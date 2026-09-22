'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Package,
  Crown,
  Search,
  UserPlus,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  X,
  RefreshCw,
  Shield,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/lib/hooks/useAuth';
import { createBrowserClient } from '@/lib/supabase/client';
import type { UserProfile, UserRole } from '@/lib/types';

export default function AdminUsersPage() {
  const { profile, isOwner, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'customers' | 'staff'>('customers');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Staff Modal State (Strictly Owner and Staff - No Pharmacist)
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'staff' | 'owner'>('staff');
  const [submittingStaff, setSubmittingStaff] = useState(false);

  // Fetch strictly REAL users from Supabase profiles
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch profiles error:', error);
        toast.error('Failed to load profiles: ' + error.message);
      } else {
        setUsers(data || []);
      }
    } catch (err: any) {
      console.error('Error fetching users from Supabase:', err);
      toast.error('Error connecting to database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper to accurately resolve effective role (owner, staff, customer)
  const getEffectiveRole = (u: UserProfile): 'owner' | 'staff' | 'customer' => {
    if (u.role === 'owner' || u.is_admin) return 'owner';
    if (u.role === 'staff') return 'staff';
    return 'customer';
  };

  // Update user role in Supabase
  const handleRoleChange = async (targetUser: UserProfile, newRole: 'owner' | 'staff' | 'customer') => {
    if (targetUser.id === profile?.id && newRole !== 'owner') {
      toast.error('You cannot revoke Store Owner privileges from your own active account!');
      return;
    }

    const ownersCount = users.filter((u) => getEffectiveRole(u) === 'owner').length;
    if (getEffectiveRole(targetUser) === 'owner' && newRole !== 'owner' && ownersCount <= 1) {
      toast.error('Cannot demote the last remaining Store Owner account!');
      return;
    }

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          is_admin: newRole === 'owner',
        })
        .eq('id', targetUser.id);

      if (error) throw error;

      // Update state locally
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id
            ? { ...u, role: newRole as UserRole, is_admin: newRole === 'owner' }
            : u
        )
      );

      const roleLabels = {
        owner: '👑 Store Owner',
        staff: '📦 Staff / Dispatch',
        customer: '👤 Customer',
      };

      toast.success(
        `Updated ${targetUser.full_name || targetUser.email} to ${roleLabels[newRole]}!`
      );
    } catch (err: any) {
      console.error('Error updating user role:', err);
      toast.error(err.message || 'Failed to update user role in database.');
    }
  };

  // Add / Elevate Staff Member in Supabase
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail) return;

    setSubmittingStaff(true);
    try {
      const cleanEmail = newStaffEmail.trim().toLowerCase();
      const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (existingUser) {
        await handleRoleChange(existingUser, newStaffRole);
      } else {
        const supabase = createBrowserClient();
        const newRecord = {
          email: cleanEmail,
          full_name: newStaffName || cleanEmail.split('@')[0],
          phone: newStaffPhone || null,
          is_admin: newStaffRole === 'owner',
          role: newStaffRole,
        };

        const { data, error } = await supabase
          .from('profiles')
          .insert(newRecord)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setUsers((prev) => [data, ...prev]);
        } else {
          await fetchUsers();
        }
        toast.success(`Assigned ${newStaffName || cleanEmail} as ${newStaffRole}!`);
      }

      setIsAddStaffOpen(false);
      setNewStaffEmail('');
      setNewStaffName('');
      setNewStaffPhone('');
      setNewStaffRole('staff');
    } catch (err: any) {
      console.error('Error adding staff:', err);
      toast.error(err.message || 'Could not add staff member.');
    } finally {
      setSubmittingStaff(false);
    }
  };

  // Summary Metrics calculations (3 Clean Cards - No Pharmacist)
  const totalCustomers = useMemo(
    () => users.filter((u) => getEffectiveRole(u) === 'customer').length,
    [users]
  );
  const totalStaff = useMemo(
    () => users.filter((u) => getEffectiveRole(u) === 'staff').length,
    [users]
  );
  const totalOwners = useMemo(
    () => users.filter((u) => getEffectiveRole(u) === 'owner').length,
    [users]
  );

  // Filtered lists (strictly real users)
  const filteredCustomers = useMemo(() => {
    return users
      .filter((u) => getEffectiveRole(u) === 'customer')
      .filter((u) => {
        const query = searchQuery.toLowerCase();
        return (
          (u.full_name && u.full_name.toLowerCase().includes(query)) ||
          u.email.toLowerCase().includes(query) ||
          (u.phone && u.phone.toLowerCase().includes(query)) ||
          (u.address && u.address.toLowerCase().includes(query))
        );
      });
  }, [users, searchQuery]);

  const privilegedStaffList = useMemo(() => {
    return users
      .filter((u) => getEffectiveRole(u) !== 'customer')
      .filter((u) => {
        const query = searchQuery.toLowerCase();
        return (
          (u.full_name && u.full_name.toLowerCase().includes(query)) ||
          u.email.toLowerCase().includes(query) ||
          (u.phone && u.phone.toLowerCase().includes(query))
        );
      });
  }, [users, searchQuery]);

  // Loading state
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-text"></div>
        <p className="text-xs font-semibold text-text-muted">Loading access console...</p>
      </div>
    );
  }

  // Strict RBAC Gate
  if (!isOwner) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-rose-200 text-center shadow-lg space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert size={30} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-heading font-black text-text">Access Restricted</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            The <strong>User & Staff Access Management</strong> console is confidential and accessible exclusively by the <strong>Store Owner (👑)</strong>.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/admin" className="btn btn-primary text-xs px-6 py-2.5 rounded-xl font-bold">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ── 1. Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[10px] font-bold text-text-muted tracking-widest uppercase">
            <span>Admin Console</span>
            <span>•</span>
            <span className="text-[#1A1A2E]">Owner Restricted</span>
          </div>
          <h1 className="font-heading font-black text-2xl md:text-3xl lg:text-4xl text-text tracking-tight">
            User & Access Control
          </h1>
          <p className="text-xs text-text-muted max-w-xl">
            Live database records from Supabase. View registered pet parent accounts and assign operational staff privileges.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 px-4 rounded-xl border border-black/[0.08] bg-white hover:bg-black/[0.02] text-text text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            title="Refresh database records"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1A1A2E] text-white hover:bg-black transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <UserPlus size={15} />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* ── 2. Top Summary KPI Cards (Double-Bezel Architecture, 3 Balanced Columns) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Registered Customers */}
        <div className="p-1 rounded-[1.75rem] bg-black/[0.025] border border-black/[0.05] shadow-xs">
          <div className="p-6 rounded-[calc(1.75rem-0.25rem)] bg-white h-full flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Registered Customers
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 flex-shrink-0">
                <Users size={19} />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black font-heading text-text tracking-tight mb-1.5">
                {totalCustomers}
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>Active Shopper Accounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Staff & Operations */}
        <div className="p-1 rounded-[1.75rem] bg-black/[0.025] border border-black/[0.05] shadow-xs">
          <div className="p-6 rounded-[calc(1.75rem-0.25rem)] bg-white h-full flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Staff / Dispatch
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 flex-shrink-0">
                <Package size={19} />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black font-heading text-text tracking-tight mb-1.5">
                {totalStaff}
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold">
                <Clock size={12} className="text-amber-600" />
                <span>Orders & Fulfillment Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Store Owners */}
        <div className="p-1 rounded-[1.75rem] bg-black/[0.025] border border-black/[0.05] shadow-xs">
          <div className="p-6 rounded-[calc(1.75rem-0.25rem)] bg-white h-full flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Store Owners
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100/70 text-amber-900 flex items-center justify-center border border-amber-200 flex-shrink-0">
                <Crown size={19} />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black font-heading text-text tracking-tight mb-1.5">
                {totalOwners}
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100/60 text-amber-900 text-[11px] font-bold">
                <span>Full System & Root Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Tabs & Search Bar (Segmented Slider Architecture) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Segmented Control */}
        <div className="inline-flex p-1 rounded-2xl bg-black/[0.035] border border-black/[0.05]">
          <button
            onClick={() => setActiveTab('customers')}
            style={{
              backgroundColor: activeTab === 'customers' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'customers' ? '#1A1A2E' : '#6B6B7B',
              boxShadow: activeTab === 'customers' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2.5"
          >
            <Users size={14} />
            <span>Registered Customers</span>
            <span
              style={{
                backgroundColor: activeTab === 'customers' ? '#1A1A2E' : 'rgba(0,0,0,0.06)',
                color: activeTab === 'customers' ? '#FFFFFF' : '#1A1A2E',
              }}
              className="px-2 py-0.5 rounded-full text-[10px] font-extrabold"
            >
              {totalCustomers}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            style={{
              backgroundColor: activeTab === 'staff' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'staff' ? '#1A1A2E' : '#6B6B7B',
              boxShadow: activeTab === 'staff' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2.5"
          >
            <Shield size={14} />
            <span>Staff & Privileges</span>
            <span
              style={{
                backgroundColor: activeTab === 'staff' ? '#1A1A2E' : 'rgba(0,0,0,0.06)',
                color: activeTab === 'staff' ? '#FFFFFF' : '#1A1A2E',
              }}
              className="px-2 py-0.5 rounded-full text-[10px] font-extrabold"
            >
              {totalStaff + totalOwners}
            </span>
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/60 pointer-events-none" />
          <input
            type="text"
            placeholder={
              activeTab === 'customers'
                ? 'Search customer name, email, phone...'
                : 'Search staff by name or email...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-black/[0.08] bg-white text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-[#1A1A2E] focus:ring-2 focus:ring-black/5 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer p-0.5"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── 4. TAB 1: Registered Customers (Double-Bezel Table) ── */}
      {activeTab === 'customers' && (
        <div className="p-1 rounded-[1.75rem] bg-black/[0.025] border border-black/[0.05] shadow-xs">
          <div className="rounded-[calc(1.75rem-0.25rem)] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-black/[0.05] bg-[#FAF9F6] text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    <th className="py-4 px-6 whitespace-nowrap">Customer</th>
                    <th className="py-4 px-6 whitespace-nowrap">Contact Phone</th>
                    <th className="py-4 px-6 whitespace-nowrap">Delivery Address</th>
                    <th className="py-4 px-6 whitespace-nowrap">Joined Date</th>
                    <th className="py-4 px-6 whitespace-nowrap text-right">Role Elevation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-xs text-text">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-text-muted">
                        <Users size={34} className="mx-auto mb-2 text-text-muted/40" />
                        <p className="font-bold text-sm text-text">No registered customer accounts found</p>
                        {searchQuery ? (
                          <p className="text-xs text-text-muted mt-1">
                            No records matched &quot;{searchQuery}&quot;.
                          </p>
                        ) : (
                          <p className="text-xs text-text-muted mt-1">
                            When pet parents register on the store, their profiles will appear here.
                          </p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const displayName = cust.full_name || cust.email.split('@')[0];
                      const initials = displayName
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <tr key={cust.id} className="hover:bg-black/[0.015] transition-colors">
                          {/* Customer Details */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 min-w-[40px] aspect-square rounded-full bg-gradient-to-br from-amber-200 to-amber-300 text-[#1A1A2E] font-black text-xs flex items-center justify-center border border-amber-400/30 shadow-xs flex-shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-text text-sm truncate max-w-[220px]">
                                  {displayName}
                                </p>
                                <p className="text-[11px] text-text-muted truncate max-w-[220px]">
                                  {cust.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact Phone */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            {cust.phone ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/[0.03] border border-black/[0.06] text-xs font-mono font-medium text-text">
                                <Phone size={11} className="text-text-muted flex-shrink-0" />
                                {cust.phone}
                              </span>
                            ) : (
                              <span className="text-text-muted/50 text-xs italic">Not provided</span>
                            )}
                          </td>

                          {/* Delivery Address */}
                          <td className="py-4 px-6 max-w-[240px]">
                            {cust.address ? (
                              <div className="flex items-center gap-1.5 text-text-muted truncate text-xs" title={cust.address}>
                                <MapPin size={12} className="text-text-muted flex-shrink-0" />
                                <span className="truncate">{cust.address}</span>
                              </div>
                            ) : (
                              <span className="text-text-muted/50 text-xs italic">No saved address</span>
                            )}
                          </td>

                          {/* Joined Date */}
                          <td className="py-4 px-6 whitespace-nowrap text-text-muted text-xs">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-text-muted/70 flex-shrink-0" />
                              <span>
                                {cust.created_at
                                  ? new Date(cust.created_at).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : 'Recently'}
                              </span>
                            </div>
                          </td>

                          {/* Role Promotion Action (Strictly + Staff) */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleRoleChange(cust, 'staff')}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1A1A2E] text-white hover:bg-black active:scale-[0.97] transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer ml-auto"
                              title="Elevate user to Store Staff"
                            >
                              <UserPlus size={13} />
                              <span>Make Staff</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. TAB 2: Staff & Access Privileges (Double-Bezel Table) ── */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          {/* Subtle Info Card */}
          <div className="p-4 px-5 rounded-2xl bg-black/[0.02] border border-black/[0.06] flex items-center gap-3">
            <ShieldCheck size={20} className="text-text-muted flex-shrink-0" />
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-text">Store Owners</strong> have full root access to settings, financials, and staff management. 
              <strong className="text-text ml-2">Staff Members</strong> have operational access to the products catalog, categories, and order fulfillment.
            </p>
          </div>

          <div className="p-1 rounded-[1.75rem] bg-black/[0.025] border border-black/[0.05] shadow-xs">
            <div className="rounded-[calc(1.75rem-0.25rem)] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="border-b border-black/[0.05] bg-[#FAF9F6] text-[11px] font-bold text-text-muted uppercase tracking-wider">
                      <th className="py-4 px-6 whitespace-nowrap">Team Member</th>
                      <th className="py-4 px-6 whitespace-nowrap">Current Role</th>
                      <th className="py-4 px-6 whitespace-nowrap">System Access</th>
                      <th className="py-4 px-6 whitespace-nowrap text-right">Modify Privilege</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04] text-xs text-text">
                    {privilegedStaffList.map((st) => {
                      const activeRole = getEffectiveRole(st);
                      const isCurrentUser = st.id === profile?.id;

                      const roleMeta = {
                        owner: {
                          label: 'Store Owner',
                          icon: '👑',
                          badge: 'bg-amber-500/15 text-amber-900 border-amber-400/40',
                          perms: 'Full System, Financials & User Admin',
                        },
                        staff: {
                          label: 'Staff / Dispatch',
                          icon: '📦',
                          badge: 'bg-blue-500/15 text-blue-900 border-blue-400/40',
                          perms: 'Catalog, Categories & Order Dispatch',
                        },
                        customer: {
                          label: 'Customer',
                          icon: '👤',
                          badge: 'bg-gray-100 text-gray-700 border-gray-300',
                          perms: 'Customer Shopping Only',
                        },
                      }[activeRole];

                      const displayName = st.full_name || st.email.split('@')[0];

                      return (
                        <tr key={st.id} className="hover:bg-black/[0.015] transition-colors">
                          {/* Member */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 min-w-[40px] aspect-square rounded-full bg-accent text-[#1A1A2E] font-black text-sm flex items-center justify-center border border-accent/60 shadow-xs flex-shrink-0">
                                {roleMeta.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-sm text-text truncate max-w-[200px]">
                                    {displayName}
                                  </p>
                                  {isCurrentUser && (
                                    <span className="px-2 py-0.5 rounded-md bg-[#1A1A2E] text-[9px] font-black text-white uppercase tracking-wider">
                                      You
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-text-muted truncate max-w-[200px]">{st.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Current Role Badge */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold ${roleMeta.badge}`}
                            >
                              <span>{roleMeta.icon}</span>
                              <span>{roleMeta.label}</span>
                            </span>
                          </td>

                          {/* Permissions */}
                          <td className="py-4 px-6 text-text-muted text-xs whitespace-nowrap">
                            {roleMeta.perms}
                          </td>

                          {/* Modify Role Select (Strictly Owner / Staff / Revoke) */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <select
                              value={activeRole}
                              onChange={(e) => handleRoleChange(st, e.target.value as 'owner' | 'staff' | 'customer')}
                              disabled={isCurrentUser}
                              className="px-3.5 py-2 rounded-xl border border-black/10 bg-white text-xs font-bold text-text focus:outline-none focus:border-[#1A1A2E] focus:ring-2 focus:ring-black/5 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <option value="owner">👑 Make Store Owner</option>
                              <option value="staff">📦 Make Staff / Dispatch</option>
                              <option value="customer">👤 Revoke Access (Customer)</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. ADD / ASSIGN STAFF MODAL (Refined Luxury Agency Dialog) ── */}
      <AnimatePresence>
        {isAddStaffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white rounded-[2rem] border border-black/[0.08] max-w-lg w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-7 pb-5 border-b border-black/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1A1A2E] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-text tracking-tight">Add Team Member</h3>
                    <p className="text-[11px] text-text-muted">Assign administrative privileges to a user</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddStaffOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddStaff} className="p-7 space-y-5 text-xs">
                <div>
                  <label className="block font-bold text-text mb-1.5 text-xs">
                    User Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="employee@petsolutions.lk"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/15 bg-black/[0.01] text-xs text-text placeholder:text-text-muted/50 focus:bg-white focus:outline-none focus:border-[#1A1A2E] focus:ring-2 focus:ring-black/5 shadow-xs transition-all"
                  />
                  <p className="text-[11px] text-text-muted/70 mt-1.5">
                    If this user is already registered in Supabase, their privileges will be elevated.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-text mb-1.5 text-xs">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Nimal Jayawardena"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/15 bg-black/[0.01] text-xs text-text placeholder:text-text-muted/50 focus:bg-white focus:outline-none focus:border-[#1A1A2E] focus:ring-2 focus:ring-black/5 shadow-xs transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text mb-1.5 text-xs">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+94 77 123 4567"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/15 bg-black/[0.01] text-xs text-text placeholder:text-text-muted/50 focus:bg-white focus:outline-none focus:border-[#1A1A2E] focus:ring-2 focus:ring-black/5 shadow-xs transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text mb-2 text-xs">
                    Assign Privilege Level <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Staff Option */}
                    <button
                      type="button"
                      onClick={() => setNewStaffRole('staff')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        newStaffRole === 'staff'
                          ? 'border-[#1A1A2E] bg-[#1A1A2E]/[0.03] shadow-xs'
                          : 'border-black/10 hover:border-black/20 hover:bg-black/[0.01]'
                      }`}
                    >
                      {newStaffRole === 'staff' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1A1A2E] text-white flex items-center justify-center">
                          <Check size={11} />
                        </div>
                      )}
                      <div className="text-xl mb-1.5">📦</div>
                      <div className="font-extrabold text-xs text-text">Staff Member</div>
                      <div className="text-[10px] text-text-muted mt-0.5">Catalog & order dispatch</div>
                    </button>

                    {/* Owner Option */}
                    <button
                      type="button"
                      onClick={() => setNewStaffRole('owner')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        newStaffRole === 'owner'
                          ? 'border-[#1A1A2E] bg-[#1A1A2E]/[0.03] shadow-xs'
                          : 'border-black/10 hover:border-black/20 hover:bg-black/[0.01]'
                      }`}
                    >
                      {newStaffRole === 'owner' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1A1A2E] text-white flex items-center justify-center">
                          <Check size={11} />
                        </div>
                      )}
                      <div className="text-xl mb-1.5">👑</div>
                      <div className="font-extrabold text-xs text-text">Store Owner</div>
                      <div className="text-[10px] text-text-muted mt-0.5">Root access & settings</div>
                    </button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-5 border-t border-black/[0.06] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text hover:bg-black/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingStaff}
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#1A1A2E] text-white hover:bg-black active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submittingStaff ? 'Assigning...' : 'Confirm Assignment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  X,
  RefreshCw,
  Shield,
  Check,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/lib/hooks/useAuth';
import { createBrowserClient } from '@/lib/supabase/client';
import type { UserProfile, UserRole } from '@/lib/types';

export default function AdminUsersPage() {
  const { profile, isOwner, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'customers' | 'staff'>('customers');
  const [staffFilter, setStaffFilter] = useState<'all' | 'staff' | 'owner'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Staff Modal State (Strictly Owner and Staff - No Pharmacist)
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'staff' | 'owner'>('staff');
  const [submittingStaff, setSubmittingStaff] = useState(false);

  // Ensure the browser Supabase client has an active admin JWT session (handles demo/mock owner sessions)
  const ensureAdminSupabaseSession = async () => {
    const supabase = createBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      await supabase.auth.signInWithPassword({
        email: 'admin@petsolutions.lk',
        password: 'AdminPassword123',
      });
    }
    return supabase;
  };

  // Fetch strictly REAL users from Supabase profiles
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const supabase = await ensureAdminSupabaseSession();
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
      const supabase = await ensureAdminSupabaseSession();
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

  // Add / Create Staff or Owner Account with Password in Supabase
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail) return;

    const cleanPassword = newStaffPassword.trim();
    if (cleanPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setSubmittingStaff(true);
    try {
      const cleanEmail = newStaffEmail.trim().toLowerCase();
      const resolvedName = newStaffName.trim() || cleanEmail.split('@')[0];
      const resolvedPhone = newStaffPhone.trim() || null;
      const encodedPassword = '__pwd:' + btoa(encodeURIComponent(cleanPassword));
      const existingUser = users.find((u) => (u.email || '').toLowerCase() === cleanEmail);

      // 1. Register user in Supabase Auth using an isolated non-persisting client
      // so the current Admin session is never interrupted
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
      const tempClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey: 'petsolutions-admin-provision-temp',
        },
      });

      const { data: signUpData } = await tempClient.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: { full_name: resolvedName, role: newStaffRole },
        },
      });

      const authUserId = signUpData?.user?.id;
      const supabase = await ensureAdminSupabaseSession();

      // Wait briefly in case the on_auth_user_created trigger ran for a new Auth user
      if (authUserId) {
        await new Promise((r) => setTimeout(r, 350));
      }

      if (existingUser) {
        // Update existing profile record (and set their login password & role)
        const targetId = existingUser.id;
        const { data: updatedData, error: updateError } = await supabase
          .from('profiles')
          .update({
            email: cleanEmail,
            full_name: newStaffName.trim() || existingUser.full_name || resolvedName,
            phone: resolvedPhone || existingUser.phone || null,
            address: encodedPassword,
            role: newStaffRole,
            is_admin: newStaffRole === 'owner',
          })
          .eq('id', targetId)
          .select()
          .single();

        if (updateError) throw updateError;

        if (updatedData) {
          setUsers((prev) => prev.map((u) => (u.id === targetId ? updatedData : u)));
        } else {
          await fetchUsers();
        }
      } else {
        const targetId =
          authUserId ||
          (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined);

        const newRecord = {
          id: targetId,
          email: cleanEmail,
          full_name: resolvedName,
          phone: resolvedPhone,
          address: encodedPassword,
          is_admin: newStaffRole === 'owner',
          role: newStaffRole,
        };

        // Try upsert/update if trigger already created the row, otherwise insert
        const { data: existingById } = targetId
          ? await supabase.from('profiles').select('id').eq('id', targetId).maybeSingle()
          : { data: null };

        let savedProfile: UserProfile | null = null;

        if (existingById?.id) {
          const { data: upData, error: upErr } = await supabase
            .from('profiles')
            .update({
              email: cleanEmail,
              full_name: resolvedName,
              phone: resolvedPhone,
              address: encodedPassword,
              is_admin: newStaffRole === 'owner',
              role: newStaffRole,
            })
            .eq('id', existingById.id)
            .select()
            .single();
          if (upErr) throw upErr;
          savedProfile = upData;
        } else {
          const { data: insData, error: insErr } = await supabase
            .from('profiles')
            .insert(newRecord)
            .select()
            .single();
          if (insErr) throw insErr;
          savedProfile = insData;
        }

        if (savedProfile) {
          setUsers((prev) => [savedProfile!, ...prev.filter((u) => u.id !== savedProfile!.id)]);
        } else {
          await fetchUsers();
        }
      }

      toast.success(
        `Created ${newStaffRole === 'owner' ? '👑 Store Owner' : '📦 Staff'} account for ${resolvedName} (${cleanEmail})!`
      );

      setIsAddStaffOpen(false);
      setNewStaffEmail('');
      setNewStaffPassword('');
      setShowStaffPassword(false);
      setNewStaffName('');
      setNewStaffPhone('');
      setNewStaffRole('staff');
      setActiveTab('staff');
    } catch (err: any) {
      console.error('Error adding staff:', err);
      toast.error(err.message || 'Could not create team member account.');
    } finally {
      setSubmittingStaff(false);
    }
  };

  // Metrics calculations (Strictly 3 clean metrics: Customers, Staff, Owners)
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

  // Filtered lists
  const filteredCustomers = useMemo(() => {
    return users
      .filter((u) => getEffectiveRole(u) === 'customer')
      .filter((u) => {
        const query = searchQuery.toLowerCase();
        const displayAddr = u.address && !u.address.startsWith('__pwd:') ? u.address : '';
        return (
          (u.full_name && u.full_name.toLowerCase().includes(query)) ||
          u.email.toLowerCase().includes(query) ||
          (u.phone && u.phone.toLowerCase().includes(query)) ||
          (displayAddr && displayAddr.toLowerCase().includes(query))
        );
      });
  }, [users, searchQuery]);

  const privilegedStaffList = useMemo(() => {
    return users
      .filter((u) => getEffectiveRole(u) !== 'customer')
      .filter((u) => {
        if (staffFilter === 'staff') return getEffectiveRole(u) === 'staff';
        if (staffFilter === 'owner') return getEffectiveRole(u) === 'owner';
        return true;
      })
      .filter((u) => {
        const query = searchQuery.toLowerCase();
        return (
          (u.full_name && u.full_name.toLowerCase().includes(query)) ||
          u.email.toLowerCase().includes(query) ||
          (u.phone && u.phone.toLowerCase().includes(query))
        );
      });
  }, [users, staffFilter, searchQuery]);

  // Strict RBAC Gate (only evaluate after auth state is determined)
  if (!authLoading && !isOwner) {
    return (
      <div
        style={{
          maxWidth: '480px',
          margin: '80px auto',
          padding: '32px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#FFF1F2',
            color: '#E11D48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px' }}>
          Access Restricted
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
          The <strong>User & Staff Access Management</strong> console is confidential and accessible exclusively by the <strong>Store Owner (👑)</strong>.
        </p>
        <Link
          href="/admin"
          className="btn btn-primary btn-sm"
          style={{
            height: '38px',
            padding: '0 20px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: '#1A1A2E',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-catalog-wrap">
      {/* ── 1. Executive Top Header Banner (Matching Products Page) ── */}
      <div className="admin-hero-banner">
        <div className="admin-hero-content">
          <div className="admin-hero-icon">
            <Users size={24} />
          </div>
          <div>
            <div className="admin-hero-title-row">
              <h1 className="admin-hero-title">User & Access Control</h1>
              <span className="admin-hero-badge">
                {users.length} Total Users
              </span>
            </div>
            <p className="admin-hero-subtitle">
              Manage customer accounts, assign operational staff privileges, and oversee store access.
            </p>
          </div>
        </div>

        <div className="admin-hero-actions">
          <button
            onClick={() => {
              fetchUsers();
              toast.success('User profiles refreshed.');
            }}
            disabled={loading}
            className="admin-action-btn"
            style={{ width: '38px', height: '38px', borderRadius: '12px' }}
            title="Refresh Users"
            aria-label="Refresh users"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="btn btn-primary btn-sm"
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: '#1A1A2E',
              color: '#FFFFFF',
              border: '1.5px solid rgba(255, 200, 0, 0.4)',
              boxShadow: '0 2px 8px rgba(26, 26, 46, 0.15)',
              gap: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <UserPlus size={16} />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* ── 2. Interactive KPI Metric Cards (Matching Products Page) ── */}
      <div className="admin-kpi-grid-4">
        {/* All Accounts */}
        <div
          onClick={() => {
            setActiveTab('customers');
            setStaffFilter('all');
          }}
          className={`admin-kpi-card ${activeTab === 'customers' && !searchQuery ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>All Accounts</span>
            <Users size={15} className="text-text-muted" />
          </div>
          <div className="admin-kpi-value">{users.length}</div>
          <div className="admin-kpi-footer">Total registered database records</div>
        </div>

        {/* Registered Customers */}
        <div
          onClick={() => {
            setActiveTab('customers');
            setStaffFilter('all');
          }}
          className={`admin-kpi-card ${activeTab === 'customers' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Customers</span>
            <span className="status-dot status-dot-emerald" />
          </div>
          <div className="admin-kpi-value" style={{ color: '#059669' }}>
            {totalCustomers}
          </div>
          <div className="admin-kpi-footer">Active shopper profiles</div>
        </div>

        {/* Staff / Dispatch */}
        <div
          onClick={() => {
            setActiveTab('staff');
            setStaffFilter('staff');
          }}
          className={`admin-kpi-card ${activeTab === 'staff' && staffFilter === 'staff' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Staff / Dispatch</span>
            <span className="status-dot status-dot-amber" />
          </div>
          <div className="admin-kpi-value" style={{ color: '#D97706' }}>
            {totalStaff}
          </div>
          <div className="admin-kpi-footer">Catalog & order fulfillment</div>
        </div>

        {/* Store Owners */}
        <div
          onClick={() => {
            setActiveTab('staff');
            setStaffFilter('owner');
          }}
          className={`admin-kpi-card ${activeTab === 'staff' && staffFilter === 'owner' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Store Owners</span>
            <Crown size={15} className="text-amber-500" />
          </div>
          <div className="admin-kpi-value" style={{ color: '#B45309' }}>
            {totalOwners}
          </div>
          <div className="admin-kpi-footer">Full root system access</div>
        </div>
      </div>

      {/* ── 3. High-Density Search, Filter Toolbar & View Switcher ── */}
      <div className="admin-toolbar-wrap">
        <div className="admin-toolbar-main">
          {/* Search Box */}
          <div className="admin-search-box">
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                color: 'var(--color-text-muted)',
              }}
            >
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder={
                activeTab === 'customers'
                  ? 'Search customer name, email, phone, address...'
                  : 'Search staff by name, email, or phone...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="admin-filter-group">
            {activeTab === 'staff' && (
              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value as 'all' | 'staff' | 'owner')}
                className="admin-select"
              >
                <option value="all">All Privileged ({totalStaff + totalOwners})</option>
                <option value="staff">Staff Only ({totalStaff})</option>
                <option value="owner">Owners Only ({totalOwners})</option>
              </select>
            )}

            {/* View Mode Toggle */}
            <div className="admin-view-toggle">
              <button
                type="button"
                onClick={() => setActiveTab('customers')}
                className={`admin-view-btn ${activeTab === 'customers' ? 'active' : ''}`}
                style={{ gap: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 700 }}
                title="Registered Customers"
              >
                <Users size={15} />
                <span>Customers ({totalCustomers})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('staff')}
                className={`admin-view-btn ${activeTab === 'staff' ? 'active' : ''}`}
                style={{ gap: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 700 }}
                title="Privileged Staff & Owners"
              >
                <Shield size={15} />
                <span>Staff & Access ({totalStaff + totalOwners})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active search filter reset row */}
        {searchQuery && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid rgba(189, 223, 234, 0.4)',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}
          >
            <div>
              Showing results matching &ldquo;<strong style={{ color: 'var(--color-text)' }}>{searchQuery}</strong>&rdquo;
            </div>
            <button
              onClick={() => setSearchQuery('')}
              style={{
                color: 'var(--color-brand-blue)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              <X size={13} /> Clear search
            </button>
          </div>
        )}
      </div>

      {/* ── 4. Main Data Table (Matching Products Page) ── */}
      {loading || authLoading ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(189, 223, 234, 0.55)',
            padding: '64px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            minHeight: '460px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-accent border-t-transparent mx-auto" />
          <p style={{ marginTop: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Loading user & access records...
          </p>
        </div>
      ) : activeTab === 'customers' ? (
        /* CUSTOMERS TABLE */
        <div className="admin-table-container">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '56px', textAlign: 'center' }}>#</th>
                  <th style={{ minWidth: '260px' }}>Customer Profile</th>
                  <th style={{ minWidth: '160px' }}>Contact Phone</th>
                  <th style={{ minWidth: '240px' }}>Delivery Address</th>
                  <th style={{ minWidth: '140px' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '64px', textAlign: 'center' }}>
                      <Users size={44} style={{ margin: '0 auto 12px auto', color: 'var(--color-text-light)' }} />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                        No customer accounts found
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {searchQuery
                          ? `No customer matches "${searchQuery}".`
                          : 'Customer accounts will appear here once pet parents register on the store.'}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="btn btn-outline btn-sm"
                          style={{ borderRadius: '12px', fontSize: '12px', marginTop: '16px' }}
                        >
                          Clear Search
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust, idx) => {
                    const displayName = cust.full_name || cust.email.split('@')[0];
                    const cleanAddress =
                      cust.address && !cust.address.startsWith('__pwd:') ? cust.address : null;
                    const initials = displayName
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'U';

                    return (
                      <tr key={cust.id}>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-text-light)', fontSize: '11px' }}>
                          #{String(idx + 1).padStart(2, '0')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                backgroundColor: 'var(--color-secondary)',
                                color: 'var(--color-brand-blue)',
                                border: '1px solid var(--color-secondary-alt)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '12px',
                                flexShrink: 0,
                              }}
                            >
                              {initials}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '13px', lineHeight: 1.3 }}>
                                {displayName}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                {cust.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {cust.phone ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 8px',
                                borderRadius: '8px',
                                backgroundColor: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                fontSize: '11px',
                                fontFamily: 'monospace',
                                fontWeight: 600,
                                color: 'var(--color-text)',
                              }}
                            >
                              <Phone size={11} style={{ color: 'var(--color-text-muted)' }} />
                              {cust.phone}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--color-text-light)', fontSize: '11px', fontStyle: 'italic' }}>
                              Not provided
                            </span>
                          )}
                        </td>
                        <td>
                          {cleanAddress ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--color-text-muted)',
                                fontSize: '12px',
                                maxWidth: '260px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={cleanAddress}
                            >
                              <MapPin size={12} style={{ flexShrink: 0, color: 'var(--color-brand-blue)' }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{cleanAddress}</span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--color-text-light)', fontSize: '11px', fontStyle: 'italic' }}>
                              No saved address
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '11px' }}>
                            <Calendar size={12} style={{ color: 'var(--color-text-light)' }} />
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
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* STAFF & PRIVILEGES TABLE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Subtle Info Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(189, 223, 234, 0.55)',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <ShieldCheck size={18} style={{ color: 'var(--color-brand-blue)', flexShrink: 0 }} />
            <span>
              <strong style={{ color: 'var(--color-text)' }}>Store Owners (👑)</strong> have full root access to settings, financials, and staff management. 
              <strong style={{ color: 'var(--color-text)', marginLeft: '12px' }}>Staff Members (📦)</strong> have operational access to the products catalog, categories, and order fulfillment.
            </span>
          </div>

          <div className="admin-table-container">
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '56px', textAlign: 'center' }}>#</th>
                    <th style={{ minWidth: '240px' }}>Team Member</th>
                    <th style={{ minWidth: '170px' }}>Current Privilege</th>
                    <th style={{ minWidth: '240px' }}>Access Permissions</th>
                    <th style={{ width: '220px', textAlign: 'right' }}>Modify Privilege</th>
                  </tr>
                </thead>
                <tbody>
                  {privilegedStaffList.map((st, idx) => {
                    const activeRole = getEffectiveRole(st);
                    const isCurrentUser = st.id === profile?.id;
                    const displayName = st.full_name || st.email.split('@')[0];

                    return (
                      <tr key={st.id}>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-text-light)', fontSize: '11px' }}>
                          #{String(idx + 1).padStart(2, '0')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                backgroundColor: activeRole === 'owner' ? '#FEF3C7' : '#E0F2FE',
                                border: activeRole === 'owner' ? '1px solid #FCD34D' : '1px solid #BAE6FD',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                flexShrink: 0,
                              }}
                            >
                              {activeRole === 'owner' ? '👑' : '📦'}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '13px' }}>
                                  {displayName}
                                </span>
                                {isCurrentUser && (
                                  <span
                                    style={{
                                      backgroundColor: '#1A1A2E',
                                      color: '#FFFFFF',
                                      fontSize: '9px',
                                      fontWeight: 800,
                                      padding: '2px 6px',
                                      borderRadius: '6px',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em',
                                    }}
                                  >
                                    You
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                {st.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className="admin-stock-badge"
                            style={
                              activeRole === 'owner'
                                ? { backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }
                                : { backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD' }
                            }
                          >
                            {activeRole === 'owner' ? '👑 Store Owner' : '📦 Staff / Dispatch'}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          {activeRole === 'owner'
                            ? 'Full System, Financials & Staff Admin'
                            : 'Catalog, Categories & Order Dispatch'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <select
                            value={activeRole}
                            onChange={(e) => handleRoleChange(st, e.target.value as 'owner' | 'staff' | 'customer')}
                            disabled={isCurrentUser}
                            className="admin-select"
                            style={{
                              height: '34px',
                              padding: '0 10px',
                              fontSize: '11px',
                              fontWeight: 700,
                              borderRadius: '10px',
                              cursor: isCurrentUser ? 'not-allowed' : 'pointer',
                              opacity: isCurrentUser ? 0.6 : 1,
                            }}
                          >
                            <option value="owner">👑 Store Owner</option>
                            <option value="staff">📦 Staff / Dispatch</option>
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
      )}

      {/* ── 5. High-Contrast Add / Elevate Staff Modal (No Pharmacist) ── */}
      <AnimatePresence>
        {isAddStaffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Dark High-Contrast Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddStaffOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            {/* Solid High-Contrast Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 p-6 md:p-7 space-y-5 text-slate-900 max-h-[88vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    className="admin-hero-icon"
                    style={{ width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0 }}
                  >
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: 0, lineHeight: 1.2 }}>
                      Add Team Member
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', margin: 0 }}>
                      Assign administrative staff or store owner privileges
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="admin-action-btn"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-secondary-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  title="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
                    User Email Address <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="employee@petsolutions.lk"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--color-secondary-alt)',
                      backgroundColor: 'var(--color-dominant)',
                      color: 'var(--color-text)',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
                    Account Password <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock
                      size={15}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        color: 'var(--color-text-muted)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type={showStaffPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={newStaffPassword}
                      onChange={(e) => setNewStaffPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 40px 0 38px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--color-secondary-alt)',
                        backgroundColor: 'var(--color-dominant)',
                        color: 'var(--color-text)',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword((prev) => !prev)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                      }}
                      title={showStaffPassword ? 'Hide password' : 'Show password'}
                    >
                      {showStaffPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    The team member will use this email and password to sign in at the login page.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kasun Silva"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--color-secondary-alt)',
                        backgroundColor: 'var(--color-dominant)',
                        color: 'var(--color-text)',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+94 77 123 4567"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--color-secondary-alt)',
                        backgroundColor: 'var(--color-dominant)',
                        color: 'var(--color-text)',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                    Assign Privilege Level <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {/* Option 1: Staff / Dispatch */}
                    <button
                      type="button"
                      onClick={() => setNewStaffRole('staff')}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '16px',
                        border: newStaffRole === 'staff' ? '2px solid var(--color-brand-blue)' : '1.5px solid var(--color-secondary-alt)',
                        backgroundColor: newStaffRole === 'staff' ? '#F0F9FD' : '#FFFFFF',
                        textAlign: 'left',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: '20px' }}>📦</span>
                        {newStaffRole === 'staff' && (
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--color-brand-blue)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={11} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--color-text)' }}>
                        Staff / Dispatch
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                        Catalog & order fulfillment
                      </div>
                    </button>

                    {/* Option 2: Store Owner */}
                    <button
                      type="button"
                      onClick={() => setNewStaffRole('owner')}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '16px',
                        border: newStaffRole === 'owner' ? '2px solid #D97706' : '1.5px solid var(--color-secondary-alt)',
                        backgroundColor: newStaffRole === 'owner' ? '#FFFBEB' : '#FFFFFF',
                        textAlign: 'left',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: '20px' }}>👑</span>
                        {newStaffRole === 'owner' && (
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#D97706', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={11} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--color-text)' }}>
                        Store Owner
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                        Root access & settings
                      </div>
                    </button>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--color-secondary-alt)' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddStaffOpen(false)}
                    disabled={submittingStaff}
                    className="btn btn-outline btn-sm"
                    style={{
                      height: '38px',
                      padding: '0 18px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingStaff}
                    className="btn btn-primary btn-sm"
                    style={{
                      height: '38px',
                      padding: '0 20px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: '#1A1A2E',
                      color: '#FFFFFF',
                      border: '1.5px solid rgba(255, 200, 0, 0.4)',
                      boxShadow: '0 2px 8px rgba(26, 26, 46, 0.15)',
                      gap: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {submittingStaff ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Confirm Assignment</span>
                      </>
                    )}
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

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/supabase/client';
import type { UserProfile, UserRole } from '@/lib/types';

/* --------------------------------------------------------------------------
   Context value
   -------------------------------------------------------------------------- */
interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  role: UserRole;
  isOwner: boolean;
  isStaff: boolean;
  isPharmacist: boolean;
  switchRole: (role: UserRole) => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* --------------------------------------------------------------------------
   Provider
   -------------------------------------------------------------------------- */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => createBrowserClient(), []);

  /** Fetch the user's profile row from the `profiles` table. */
  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        const pData = data as any;
        const mappedProfile: UserProfile = {
          id: pData.id,
          email: pData.email || '',
          full_name: pData.full_name || null,
          phone: pData.phone || null,
          address: pData.address || null,
          is_admin: !!pData.is_admin,
          role: (pData.role as UserRole) || (pData.is_admin ? 'owner' : 'customer'),
          created_at: pData.created_at || new Date().toISOString(),
        };
        setProfile(mappedProfile);
      } else {
        setProfile(null);
      }
    },
    [supabase]
  );

  // ---- Hydrate session on mount & listen for auth changes ----
  useEffect(() => {
    // 1. Get the initial session
    const init = async () => {
      // Dev bypass: Check if a mock session is active in localStorage
      if (typeof window !== 'undefined') {
        const mockUserStr = localStorage.getItem('mock_auth_user');
        const mockProfileStr = localStorage.getItem('mock_auth_profile');
        if (mockUserStr && mockProfileStr) {
          try {
            setUser(JSON.parse(mockUserStr));
            setProfile(JSON.parse(mockProfileStr));
            setIsLoading(false);
            return;
          } catch (e) {
            console.error('Failed to parse mock session:', e);
          }
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setIsLoading(false);
    };

    init();

    // 2. Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Ignore auth changes if we are currently using a mock session
      if (typeof window !== 'undefined' && localStorage.getItem('mock_auth_user')) {
        return;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }

      // If the user just signed in, we're done loading
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // ---- Auth actions ----
  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      // Check if this matches one of our demo/testing credentials
      const isDemoOwner = cleanEmail === 'admin@petsolutions.lk' || cleanEmail === 'owner@petsolutions.lk';
      const isDemoStaff = cleanEmail === 'staff@petsolutions.lk';
      const isDemoPharmacist = cleanEmail === 'pharmacist@petsolutions.lk';
      const isDemoCustomer = cleanEmail === 'user@petsolutions.lk';

      if (isDemoOwner || isDemoStaff || isDemoPharmacist || isDemoCustomer) {
        const targetRole: UserRole = isDemoOwner
          ? 'owner'
          : isDemoStaff
          ? 'staff'
          : isDemoPharmacist
          ? 'pharmacist'
          : 'customer';

        const roleNames: Record<UserRole, string> = {
          owner: 'Dr. Thenuka (Store Owner & Chief Vet)',
          staff: 'Kamal Perera (Inventory & Fulfillment Staff)',
          pharmacist: 'Dr. Nimna (Clinical Pharmacist)',
          customer: 'Dilan Silva (Pet Owner)',
        };

        const mockUser = {
          id: 'demo-' + targetRole + '-uuid',
          email: cleanEmail,
          app_metadata: {},
          user_metadata: { full_name: roleNames[targetRole] },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User;

        const mockProfile: UserProfile = {
          id: 'demo-' + targetRole + '-uuid',
          email: cleanEmail,
          full_name: roleNames[targetRole],
          phone: '+94 77 123 4567',
          address: 'No 10, Veterinary Boulevard, Colombo 03',
          is_admin: targetRole !== 'customer',
          role: targetRole,
          created_at: new Date().toISOString(),
        };

        // Try Supabase auth first, but if it complains about credentials or unconfirmed email,
        // activate our verified demo session
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

          if (!error && data?.user) {
            setUser(data.user);
            await fetchProfile(data.user.id);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('mock_auth_user');
              localStorage.removeItem('mock_auth_profile');
            }
            setIsLoading(false);
            return { error: null };
          }
        } catch {
          // Continue to mock session fallback
        }

        // Apply instant mock session
        setUser(mockUser);
        setProfile(mockProfile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
          localStorage.setItem('mock_auth_profile', JSON.stringify(mockProfile));
        }
        setIsLoading(false);
        return { error: null };
      }

      // Standard Supabase login for regular users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mock_auth_user');
          localStorage.removeItem('mock_auth_profile');
        }
      }
      setIsLoading(false);
      return { error: null };
    },
    [supabase, fetchProfile]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (!error && data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          is_admin: false,
          role: 'customer',
        });
      }

      setIsLoading(false);
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_auth_user');
      localStorage.removeItem('mock_auth_profile');
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  }, [supabase]);

  // Role switcher for live testing
  const switchRole = useCallback((newRole: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      owner: 'Dr. Thenuka (Store Owner & Chief Vet)',
      staff: 'Kamal Perera (Inventory & Fulfillment Staff)',
      pharmacist: 'Dr. Nimna (Clinical Pharmacist)',
      customer: 'Dilan Silva (Pet Owner)',
    };

    const updatedProfile: UserProfile = {
      id: profile?.id || 'demo-' + newRole + '-uuid',
      email: newRole + '@petsolutions.lk',
      full_name: roleNames[newRole],
      phone: '+94 77 123 4567',
      address: 'Colombo, Sri Lanka',
      is_admin: newRole !== 'customer',
      role: newRole,
      created_at: profile?.created_at || new Date().toISOString(),
    };

    setProfile(updatedProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_auth_profile', JSON.stringify(updatedProfile));
    }
  }, [profile]);

  // ---- Derived RBAC states ----
  const role: UserRole = useMemo(() => {
    if (profile?.role && profile.role !== 'customer') return profile.role;
    if (profile?.is_admin) return 'owner';
    if (profile?.role) return profile.role;
    return 'customer';
  }, [profile]);

  const isOwner = role === 'owner';
  const isStaff = role === 'staff';
  const isPharmacist = role === 'pharmacist';
  const isAdmin = isOwner || isStaff || isPharmacist || (profile?.is_admin ?? false);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isAdmin,
      role,
      isOwner,
      isStaff,
      isPharmacist,
      switchRole,
      signIn,
      signUp,
      signOut,
    }),
    [user, profile, isLoading, isAdmin, role, isOwner, isStaff, isPharmacist, switchRole, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* --------------------------------------------------------------------------
   Hook
   -------------------------------------------------------------------------- */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

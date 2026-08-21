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
import type { UserProfile } from '@/lib/types';

/* --------------------------------------------------------------------------
   Context value
   -------------------------------------------------------------------------- */
interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
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

      setProfile((data as UserProfile) ?? null);
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

      // Dev bypass: handle quick-test credentials using real Supabase signup/signin
      if (
        (email.trim().toLowerCase() === 'admin@petsolutions.lk' && password === 'AdminPassword123') ||
        (email.trim().toLowerCase() === 'user@petsolutions.lk' && password === 'UserPassword123')
      ) {
        const isAdmin = email.trim().toLowerCase() === 'admin@petsolutions.lk';
        const cleanEmail = email.trim().toLowerCase();
        
        // 1. Try to sign in
        let { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        // 2. If user doesn't exist, register them
        if (error && (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed') || error.message.includes('User not found'))) {
          const signUpRes = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: isAdmin ? 'Test Admin (Mock)' : 'Test User (Mock)'
              }
            }
          });
          
          if (!signUpRes.error) {
            // Sign in again after sign up
            const signInRes = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password,
            });
            data = signInRes.data;
            error = signInRes.error;
          } else {
            error = signUpRes.error;
          }
        }

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          // 3. Set profile info (especially is_admin)
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              id: data.user.id,
              email: cleanEmail,
              is_admin: isAdmin,
              full_name: isAdmin ? 'Test Admin (Mock)' : 'Test User (Mock)',
              phone: isAdmin ? '+94 77 111 2222' : '+94 77 333 4444',
              address: isAdmin ? 'No 10, Main Street, Colombo' : 'No 45, Flower Road, Kandy'
            });
            
          if (profileError) {
            console.error('Failed to update profile admin state in database:', profileError);
          }

          // 4. Load full profile
          const { data: profData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          setUser(data.user);
          setProfile((profData as UserProfile) ?? null);
          
          if (typeof window !== 'undefined') {
            localStorage.removeItem('mock_auth_user');
            localStorage.removeItem('mock_auth_profile');
          }
          setIsLoading(false);
          return { error: null };
        }
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
        // Create a profile row for the new user
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          is_admin: false,
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

  // ---- Derived ----
  const isAdmin = profile?.is_admin ?? false;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isAdmin,
      signIn,
      signUp,
      signOut,
    }),
    [user, profile, isLoading, isAdmin, signIn, signUp, signOut]
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

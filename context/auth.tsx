import React, { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type User = Database['public']['Tables']['users']['Row'];

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/sign-in');
    } else if (user && inAuthGroup) {
      // Redirect to the appropriate initial route based on user role
      switch (user.role) {
        case 'admin':
          router.replace('/dashboard');
          break;
        case 'client':
          router.replace('/services');
          break;
        case 'employee':
          // TODO: Add employee-specific route
          router.replace('/dashboard');
          break;
        default:
          router.replace('/dashboard');
      }
    }
  }, [user, segments, navigationState?.key]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useProtectedRoute(user);

  useEffect(() => {
    let isMounted = true;

    // Check for stored authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;

      if (session?.user) {
        // Fetch user profile from the database
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (!isMounted) return;

            if (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
            } else {
              setUser(profile);
            }
          });
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        try {
          // Fetch user profile when auth state changes
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            setUser(null);
            return;
          }

          if (!profile) {
            console.error('No user profile found');
            setUser(null);
            return;
          }

          setUser(profile);
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw new Error('Failed to fetch user profile');
        }

        if (!profile) {
          console.error('No user profile found');
          throw new Error('User profile not found');
        }

        setUser(profile);
      } else {
        throw new Error('No user data returned from authentication');
      }
    } catch (error) {
      await supabase.auth.signOut(); // Clear any partial authentication state
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
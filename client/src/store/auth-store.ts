import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  onboarding_completed:boolean
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  unsubscribe: (() => void) | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  unsubscribe: null,

  initialize: async () => {
    const existingUnsubscribe = get().unsubscribe;

    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    try {
      set({ loading: true, error: null });

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const user = session?.user ?? null;

      let profile = null;

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Profile fetch error:", error.message);
        }

        profile = data ?? null;
      }

      set({ user, profile, loading: false });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const user = session?.user ?? null;

        let profile = null;

        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          profile = data ?? null;
        }

        set({ user, profile });
      });

      set({ unsubscribe: subscription.unsubscribe });
    } catch (err: any) {
      set({
        error: err.message ?? "Something went wrong",
        loading: false,
      });
    }
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    set({ user: null, profile: null });
  },
}));

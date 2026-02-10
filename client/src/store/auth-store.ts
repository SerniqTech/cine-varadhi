import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  onboarding_completed: boolean;
  full_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;

  isAuthLoading: boolean;
  isProfileLoading: boolean;

  error: string | null;
  unsubscribe: (() => void) | null;

  initialize: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;

  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,

  isAuthLoading: true,
  isProfileLoading: false,

  error: null,
  unsubscribe: null,

  /* ---------------- INITIALIZE ---------------- */

  initialize: async () => {
    const existingUnsubscribe = get().unsubscribe;
    if (existingUnsubscribe) existingUnsubscribe();

    try {
      set({ isAuthLoading: true });

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      const user = session?.user ?? null;

      set({ user });

      if (user) {
        await get().fetchProfile(user.id);
      }

      set({ isAuthLoading: false });

      // 🔥 Auth listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const user = session?.user ?? null;
        set({ user });

        if (user) {
          await get().fetchProfile(user.id);
        } else {
          set({ profile: null });
        }
      });

      set({ unsubscribe: subscription.unsubscribe });
    } catch (err: any) {
      set({
        error: err.message ?? "Something went wrong",
        isAuthLoading: false,
      });
    }
  },

  /* ---------------- FETCH PROFILE ---------------- */

  fetchProfile: async (userId: string) => {
    try {
      set({ isProfileLoading: true });

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      set({ profile: data });
    } catch (err: any) {
      console.error("Profile fetch error:", err.message);
      set({ profile: null });
    } finally {
      set({ isProfileLoading: false });
    }
  },

  /* ---------------- REFRESH PROFILE ---------------- */

  refreshProfile: async () => {
    const user = get().user;
    if (!user) return;

    await get().fetchProfile(user.id);
  },

  /* ---------------- AUTH METHODS ---------------- */

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `https://cine-varadhi-d698d.web.app/`,
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

import { create } from "zustand";
// import { useVideoStore } from "./useVideoStore";

interface AuthState {
  username: string | null;
  usertoken: string | null;
  setUsername: (username: string | null) => void;
  setUsertoken: (usertoken: string | null) => void;
  logout: () => void;
}

const useUserState = create<AuthState>((set) => ({
  username: null,
  usertoken: null,

  setUsername: (username: string | null) => {
    set({ username });
    if (typeof window !== "undefined") {
      localStorage.setItem("username", username || "");
    }
  },

  setUsertoken: (usertoken: string | null) => {
    set({ usertoken });
    if (typeof window !== "undefined") {
      localStorage.setItem("usertoken", usertoken || "");
    }
  },

  logout: () => {
    set({ username: null, usertoken: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("username");
      localStorage.removeItem("usertoken");
    }
  },
}));

export default useUserState; 


"use client";

import { create } from "zustand";

export type Role =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "TEACHER"
  | "STUDENT"
  | "PARENT";

type SessionState = {
  role: Role;
  schoolId?: string;
  setRole: (role: Role) => void;
  setSchool: (schoolId: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  role: "SUPER_ADMIN",
  schoolId: undefined,
  setRole: (role) => set({ role }),
  setSchool: (schoolId) => set({ schoolId }),
}));

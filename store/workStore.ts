"use client";

import { create } from "zustand";

interface WorkState {
  searchParams: URLSearchParams | null;
  setSearchParams: (params: URLSearchParams) => void;
}

export const useWorkStore = create<WorkState>((set) => ({
  searchParams: null,
  setSearchParams: (params) => set({ searchParams: params }),
}));

"use client";

import { create } from "zustand";

interface EnergySystemState {
  // Component states
  inverterActive: boolean;
  switchActive: boolean;
  showHeroSection: boolean;
  showTagSection: boolean;
  booting: boolean;

  // Animation and metrics
  animationPhase: number;
  energySaved: number;
  co2Reduced: number;
  animationsPaused: boolean;

  // State update functions
  setInverterActive: (active: boolean) => void;
  setSwitchActive: (active: boolean) => void;
  setShowHeroSection: (show: boolean) => void;
  setShowTagSection: (show: boolean) => void;
  setAnimationPhase: (phase: number) => void;
  incrementEnergySaved: () => void;
  incrementCo2Reduced: () => void;
  setBooting: (booting: boolean) => void;
  setAnimationsPaused: (paused: boolean) => void;
  toggleAnimations: () => void;

  // Utility functions
  activateFullSystem: () => void;
  deactivateFullSystem: () => void;
}

export const useEnergySystemStore = create<EnergySystemState>((set, get) => ({
  // Initial states
  inverterActive: false,
  switchActive: false,
  showHeroSection: true,
  showTagSection: true,
  booting: false,
  animationPhase: 0,
  energySaved: 0,
  co2Reduced: 0,
  animationsPaused: false,

  // Core state update functions
  setInverterActive: (active) =>
    set((state) => ({
      ...state,
      inverterActive: active,
      switchActive: active ? state.switchActive : false,
      showHeroSection: active,
      showTagSection: active,
      animationPhase: active ? 1 : 0, // Animation phase depends only on inverter state
    })),

  setSwitchActive: (active) =>
    set((state) => {
      // If turning the switch on, also turn on the inverter
      if (active) {
        return {
          ...state,
          switchActive: active,
          inverterActive: true, // Ensure inverter is activated when switch is activated
          showHeroSection: true,
          showTagSection: true,
          animationPhase: 1, // Update animation phase
        };
      }
      
      // When turning off, just update the switch state
      return {
        ...state,
        switchActive: active,
      };
    }),

  setShowHeroSection: (show) =>
    set((state) => ({
      ...state,
      showHeroSection: show,
    })),

  setShowTagSection: (show) =>
    set((state) => ({
      ...state,
      showTagSection: show,
    })),

  setAnimationPhase: (phase) =>
    set((state) => ({ ...state, animationPhase: phase })),

  incrementEnergySaved: () =>
    set((state) => ({ ...state, energySaved: state.energySaved + 0.05 })),

  incrementCo2Reduced: () =>
    set((state) => ({ ...state, co2Reduced: state.co2Reduced + 0.02 })),

  setBooting: (booting) => set((state) => ({ ...state, booting })),

  setAnimationsPaused: (paused) =>
    set((state) => ({ ...state, animationsPaused: paused })),

  toggleAnimations: () =>
    set((state) => ({ ...state, animationsPaused: !state.animationsPaused })),

  // Utility functions
  activateFullSystem: () =>
    set((state) => ({
      ...state,
      inverterActive: true,
      switchActive: true,
      showHeroSection: true,
      showTagSection: true,
      animationPhase: 1,
    })),

  deactivateFullSystem: () =>
    set((state) => ({
      ...state,
      inverterActive: false,
      switchActive: false,
      showHeroSection: false,
      showTagSection: false,
      animationPhase: 0,
    })),
}));

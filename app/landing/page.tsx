"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useEnergySystemStore } from "@/store/energySystemStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMobileGestures } from "@/hooks/useMobileGestures";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDesktopMode } from "@/hooks/useDesktopMode";

// Layout Components
import HeaderSection from "@/components/sections/Header/HeaderSection";
import HeroSection from "@/components/sections/Hero/HeroSection";
import ContactGreanWorldSection from "@/components/sections/ContactGreanWorld/ContactGreanWorldSection";

// Custom Interactive Demo Section
import InteractiveDemoSection from "./InteractiveDemoSection";

// Animation Imports
import { motion, AnimatePresence } from "framer-motion";

// Official Brand CSS from brand guidelines
const brandCSS = `
  :root {
    --grean-primary: #3dd56d;
    --grean-secondary: #2bb757;
    --grean-accent: #23a455;
  }

  html, body {
    min-height: 100vh;
    min-height: 100dvh;
    margin: 0;
    padding: 0;
  }

  html {
    background: #ffffff;
  }

  html.dark {
    background: #020617;
  }

  .light body {
    background: #ffffff !important;
  }

  .dark body {
    background: #020617 !important;
  }

  .dark {
    color-scheme: dark;
  }

  /* Ensure dark mode backgrounds persist */
  .dark * {
    --tw-bg-opacity: 1;
  }
`;

// Loading component for suspense fallbacks
const LoadingComponent = () => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function ResponsiveLandingPage() {
  // Mobile detection and desktop mode preference
  const isMobile = useIsMobile();
  const { isDesktopMode, mounted } = useDesktopMode();
  const { isDark } = useTheme();
  
  // Determine if we should show mobile layout
  const shouldShowMobileLayout = mounted && isMobile && !isDesktopMode;
  
  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Get window dimensions
  const { windowHeight, windowWidth } = useWindowDimensions();
  
  // Get energy system state from store
  const {
    inverterActive,
    switchActive,
    setInverterActive,
    setSwitchActive,
    toggleAnimations,
    animationsPaused
  } = useEnergySystemStore();
  
  // Inject official brand CSS
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = brandCSS;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Initialize loading effect
  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoadingComplete(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [mounted]);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onSpacePress: () => {
      toggleAnimations();
    },
    enabled: true,
  });

  // Initialize mobile gestures for navigation
  useMobileGestures({
    onSwipeLeft: () => {
      if (!switchActive) {
        setSwitchActive(true);
      }
    },
    onSwipeRight: () => {
      if (switchActive) {
        setSwitchActive(false);
      } else if (inverterActive) {
        setInverterActive(false);
      }
    },
    enabled: true,
  });

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Loading Screen - Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex items-center justify-center"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mb-4 mx-auto relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500 border-r-green-500"
                ></motion.div>
                <div className="absolute inset-2 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-green-500/40"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 animate-pulse">
                Loading energy systems...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header Section (10% of viewport height) */}
        <header className="fixed top-0 left-0 w-full z-30 h-[10vh]">
          <Suspense fallback={<LoadingComponent />}>
            <HeaderSection />
          </Suspense>
        </header>
        
        {/* Hero Section (25% of viewport height) */}
        <section className="mt-[10vh] min-h-[25vh] flex items-center justify-center px-4 sm:px-8 lg:px-16">
          <Suspense fallback={<LoadingComponent />}>
            <HeroSection />
          </Suspense>
        </section>
        
        {/* Interactive Simulation Demo (45% of viewport height) */}
        <section className="min-h-[45vh] flex items-center justify-center px-4 sm:px-8 lg:px-16">
          <Suspense fallback={<LoadingComponent />}>
            <InteractiveDemoSection />
          </Suspense>
        </section>
        
        {/* Contact Section (20% of viewport height) */}
        <section className="min-h-[20vh] flex items-center justify-center px-4 sm:px-8 lg:px-16 mb-4">
          <Suspense fallback={<LoadingComponent />}>
            <ContactGreanWorldSection />
          </Suspense>
        </section>
      </main>
    </div>
  );
} 
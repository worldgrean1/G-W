"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnergySystemStore } from "@/store/energySystemStore";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/useTheme";
import styles from "./styles.module.css";
import PowerFlowConnector from "./PowerFlowConnector";

// Import the components from the existing project
import StaticInverterNode from "@/components/static-nodes/inverter";
import StaticSwitchNode from "@/components/static-nodes/static-switch-node";

export default function InteractiveDemoSection() {
  // Get theme and mobile detection
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const { windowHeight, windowWidth } = useWindowDimensions();
  
  // Component state
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Refs for interactive components
  const demoRef = useRef<HTMLDivElement>(null);
  const inverterContainerRef = useRef<HTMLDivElement>(null);
  const switchContainerRef = useRef<HTMLDivElement>(null);
  
  // Get energy system state from store
  const {
    inverterActive,
    switchActive,
    setInverterActive,
    setSwitchActive,
    booting,
    setBooting
  } = useEnergySystemStore();
  
  // Show tooltip after a delay when component loads
  useEffect(() => {
    // Only show tooltip if inverter is not active and not booting
    if (!inverterActive && !booting) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [inverterActive, booting]);
  
  // Update container dimensions when window size changes
  useEffect(() => {
    if (demoRef.current) {
      setContainerWidth(demoRef.current.offsetWidth);
      setContainerHeight(demoRef.current.offsetHeight);
    }
  }, [windowWidth, windowHeight]);
  
  // Calculate ideal inverter scale based on screen size
  const getInverterScale = () => {
    // Base scale depends on screen size
    if (isMobile) {
      return 0.45; // Smaller scale for mobile
    } else if (windowWidth < 1024) {
      return 0.55; // Medium scale for tablets
    } else {
      return 0.65; // Larger scale for desktop
    }
  };
  
  // Calculate ideal switch scale based on screen size
  const getSwitchScale = () => {
    if (isMobile) {
      return 0.8; // Smaller scale for mobile
    } else {
      return 1.0; // Normal scale for desktop
    }
  };
  
  // Get calculated scales
  const inverterScale = getInverterScale();
  const switchScale = getSwitchScale();

  // Start simulation function with error handling
  const startSimulation = () => {
    try {
      if (!inverterActive && !booting) {
        setBooting(true);
        setShowTooltip(false);
        
        // Add small delay to simulate booting
        setTimeout(() => {
          setInverterActive(true);
          setBooting(false);
          
          // Auto-activate switch after inverter turns on (for demo purposes)
          setTimeout(() => {
            if (!switchActive) {
              setSwitchActive(true);
            }
          }, 2000);
        }, 1500);
      }
    } catch (error) {
      console.error("Error starting simulation:", error);
      setBooting(false);
    }
  };
  
  return (
    <motion.section
      className={`w-full max-w-7xl mx-auto ${styles.sectionPadding}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={demoRef}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-8">
        {/* Left side - Inverter */}
        <div
          ref={inverterContainerRef}
          className="flex flex-col items-center justify-center relative"
        >
          {/* Proper Inverter Component with correct scaling */}
          <div className="relative w-[250px] h-[350px] flex items-center justify-center">
            <StaticInverterNode
              position={{ x: 0, y: 0 }}
              inverterOn={inverterActive}
              onInverterChange={setInverterActive}
              gridConnected={inverterActive}
              solarConnected={inverterActive}
              batteryConnected={inverterActive}
              loadPercentage={inverterActive ? 75 : 0}
              efficiency={97}
              inputVoltage={48}
              outputVoltage={230}
              frequency={50}
              batteryLevel={80}
              batteryCharging={inverterActive}
              totalEnergyGenerated={23.5}
              temperature={inverterActive ? 45 : 25}
              fanSpeed={inverterActive ? 40 : 0}
              mode="normal"
              scale={inverterScale}
              fixedPosition={false}
              centerOrigin={true}
              className="transition-all duration-500 ease-in-out"
            />
            
            {/* Animated tooltip */}
            <AnimatePresence>
              {showTooltip && !inverterActive && !booting && (
                <motion.div
                  className="absolute right-0 top-1/3 bg-green-600 text-white text-xs font-bold rounded p-2 shadow-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ maxWidth: "120px", zIndex: 10 }}
                  onClick={startSimulation}
                >
                  <div className="relative">
                    Click to activate
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-green-600">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className={`mt-4 text-sm font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>Inverter</p>
        </div>
        
        {/* Center - Power Flow Connector */}
        <div className="w-32 md:w-48 h-2 bg-green-500/20 relative overflow-hidden">
          {(inverterActive && switchActive) && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500 to-transparent bg-[length:200%_100%]"
              animate={{
                backgroundPosition: ["100% 0", "-100% 0"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </div>
        
        {/* Right side - Switch */}
        <div
          ref={switchContainerRef}
          className="flex flex-col items-center justify-center relative"
        >
          <div className="relative w-[120px] h-[180px] flex items-center justify-center">
            <StaticSwitchNode
              position={{ x: 0, y: 0 }}
              switchOn={switchActive}
              onSwitchChange={setSwitchActive}
              scale={switchScale}
              fixedPosition={false}
              centerOrigin={true}
            />
          </div>
          <p className={`mt-4 text-sm font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>Switch</p>
        </div>
      </div>
    </motion.section>
  );
}

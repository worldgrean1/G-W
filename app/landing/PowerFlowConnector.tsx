"use client";

import { motion } from "framer-motion";
import { useEnergySystemStore } from "@/store/energySystemStore";
import { useTheme } from "@/hooks/useTheme";
import { memo } from 'react';

interface PowerFlowConnectorProps {
  active?: boolean;
  className?: string;
}

// Use memo to prevent unnecessary re-renders
const PowerFlowConnector = memo(function PowerFlowConnector({ 
  active, 
  className = "" 
}: PowerFlowConnectorProps) {
  const { isDark } = useTheme();
  const { inverterActive, switchActive } = useEnergySystemStore();
  
  // Determine if power should flow based on component state or store state
  const isPowerFlowing = active !== undefined ? active : (inverterActive && switchActive);
  
  return (
    <div className={`w-32 md:w-48 h-2 bg-green-500/20 relative overflow-hidden ${className}`}>
      {isPowerFlowing && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500 to-transparent"
          style={{ backgroundSize: "200% 100%" }}
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
  );
});

export default PowerFlowConnector; 
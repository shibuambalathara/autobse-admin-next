"use client";

import { useCallback, useEffect, useState } from "react";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import type { SidebarMode } from "@/types";

interface SidebarState {
  mode: SidebarMode;
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  toggleCollapse: () => void;
}

export function useSidebar(): SidebarState {
  const { isMobile } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (!isMobile) setIsOpen(false);
  }, [isMobile]);

  const mode: SidebarMode = isMobile ? "drawer" : isCollapsed ? "collapsed" : "expanded";

  return {
    mode,
    isOpen,
    isCollapsed,
    toggle: useCallback(() => setIsOpen((v) => !v), []),
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
    toggleCollapse: useCallback(() => setIsCollapsed((v) => !v), []),
  };
}

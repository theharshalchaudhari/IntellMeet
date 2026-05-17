"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DesktopHeader = dynamic(() => import("../header/DesktopHeader"), { ssr: false });
const MobileHeader  = dynamic(() => import("../header/MobileHeader"),  { ssr: false });

export function Header() {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (!isMounted) return null;

  return isDesktop ? <DesktopHeader /> : <MobileHeader />;
}
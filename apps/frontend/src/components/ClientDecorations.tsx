'use client';

import StickyCursor from "@/components/cursor/StickyCursor";
import Checks from "@/components/Checks";

export function ClientDecorations() {
  return (
    <>
      <StickyCursor />
      <Checks interactive showMask />
    </>
  );
}

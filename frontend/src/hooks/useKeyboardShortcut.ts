"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options?: { metaOrCtrl?: boolean }
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTargetKey = e.key.toLowerCase() === key.toLowerCase();
      const requiresModifier = options?.metaOrCtrl;

      if (requiresModifier) {
        if (isTargetKey && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          callback(e);
        }
      } else if (isTargetKey) {
        callback(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options?.metaOrCtrl]);
}

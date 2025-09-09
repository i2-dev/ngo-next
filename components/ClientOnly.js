"use client";

import { useState, useEffect } from 'react';

export default function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // console.log('ClientOnly: Component mounted, checking window object');
    // Ensure we're in the browser environment
    if (typeof window !== 'undefined') {
      // console.log('ClientOnly: Window object found, setting hasMounted to true');
      setHasMounted(true);
    } else {
      // console.log('ClientOnly: Window object not found');
    }
  }, []);

  // Don't render anything until we're on the client side
  if (!hasMounted) {
    // console.log('ClientOnly: Not mounted yet, returning fallback');
    return fallback;
  }

  // console.log('ClientOnly: Mounted, rendering children');
  return children;
} 
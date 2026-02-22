import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface WishlistContextType {
  wishlist: Set<string>;
  toggleWishlist: (motorcycleId: string) => void;
  isInWishlist: (motorcycleId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setWishlist(new Set(parsed));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const toggleWishlist = (motorcycleId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(motorcycleId)) {
        next.delete(motorcycleId);
      } else {
        next.add(motorcycleId);
      }

      localStorage.setItem('wishlist', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const isInWishlist = (motorcycleId: string) => wishlist.has(motorcycleId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

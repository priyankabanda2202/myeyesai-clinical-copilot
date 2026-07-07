"use client";

import { createContext, useContext, useEffect, useState } from "react";

type NavContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const NavContext = createContext<NavContextValue>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <NavContext.Provider value={{ open, setOpen, toggle: () => setOpen((v) => !v) }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}

/** Close drawer when route changes (mobile) */
export function useCloseNavOnNavigate(pathname: string) {
  const { setOpen } = useNav();
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);
}

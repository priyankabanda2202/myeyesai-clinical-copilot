"use client";

import { BRANCHES, Branch } from "@/lib/hospital";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "visionflow-active-branch";

type BranchContextValue = {
  branch: Branch;
  setBranchId: (id: string) => void;
};

const BranchContext = createContext<BranchContextValue>({
  branch: BRANCHES[0],
  setBranchId: () => {},
});

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branchId, setBranchIdState] = useState(BRANCHES[0].id);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && BRANCHES.some((b) => b.id === saved)) {
      setBranchIdState(saved);
    }
  }, []);

  function setBranchId(id: string) {
    setBranchIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  const branch = BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];

  return (
    <BranchContext.Provider value={{ branch, setBranchId }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  return useContext(BranchContext);
}

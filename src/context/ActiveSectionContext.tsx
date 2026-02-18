"use client";

import { createContext, useContext, useState } from "react";

type SectionId = "home" | "features" | "pricing" | "contact";

type ActiveSectionContextType = {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextType>({
  activeSection: "home",
  setActiveSection: () => {},
});

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

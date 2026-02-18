"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useActiveSection } from "@/context/ActiveSectionContext";

type SectionId = "home" | "features" | "pricing" | "contact";

interface SectionObserverProps {
  id: SectionId;
  children: React.ReactNode;
  className?: string;
  amount?: number;
}

export default function SectionObserver({
  id,
  children,
  className,
  amount = 0.3,
}: SectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount, margin: "-80px 0px 0px 0px" });
  const { setActiveSection } = useActiveSection();

  useEffect(() => {
    if (isInView) {
      setActiveSection(id);
    }
  }, [isInView, id, setActiveSection]);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}

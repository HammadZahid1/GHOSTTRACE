"use client";

import { ModuleHeader } from "./ModuleHeader";
import { EmptyState } from "@/components/common";

export interface ModulePageProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

/** Scaffold page for modules still under construction. */
export function ModulePage({ eyebrow, title, description, icon }: ModulePageProps) {
  return (
    <>
      <ModuleHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState
        icon={icon}
        title="Module under construction"
        description="This intelligence module is scheduled for an upcoming development phase."
      />
    </>
  );
}

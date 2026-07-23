import type { ReactNode } from "react";

interface FormStepProps {
  numero: number;
  titre: string;
  children: ReactNode;
}

export default function FormStep({ numero, titre, children }: FormStepProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-sm font-bold text-white">
          {numero}
        </span>
        <h2 className="text-lg font-bold text-navy-950">{titre}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

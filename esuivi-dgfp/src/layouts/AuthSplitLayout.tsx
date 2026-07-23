import type { ReactNode } from "react";
import Logo from "../components/Logo";

interface AuthSplitLayoutProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
}

export default function AuthSplitLayout({
  eyebrow,
  title,
  subtitle,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Panneau gauche décoratif */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-12 md:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(245,166,35,0.5) 0%, rgba(10,38,71,0) 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(19,57,104,0.9) 0%, rgba(10,38,71,0) 70%)",
          }}
        />

        <div className="relative z-10">
          <span className="text-sm font-semibold uppercase tracking-wide text-gold-500">
            {eyebrow}
          </span>
          <h1 className="mt-4 max-w-md text-4xl font-extrabold leading-tight text-white">
            {title}
          </h1>
          <p className="mt-4 max-w-sm text-slate-300">{subtitle}</p>
        </div>

        <p className="relative z-10 text-sm text-slate-400">
          © 2026 DGFP — Direction Générale de la Fonction Publique
        </p>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex flex-col justify-center bg-white px-8 py-12 md:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 md:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

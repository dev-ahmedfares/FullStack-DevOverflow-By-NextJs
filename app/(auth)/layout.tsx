import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-center min-h-screen w-full bg-auth-light bg-cover bg-center bg-no-repeat dark:bg-auth-dark">
      {children}
    </main>
  );
}

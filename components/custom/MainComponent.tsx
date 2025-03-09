// components/ClientOnly.tsx
"use client";
import { Footer } from "@/components/custom/Footer";
import { HeaderMenu } from "@/components/custom/HeaderMenu";
import { hasRole } from "@/helpers/checkAuthorization";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainComponent({
  children,
  rolesPermission,
  className,
}: {
  children: React.ReactNode;
  rolesPermission?: string[];
  className?: string;
}) {
  const router = useRouter();
  useEffect(() => {
    // Obtenha o token do localStorage
    const objectStorage = localStorage.getItem("auth-storage");
    // console.log(objectStorage);
    const json = objectStorage && JSON.parse(objectStorage);

    // const storageToken = useAuthStore.getState().token
    // const token = storageToken || null;
    const token = json && json.state && json.state.token;

    if (!token) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (rolesPermission && !hasRole(rolesPermission)) {
      router.push("/");
    }
  }, []);

  return (
    <main className="flex flex-col gap-4 w-full bg-background py-8 px-4 max-w-6xl mx-auto">
      <HeaderMenu />
      <section className={cn("flex flex-col flex-wrap w-full h-full min-h-[70dvh]", className)}>
        {children}
      </section>
      <Footer />
    </main>
  );
}

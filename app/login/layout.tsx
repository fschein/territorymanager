import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata = {
  title: "Login",
  description: "Página de Login",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      {children}
    </ThemeProvider>
  );
}

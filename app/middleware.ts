import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Permitir acesso à página de login sem autenticação
  if (req.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // Se não houver token, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Aplica o middleware em todas as rotas, exceto login
export const config = {
  matcher: "/((?!api/auth/login|login).*)", // Protege todas as rotas, menos a de login
};

import { NextRequest, NextResponse } from "next/server";

// Função para validar o token diretamente via API
const validateToken = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return false;
  }
};
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const lastValidation = req.cookies.get("lastValidation")?.value;
  const isTokenValid = req.cookies.get("isTokenValid")?.value;
  const now = Date.now();

  // Permitir acesso direto à página de login e API de autenticação
  if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Sem token, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verifica se já validou recentemente (12h)
  if (
    lastValidation &&
    isTokenValid === "true" &&
    now - Number(lastValidation) < 12 * 60 * 60 * 1000
  ) {
    return NextResponse.next();
  }

  // Valida token via API
  const isValid = await validateToken(token);

  const response = isValid
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/login", req.url));

  // Atualiza cookies com os resultados
  response.cookies.set("isTokenValid", String(isValid));
  response.cookies.set("lastValidation", String(now));

  return response;
}

// Configuração do matcher
export const config = {
  matcher: "/((?!api/auth/.*|_next/.*|login).*)",
};

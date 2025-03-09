import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || "seu_secret_aqui", (err, decoded) => {
      if (err) {
        reject("Token inválido");
      } else {
        resolve(decoded);
      }
    });
  });
};

import { NextResponse } from "next/server";

export async function withAuth(req: Request, allowedRoles?: string | string[]) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    // Se allowedRoles não for definido, qualquer usuário autenticado pode acessar
    if (allowedRoles) {
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      if (!roles.includes(user.role)) {
        return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
      }
    }

    return user;
  } catch (error: any) {
    return NextResponse.json({ error: "Erro na autenticação.", details: error }, { status: 500 });
  }
}

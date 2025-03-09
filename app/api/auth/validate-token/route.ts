import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta"; // Substitua pela sua chave real

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET_KEY);

    return NextResponse.json({ valid: true, decoded }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
  }
}

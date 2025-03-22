import connectToDB from "@/app/api/lib/mongoose";
import User from "@/app/api/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "seu_secret_aqui"
    );

    // Salvar o token no cookie com a API de cookies do Next.js
    const response = NextResponse.json({ token, user }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true, // Impede o acesso ao cookie via JavaScript (melhora a segurança)
      // secure: process.env.NODE_ENV === "production", // Só envia o cookie em HTTPS
      sameSite: "strict", // Protege contra ataques CSRF
      maxAge: 100 * 365 * 24 * 60 * 60, // Expira em 100 anos (em segundos)
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao realizar login", details: error }, { status: 500 });
  }
}

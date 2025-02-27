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
      process.env.JWT_SECRET || "seu_secret_aqui",
      { expiresIn: "15d" }
    );

    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao realizar login", details: error }, { status: 500 });
  }
}

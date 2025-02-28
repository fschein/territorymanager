import connectToDB from "@/app/api/lib/mongoose";
import User from "@/app/api/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { withAuth } from "../lib/auth";

export async function POST(req: Request) {
  const user = await withAuth(req, "admin");
  if (user instanceof NextResponse) return user; // Retorna erro se não for admin

  try {
    await connectToDB();
    const { name, email, password, role, phone_number } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, phone_number });

    await newUser.save();
    return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error.message);
    return NextResponse.json({ error: "Erro ao criar usuário", details: error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const users = await User.find({ role: { $ne: "admin" } });
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar usuários:", error.message);
    return NextResponse.json({ error: "Erro ao buscar usuários", details: error }, { status: 500 });
  }
}

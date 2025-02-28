import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import User from "@/app/api/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await withAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    const id = (await params).id;

    if (user.id !== id && user.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    await connectToDB();
    const foundUser = await User.findById(id).select("-password");
    if (!foundUser) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    return NextResponse.json(foundUser, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar usuário:", error.message);
    return NextResponse.json({ error: "Erro ao buscar usuário", details: error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user; // Retorna erro se não estiver autenticado

  try {
    await connectToDB();
    const { name, email, role, phone_number, password } = await req.json();
    const id = (await params).id;

    // O usuário comum pode editar apenas seu próprio perfil (name e email)
    if (user.role !== "admin" && user.id !== id) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }
    const updateData: {
      name?: string;
      email?: string;
      role?: string;
      phone_number?: string;
      password?: string;
    } = {
      name,
      email,
      phone_number,
    };

    // Apenas admins podem modificar a role
    if (user.role === "admin" && role) {
      updateData.role = role;
    }

    // Se o password foi informado, ele é criptografado e adicionado ao updateData
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error.message);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req, "admin");
  if (user instanceof NextResponse) return user; // Retorna erro se não for admin

  try {
    await connectToDB();
    const id = (await params).id;

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "Usuário deletado com sucesso!" }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error.message);
    return NextResponse.json({ error: "Erro ao deletar usuário", details: error }, { status: 500 });
  }
}

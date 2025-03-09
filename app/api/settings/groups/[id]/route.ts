import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Group from "@/app/api/models/group.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    await connectToDB();
    const id = (await params).id;

    const group = await Group.findById(id);
    if (!group) return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });

    return NextResponse.json(group, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar grupo", details: error }, { status: 500 });
  }
}

// 📌 Atualizar um grupo (PUT)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB();
    const id = (await params).id; // Alterado para acessar `params`

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const { name, color } = await req.json();
    const updatedGroup = await Group.findByIdAndUpdate(id, { name, color }, { new: true });

    if (!updatedGroup) {
      return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao atualizar grupo", details: error }, { status: 500 });
  }
}

// 📌 Deletar um grupo (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB();
    const id = (await params).id; // Alterado para acessar `params`

    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });

    return NextResponse.json({ message: "Grupo deletado com sucesso" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao deletar grupo", details: error }, { status: 500 });
  }
}

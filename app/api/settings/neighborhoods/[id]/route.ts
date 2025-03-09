import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Neighborhood from "@/app/api/models/neighborhood.model";
import { NextResponse } from "next/server";

// 📌 Buscar um bairro por ID (GET)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const id = (await params).id;
    const neighborhood = await Neighborhood.findById(id);
    if (!neighborhood)
      return NextResponse.json({ error: "Bairro não encontrado" }, { status: 404 });
    return NextResponse.json(neighborhood, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar bairro", details: error }, { status: 500 });
  }
}

// 📌 Atualizar um bairro (PUT)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req, ["admin", "elder"]);
  if (user instanceof NextResponse) return user;
  try {
    const id = (await params).id;
    await connectToDB();
    const { name } = await req.json();
    const updatedNeighborhood = await Neighborhood.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedNeighborhood)
      return NextResponse.json({ error: "Bairro não encontrado" }, { status: 404 });
    return NextResponse.json(updatedNeighborhood, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao atualizar bairro", details: error },
      { status: 500 }
    );
  }
}

// 📌 Deletar um bairro (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await connectToDB();
    const deletedNeighborhood = await Neighborhood.findByIdAndDelete(id);
    if (!deletedNeighborhood)
      return NextResponse.json({ error: "Bairro não encontrado" }, { status: 404 });
    return NextResponse.json({ message: "Bairro deletado com sucesso" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao deletar bairro", details: error }, { status: 500 });
  }
}

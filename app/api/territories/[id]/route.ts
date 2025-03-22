import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Territory from "@/app/api/models/territory.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Buscar um território por ID (GET)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  try {
    const id = (await params).id;
    await connectToDB();
    if (!mongoose.models.Group) {
      await import("@/app/api/models/group.model");
    }
    if (!mongoose.models.Neighborhood) {
      await import("@/app/api/models/neighborhood.model");
    }
    const territory = await Territory.findById(id).populate("id_group").populate("id_neighborhood");
    const territoryWithGroupAndNeighborhood = {
      ...territory.toObject(),
      id_group: territory.id_group._id.toString(),
      group: territory.id_group,
      id_neighborhood: territory.id_neighborhood._id.toString(),
      neighborhood: territory.id_neighborhood,
    };

    if (!territoryWithGroupAndNeighborhood)
      return NextResponse.json({ error: "Território não encontrado" }, { status: 404 });
    return NextResponse.json(territoryWithGroupAndNeighborhood, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar território:", error.message);
    return NextResponse.json(
      { error: "Erro ao buscar território", details: error },
      { status: 500 }
    );
  }
}

// Atualizar um território (PUT)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const paramsData = await params;
    const id = paramsData.id;
    const body = await req.json();
    // Verificando se já existe um território com o mesmo número
    const existingTerritory = await Territory.findOne({ number: body.number });
    if (existingTerritory && existingTerritory.id !== id) {
      // Se já existe um território com o mesmo número, mas não é o mesmo que está sendo atualizado
      throw new Error(`Território com o número ${body.number} já existe`);
    }
    const updatedTerritory = await Territory.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("id_group")
      .populate("id_neighborhood");

    if (!updatedTerritory)
      return NextResponse.json({ error: "Território não encontrado" }, { status: 404 });
    return NextResponse.json(updatedTerritory, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar território:", error.message);
    return NextResponse.json({ error: error.message, details: error }, { status: 400 });
  }
}

// Deletar um território (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const id = (await params).id;
    const deletedTerritory = await Territory.findByIdAndDelete(id);
    if (!deletedTerritory)
      return NextResponse.json({ error: "Território não encontrado" }, { status: 404 });
    return NextResponse.json({ message: "Território deletado com sucesso" }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao deletar território:", error.message);

    return NextResponse.json(
      { error: "Erro ao deletar território", details: error },
      { status: 500 }
    );
  }
}

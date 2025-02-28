import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Territory from "@/app/api/models/territory.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import TerritoryLog from "../../models/territoryLog.model";

export async function GET(req: Request) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    await connectToDB();

    // Faz o count agrupando por status
    const statusCounts = await Territory.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Converte para um objeto mais legível
    const statusSummary: Record<string, number> = {};
    statusCounts.forEach(({ _id, count }) => {
      statusSummary[_id] = count;
    });

    return NextResponse.json({ ...statusSummary }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar territórios:", error.message);
    return NextResponse.json({ error: "Erro ao buscar territórios" }, { status: 500 });
  }
}

// Atualizar status de um território (PUT)
export async function PUT(req: NextRequest) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const { id, status, information, id_responsible, data } = await req.json();
    if (!mongoose.models.Group) {
      await import("@/app/api/models/group.model");
    }
    if (!mongoose.models.Neighborhood) {
      await import("@/app/api/models/neighborhood.model");
    }

    const updatedTerritory = await Territory.findByIdAndUpdate(
      id,
      { status, information, id_responsible },
      { new: true, runValidators: true }
    )
      .populate("id_group")
      .populate("id_neighborhood");

    if (!updatedTerritory) throw new Error("Território não encontrado");

    // Se o status for "done" ou "ongoing", cria um registro na tabela TerritoryLog
    if (status === "done" || status === "ongoing") {
      await Territory.findByIdAndUpdate(
        id,

        { id_responsible: null },
        { new: true, runValidators: true }
      );
      await TerritoryLog.create({
        territory: id,
        user: user.id, // Pegando o ID do usuário autenticado
        data: data || new Date(),
        status,
        information,
      });
    }
    return NextResponse.json(updatedTerritory, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar status do território:", error.message);
    return NextResponse.json(
      { error: "Erro ao atualizar status do território", details: error },
      { status: 400 }
    );
  }
}

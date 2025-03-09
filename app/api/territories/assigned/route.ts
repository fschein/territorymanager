import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Territory from "@/app/api/models/territory.model";
import { NextRequest, NextResponse } from "next/server";

// Rrmove a designação de um território (PUT)
export async function PUT(req: NextRequest) {
  const user = await withAuth(req, ["admin", "elder"]);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const { id_territory, id_responsible } = await req.json();

    const updatedTerritory = await Territory.findByIdAndUpdate(
      id_territory,
      { $pull: { responsibles: id_responsible } },
      { new: true, runValidators: true }
    );

    if (!updatedTerritory) {
      return NextResponse.json({ error: "Território não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedTerritory, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar designados do território:", error.message);
    return NextResponse.json({ error: error.message, details: error }, { status: 400 });
  }
}

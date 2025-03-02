import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Territory from "@/app/api/models/territory.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Listar todos os territórios (GET)
export async function GET(req: Request) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    if (!mongoose.models.Group) {
      await import("@/app/api/models/group.model");
    }
    if (!mongoose.models.Neighborhood) {
      await import("@/app/api/models/neighborhood.model");
    }
    if (!mongoose.models.User) {
      await import("@/app/api/models/user.model");
    }
    // Pegando os parâmetros da URL
    const { searchParams } = new URL(req.url);
    // Extraindo id_responsible
    const id_responsible = searchParams.get("filters[id_responsible]");

    // Extraindo statusList (pega todos os valores de "filters[statusList][x]")
    const statusList: string[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith("filters[statusList]")) {
        statusList.push(value);
      }
    });

    // Extraindo id (se presente)
    const id = searchParams.get("filters[id]");

    // Construindo o filtro
    const query: any = {};
    if (id_responsible) query.responsibles = { $in: [id_responsible] };
    if (statusList.length > 0) query.status = { $in: statusList };
    if (id) query._id = id;

    const territories = await Territory.find(query)
      .populate("id_group")
      .populate("id_neighborhood")
      .populate({ path: "responsibles", strictPopulate: false });
    const territoriesWithGroupAndNeighborhood = territories.map((territory) => ({
      ...territory.toObject(),
      group: territory.id_group,
      neighborhood: territory.id_neighborhood,
    }));
    const statusOrder = {
      urgent: 1,
      ongoing: 2,
      assigned: 3,
      done: 4,
    };

    // Ordena com base na prioridade dos status
    territoriesWithGroupAndNeighborhood.sort((a, b) => {
      return (
        (statusOrder[a.status as keyof typeof statusOrder] || 99) -
        (statusOrder[b.status as keyof typeof statusOrder] || 99)
      );
    });
    return NextResponse.json(territoriesWithGroupAndNeighborhood, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar territórios:", error.message);
    return NextResponse.json(
      { error: "Erro ao buscar territórios", details: error },
      { status: 500 }
    );
  }
}

// Criar um novo território (POST)
export async function POST(req: NextRequest) {
  const user = await withAuth(req, ["admin", "elder"]);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const body = await req.json();
    // Verificando se já existe um território com o mesmo número
    const existingTerritory = await Territory.findOne({ number: body.number });
    if (existingTerritory) {
      throw new Error(`Território com o número ${body.number} já existe`);
    }
    const newTerritory = new Territory(body);
    await newTerritory.save();
    return NextResponse.json(newTerritory, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar território:", error.message);
    return NextResponse.json({ error: error.message, details: error }, { status: 400 });
  }
}

import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Square from "@/app/api/models/square.model";
import { NextRequest, NextResponse } from "next/server";
import Territory from "../models/territory.model";

// Criar um novo quadra (POST)
export async function POST(req: NextRequest) {
  const user = await withAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const body = await req.json();

    const territory = await Territory.findOne({ number: body.territory_number });
    if (!territory) {
      throw new Error(`Não há nenhum território com o número ${body.territory_number}`);
    }

    const existingSquare = await Square.findOne({
      letter: body.letter,
      id_territory: territory._id,
    });
    if (existingSquare) {
      throw new Error(`Quadra com a letra ${body.letter} já existe`);
    }
    const newSquare = new Square({ ...body, id_territory: territory._id });
    await newSquare.save();

    // Incrementar qtde_squares no território
    territory.qtde_squares = (territory.qtde_squares || 0) + 1;
    await territory.save();
    return NextResponse.json(newSquare, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar quadra:", error.message);
    return NextResponse.json({ error: error.message, details: error }, { status: 400 });
  }
}

import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Neighborhood from "@/app/api/models/neighborhood.model";
import { NextResponse } from "next/server";

// 📌 Criar um novo bairro (POST)
export async function POST(req: Request) {
  const user = await withAuth(req, ["admin", "elder"]);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const { name } = await req.json();
    const newNeighborhood = new Neighborhood({ name });
    await newNeighborhood.save();
    return NextResponse.json(newNeighborhood, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao criar bairro", details: error }, { status: 500 });
  }
}

// 📌 Buscar todos os bairros (GET)
export async function GET(req: Request) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const neighborhoods = await Neighborhood.find();
    return NextResponse.json(neighborhoods, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar bairros", details: error }, { status: 500 });
  }
}

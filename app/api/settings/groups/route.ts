import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Group from "@/app/api/models/group.model";
import { NextResponse } from "next/server";

// 📌 Criar um novo grupo (POST)
export async function POST(req: Request) {
  const user = await withAuth(req, ["admin", "elder"]);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const body = await req.json(); // Aqui você já está tentando fazer o parsing
    const { name, color } = body;
    const newGroup = new Group({ name, color });
    await newGroup.save();
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar grupo", details: error }, { status: 500 });
  }
}

// 📌 Buscar todos os grupos (GET)
export async function GET(req: Request) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const groups = await Group.find();
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar grupos", details: error }, { status: 500 });
  }
}

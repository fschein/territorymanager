import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Square from "@/app/api/models/square.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Territory from "../../models/territory.model";

// Buscar um quadra por ID (GET)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  try {
    const id = (await params).id;
    await connectToDB();
    const square = await Square.findById(id);

    if (!square) return NextResponse.json({ error: "Quadra não encontrada" }, { status: 404 });
    return NextResponse.json(square, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar quadra:", error.message);
    return NextResponse.json({ error: "Erro ao buscar quadra", details: error }, { status: 500 });
  }
}

// Atualizar um quadra (PUT)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;
  try {
    await connectToDB();
    const paramsData = await params;
    const id = paramsData.id;
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
    const updatedSquare = await Square.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSquare)
      return NextResponse.json({ error: "Quadra não encontrada" }, { status: 404 });
    return NextResponse.json(updatedSquare, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar quadra:", error.message);
    return NextResponse.json({ error: error.message, details: error }, { status: 400 });
  }
}

// Deletar um quadra (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await withAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;

  await connectToDB();
  const session = await mongoose.startSession(); // Cria uma sessão para a transação

  try {
    const id = (await params).id;

    // Inicia uma transação
    session.startTransaction();

    // Encontrar e deletar a quadra dentro da transação
    const deletedSquare = await Square.findByIdAndDelete(id).session(session);
    if (!deletedSquare)
      return NextResponse.json({ error: "Quadra não encontrada" }, { status: 404 });

    // Encontrar o território associado à quadra
    const territory = await Territory.findById(deletedSquare.id_territory).session(session);
    if (!territory)
      return NextResponse.json({ error: "Território associado não encontrado" }, { status: 404 });

    // Decrementar o qtde_squares no território
    territory.qtde_squares = Math.max(0, territory.qtde_squares - 1);
    await territory.save({ session });

    // Commit da transação se todas as operações forem bem-sucedidas
    await session.commitTransaction();

    return NextResponse.json({ message: "Quadra deletada com sucesso" }, { status: 200 });
  } catch (error: any) {
    // Se algo falhar, o rollback é acionado
    console.error("Erro ao deletar quadra:", error.message);

    // Abortando a transação (rollback)
    await session.abortTransaction();

    return NextResponse.json({ error: "Erro ao deletar quadra", details: error }, { status: 500 });
  } finally {
    // Finaliza a sessão
    session.endSession();
  }
}

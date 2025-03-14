import { withAuth } from "@/app/api/lib/auth";
import connectToDB from "@/app/api/lib/mongoose";
import Territory from "@/app/api/models/territory.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import TerritoryLog from "../../models/territoryLog.model";

export async function PUT(req: NextRequest) {
  const user = await withAuth(req);
  if (user instanceof NextResponse) return user;
  let session;
  try {
    // Conecta ao banco de dados
    await connectToDB();

    // Cria a sessão manualmente, sem alterar o connectToDB
    session = await mongoose.startSession();
    session.startTransaction();

    let { id, square_list, data } = await req.json();

    // Primeiro, busque o território atual para verificar o status antes da atualização
    const currentTerritory = await Territory.findById(id).session(session);
    if (!currentTerritory) {
      throw new Error("Território não encontrado");
    }

    // Atualiza a lista de doneSquaresList com os ids das quadras
    const doneSquaresIds = square_list.filter((sq: any) => sq.canToggle).map((sq: any) => sq.id);
    const updatedFields: any = {
      $addToSet: { doneSquaresList: { $each: doneSquaresIds } },
    };

    updatedFields.status = "ongoing";

    // Atualizar o território com o novo status e a lista de doneSquaresList
    const updatedTerritory = await Territory.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
      session, // Passa a sessão para garantir que a operação faça parte da transação
    });

    if (!updatedTerritory) throw new Error("Território não encontrado");

    // Verifique se a quantidade de doneSquaresList é igual a qtde_squares
    if (updatedTerritory.doneSquaresList.length === updatedTerritory.qtde_squares) {
      updatedTerritory.status = "done"; // Marca o território como "done"
      updatedTerritory.responsibles = [];
    }

    await updatedTerritory.save({ session }); // Salva as alterações com a sessão

    const status = updatedTerritory.status;

    // Gerar a informação para o log (caso o status seja "done" ou "ongoing")
    if (status === "done" || status === "ongoing") {
      const squareLabels = square_list
        .filter((sq: any) => sq.canToggle)
        .map((sq: any) => sq.label)
        .join(", ");
      const logInformation = `Quadras ${squareLabels} concluídas`;

      // Criar o log do território
      await TerritoryLog.create(
        [
          {
            territory: id,
            user: user.id, // Pegando o ID do usuário autenticado
            data: data || new Date(),
            status, // status atual
            information: logInformation,
          },
        ],
        { session }
      ); // Passa a sessão para garantir que o log esteja na transação
    }

    // Commit da transação se tudo for bem-sucedido
    await session.commitTransaction();

    return NextResponse.json(updatedTerritory, { status: 200 });
  } catch (error: any) {
    // Se algo falhar, o rollback é acionado
    console.error("Erro ao atualizar status do território:", error.message);

    // Aborta a transação em caso de erro
    if (session) await session.abortTransaction();

    return NextResponse.json({ error: error.message, details: error }, { status: 400 });
  } finally {
    // Finaliza a sessão
    if (session) session.endSession();
  }
}

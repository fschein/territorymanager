import { isBefore, subDays } from "date-fns";
import { NextResponse } from "next/server";
import connectToDB from "../lib/mongoose";
import Territory from "../models/territory.model";
import TerritoryLog from "../models/territoryLog.model";

export async function GET(req: Request) {
  // Verifica a autorização do header
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDB();

    const today = new Date();
    const thresholdDate = subDays(today, 45); // Data limite (hoje - 45 dias)

    // Busca territórios que não tiveram logs nos últimos 45 dias
    const outdatedTerritories = await Territory.find().lean();

    const territoriesToUpdate = [];
    for (const territory of outdatedTerritories) {
      const lastLog = await TerritoryLog.findOne({ id_territory: territory._id })
        .sort({ date: -1 }) // Pega o log mais recente
        .lean();

      if (!lastLog || Array.isArray(lastLog) || isBefore(new Date(lastLog.date), thresholdDate)) {
        // Se não tem log ou o último log foi há mais de 45 dias, atualizar
        territoriesToUpdate.push(territory._id);
      }
    }

    if (territoriesToUpdate.length > 0) {
      await Territory.updateMany(
        { _id: { $in: territoriesToUpdate } },
        { $set: { status: "urgent" } }
      );
    }

    return NextResponse.json({
      message: "Cron job executada com sucesso",
      updatedCount: territoriesToUpdate.length,
    });
  } catch (error) {
    console.error("Erro na cron job:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

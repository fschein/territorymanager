import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number") || "—";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "64px",
          background: "linear-gradient(135deg, #e6f8ef, #b6e6cd)", // tons suaves do verde
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: "#14532d" }}>Território de Serviço</div>
        <div
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: "#30B068",
            lineHeight: 1,
          }}
        >
          {number}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

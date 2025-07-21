import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number") || "—";

  const iconUrl = `${process.env.NEXT_PUBLIC_URL}/android-chrome-512x512.png`; // ou qualquer logo que você use

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #e6f8ef, #b6e6cd)", // tons suaves do verde
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 600, color: "#14532d" }}>Território de Serviço</div>

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

        <img src={iconUrl} alt="Logo" width={80} height={80} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

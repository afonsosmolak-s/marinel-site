import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Marinel Pastelería";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse 70% 65% at 50% 42%, #fdecef 0%, #faf9f7 75%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={300} height={300} alt="Marinel Pastelería" />
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            fontStyle: "italic",
            color: "#8b6b5c",
          }}
        >
          Cursos, masterclasses y clases privadas de pastelería
        </div>
      </div>
    ),
    { ...size },
  );
}

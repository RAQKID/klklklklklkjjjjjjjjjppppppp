import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge", // Must use edge for @vercel/og
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const background = searchParams.get("background") || "https://picsum.photos/800/400";
  const text1 = searchParams.get("text1") || "Guest";
  const text2 = searchParams.get("text2") || "Our Server";
  const text3 = searchParams.get("text3") || "1";
  const avatar = searchParams.get("avatar") || "https://i.pravatar.cc/150";

  return new ImageResponse(
    (
      <div
        style={{
          width: "800px",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          color: "white",
          fontFamily: "Arial, sans-serif",
          textShadow: "2px 2px 6px rgba(0,0,0,.7)",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "4px solid white",
            backgroundImage: `url(${avatar})`,
            backgroundSize: "cover",
          }}
        />
        <h1 style={{ margin: "15px 0 5px", fontSize: "36px" }}>{text1}</h1>
        <h2 style={{ margin: 0, fontSize: "24px" }}>Welcome to {text2}</h2>
        <p style={{ margin: "5px 0 0", fontSize: "20px" }}>{text3} members</p>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
    }

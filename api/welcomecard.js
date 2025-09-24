import express from "express";
import { createCanvas, loadImage } from "canvas";

const app = express();

app.get("/api/welcomecard", async (req, res) => {
  try {
    const { background, text1, text2, text3, avatar } = req.query;

    if (!background || !text1 || !text2 || !text3 || !avatar) {
      return res.status(400).json({ error: "Missing query parameters" });
    }

    // Canvas size
    const width = 800;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    const bgImg = await loadImage(background);
    ctx.drawImage(bgImg, 0, 0, width, height);

    // Avatar (circle crop)
    const avatarImg = await loadImage(avatar);
    const avatarSize = 180;
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, height / 2, avatarSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, 60, height / 2 - avatarSize / 2, avatarSize, avatarSize);
    ctx.restore();

    // Text styles
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.font = "bold 36px Sans";

    ctx.fillText(text1, 280, 120); // Username
    ctx.font = "28px Sans";
    ctx.fillText(text2, 280, 170); // Server name
    ctx.fillText(`Member #${text3}`, 280, 220); // Member count

    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer("image/png"));
  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

export default app;

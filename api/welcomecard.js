const express = require("express");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const app = express();

app.get("/api/welcomecard", async (req, res) => {
  const { background, text1, text2, text3, avatar, format } = req.query;

  const html = `<!DOCTYPE html><html><head><style>
    body{margin:0;width:800px;height:400px;display:flex;align-items:center;justify-content:center;flex-direction:column;
      background:url('${background || "https://picsum.photos/800/400"}') center/cover no-repeat;
      color:white;font-family:Arial;text-shadow:2px 2px 6px rgba(0,0,0,.7)}
    .avatar{width:120px;height:120px;border-radius:50%;border:4px solid white;
      background:url('${avatar || "https://i.pravatar.cc/150"}') center/cover no-repeat}
  </style></head><body>
    <div class="avatar"></div>
    <h1>${text1 || "Guest"}</h1>
    <h2>Welcome to ${text2 || "Our Server"}</h2>
    <p>${text3 || "1"} members</p>
  </body></html>`;

  try {
    const exePath = await chromium.executablePath();

    console.log("Chromium path:", exePath); // 👈 See logs in Vercel

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 800, height: 400 },
      executablePath: exePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.screenshot({
      type: format === "jpg" ? "jpeg" : "png",
    });

    await browser.close();

    res.setHeader(
      "Content-Type",
      format === "jpg" ? "image/jpeg" : "image/png"
    );
    res.send(buffer);
  } catch (err) {
    console.error("Welcome card error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

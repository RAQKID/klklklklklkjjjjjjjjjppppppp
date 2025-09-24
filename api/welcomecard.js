const express = require("express");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const app = express();

app.get("/api/welcomecard", async (req, res) => {
  const { background, text1, text2, text3, avatar, format } = req.query;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          margin: 0;
          padding: 0;
          width: 800px;
          height: 400px;
          background: url('${background || "https://picsum.photos/800/400"}') no-repeat center center;
          background-size: cover;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
        }
        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid white;
          background: url('${avatar || "https://i.pravatar.cc/150"}') no-repeat center center;
          background-size: cover;
        }
        h1 {
          margin: 15px 0 5px 0;
          font-size: 36px;
        }
        h2 {
          margin: 0;
          font-size: 24px;
        }
        p {
          margin: 5px 0 0 0;
          font-size: 20px;
        }
      </style>
    </head>
    <body>
      <div class="avatar"></div>
      <h1>${text1 || "Guest"}</h1>
      <h2>Welcome to ${text2 || "Our Server"}</h2>
      <p>${text3 || "1"} members</p>
    </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 800, height: 400 },
      executablePath:
        (await chromium.executablePath()) || "/usr/bin/chromium-browser", // fallback
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const screenshot = await page.screenshot({
      type: format === "jpg" ? "jpeg" : "png",
    });

    await browser.close();

    res.setHeader(
      "Content-Type",
      format === "jpg" ? "image/jpeg" : "image/png"
    );
    res.send(screenshot);
  } catch (err) {
    console.error("Error generating welcome card:", err);
    res.status(500).json({ error: "Failed to generate welcome card" });
  }
});

module.exports = app;

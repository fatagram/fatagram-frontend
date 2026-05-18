#!/usr/bin/env node
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePNGs() {
  const svgPath = path.join(__dirname, "public/svgs/app-icon-maskable.svg");

  try {
    // Generate 192x192
    await sharp(svgPath)
      .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(__dirname, "public/app-icon-maskable-192.png"));
    console.log("✅ app-icon-maskable-192.png created");

    // Generate 512x512
    await sharp(svgPath)
      .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(__dirname, "public/app-icon-maskable-512.png"));
    console.log("✅ app-icon-maskable-512.png created");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

generatePNGs();

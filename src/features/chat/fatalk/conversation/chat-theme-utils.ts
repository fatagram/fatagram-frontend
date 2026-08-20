import { ChatThemeDto } from "@/api/chat-theme/dto/chat-theme.dto";

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * Converts a hex color string (e.g. #107a51 or #fff) to space-separated RGB numbers: "16 122 81"
 */
export const hexToRgbSpace = (hex?: string): string => {
  if (!hex) return "";
  let cleanHex = hex.trim().replace(/^#/, "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return "";
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
};

/**
 * Parses Tailwind gradient string like "bg-gradient-to-tr from-[#107a51] to-[#85e3ad]"
 * or CSS linear-gradient into a standard CSS linear-gradient string.
 */
export const parseGradientToCss = (gradient?: string): string => {
  if (!gradient) return "";
  if (gradient.includes("linear-gradient")) return gradient;

  // Extract from-[#hex] and to-[#hex]
  const fromMatch = gradient.match(/from-\[#?([0-9a-fA-F]{3,6})\]/);
  const toMatch = gradient.match(/to-\[#?([0-9a-fA-F]{3,6})\]/);

  if (fromMatch && toMatch) {
    const fromHex = `#${fromMatch[1]}`;
    const toHex = `#${toMatch[1]}`;
    return `linear-gradient(135deg, ${fromHex} 0%, ${toHex} 100%)`;
  }

  return gradient;
};

/**
 * Generates dynamic CSS variables object for inline styles on chat panel/preview container.
 */
export const getThemeCssVariables = (
  theme?: ChatThemeDto | null,
  isDark = false,
): React.CSSProperties => {
  if (!theme || theme.key === "default") return {};

  const colors = isDark ? theme.dark : theme.light;
  if (!colors) return {};

  const primaryMainRgb = hexToRgbSpace(colors.primaryMain);
  const primaryLightRgb = hexToRgbSpace(colors.primaryLight);
  const bgMainRgb = hexToRgbSpace(colors.bgMain);
  const bgSecondRgb = hexToRgbSpace(colors.bgSecond);
  let gradientCss = parseGradientToCss(colors.gradient);

  if (!gradientCss && colors.primaryMain && colors.primaryLight) {
    gradientCss = `linear-gradient(135deg, ${colors.primaryMain} 0%, ${colors.primaryLight} 100%)`;
  }

  const styleObj: Record<string, string> = {};

  if (bgMainRgb) styleObj["--bg-main"] = bgMainRgb;
  if (bgSecondRgb) styleObj["--bg-second"] = bgSecondRgb;
  if (bgSecondRgb) styleObj["--bg-fourth"] = bgSecondRgb;
  if (primaryMainRgb) {
    styleObj["--primary-600"] = primaryMainRgb;
    styleObj["--primary-500"] = primaryMainRgb;
  }
  if (primaryLightRgb) {
    styleObj["--primary-800"] = primaryLightRgb;
  }
  if (gradientCss) {
    styleObj["--gradient-main"] = gradientCss;
    styleObj["--gradient-second"] = gradientCss;
  }
  if (theme.bgImage) {
    const bgUrl = theme.bgImage.startsWith("url(")
      ? theme.bgImage
      : `url(${theme.bgImage})`;
    styleObj["--chat-custom-bg"] = bgUrl;
  }

  return styleObj as React.CSSProperties;
};

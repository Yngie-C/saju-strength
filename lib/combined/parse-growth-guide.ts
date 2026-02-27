export interface GrowthGuide {
  summary: string;
  focusAreas: Array<{ area: string; advice: string }>;
  dailyPractice: string;
}

export function parseGrowthGuide(raw: string): GrowthGuide {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const summary = lines[0] ?? "";
  const focusAreas: Array<{ area: string; advice: string }> = [];
  let dailyPractice = "";

  for (const line of lines.slice(1)) {
    if (line.startsWith("실천 방법:")) {
      dailyPractice = line.replace("실천 방법:", "").trim();
    } else if (line.includes(":")) {
      const colonIdx = line.indexOf(":");
      focusAreas.push({
        area: line.slice(0, colonIdx).trim(),
        advice: line.slice(colonIdx + 1).trim(),
      });
    }
  }

  return { summary, focusAreas, dailyPractice };
}

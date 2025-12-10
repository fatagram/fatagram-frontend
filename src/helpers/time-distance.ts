export function timeDistance(date: Date, now: Date = new Date()) {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 10) {
    return { text: "times:just_now" };
  }

  const intervals: [number, string][] = [
    [60, "times:time.second"], // < 60s  → second
    [3600, "times:time.minute"], // < 1h   → minute
    [86400, "times:time.hour"], // < 24h  → hour
    [604800, "times:time.day"], // < 7d   → day
    [2592000, "times:time.week"], // < 30d  → week
    [31536000, "times:time.month"], // < 365d → month
    [Number.MAX_SAFE_INTEGER, "times:time.year"],
  ];

  for (let i = 0; i < intervals.length; i++) {
    if (seconds < intervals[i][0]) {
      const prev = i === 0 ? 1 : intervals[i - 1][0];
      const count = Math.floor(seconds / prev);

      console.log("Seconds:", seconds, "Prev:", prev, "Count:", count);

      return {
        count,
        unit: intervals[i][1] + (count > 1 ? ":other" : ":one"),
        text: "times:ago",
      };
    }
  }

  return { text: date.toLocaleDateString() };
}

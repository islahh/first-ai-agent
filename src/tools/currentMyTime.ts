export async function getCurrentMyTime() {
  const now = new Date();
  // Get the formatted time in a 12-hour format
  const malaysiaTime = now.toLocaleTimeString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return malaysiaTime;
}

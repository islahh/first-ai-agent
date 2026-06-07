export async function getCurrentTime() {
  return {
    currentTime: new Date().toISOString(),
  };
}
import "dotenv/config";

import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { runAgent } from "./agent.js";

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

console.log("Gemini Agent Started");

while (true) {
  const question =
    await rl.question("\nYou: ");

  if (question === "exit") {
    break;
  }

  const answer =
    await runAgent(question);

  console.log("\nAgent:", answer);
}

rl.close();
import { GoogleGenAI, Type } from "@google/genai";

import { getWeather } from "./tools/weather.js";
import { getCurrentTime } from "./tools/currentTime.js";
import { getCurrentMyTime } from "./tools/currentMyTime.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function runAgent(userPrompt: string) {
  const tools = [
    {
      name: "getWeather",
      description: "Get weather for a city",
      parameters: {
        type: Type.OBJECT,
        properties: {
          city: {
            type: Type.STRING,
          },
        },
        required: ["city"],
      },
    },
    {
      name: "getCurrentTime",
      description: "Get current time",
      parameters: {
        type: Type.OBJECT,
        properties: {},
      },
    },
    {
        name: "getCurrentMyTime",
        description: "Get current time in Malaysia",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
    }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: userPrompt,
    config: {
      tools: [
        {
          functionDeclarations: tools,
        },
      ],
    },
  });

  const functionCall =
    response.candidates?.[0]?.content?.parts?.find(
      (part) => part.functionCall
    )?.functionCall;

  if (!functionCall) {
    return response.text;
  }

  let toolResult: unknown;

  switch (functionCall.name) {
    case "getWeather":
      toolResult = await getWeather(
        functionCall.args?.city as string
      );
      break;

    case "getCurrentTime":
      toolResult = await getCurrentTime();
      break;

    case "getCurrentMyTime":
      toolResult = await getCurrentMyTime();
      break;

    default:
      throw new Error(
        `Unknown tool ${functionCall.name}`
      );
  }

  const finalResponse =
    await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: userPrompt,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              functionCall,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Tool Result: ${JSON.stringify(
                toolResult
              )}`,
            },
          ],
        },
      ],
    });

  return finalResponse.text;
}
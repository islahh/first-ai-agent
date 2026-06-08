import { GoogleGenAI, Type, type FunctionDeclaration } from "@google/genai";

import { getWeather } from "./tools/weather.js";
import { getCurrentTime } from "./tools/currentTime.js";
import { getCurrentMyTime } from "./tools/currentMyTime.js";
import { getRecentAgentActivityTool } from "./tools/recentAgentActivity.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function runAgent(userPrompt: string) {
  const tools: FunctionDeclaration[] = [
    {
      name: "getWeather",
      description: "Get current live weather for a city",
      parameters: {
        type: Type.OBJECT,
        properties: {
          city: {
            type: Type.STRING,
            description: "City name such as Kuala Lumpur, London, Tokyo",
          },
        },
        required: ["city"],
      },
    } as FunctionDeclaration,
    {
      name: "getCurrentTime",
      description: "Get current time",
      parameters: {
        type: Type.OBJECT,
        properties: {},
      },
    } as FunctionDeclaration,
    {
      name: "getCurrentMyTime",
      description: "Get current time in Malaysia",
      parameters: {
        type: Type.OBJECT,
        properties: {},
      },
    } as FunctionDeclaration,
    {
      name: "getRecentAgentActivity",
      description:
        "Get recent agent activity from PostgreSQL for this CLI assistant",
      parameters: {
        type: Type.OBJECT,
        properties: {
          limit: {
            type: Type.NUMBER,
            description:
              "Maximum number of recent rows to return, between 1 and 20",
          },
        },
      },
    } as FunctionDeclaration,
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

  const functionCall = response.candidates?.[0]?.content?.parts?.find(
    (part) => part.functionCall,
  )?.functionCall;

  if (!functionCall) {
    return response.text;
  }

  let toolResult: unknown;

  switch (functionCall.name) {
    case "getWeather":
      toolResult = await getWeather(functionCall.args?.city as string);
      break;

    case "getCurrentTime":
      toolResult = await getCurrentTime();
      break;

    case "getCurrentMyTime":
      toolResult = await getCurrentMyTime();
      break;

    case "getRecentAgentActivity":
      toolResult = await getRecentAgentActivityTool(
        functionCall.args?.limit as number | undefined,
      );
      break;

    default:
      throw new Error(`Unknown tool ${functionCall.name}`);
  }

  const finalResponse = await ai.models.generateContent({
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
            text: `Tool Result: ${JSON.stringify(toolResult)}`,
          },
        ],
      },
    ],
  });

  return finalResponse.text;
}

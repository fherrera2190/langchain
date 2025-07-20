import { OpenAI } from "@langchain/openai";

import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const llm = new OpenAI({
    configuration: {
      // baseURL es una propiedad del cliente de OpenAI, no directamente de OpenAI (LangChain)
      baseURL: process.env.OPENAI_BASE_URL || "http://localhost:1234/v1",
    },

    apiKey: process.env.OPENAI_API_KEY || "lm-studio",

    modelName: "google/gemma-3n-e4b",

    temperature: 0,
  });

  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
  };

  //Con Prompt
  try {
    // Define a new graph
    const workflow = new StateGraph(MessagesAnnotation)
      // Define the node and edge
      .addNode("model", callModel)
      .addEdge(START, "model")
      .addEdge("model", END);

    // Add memory
    const memory = new MemorySaver();
    const app = workflow.compile({ checkpointer: memory });

    const config = { configurable: { thread_id: uuidv4() } };

    const input = [
      {
        role: "user",
        content: "Hi! I'm Bob.",
      },
    ];
    const output = await app.invoke({ messages: input }, config);
    // The output contains all messages in the state.
    // This will log the last message in the conversation.
    console.log(output.messages[output.messages.length - 1]);

    const input2 = [
      {
        role: "user",
        content: "What's my name?",
      },
    ];

    const output2 = await app.invoke({ messages: input2 }, config);
    console.log(output2.messages[output2.messages.length - 1]);

    
  } catch (error) {
    console.error("Error al invocar el modelo:", error);
  }
}

(() => {
  main();
})();

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { OpenAI } from "@langchain/openai";

// console.log("OPENAI_BASE_URL del entorno:", process.env.OPENAI_BASE_URL);
// console.log("OPENAI_API_KEY del entorno:", process.env.OPENAI_API_KEY);

async function main() {
  const model = new OpenAI({
    // --- CAMBIO CLAVE AQUÍ: Usamos la propiedad 'configuration' ---
    // Esto es un objeto que se pasa al constructor del cliente interno de OpenAI.
    configuration: {
      // baseURL es una propiedad del cliente de OpenAI, no directamente de OpenAI (LangChain)
      baseURL: process.env.OPENAI_BASE_URL || "http://localhost:1234/v1",
    },

    apiKey: process.env.OPENAI_API_KEY || "lm-studio",

    modelName: "google/gemma-3n-e4b",

    temperature: 0,
  });

  const messages = [
    new SystemMessage("Eres un traductor. Tu tarea es traducir exactamente lo que se te pide, sin agregar información"),
    new HumanMessage("Your are pretty woman"),
  ];



  try {
    const response = await model.invoke(messages);
    console.log(response);
  } catch (error) {
    console.error("Error al invocar el modelo:", error);
    if (error instanceof Error) {
      console.error("Mensaje de error:", error.message);
      console.error("Stack de error:", error.stack);
    }
  }
}

(() => {
  main();
})();

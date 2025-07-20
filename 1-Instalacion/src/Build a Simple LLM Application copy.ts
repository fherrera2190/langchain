import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";

// Build a simple LLM application with chat models and prompt templates

async function main() {
  const model = new OpenAI({
    configuration: {
      // baseURL es una propiedad del cliente de OpenAI, no directamente de OpenAI (LangChain)
      baseURL: process.env.OPENAI_BASE_URL || "http://localhost:1234/v1",
    },

    apiKey: process.env.OPENAI_API_KEY || "lm-studio",

    modelName: "google/gemma-3n-e4b",

    temperature: 0,
  });

  //Primera Parte
  //   try {
  //     const messages = [
  //       new HumanMessage("Where is my dog"),
  //       new SystemMessage(
  //         "Eres un traductor. Tu tarea es traducir del ingles al español exactamente lo que se te pide, sin agregar información"
  //       ),
  //     ];

  //     const response = await model.invoke(messages);
  //     console.log(response);
  //   } catch (error) {
  //     console.error("Error al invocar el modelo:", error);
  //   }

  //Con Prompt
  try {
    const systemTemplate =
      "Translate the following from English into {language} and don't add comments and the response mustbe start with Traduccion:";

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["user", "{text}"],
    ]);

    const promptValue = await promptTemplate.invoke({
      language: "spanish",
      text: "The leader made a speech in homage to the victims of the attack.",
    });

    //console.log(promptValue.toChatMessages());

    const response = await model.invoke(promptValue);
    console.log(`${response}`);
  } catch (error) {
    console.error("Error al invocar el modelo:", error);
  }
}

(() => {
  main();
})();

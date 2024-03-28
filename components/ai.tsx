import { OpenAI } from "openai";

import { createAI, getMutableAIState, render } from "ai/rsc";
import { Spinner } from "@radix-ui/themes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function submitUserMessage(userInput: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // Update the AI state with the new user message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);
  const ui = render({
    model: "gpt-3.5-turbo",
    provider: openai,
    initial: <Spinner />,
    messages: [
      { role: "system", content: "You are a flight assistant" },
      ...aiState.get(),
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return <p>{content}</p>;
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

type AIState = {
  role: "user" | "assistant" | "system";
  content: string;
  id?: string;
  name?: string;
}[];

type UIState = {
  id: number;
  display: React.ReactNode;
}[];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState: [],
  initialAIState: [],
});

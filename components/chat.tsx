"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "@/components/ai";
import { Box, Card, Flex, TextField } from "@radix-ui/themes";

export function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  //@ts-expect-error types aren't working
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    <Box mt="4">
      <Flex direction="column" gap="4">
        {
          // View messages in UI state
          messages.map((message) => (
            <Card key={message.id} size="1">{message.display}</Card>
          ))
        }
      </Flex>

      <form
        className="mt-4"
        onSubmit={async (e) => {
          e.preventDefault();

          // Add user message to UI state
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <>{inputValue}</>,
            },
          ]);

          // Submit and get response message
          const responseMessage = await submitUserMessage(inputValue);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);

          setInputValue("");
        }}
      >
        <TextField.Root
          placeholder="Send a message..."
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
      </form>
    </Box>
  );
}

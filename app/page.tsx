import { AI } from "@/components/ai";
import { Chat } from "@/components/chat";
import { Container, Heading, Section } from "@radix-ui/themes";

export default function Home() {
  return (
    <Container>
      <Section>
        <Heading>Glide Chat</Heading>
        <AI>
          <Chat />
        </AI>
      </Section>
    </Container>
  );
}

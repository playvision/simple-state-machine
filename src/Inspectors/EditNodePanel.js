import { Flex, Button, Text, Box, Heading,Container } from "@radix-ui/themes";
import useNodesStore from "../NodeStore.ts";

export default function EditNodePanel() {
  const {getSelectedNode, removeSelectedNode } = useNodesStore();


  return (
    <Flex direction="column" gap="3" >
         <Text>{getSelectedNode()?.id}</Text>
      <img
        src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
        alt="A house in a forest"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "220px",
          borderRadius: "var(--radius-2)",
        }}
      />
      <Box
        style={{
          background: "var(--gray-a2)",
          border: "1px dashed var(--gray-a7)",
        }}
        p="4"
      >
        <Heading mb="1" size="3">
          Without trim
        </Heading>
        <Text>
          The goal of typography is to relate font size, line height, and line
          width in a proportional way that maximizes beauty and makes reading
          easier and more pleasant.
        </Text>
      </Box>
      <Container />
      <Button
        variant="soft"
        disabled={!getSelectedNode()}
        color="red"
        onClick={removeSelectedNode}
      >
        Remove selected node
      </Button>
        </Flex>
  );
}
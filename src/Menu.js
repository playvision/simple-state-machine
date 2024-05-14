import { Box, Button, Container, Flex, Heading, Text } from "@radix-ui/themes";
import useNodesStore from "./NodeStore.ts";
import EditNodePanel from "./Inspectors/NodeEditor/EditNodePanel.js";
import EditEdgePanel from "./Inspectors/EdgeEditor/EditEdgePanel.js";

export default function Menu() {
  const { addNewNode, getSelectedNode, getSelectedEdge } = useNodesStore();
  const styles = {
    borderRight: "1px solid var(--gray-a7)",
    padding: "15px",
    backgroundColor: "var(--color-panel-solid)",
    height: "100%",
  };


  return (
    <Flex direction="column" gap="3" style={styles}>
      <Heading as="h2">Inspector</Heading>
      {getSelectedNode() && <EditNodePanel />}
      {getSelectedEdge() && <EditEdgePanel />}
      <Container />
      <Flex direction="column" gap="3" p="4"
        style={{
          background: "var(--gray-a2)",
          border: "1px dashed var(--gray-a7)",
        }}
      >

      <Button onClick={addNewNode}>Add node</Button>
      <Button variant="surface">Save</Button>
      </Flex>
      
    </Flex>
  );
}

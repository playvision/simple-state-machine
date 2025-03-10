import React from 'react';
import { Callout, Button, Container, Flex, Heading, Box, Separator, Link } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import useNodesStore from "../NodeStore.ts";
import EditNodePanel from "./NodeEditor/EditNodePanel";
import EditEdgePanel from "./EditEdgePanel.tsx";
import ExportConfigDialog from './ExportConfigDialog.tsx';
import ExportProjectButton from './ExportProjectButton.tsx';
import ImportProjectButton from './ImportProjectButton.tsx';
import {useReactFlow} from "@xyflow/react";

const Menu: React.FC = () => {
  const { addNewBaseNode, addNewAnyStateNode, getSelectedNode, getSelectedEdge, getLastNode } = useNodesStore();
  const selectedNode = getSelectedNode();
  const selectedEdge = getSelectedEdge();
  const { setCenter, getZoom } = useReactFlow();

  const createNode = (type: string) => {
    if (type === 'base') {
      addNewBaseNode();
    } else {
      addNewAnyStateNode();
    }
    const lastNode = getLastNode();
    setCenter(lastNode.position.x, lastNode.position.y, {
      zoom: getZoom(),
      duration: 500,
    });
  };

  const styles: React.CSSProperties = {
    borderRight: "1px solid var(--gray-a7)",
    padding: "15px",
    backgroundColor: "var(--color-panel-solid)",
    height: "100%",
  };

  return (
    <Flex direction="column" gap="3" style={styles}>
      <Heading as="h2">Welcome to SSM Editor</Heading>
      <Link href="https://github.com/playvision/simple-state-machine" target="_blank" color="gray" size="2" mt="-4">by Playvision</Link>


      <Container>
        {selectedNode && <EditNodePanel />}
        {selectedEdge && <EditEdgePanel />}
        {!selectedNode && !selectedEdge && (
          <Box>
            <Callout.Root>
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>
                Select a node or edge to edit
              </Callout.Text>
            </Callout.Root>
            <Separator my="3" size="4" />
            <Flex mt={'2'} direction="column" gap="3" >
              <Flex direction="row" gap="3" justify={"between"}>
              <ExportProjectButton />
              <ImportProjectButton />
              </Flex>
              <ExportConfigDialog />
            </Flex>
          </Box>

        )}
      </Container>
      <Flex direction="column" gap="3" p="4"
        style={{
          background: "var(--gray-a2)",
          border: "1px dashed var(--gray-a7)",
        }}
      >
        <Button onClick={() => { createNode('base') }}>Add node</Button>
        <Button onClick={() => { createNode('anyState') }}>Add new AnyState node</Button>
      </Flex>
    </Flex>
  );
};

export default Menu;

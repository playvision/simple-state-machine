import React from 'react';
import {Callout, Button, Flex, Heading, Separator, Link, ScrollArea} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import useNodesStore from "../NodeStore.ts";
import EditNodePanel from "./NodeEditor/EditNodePanel";
import EditEdgePanel from "./EditEdgePanel.tsx";
import ExportConfigDialog from './ExportConfigDialog.tsx';
import ExportProjectButton from './ExportProjectButton.tsx';
import ImportProjectButton from './ImportProjectButton.tsx';
import {useReactFlow} from "@xyflow/react";
import TagsEditor from "./TagsEditor.tsx";

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
    <ScrollArea type="auto" style={{ height: "100vh" }}>
      <Flex direction="column" gap="3" style={styles}>
        <Heading as="h2">Welcome to SSM Editor</Heading>
        <Link href="https://github.com/playvision/simple-state-machine" target="_blank" color="gray" size="2" mt="-4">by Playvision</Link>

        <Flex direction="column" flexGrow="1">
          {selectedNode && <EditNodePanel />}
          {selectedEdge && <EditEdgePanel />}
          {!selectedNode && !selectedEdge && (
            <Flex direction="column" flexGrow="1" gap="2">
              <Callout.Root>
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                  Select a node or edge to edit
                </Callout.Text>
              </Callout.Root>
              <Separator my="1" size="4" />
              <Flex direction="row" gap="3" justify={"between"}>
                <ExportProjectButton />
                <ImportProjectButton />
              </Flex>
              <ExportConfigDialog />
              <Separator my="1" size="4" />
              <TagsEditor />
            </Flex>
          )}
        </Flex>
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
    </ScrollArea>
  );
};

export default Menu;

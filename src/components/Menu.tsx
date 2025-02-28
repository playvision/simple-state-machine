import React, {useState} from 'react';
import {Callout, Button, Flex, Heading, Separator, Link, ScrollArea, Dialog, RadioGroup} from "@radix-ui/themes";
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
  const { tags, addNewNode, getSelectedNode, getSelectedEdge, getLastNode } = useNodesStore();
  const selectedNode = getSelectedNode();
  const selectedEdge = getSelectedEdge();
  const { setCenter, getZoom } = useReactFlow();

  const [tagNodeIndex, setTagNodeIndex] = useState(0);

  const createNode = (type: string) => {
    if (type === 'anyState') {
      addNewNode('anyStateNode', {});
    } else if (type === 'tag') {
      addNewNode('tagNode', { tag: tags[tagNodeIndex].name });
      setTagNodeIndex(0);
    } else {
      addNewNode('baseGameNode', {
        description: '',
        image: '',
        tags: [],
      });
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
          {!!tags.length && (
            <Dialog.Root>
              <Dialog.Trigger>
                <Button>Add new Tag node</Button>
              </Dialog.Trigger>

              <Dialog.Content maxWidth="300px">
                <Dialog.Title>New tag node</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Choose tag:
                </Dialog.Description>

                <RadioGroup.Root defaultValue={tagNodeIndex} name="tags" onValueChange={setTagNodeIndex}>
                  {tags.map((tag, index) =>
                    <RadioGroup.Item key={tag.name} value={index} style={{ color: tag.color }}>{tag.name}</RadioGroup.Item>
                  )}
                </RadioGroup.Root>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button onClick={() => { createNode('tag') }}>Create</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          )}
        </Flex>
      </Flex>
    </ScrollArea>
  );
};

export default Menu;

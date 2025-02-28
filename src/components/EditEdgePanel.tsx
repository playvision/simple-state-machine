import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Flex,
  Button,
  Text,
  Heading,
  Container,
  TextField,
} from "@radix-ui/themes";
import useNodesStore from "../NodeStore.ts";
import {useReactFlow} from "@xyflow/react";

const EditEdgePanel: React.FC = () => {
  const {
    getSelectedEdge,
    updateEdgeTriggerName,
  } = useNodesStore((state) => ({
    getSelectedEdge: state.getSelectedEdge,
    updateEdgeTriggerName: state.updateEdgeTriggerName,
  }));
  const { deleteElements } = useReactFlow();

  const selectedEdge = getSelectedEdge();

  const [triggerName, setTriggerName] = useState<string>(selectedEdge?.data.triggerName || "");

  useEffect(() => {
    if (selectedEdge) {
      setTriggerName(selectedEdge.data.triggerName);
    } else {
      setTriggerName("");
    }
  }, [selectedEdge]);

  const handleTriggerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTriggerName(e.target.value);
  };

  const handleSave = () => {
    if (selectedEdge) {
      updateEdgeTriggerName(selectedEdge.id, triggerName);
    }
  };

  const removeSelectedEdge = () => {
    void deleteElements({
      edges: [selectedEdge],
    });
  };

  return (
    <Flex direction="column" gap="3">
      <Heading mb="1" size="3">
        Edit Edge
      </Heading>
      <Text as="label">TriggerName:</Text>
      <TextField.Root
        radius="large"
        placeholder="Trigger Name"
        value={triggerName}
        onChange={handleTriggerNameChange}
      />
      <Container />
      <Button
        variant="soft"
        disabled={!selectedEdge}
        color="green"
        onClick={handleSave}
      >
        Save Trigger Name
      </Button>
      <Button
        variant="soft"
        disabled={!selectedEdge}
        color="red"
        onClick={removeSelectedEdge}
      >
        Remove selected edge
      </Button>
    </Flex>
  );
};

export default EditEdgePanel;

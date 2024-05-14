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

const EditEdgePanel: React.FC = () => {
  const {
    getSelectedEdge,
    removeSelectedEdge,
    isEdgeIdUnique,
    updateEdgeId,
  } = useNodesStore((state) => ({
    getSelectedEdge: state.getSelectedEdge,
    removeSelectedEdge: state.removeSelectedEdge,
    isEdgeIdUnique: state.isEdgeIdUnique,
    updateEdgeId: state.updateEdgeId,
  }));

  const selectedEdge = getSelectedEdge();

  const [newEdgeId, setNewEdgeId] = useState<string>(selectedEdge?.id || "");
  const [isUnique, setIsUnique] = useState<boolean>(true);

  useEffect(() => {
    console.log("Selected Edge:", selectedEdge); // Логирование для отладки
    if (selectedEdge) {
      setNewEdgeId(selectedEdge.id);
    } else {
      setNewEdgeId("");
    }
  }, [selectedEdge]);

  useEffect(() => {
    if (newEdgeId !== selectedEdge?.id) {
      setIsUnique(isEdgeIdUnique(newEdgeId));
    } else {
      setIsUnique(true);
    }
  }, [newEdgeId, selectedEdge, isEdgeIdUnique]);

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEdgeId(e.target.value);
  };

  const handleSave = () => {
    if (selectedEdge && isUnique) {
      updateEdgeId(selectedEdge.id, newEdgeId);
    }
  };

  return (
    <Flex direction="column" gap="3">
      {selectedEdge && <Text>Selected Edge: {selectedEdge.id}</Text>}
      <Heading mb="1" size="3">
        Edit Edge
      </Heading>
      <Text as="label">
        Edge Id
        <TextField.Root
          radius="large"
          placeholder="Edge ID"
          value={newEdgeId}
          onChange={handleIdChange}
        />
      </Text>

      {!isUnique && <Text color="red">ID must be unique</Text>}

      <Container />
      <Button
        variant="soft"
        disabled={!selectedEdge || !isUnique}
        color="green"
        onClick={handleSave}
      >
        Save ID
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

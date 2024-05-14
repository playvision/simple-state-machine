import React, { useState, useEffect } from 'react';
import { Flex, Button, Text, Box, Heading, Container, TextField } from '@radix-ui/themes';
import useNodesStore from '../NodeStore.ts';

export default function EditEdgePanel() {
  const { getSelectedEdge, removeSelectedEdge, isEdgeIdUnique, updateEdgeId } = useNodesStore();
  const selectedEdge = getSelectedEdge();
  const [newEdgeId, setNewEdgeId] = useState(selectedEdge ? selectedEdge.id : '');
  const [isUnique, setIsUnique] = useState(true);

  useEffect(() => {
    if (selectedEdge) {
      setNewEdgeId(selectedEdge.id);
    }
  }, [selectedEdge]);

  const handleIdChange = (e) => {
    const newId = e.target.value;
    setNewEdgeId(newId);
    setIsUnique(isEdgeIdUnique(newId));
  };

  const handleSave = () => {
    if (selectedEdge && isUnique) {
      updateEdgeId(selectedEdge.id, newEdgeId);
    }
  };

  return (
    <Flex direction="column" gap="3">
      <Text>{selectedEdge?.id}</Text>
      <Box
        style={{
          background: "var(--gray-a2)",
          border: "1px dashed var(--gray-a7)",
        }}
        p="4"
      >
        <Heading mb="1" size="3">
          Edit Edge
        </Heading>
        <Text>
          {JSON.stringify(selectedEdge)}
        </Text>
        <TextField.Root radius="large" placeholder="Edge ID" 
        value={newEdgeId} onChange={handleIdChange} />

        {!isUnique && <Text color="red">ID must be unique</Text>}
      </Box>
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
}

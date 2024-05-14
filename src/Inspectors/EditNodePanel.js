import React, { useState, useEffect } from 'react';
import { Flex, Button, Text, Box, Heading, Container, TextField } from "@radix-ui/themes";
import useNodesStore from "../NodeStore.ts";

export default function EditNodePanel() {
  const { getSelectedNode, removeSelectedNode, isNodeIdUnique, updateNodeId, updateNodeData } = useNodesStore();
  const selectedNode = getSelectedNode();
  const [newNodeId, setNewNodeId] = useState(selectedNode ? selectedNode.id : '');
  const [description, setDescription] = useState(selectedNode ? selectedNode.data.description : '');
  const [image, setImage] = useState(selectedNode ? selectedNode.data.image : '');
  const [isUnique, setIsUnique] = useState(true);

  useEffect(() => {
    if (selectedNode) {
      setNewNodeId(selectedNode.id);
      setDescription(selectedNode.data.description);
      setImage(selectedNode.data.image);
    }
  }, [selectedNode]);

  const handleIdChange = (e) => {
    const newId = e.target.value;
    setNewNodeId(newId);
    setIsUnique(isNodeIdUnique(newId));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedNode && isUnique) {
      updateNodeId(selectedNode.id, newNodeId);
      updateNodeData(selectedNode.id, { description, image });
    }
  };

  return (
    <Flex direction="column" gap="3">
      <Text>{selectedNode?.id}</Text>
      <TextField.Root radius="large" placeholder="Node ID" value={newNodeId} onChange={handleIdChange} />
      {!isUnique && <Text color="red">ID must be unique</Text>}
      <TextField.Root radius="large" placeholder="Description" value={description} onChange={handleDescriptionChange} />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && <img src={image} alt="Node" style={{ objectFit: "cover", width: "100%", height: "220px", borderRadius: "var(--radius-2)" }} />}
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
        disabled={!selectedNode || !isUnique}
        color="green"
        onClick={handleSave}
      >
        Save
      </Button>
      <Button
        variant="soft"
        disabled={!selectedNode}
        color="red"
        onClick={removeSelectedNode}
      >
        Remove selected node
      </Button>
    </Flex>
  );
}

import React from 'react';
import { TextField, Text } from "@radix-ui/themes";

const NodeIdField = ({ newNodeId, isUnique, handleIdChange }) => (
  <>
    <TextField.Root
      radius="large"
      placeholder="Node ID"
      value={newNodeId}
      onChange={handleIdChange}
    />
    {!isUnique && <Text color="red">ID must be unique</Text>}
  </>
);

export default NodeIdField;

import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Flex, TextField, TextArea, Button, Text, Box } from "@radix-ui/themes";

function BaseGameNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <Box
      style={{
        background: "var(--gray-a2)",
        borderRadius: "var(--radius-3)",
        padding: 10,
        maxWidth: "200px",
        border: "1px solid var(--gray-a5)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Flex direction="column" gap="3">
        <TextField.Root size="1" placeholder="State ID" />
        <TextArea placeholder="State description" />
      </Flex>

      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
    </Box>
  );
}

export default BaseGameNode;

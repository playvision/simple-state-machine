import React from "react";
import { Handle, Position } from '@xyflow/react';
import { Box, Heading } from "@radix-ui/themes";

type AnyStateNodeProps = {
  id: string;
  isConnectable: boolean;
};

const AnyStateNode: React.FC<AnyStateNodeProps> = ({ id, isConnectable }) => {
  return (
    <Box
      style={{
        background: "var(--green-a2)",
        borderRadius: "var(--radius-3)",
        padding: 10,
        maxWidth: "200px",
        border: "1px solid var(--accent-8)",
      }}
    >
      <Heading as="h2" style={{ color: "var(--accent-11)" }}>AnyState</Heading>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="b" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Left} id="c" isConnectable={isConnectable} />
    </Box>
  );
};

export default AnyStateNode;

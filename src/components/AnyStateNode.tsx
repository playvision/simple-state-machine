import React from "react";
import { Handle, Position } from '@xyflow/react';
import { Box, Heading } from "@radix-ui/themes";

type AnyStateNodeProps = { isConnectable: boolean; };

const AnyStateNode: React.FC<AnyStateNodeProps> = ({ isConnectable }) => {


  return (
    <Box>
      <Heading as="h2" style={{ color: "var(--accent-11)" }}>AnyState</Heading>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} isConnectableEnd={false} />
      <Handle type="source" position={Position.Right} id="b" isConnectable={isConnectable} isConnectableEnd={false} />
      <Handle type="source" position={Position.Left} id="c" isConnectable={isConnectable} isConnectableEnd={false} />
    </Box>
  );
};

export default AnyStateNode;

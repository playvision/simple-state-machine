import React, { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Flex, Box, Heading, Text } from "@radix-ui/themes";

type BaseGameNodeProps = {
  id: string;
  data: {
    description: string;
    image?: string;
  };
  isConnectable: boolean;
};

const BaseGameNode: React.FC<BaseGameNodeProps> = ({ id, data, isConnectable }) => {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
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
        <Heading as="h2">Node</Heading>
        <Text>Node ID: {id}</Text>
        {data.image && (
          <img
            src={data.image}
            alt="Node"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100px",
              borderRadius: "var(--radius-2)"
            }}
          />
        )}
        <Text>{data.description}</Text>
      </Flex>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
    </Box>
  );
};

export default BaseGameNode;

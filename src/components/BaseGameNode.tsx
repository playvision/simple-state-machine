import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Flex, Box, Heading, Text } from '@radix-ui/themes';

type BaseGameNodeProps = {
  id: string;
  data: {
    description: string;
    image?: string;
  };
  isConnectable: boolean;
};

const BaseGameNode: React.FC<BaseGameNodeProps> = ({ id, data, isConnectable }) => {
  return (
    <Box>
      <Flex direction="column" gap="3">
        <Heading as="h2">{id}</Heading>
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
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="b" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Left} id="c" isConnectable={isConnectable} />
      <Handle type="target" position={Position.Top} id="d" isConnectable={isConnectable} />
    </Box>
  );
};

export default BaseGameNode;

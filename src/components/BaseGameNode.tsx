import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {Flex, Box, Heading, Text} from '@radix-ui/themes';
import useNodesStore from "../NodeStore.ts";

type BaseGameNodeProps = {
  id: string;
  data: {
    description: string;
    image?: string;
    tags: string[];
  };
  isConnectable: boolean;
};

const BaseGameNode: React.FC<BaseGameNodeProps> = ({ id, data, isConnectable }) => {
  const { tags} = useNodesStore();

  return (
    <Box>
      <Flex direction="column" gap="3" style={{ maxWidth: "200px" }}>
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
        <Flex justify="center" gap="1" wrap="wrap">
          {tags.map((tag) => {
            if (!data.tags.some((nodeTag) => nodeTag === tag.name)) {
              return;
            }
            return (<Text key={tag.name} size="1" style={{
              color: tag.color,
              padding: "2px 4px",
              border: `1px solid ${tag.color}`,
              borderRadius: '10px',
            }}>{tag.name}</Text>);
          })}
        </Flex>
      </Flex>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="b" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Left} id="c" isConnectable={isConnectable} />
      <Handle type="target" position={Position.Top} id="d" isConnectable={isConnectable} />
    </Box>
  );
};

export default BaseGameNode;

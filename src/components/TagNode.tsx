import React from "react";
import {Box, Heading} from "@radix-ui/themes";
import {Handle, Position} from "@xyflow/react";
import useNodesStore from "../NodeStore.ts";

type TagNodeProps = {
  isConnectable: boolean;
  data: {
    tag: string;
  };
};

const TagNode: React.FC<TagNodeProps> = ({ isConnectable, data }) => {
  const { tags } = useNodesStore();
  const tagObject = tags.find((tag) => tag.name === data.tag);

  return (
    <Box>
      <Heading as="h2" style={{ color: tagObject?.color || '' }}>{tagObject?.name || ''}</Heading>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} isConnectableEnd={false} />
      <Handle type="source" position={Position.Right} id="b" isConnectable={isConnectable} isConnectableEnd={false} />
      <Handle type="source" position={Position.Left} id="c" isConnectable={isConnectable} isConnectableEnd={false} />
    </Box>
  );
};

export default TagNode;

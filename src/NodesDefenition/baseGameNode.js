
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import './base-game-node.css'
import { Flex, TextField,TextArea, AspectRatio,Text, Box } from '@radix-ui/themes';


function BaseGameNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <Box style={{ 
      background: 'var(--gray-a2)', 
      borderRadius: 'var(--radius-3)',
      padding: 10,
      maxWidth:'200px',
      border: '1px solid var(--gray-a5)'}}>
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <Flex direction="column" gap="3">
    <TextField.Root size="1" placeholder="State ID" />
    
    <img
    src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
    alt="A house in a forest"
    style={{
      objectFit: 'cover',
      width: '100%',
      height: '120px',
      borderRadius: 'var(--radius-2)',
    }}
  />
    <TextArea placeholder="State description" />
    </Flex>

    <Handle
      type="source"
      position={Position.Bottom}
      id="a"
      isConnectable={isConnectable}
    />
  </Box>
  )
}

export default BaseGameNode;

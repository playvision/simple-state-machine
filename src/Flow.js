import { useState, useCallback } from 'react';
import { SlashIcon } from '@radix-ui/react-icons'

import ReactFlow, {
  Controls,
  ControlButton,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import BaseGameNode from './NodesDefenition/baseGameNode';

let id = 1;
const getId = () => `${id++}`;

const initialNodes = [
  {
    id: getId(),
    type: 'baseGameNode',
    position: { x: getId()*50, y: getId()*50 },
  }
];

const initialEdges = [];

const nodeTypes = { baseGameNode: BaseGameNode };


function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls>
        <ControlButton onClick={() => {
          console.log("add new node");
            let newNode= {
              id: getId(),
              type: 'baseGameNode',
              position: { x: getId()*50, y: getId()*50 }};
              
          setNodes((nds) => nds.concat(newNode));
        }}>
          <SlashIcon />
        </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}

export default Flow;
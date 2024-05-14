import { useShallow } from 'zustand/react/shallow';
import ReactFlow, {
  Background,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box } from '@radix-ui/themes';
import Menu from './Menu';

import BaseGameNode from './FlowHelpers/BaseGameNode.js';
import BaseGameEdge from './FlowHelpers/BaseGameEdge.js';

import useNodesStore from './NodeStore.ts';



const nodeTypes = { baseGameNode: BaseGameNode };

const edgeTypes = { baseGameEdge: BaseGameEdge};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function Flow() {
  
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useNodesStore(
    useShallow(selector),
  );

  return (
    <Box height="100%">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
      <Panel position="top-left" style={{
        padding: '0px',
        margin: '0px',
        height: '100vh',
        width: '350px',
      }
        }>
        <Menu />
      </Panel>
        <Background />
      </ReactFlow>
    </Box>
  );
}

export default Flow;
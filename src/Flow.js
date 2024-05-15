import { useShallow } from 'zustand/react/shallow';
import ReactFlow, {
  Background,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box } from '@radix-ui/themes';
import Menu from './components/Menu.tsx';



import useNodesStore from './NodeStore.ts';
import BaseGameNode from './components/BaseGameNode.tsx';
import BaseGameEdge from './components/BaseGameEdge.tsx';
import AnyStateNode from './components/AnyStateNode.tsx';



const nodeTypes = { baseGameNode: BaseGameNode, anyStateNode: AnyStateNode };
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
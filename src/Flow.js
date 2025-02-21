import { useShallow } from 'zustand/react/shallow';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './xy-theme.css';
import { Box } from '@radix-ui/themes';
import Menu from './components/Menu.tsx';
import useNodesStore from './NodeStore.ts';
import BaseGameNode from './components/BaseGameNode.tsx';
import BaseGameEdge from './components/BaseGameEdge.tsx';
import AnyStateNode from './components/AnyStateNode.tsx';

const nodeTypes = { baseGameNode: BaseGameNode, anyStateNode: AnyStateNode };
const edgeTypes = { baseGameEdge: BaseGameEdge };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onReconnect: state.onReconnect,
});

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onReconnect } = useNodesStore(
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
        onReconnect={onReconnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
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
        <Controls position="bottom-right" />
        <Background />
      </ReactFlow>
    </Box>
  );
}

export default Flow;
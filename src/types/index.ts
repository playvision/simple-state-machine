import {
  Connection,
  Edge,
  Node,
  EdgeChange,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow';

export type NodeData = {
  description: string;
  image: string; // base64 image
};

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNewNode: () => void;
  removeSelectedNode: () => void;
  isNodeIdUnique: (id: string) => boolean;
  updateNodeId: (oldId: string, newId: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  removeSelectedEdge: () => void;
  getSelectedNode: () => Node | null;
  getSelectedEdge: () => Edge | null;
  isEdgeIdUnique: (id: string) => boolean;
  updateEdgeId: (oldId: string, newId: string) => void;
};

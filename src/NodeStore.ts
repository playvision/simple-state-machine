import { create } from 'zustand';
import { nanoid } from 'nanoid'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNewNode: () => void;
  removeSelectedNode: () => void;
  getSelectedNode: () => Node | null;
  getSelectedEdge: () => Edge | null;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useNodesStore = create<RFState>((set, get) => ({
  nodes : [],
  edges: [],
  lastNodeId: '',
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    console.log('onEdgesChange');
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    const edge = { ...connection, type: 'baseGameEdge' };
    set({
      edges: addEdge(edge, get().edges),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  addNewNode: () => {
    console.log('addNewNode')
    const newNode: Node = {
      id: nanoid(10),
      type: 'baseGameNode',
      position: { x: 250, y: 250 },
      data: {} // Add the missing 'data' property
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  removeSelectedNode: () => {
    console.log('removeSelectedNode')
    const newNodes = get().nodes.filter((node) => !node.selected);
    set({ nodes: newNodes });
  },
  getSelectedNode: () => {
    return get().nodes.find((node) => node.selected) || null;
  },
  getSelectedEdge: () => {
    return get().edges.find((edge) => edge.selected) || null;
  },
}));

export default useNodesStore;
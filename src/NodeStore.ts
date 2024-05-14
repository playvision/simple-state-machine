import { create } from 'zustand';
import { nanoid } from 'nanoid';
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

type NodeData = {
  description: string;
  image: string; // base64 image
};

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
  isNodeIdUnique: (id: string) => boolean;
  updateNodeId: (oldId: string, newId: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  removeSelectedEdge: () => void;
  getSelectedNode: () => Node | null;
  getSelectedEdge: () => Edge | null;
  isEdgeIdUnique: (id: string) => boolean;
  updateEdgeId: (oldId: string, newId: string) => void;
};

const useNodesStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
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
  onConnect: (params: Edge | Connection) => {
    console.log('onConnect');
    const newEdge: Edge = {
      id: nanoid(10),
      type: 'baseGameEdge',
      source: params.source!,
      target: params.target!,
      sourceHandle: params.sourceHandle ?? undefined,
      targetHandle: params.targetHandle ?? undefined,
    };
    set({
      edges: addEdge(newEdge, get().edges),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  addNewNode: () => {
    console.log('addNewNode');
    const newNode: Node = {
      id: nanoid(10),
      type: 'baseGameNode',
      position: { x: 250, y: 250 },
      data: {
        description: '',
        image: ''
      }
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  removeSelectedNode: () => {
    console.log('removeSelectedNode');
    const newNodes = get().nodes.filter((node) => !node.selected);
    set({ nodes: newNodes });
  },
  removeSelectedEdge: () => {
    console.log('removeSelectedEdge');
    const newEdges = get().edges.filter((edge) => !edge.selected);
    set({ edges: newEdges });
  },
  getSelectedNode: () => {
    return get().nodes.find((node) => node.selected) || null;
  },
  getSelectedEdge: () => {
    return get().edges.find((edge) => edge.selected) || null;
  },
  isEdgeIdUnique: (id: string) => {
    return !get().edges.some((edge) => edge.id === id);
  },
  updateEdgeId: (oldId: string, newId: string) => {
    const edges = get().edges.map((edge) => {
      if (edge.id === oldId) {
        return { ...edge, id: newId };
      }
      return edge;
    });
    set({ edges });
  },
  isNodeIdUnique: (id: string) => {
    return !get().nodes.some((node) => node.id === id);
  },
  updateNodeId: (oldId: string, newId: string) => {
    const nodes = get().nodes.map((node) => {
      if (node.id === oldId) {
        return { ...node, id: newId };
      }
      return node;
    });
    set({ nodes });
  },
  updateNodeData: (id: string, data: Partial<NodeData>) => {
    const nodes = get().nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    });
    set({ nodes });
  },
}));

export default useNodesStore;
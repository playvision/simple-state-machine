import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  reconnectEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from '@xyflow/react';

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
  addNewBaseNode: () => void;
  addNewAnyStateNode: () => void;
  removeSelectedNode: () => void;
  isNodeIdUnique: (id: string) => boolean;
  updateNodeId: (oldId: string, newId: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  removeSelectedEdge: () => void;
  getSelectedNode: () => Node | null;
  getSelectedEdge: () => Edge | null;
  isEdgeIdUnique: (id: string) => boolean;
  updateEdgeId: (oldId: string, newId: string) => void;
  updateEdgeTriggerName: (id: string, triggerName: string) => void;
  generateConfig: () => any;
  generateProjectFile: () => string;
};

const DEFAULT_MARKER_END = {
  type: MarkerType.ArrowClosed,
  color: 'var(--accent-8)',
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
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (params: Edge | Connection) => {
    const newEdge: Edge = {
      id: nanoid(10),
      type: 'baseGameEdge',
      source: params.source!,
      target: params.target!,
      sourceHandle: params.sourceHandle ?? undefined,
      targetHandle: params.targetHandle ?? undefined,
      data: {
        triggerName: 'new_trigger_name',
      },
      markerEnd: DEFAULT_MARKER_END,
    };
    set({
      edges: addEdge(newEdge, get().edges),
    });
  },
  onReconnect: (oldEdge: Edge, newConnection: Connection) => {
    set({
      edges: reconnectEdge(oldEdge, newConnection, get().edges),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  addNewBaseNode: () => {
    const nodes = get().nodes;
    const lastNode = nodes[nodes.length - 1];
    const position = lastNode
      ? { x: lastNode.position.x + 100, y: lastNode.position.y + 100 }
      : { x: 250, y: 250 };
    const newNode: Node = {
      id: `new_node_${nanoid(4)}`,
      type: 'baseGameNode',
      position,
      data: {
        description: '',
        image: ''
      }
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  addNewAnyStateNode: () => {
    const newNode: Node = {
      id: `new_node_${nanoid(4)}`,
      type: 'anyStateNode',
      position: { x: 250, y: 250 },
      data: {
        description: '',
        image: ''
      }
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  removeSelectedNode: () => {
    const newNodes = get().nodes.filter((node) => !node.selected);
    set({ nodes: newNodes });
  },
  removeSelectedEdge: () => {
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
    // update node and save all edges
    const nodes = get().nodes.map((node) => {
      if (node.id === oldId) {
        return { ...node, id: newId };
      }
      return node;
    });
    const edges = get().edges.map((edge) => {
      if (edge.source === oldId) {
        return { ...edge, source: newId };
      }
      if (edge.target === oldId) {
        return { ...edge, target: newId };
      }
      return edge;
    });
    set({ nodes, edges });
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
  updateEdgeTriggerName: (id: string, triggerName: string) => {
    const edges = get().edges.map((edge) => {
      if (edge.id === id) {
        return { ...edge, data: { ...edge.data, triggerName } };
      }
      return edge;
    });
    set({ edges });
  },
  generateConfig: () => {
    const nodes = get().nodes;
    const edges = get().edges;
  
    const states = nodes.reduce((acc, node) => {
      if (node.type !== 'anyStateNode') {
        acc[node.id] = {
          transitions: []
        };
      }
      return acc;
    }, {} as Record<string, { transitions: { to: string, trigger: string }[] }>);
  
    const transitionsFromAny: { to: string, trigger: string }[] = [];
  
    edges.forEach((edge) => {
      if (edge.source && states[edge.source]) {
        states[edge.source].transitions.push({
          to: edge.target,
          trigger: edge.data.triggerName
        });
      } else if (edge.source && nodes.find(node => node.id === edge.source && node.type === 'anyStateNode')) {
        transitionsFromAny.push({
          to: edge.target,
          trigger: edge.data.triggerName
        });
      }
    });
  
    return {
      states,
      transitionsFromAny
    };
  },
  generateProjectFile: () => {
    const { nodes, edges } = get();
    const projectData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        data: edge.data,
        markerEnd: edge.markerEnd,
      })),
    };
    return JSON.stringify(projectData, null, 2);
  },
  loadProjectFile: (projectDataString: string) => {
    const projectData = JSON.parse(projectDataString);
  
    const nodes: Node<NodeData>[] = projectData.nodes.map((node: any) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data
    }));
    
    const edges: Edge[] = projectData.edges.map((edge: any) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || 'a',
      targetHandle: edge.targetHandle || 'd',
      type: edge.type,
      data: edge.data,
      markerEnd: edge.markerEnd || DEFAULT_MARKER_END,
    }));
    
    set({ nodes, edges });
  },  
}));

export default useNodesStore;

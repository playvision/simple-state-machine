import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  Connection,
  Edge,
  Node,
  addEdge,
  reconnectEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from '@xyflow/react';

type Tag = {
  name: string;
  color: string;
};

type NodeData = {
  description: string;
  image: string; // base64 image
  tags?: string[];
  tag?: string;
};

type RFState = {
  nodes: Node[];
  edges: Edge[];
  tags: Tag[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setTags: (tags: Tag[]) => void;
  addNewNode: (type: string, data: any) => void;
  isNodeIdUnique: (id: string) => boolean;
  updateNodeId: (oldId: string, newId: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  getSelectedNode: () => Node | null;
  getLastNode: () => Node | null;
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
  tags: [],
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
  setTags: (tags) => {
    set({ tags });
  },
  addNewNode: (type: string, data: any) => {
    const lastNode = get().getLastNode();
    const position = lastNode
      ? { x: lastNode.position.x + 100, y: lastNode.position.y + 100 }
      : { x: 250, y: 250 };
    const newNode: Node = {
      id: `new_node_${nanoid(4)}`,
      type,
      position,
      data,
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  getSelectedNode: () => {
    return get().nodes.find((node) => node.selected) || null;
  },
  getLastNode: () => {
    const nodes = get().nodes;
    return nodes[nodes.length - 1];
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
    const { nodes, edges } = get();
  
    const states = nodes.reduce((acc, node) => {
      if (node.type === 'baseGameNode') {
        acc[node.id] = {
          transitions: [],
          tags: node.data.tags || [],
        };
      }
      return acc;
    }, {} as Record<string, { transitions: { to: string, trigger: string }[], tags: string[] }>);
  
    const transitionsFromAny: { to: string, trigger: string }[] = [];
    const transitionsByTag: Record<string, { transitions: { to: string, trigger: string }[] }> = {};
  
    edges.forEach((edge) => {
      if (edge.source && states[edge.source]) {
        states[edge.source].transitions.push({
          to: edge.target,
          trigger: edge.data.triggerName
        });
        return;
      }
      if (!edge.source) {
        return;
      }

      const sourceNode = nodes.find(node => node.id === edge.source);
      if (!sourceNode) {
        return;
      }

      if (sourceNode.type === 'anyStateNode') {
        transitionsFromAny.push({
          to: edge.target,
          trigger: edge.data.triggerName
        });
      } else if (sourceNode.type === 'tagNode') {
        const tagTransitions = transitionsByTag[sourceNode.data.tag];
        if (tagTransitions) {
          transitionsByTag[sourceNode.data.tag].transitions.push({
            to: edge.target,
            trigger: edge.data.triggerName
          });
        } else {
          transitionsByTag[sourceNode.data.tag] = {
            transitions: [{
              to: edge.target,
              trigger: edge.data.triggerName
            }],
          };
        }
      }
    });
  
    return {
      states,
      transitionsFromAny,
      transitionsByTag,
    };
  },
  generateProjectFile: () => {
    const { nodes, edges, tags } = get();
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
      tags: tags.map(tag => ({
        name: tag.name,
        color: tag.color,
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

    const tags: Tag[] = projectData.tags?.map((tag: any) => ({
      name: tag.name,
      color: tag.color,
    })) || [];
    
    set({ nodes, edges, tags });
  },
}));

export default useNodesStore;

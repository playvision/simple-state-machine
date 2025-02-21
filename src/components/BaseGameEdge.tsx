import React, {useCallback, useEffect, useState} from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeMarkerType,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';
import { Text, Box } from "@radix-ui/themes";
import useNodesStore from '../NodeStore.ts';
import { getCustomBezierPath } from '../Utils';

type BaseGameEdgeProps = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: string;
  targetPosition: string;
  data?: any; // You can define the exact type if you know the structure of data
  markerEnd: EdgeMarkerType;
};

const BaseGameEdge: React.FC<BaseGameEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) => {
  const edges = useNodesStore((state) => state.edges);
  const { setEdges } = useNodesStore();
  const { getViewport } = useReactFlow();
  let hasCustomLabelPos = !!data?.labelPos;

  // Используем единый state для хранения позиций: source, target и label
  const [positions, setPositions] = useState({
    source: { x: sourceX, y: sourceY },
    target: { x: targetX, y: targetY },
    label: data?.labelPos || { x: (sourceX + targetX) / 2, y: (sourceY + targetY) / 2 },
  });

  // Тип перетаскивания: "source", "target", "label" или null
  const [draggingType, setDraggingType] = useState(null);

  // Синхронизация позиций при изменении входных пропсов, если не перетаскивается
  useEffect(() => {
    if (draggingType !== "source") {
      setPositions((pos) => ({ ...pos, source: { x: sourceX, y: sourceY } }));
    }
  }, [sourceX, sourceY, draggingType]);

  useEffect(() => {
    if (draggingType !== "target") {
      setPositions((pos) => ({ ...pos, target: { x: targetX, y: targetY } }));
    }
  }, [targetX, targetY, draggingType]);

  // Глобальный обработчик mousemove для всех случаев перетаскивания
  const onMouseMove = useCallback(
    (event) => {
      if (!draggingType) return;
      if (draggingType === 'label' && !hasCustomLabelPos) {
        hasCustomLabelPos = true;
      }
      const { x: vpX, y: vpY, zoom } = getViewport();
      const newPos = {
        x: (event.clientX - vpX) / zoom,
        y: (event.clientY - vpY) / zoom,
      };
      setPositions((prev) => ({ ...prev, [draggingType]: newPos }));
      setEdges(edges.map((edge) => {
        return edge.id === id
          ? {
            ...edge,
            ...(draggingType === "source" && { sourceX: newPos.x, sourceY: newPos.y }),
            ...(draggingType === "target" && { targetX: newPos.x, targetY: newPos.y }),
            data: { ...edge.data, [`${draggingType}Pos`]: newPos },
          }
          : edge;
      }));
    },
    [draggingType, getViewport, id, setEdges]
  );

  const onMouseUp = useCallback(() => setDraggingType(null), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const { source, target, label } = positions; // {x, y} для каждой точки
  let edgePath: string;
  let labelX: number;
  let labelY: number;
  if (hasCustomLabelPos) {
    const customBezier = getCustomBezierPath(positions);
    edgePath = customBezier.edgePath;
    labelX = customBezier.labelX;
    labelY = customBezier.labelY;
  } else {
    const [bezierPath, bezierCenterX, bezierCenterY] = getBezierPath({
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y,
      sourcePosition,
      targetPosition,
    });
    edgePath = bezierPath;
    labelX = bezierCenterX;
    labelY = bezierCenterY;
  }

  // Подсчитываем количество повторений triggerName
  const triggerNameCount = edges.filter(edge => edge.data.triggerName === data.triggerName).length;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{stroke: "var(--accent-8)", strokeWidth: 2}}
        markerEnd={markerEnd}
      />
      {/* Draggable endpoint для source */}
      <circle
        cx={source.x}
        cy={source.y}
        r={6}
        style={{cursor: "pointer", opacity: 0}}
        onMouseDown={(e) => { e.stopPropagation(); setDraggingType("source"); }}
      />
      {/* Draggable endpoint для target */}
      <circle
        cx={target.x}
        cy={target.y}
        r={6}
        style={{cursor: "pointer", opacity: 0}}
        onMouseDown={(e) => { e.stopPropagation(); setDraggingType("target"); }}
      />
      <EdgeLabelRenderer>
        <Box
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            borderRadius: "var(--radius-6)",
            margin: "var(--space-2)",
            padding: "var(--space-1)",
            background: "var(--color-panel-solid)",
            color: "var(--color-text)",
            border: "1px solid var(--gray-a7)",
          }}
          onMouseDown={(e) => { e.stopPropagation(); setDraggingType("label"); }}
        >
          <Text>
            {data.triggerName} {triggerNameCount > 1 && `(${triggerNameCount})`}
          </Text>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
};

export default BaseGameEdge;

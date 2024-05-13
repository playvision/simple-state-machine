import {
    BaseEdge,
    EdgeLabelRenderer,
    useReactFlow,
    getSimpleBezierPath,
    MarkerType
  } from 'reactflow';
import { TextField } from '@radix-ui/themes';

export default function BaseGameEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <svg style={{ overflow: 'visible' }}>
        <defs>
          <marker
            id={`arrow-${id}`}
            markerWidth="10"
            markerHeight="7" // Уменьшенная высота
            refX="9"
            refY="3.5" // Центрирование после изменения высоты
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,7 L9,3.5 z" fill="#000" stroke-linejoin="round" /> // Скругление углов
          </marker>
        </defs>
      </svg>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={`url(#arrow-${id})`} // Referencing the marker ID defined above
        style={{ stroke: '#000', strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <TextField.Root style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }} size="1" placeholder="Trigger ID" />
      </EdgeLabelRenderer>
    </>
  );
}

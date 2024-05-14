import {
  BaseEdge,
  EdgeLabelRenderer,
} from "reactflow";
import { Text, Box } from "@radix-ui/themes";

export default function BaseGameEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data, 
}) {
  const verticalOffset = 80; // Смещение вниз для создания кривой

  // Настройка контрольных точек для создания изгиба вниз
  const controlPoint1X = sourceX;
  const controlPoint1Y = sourceY + verticalOffset;
  const controlPoint2X = targetX;
  const controlPoint2Y = targetY - verticalOffset;

  // Создаем кривую Безье, которая изгибается вниз
  const edgePath = `M ${sourceX},${sourceY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${targetX},${targetY}`;

  // Вычисляем положение центра кривой Безье для правильного позиционирования текста
  const midX = (sourceX + controlPoint1X + controlPoint2X + targetX) / 4;
  const midY = (sourceY + controlPoint1Y + controlPoint2Y + targetY) / 4;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: "#000", strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <Box
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${midX}px, ${midY}px)`,
            pointerEvents: "all",
            borderRadius: "var(--radius-6)",
            margin: "var(--space-2)",
            padding: "var(--space-1)",
            background: "var(--color-panel-solid)",
            color: "var(--color-text)",
            border: "1px solid var(--gray-a7)",
          }}
          size="1"
          placeholder="Trigger ID"
        >
          <Text>{id}</Text>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
}

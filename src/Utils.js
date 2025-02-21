export function getCustomBezierPath(positions) {
  const { source, target, label } = positions; // {x, y} для каждой точки

  // Фиксируем cp1 так, чтобы оно лежало на прямой от source к target.
  // Коэффициент k определяет, на каком расстоянии от source начинается изгиб.
  const k = 0.25; // Можно поиграть с этим значением (например, 0.25 или 0.33)
  const cp1 = {
    x: source.x + k * (target.x - source.x),
    y: source.y + k * (target.y - source.y),
  };

  // Вычисляем cp2 так, чтобы кривая проходила через label при t = 0.5:
  const cp2 = {
    x: (8 * label.x - source.x - target.x) / 3 - cp1.x,
    y: (8 * label.y - source.y - target.y) / 3 - cp1.y,
  };

  return {
    edgePath: `M ${source.x} ${source.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${target.x} ${target.y}`,
    labelX: label.x,
    labelY: label.y
  };
}

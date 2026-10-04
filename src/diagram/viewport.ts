export interface DiagramPointV010 {
  x: number;
  y: number;
}

export interface DiagramSizeV010 {
  width: number;
  height: number;
}

export interface DiagramRectV010 extends DiagramPointV010, DiagramSizeV010 {}

export interface DiagramViewportV010 {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface DiagramViewportLimitsV010 {
  minScale: number;
  maxScale: number;
}

export const DEFAULT_DIAGRAM_VIEWPORT_LIMITS_V010: DiagramViewportLimitsV010 = {
  minScale: 0.1,
  maxScale: 4
};

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function clampDiagramScaleV010(
  scale: number,
  limits: DiagramViewportLimitsV010 = DEFAULT_DIAGRAM_VIEWPORT_LIMITS_V010
): number {
  if (!finite(scale) || scale <= 0) {
    throw new Error("EIDOS_2D_VIEWPORT_SCALE_INVALID");
  }
  if (
    !finite(limits.minScale)
    || !finite(limits.maxScale)
    || limits.minScale <= 0
    || limits.maxScale < limits.minScale
  ) {
    throw new Error("EIDOS_2D_VIEWPORT_LIMITS_INVALID");
  }
  return Math.min(limits.maxScale, Math.max(limits.minScale, scale));
}

export function createDiagramViewportV010(
  value: Partial<DiagramViewportV010> = {}
): DiagramViewportV010 {
  const scale = value.scale ?? 1;
  const translateX = value.translateX ?? 0;
  const translateY = value.translateY ?? 0;
  if (!finite(translateX) || !finite(translateY)) {
    throw new Error("EIDOS_2D_VIEWPORT_TRANSLATION_INVALID");
  }
  return {
    scale: clampDiagramScaleV010(scale),
    translateX,
    translateY
  };
}

export function diagramWorldToScreenV010(
  viewport: DiagramViewportV010,
  point: DiagramPointV010
): DiagramPointV010 {
  return {
    x: point.x * viewport.scale + viewport.translateX,
    y: point.y * viewport.scale + viewport.translateY
  };
}

export function diagramScreenToWorldV010(
  viewport: DiagramViewportV010,
  point: DiagramPointV010
): DiagramPointV010 {
  if (viewport.scale <= 0 || !finite(viewport.scale)) {
    throw new Error("EIDOS_2D_VIEWPORT_SCALE_INVALID");
  }
  return {
    x: (point.x - viewport.translateX) / viewport.scale,
    y: (point.y - viewport.translateY) / viewport.scale
  };
}

export function panDiagramViewportV010(
  viewport: DiagramViewportV010,
  deltaScreen: DiagramPointV010
): DiagramViewportV010 {
  return {
    ...viewport,
    translateX: viewport.translateX + deltaScreen.x,
    translateY: viewport.translateY + deltaScreen.y
  };
}

export function zoomDiagramViewportAtV010(
  viewport: DiagramViewportV010,
  nextScale: number,
  anchorScreen: DiagramPointV010,
  limits: DiagramViewportLimitsV010 = DEFAULT_DIAGRAM_VIEWPORT_LIMITS_V010
): DiagramViewportV010 {
  const scale = clampDiagramScaleV010(nextScale, limits);
  const anchorWorld = diagramScreenToWorldV010(viewport, anchorScreen);
  return {
    scale,
    translateX: anchorScreen.x - anchorWorld.x * scale,
    translateY: anchorScreen.y - anchorWorld.y * scale
  };
}

export function diagramBoundsFromRectsV010(
  rects: readonly DiagramRectV010[]
): DiagramRectV010 | undefined {
  if (rects.length === 0) return undefined;
  const minX = Math.min(...rects.map(rect => rect.x));
  const minY = Math.min(...rects.map(rect => rect.y));
  const maxX = Math.max(...rects.map(rect => rect.x + rect.width));
  const maxY = Math.max(...rects.map(rect => rect.y + rect.height));
  return {
    x: minX,
    y: minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY)
  };
}

export function fitDiagramViewportV010(
  bounds: DiagramRectV010,
  viewportSize: DiagramSizeV010,
  padding = 24,
  limits: DiagramViewportLimitsV010 = DEFAULT_DIAGRAM_VIEWPORT_LIMITS_V010
): DiagramViewportV010 {
  if (
    bounds.width < 0
    || bounds.height < 0
    || viewportSize.width <= 0
    || viewportSize.height <= 0
  ) {
    throw new Error("EIDOS_2D_VIEWPORT_BOUNDS_INVALID");
  }
  const availableWidth = Math.max(1, viewportSize.width - padding * 2);
  const availableHeight = Math.max(1, viewportSize.height - padding * 2);
  const scale = clampDiagramScaleV010(
    Math.min(
      bounds.width > 0 ? availableWidth / bounds.width : limits.maxScale,
      bounds.height > 0 ? availableHeight / bounds.height : limits.maxScale
    ),
    limits
  );
  const contentCenterX = bounds.x + bounds.width / 2;
  const contentCenterY = bounds.y + bounds.height / 2;
  return {
    scale,
    translateX: viewportSize.width / 2 - contentCenterX * scale,
    translateY: viewportSize.height / 2 - contentCenterY * scale
  };
}

export function centerDiagramViewportOnV010(
  viewport: DiagramViewportV010,
  worldPoint: DiagramPointV010,
  viewportSize: DiagramSizeV010
): DiagramViewportV010 {
  return {
    ...viewport,
    translateX: viewportSize.width / 2 - worldPoint.x * viewport.scale,
    translateY: viewportSize.height / 2 - worldPoint.y * viewport.scale
  };
}

export function resetDiagramViewportV010(): DiagramViewportV010 {
  return {
    scale: 1,
    translateX: 0,
    translateY: 0
  };
}

import type {
  AppHostRouteV010,
  EffectiveExperienceManifestV010
} from "./contracts.js";

export type AppHostSurfaceTargetV010 =
  | "DESKTOP_WORKBENCH"
  | "MOBILE_TASK"
  | "MOBILE_READ"
  | "TABLET_WORKBENCH";

export type AppHostSurfaceSupportV010 =
  | "FULL"
  | "TASK_FOCUSED"
  | "READ_ONLY"
  | "UNSUPPORTED";

export interface AppHostSurfaceDeclarationV010 {
  id: string;
  target: AppHostSurfaceTargetV010;
  support: AppHostSurfaceSupportV010;
  entryRoute?: string;
  fallbackSurfaceId?: string;
}

export interface ClientSurfaceProfileV010 {
  contractVersion: "0.1.0";
  viewportClass: "COMPACT" | "MEDIUM" | "EXPANDED";
  primaryPointer: "COARSE" | "FINE" | "NONE";
  hover: boolean;
  touch: boolean;
  reducedMotion: boolean;
  standalone: boolean;
}

export interface ExperienceSurfaceResolutionRequestV010 {
  path?: string;
  semanticRouteId?: string;
  explicitTarget?: AppHostSurfaceTargetV010;
  userTarget?: AppHostSurfaceTargetV010;
  profile?: ClientSurfaceProfileV010;
}

export interface ExperienceSurfaceRouteResolutionV010 {
  kind: "ROUTE";
  target: AppHostSurfaceTargetV010;
  support: Exclude<AppHostSurfaceSupportV010, "UNSUPPORTED">;
  surfaceId: string;
  route: AppHostRouteV010;
  semanticRouteId: string;
  selectedBy: "EXPLICIT" | "USER" | "CAPABILITY" | "DEFAULT";
}

export interface ExperienceSurfaceHandoffResolutionV010 {
  kind: "HANDOFF";
  target: AppHostSurfaceTargetV010;
  reason:
    | "LEGACY_DESKTOP_ONLY"
    | "TARGET_NOT_DECLARED"
    | "TARGET_UNSUPPORTED"
    | "SEMANTIC_ROUTE_UNAVAILABLE";
  selectedBy: "EXPLICIT" | "USER" | "CAPABILITY" | "DEFAULT";
  semanticRouteId?: string;
  requestedPath?: string;
  availableTargets: AppHostSurfaceTargetV010[];
  fallbackSurfaceId?: string;
}

export interface ExperienceSurfaceNotFoundResolutionV010 {
  kind: "NOT_FOUND";
  target: AppHostSurfaceTargetV010;
  selectedBy: "EXPLICIT" | "USER" | "CAPABILITY" | "DEFAULT";
  requestedPath?: string;
  semanticRouteId?: string;
}

export type ExperienceSurfaceResolutionV010 =
  | ExperienceSurfaceRouteResolutionV010
  | ExperienceSurfaceHandoffResolutionV010
  | ExperienceSurfaceNotFoundResolutionV010;

export function inferSurfaceTargetV010(
  profile: ClientSurfaceProfileV010
): AppHostSurfaceTargetV010 {
  if (
    profile.viewportClass === "COMPACT"
    || profile.primaryPointer === "COARSE"
  ) {
    return "MOBILE_TASK";
  }
  if (profile.viewportClass === "MEDIUM" && profile.touch) {
    return "TABLET_WORKBENCH";
  }
  return "DESKTOP_WORKBENCH";
}

function selectedTarget(
  request: ExperienceSurfaceResolutionRequestV010
): {
  target: AppHostSurfaceTargetV010;
  selectedBy: "EXPLICIT" | "USER" | "CAPABILITY" | "DEFAULT";
} {
  if (request.explicitTarget) {
    return { target: request.explicitTarget, selectedBy: "EXPLICIT" };
  }
  if (request.userTarget) {
    return { target: request.userTarget, selectedBy: "USER" };
  }
  if (request.profile) {
    return {
      target: inferSurfaceTargetV010(request.profile),
      selectedBy: "CAPABILITY"
    };
  }
  return { target: "DESKTOP_WORKBENCH", selectedBy: "DEFAULT" };
}

function semanticId(route: AppHostRouteV010): string {
  return route.semanticId ?? route.id;
}

function requestedSemanticId(
  manifest: EffectiveExperienceManifestV010,
  request: ExperienceSurfaceResolutionRequestV010
): string | undefined {
  if (request.semanticRouteId) return request.semanticRouteId;
  if (!request.path) return undefined;
  return manifest.routes.find(route => route.path === request.path)
    ? semanticId(manifest.routes.find(route => route.path === request.path)!)
    : undefined;
}

function routeForSurface(
  manifest: EffectiveExperienceManifestV010,
  surfaceId: string,
  semanticRouteId: string
): AppHostRouteV010 | undefined {
  return manifest.routes.find(route =>
    semanticId(route) === semanticRouteId
    && (route.surfaceId === surfaceId || route.surfaceId === undefined)
  );
}

export function resolveExperienceSurfaceV010(
  manifest: EffectiveExperienceManifestV010,
  request: ExperienceSurfaceResolutionRequestV010 = {}
): ExperienceSurfaceResolutionV010 {
  const choice = selectedTarget(request);
  const surfaces = manifest.surfaces ?? [];
  const semantic = requestedSemanticId(manifest, request);

  if (surfaces.length === 0) {
    if (choice.target !== "DESKTOP_WORKBENCH") {
      return {
        kind: "HANDOFF",
        target: choice.target,
        reason: "LEGACY_DESKTOP_ONLY",
        selectedBy: choice.selectedBy,
        ...(semantic ? { semanticRouteId: semantic } : {}),
        ...(request.path ? { requestedPath: request.path } : {}),
        availableTargets: ["DESKTOP_WORKBENCH"]
      };
    }

    const route = semantic
      ? manifest.routes.find(candidate => semanticId(candidate) === semantic)
      : request.path
        ? manifest.routes.find(candidate => candidate.path === request.path)
        : manifest.defaultRoute
          ? manifest.routes.find(candidate => candidate.path === manifest.defaultRoute)
          : manifest.routes[0];

    if (!route) {
      return {
        kind: "NOT_FOUND",
        target: choice.target,
        selectedBy: choice.selectedBy,
        ...(request.path ? { requestedPath: request.path } : {}),
        ...(semantic ? { semanticRouteId: semantic } : {})
      };
    }

    return {
      kind: "ROUTE",
      target: "DESKTOP_WORKBENCH",
      support: "FULL",
      surfaceId: "legacy:desktop",
      route,
      semanticRouteId: semanticId(route),
      selectedBy: choice.selectedBy
    };
  }

  const surface = surfaces.find(candidate => candidate.target === choice.target);
  const availableTargets = surfaces
    .filter(candidate => candidate.support !== "UNSUPPORTED")
    .map(candidate => candidate.target);

  if (!surface) {
    return {
      kind: "HANDOFF",
      target: choice.target,
      reason: "TARGET_NOT_DECLARED",
      selectedBy: choice.selectedBy,
      ...(semantic ? { semanticRouteId: semantic } : {}),
      ...(request.path ? { requestedPath: request.path } : {}),
      availableTargets
    };
  }

  if (surface.support === "UNSUPPORTED") {
    return {
      kind: "HANDOFF",
      target: choice.target,
      reason: "TARGET_UNSUPPORTED",
      selectedBy: choice.selectedBy,
      ...(semantic ? { semanticRouteId: semantic } : {}),
      ...(request.path ? { requestedPath: request.path } : {}),
      availableTargets,
      ...(surface.fallbackSurfaceId
        ? { fallbackSurfaceId: surface.fallbackSurfaceId }
        : {})
    };
  }

  let route: AppHostRouteV010 | undefined;
  let resolvedSemantic = semantic;

  if (semantic) {
    route = routeForSurface(manifest, surface.id, semantic);
    if (!route) {
      return {
        kind: "HANDOFF",
        target: choice.target,
        reason: "SEMANTIC_ROUTE_UNAVAILABLE",
        selectedBy: choice.selectedBy,
        semanticRouteId: semantic,
        ...(request.path ? { requestedPath: request.path } : {}),
        availableTargets,
        ...(surface.fallbackSurfaceId
          ? { fallbackSurfaceId: surface.fallbackSurfaceId }
          : {})
      };
    }
  } else if (request.path) {
    route = manifest.routes.find(candidate =>
      candidate.path === request.path
      && (candidate.surfaceId === surface.id || candidate.surfaceId === undefined)
    );
  } else if (surface.entryRoute) {
    route = manifest.routes.find(candidate =>
      candidate.path === surface.entryRoute
      && (candidate.surfaceId === surface.id || candidate.surfaceId === undefined)
    );
  }

  if (!route) {
    return {
      kind: "NOT_FOUND",
      target: choice.target,
      selectedBy: choice.selectedBy,
      ...(request.path ? { requestedPath: request.path } : {}),
      ...(resolvedSemantic ? { semanticRouteId: resolvedSemantic } : {})
    };
  }

  resolvedSemantic ??= semanticId(route);
  return {
    kind: "ROUTE",
    target: choice.target,
    support: surface.support,
    surfaceId: surface.id,
    route,
    semanticRouteId: resolvedSemantic,
    selectedBy: choice.selectedBy
  };
}

import type {
  AttentionSemantic, ExperienceCompositionV010, ExperienceContextV010,
  ExperienceRegion, MotionSemantic, ResolvedExperienceV010
} from "./contracts.js";

function enforceMotion(motion: MotionSemantic | undefined, context: ExperienceContextV010): MotionSemantic | undefined {
  if (!motion) return undefined;
  if (context.accessibility?.reduceMotion) return { intent: "none", ...(motion.importance ? {importance: motion.importance} : {}), repeat: "never" };
  return motion;
}

function enforceAttention(attention: AttentionSemantic | undefined): AttentionSemantic | undefined {
  if (!attention) return undefined;
  if (attention.decisionCritical && ["passive", "informative"].includes(attention.level)) {
    return { ...attention, level: "requires-review" };
  }
  return attention;
}

function resolveRegion(region: ExperienceRegion, context: ExperienceContextV010): ExperienceRegion {
  const attention = enforceAttention(region.attention);
  const motion = enforceMotion(region.motion, context);
  return {
    id: region.id,
    capability: region.capability,
    stability: region.stability,
    ...(region.props ? { props: region.props } : {}),
    ...(attention ? { attention } : {}),
    ...(motion ? { motion } : {})
  };
}

export function resolveExperience(
  composition: ExperienceCompositionV010,
  context: ExperienceContextV010
): ResolvedExperienceV010 {
  const diagnostics: string[] = [];
  const shared = context.mode === "shared" || Boolean(context.collaboration);
  const regions = composition.regions.map(region => {
    if (shared && region.stability === "adaptive") {
      diagnostics.push(`Region '${region.id}' is adaptive inside collaboration; renderer must preserve shared reference identity.`);
    }
    return resolveRegion(region, context);
  });
  return {
    contractVersion: "0.1.0",
    experienceId: composition.experienceId,
    mode: shared ? "shared" : context.mode,
    regions,
    diagnostics
  };
}

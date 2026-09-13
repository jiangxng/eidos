# Experience Compiler (EC) — Expectations from Eidos

This records Eidos-side expectations for the separate Experience Compiler project.

## EC owns intelligence that Eidos intentionally does not own
- understand Human Intent;
- learn long-term user work habits where appropriate;
- accumulate experience preferences;
- understand role, task and collaboration context;
- decide when adaptation is useful;
- let adaptation converge instead of creating perpetual change;
- propose composition using Eidos capabilities;
- explain material personalization decisions when useful.

Eidos receives explicit proposals/context, validates them and realizes them deterministically.

## Desired human outcome
> "This environment increasingly fits how I work."

Not:
> "The AI keeps rearranging my software."

## EC must distinguish
- long-term preference vs temporary context;
- personal preference vs role responsibility;
- solo vs shared mode;
- preference vs organization policy;
- preference vs accessibility;
- preference vs decision-critical evidence;
- stable learned habit vs weak short-term signal.

## Shared Experience
During collaboration EC may reduce or suspend structural personalization to protect common reference.

Future collaboration needs include shared focus, presenter/follow mode, shared selection, annotations, decision state, timeline reference and personal-assistant periphery.

## Integrity
EC must not personalize away business truth, mandatory evidence, policy controls, objective attention severity or collaboration reference identity.

## Privacy boundary
Eidos should not require EC's complete personal memory or raw behavioral history. EC should send the minimum bounded task-relevant projection.

## Contract
`EC User/Profile Intelligence -> ExperienceContext + AdaptationHints + ExperienceComposition -> Eidos validation/resolution`

See `src/ec/contracts.ts`.

## Executable code
EC may compose declarative/versioned contracts. Eidos Core Runtime does not execute arbitrary EC/LLM-generated executable code by default.

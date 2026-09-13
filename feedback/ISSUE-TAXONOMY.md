# Feedback Taxonomy

Use stable codes so feedback can be aggregated.

## LLM comprehension
- `CTX-IDENTITY` — model misunderstands what Eidos is.
- `CTX-BOUNDARY` — EC/Eidos/Host/Human ownership confusion.
- `CTX-DISCOVERY` — capability/tool/document cannot be found.
- `CTX-CONTRADICTION` — authoritative sources appear inconsistent.
- `CTX-OVERLOAD` — too much context required.

## LLM correctness
- `ERR-CAPABILITY` — wrong/imagined capability.
- `ERR-CONTRACT` — invalid contract.
- `ERR-EXECUTION` — business execution leaks into Eidos.
- `ERR-STABILITY` — stability/integrity violation.
- `ERR-RENDERER` — renderer/framework detail leaks upward.
- `ERR-REPAIR` — excessive repair cycles.

## Human experience
- `HUX-DIRECT` — direct manipulation inefficient/confusing.
- `HUX-ADAPT` — personalization unstable/unhelpful.
- `HUX-ATTENTION` — attention guidance wrong or fatiguing.
- `HUX-DECISION` — evidence/alternatives/consequences inadequate.
- `HUX-SHARED` — collaboration loses shared reference.
- `HUX-A11Y` — accessibility failure.

## Product / market
- `GTM-POSITION` — value proposition unclear.
- `GTM-DEMO` — demo fails to prove a claim.
- `GTM-TRUST` — insufficient reliability/security evidence.
- `GTM-INTEGRATION` — adoption blocked by integration.
- `GTM-CAPABILITY` — missing capability blocks use.

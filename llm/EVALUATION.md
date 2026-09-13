# Eidos LLM Evaluation

Use this to evaluate a new model, agent or coding assistant.

Score each item 0 / 1 / 2:
- 0 = wrong or unsafe
- 1 = partially correct / needs prompting
- 2 = correct without repair

Total: 40.

## A. Identity & boundaries
1. Define Eidos in <= 80 words.
2. Who owns Human Intent interpretation?
3. Who owns business truth?
4. Can Core Runtime execute arbitrary LLM-generated JavaScript?
5. Explain `LLM proposes; Eidos validates and realizes`.

## B. Composition
6. Given an order-risk review request, select capabilities before components.
7. Explain Capability vs Component.
8. Explain why a renderer adapter is not itself the semantic capability.
9. What should happen when a capability is unknown?
10. When is rewriting an old component preferred over preserving it?

## C. Experience integrity
11. Explain invariant/shared-stable/personal-stable/adaptive.
12. Can mandatory decision evidence disappear because a user prefers a cleaner page?
13. In collaboration, what must remain stable?
14. Which wins: explicit human layout choice or EC inference?
15. Name the exceptions that can override personal preference.

## D. Human interaction
16. When should drag/reorder happen directly instead of through an LLM?
17. Does direct manipulation create a second architecture?
18. What is the difference between attention semantics and attention presentation?

## E. Implementation task
19. Produce a valid Experience Proposal for an exception review.
20. Produce one deliberately invalid proposal and predict the deterministic diagnostic.

## Pass levels
- 36–40: **Eidos-native**
- 30–35: **Operational**
- 22–29: **Needs guided context**
- <22: **Do not grant autonomous Eidos changes**

Record both first-pass score and score after deterministic diagnostics. Repair-cycle count is itself useful feedback.

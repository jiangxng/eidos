# ADR-0003 — M0 UIDL 0.1.0 identity conflict remains unresolved

Status: Blocking compatibility claim.

The supplied M0 schema bytes and the hash declared by its manifests/documents disagree. Do not silently rewrite 0.1.0. Preserve evidence and publish corrected semantics under a new version (this candidate uses 0.1.1) until the producer/public contract is confirmed.

import type { RealtimeEventV010 } from "./contracts.js";

export type RealtimeSequenceDecisionKindV010 =
  | "APPLY"
  | "DUPLICATE"
  | "GAP"
  | "RECOVERY_PENDING";

export interface RealtimeSequenceDecisionV010 {
  kind: RealtimeSequenceDecisionKindV010;
  eventId: string;
  sequence: number;
  expectedSequence?: number;
}

export interface RealtimeEventSequenceSnapshotV010 {
  contractVersion: "0.1.0";
  lastAppliedSequence?: number;
  recoveryRequired: boolean;
  highWaterSequence?: number;
}

export interface RealtimeEventSequenceGuardV010 {
  observe(event: Pick<RealtimeEventV010, "eventId" | "sequence">): RealtimeSequenceDecisionV010;
  completeRecovery(throughSequence?: number): void;
  reset(): void;
  snapshot(): RealtimeEventSequenceSnapshotV010;
}

export function createRealtimeEventSequenceGuardV010(
  maxRememberedEventIds = 512
): RealtimeEventSequenceGuardV010 {
  let lastAppliedSequence: number | undefined;
  let recoveryRequired = false;
  let highWaterSequence: number | undefined;
  const seen = new Set<string>();
  const order: string[] = [];

  const remember = (eventId: string) => {
    if (seen.has(eventId)) return;
    seen.add(eventId);
    order.push(eventId);
    while (order.length > maxRememberedEventIds) {
      const oldest = order.shift();
      if (oldest) seen.delete(oldest);
    }
  };

  return {
    observe(event) {
      if (!Number.isInteger(event.sequence) || event.sequence < 0 || !event.eventId) {
        throw new Error("EIDOS_REALTIME_SEQUENCE_EVENT_INVALID");
      }

      if (seen.has(event.eventId)) {
        return {
          kind: "DUPLICATE",
          eventId: event.eventId,
          sequence: event.sequence
        };
      }

      if (recoveryRequired) {
        remember(event.eventId);
        highWaterSequence = Math.max(highWaterSequence ?? event.sequence, event.sequence);
        return {
          kind: "RECOVERY_PENDING",
          eventId: event.eventId,
          sequence: event.sequence
        };
      }

      if (lastAppliedSequence === undefined) {
        remember(event.eventId);
        lastAppliedSequence = event.sequence;
        highWaterSequence = event.sequence;
        return {
          kind: "APPLY",
          eventId: event.eventId,
          sequence: event.sequence
        };
      }

      if (event.sequence <= lastAppliedSequence) {
        remember(event.eventId);
        return {
          kind: "DUPLICATE",
          eventId: event.eventId,
          sequence: event.sequence
        };
      }

      const expectedSequence = lastAppliedSequence + 1;
      if (event.sequence !== expectedSequence) {
        remember(event.eventId);
        recoveryRequired = true;
        highWaterSequence = event.sequence;
        return {
          kind: "GAP",
          eventId: event.eventId,
          sequence: event.sequence,
          expectedSequence
        };
      }

      remember(event.eventId);
      lastAppliedSequence = event.sequence;
      highWaterSequence = event.sequence;
      return {
        kind: "APPLY",
        eventId: event.eventId,
        sequence: event.sequence
      };
    },
    completeRecovery(throughSequence) {
      if (!recoveryRequired && throughSequence === undefined) return;
      const recoveredThrough = throughSequence ?? highWaterSequence;
      if (recoveredThrough !== undefined) {
        lastAppliedSequence = Math.max(
          lastAppliedSequence ?? recoveredThrough,
          recoveredThrough
        );
        highWaterSequence = lastAppliedSequence;
      }
      recoveryRequired = false;
    },
    reset() {
      lastAppliedSequence = undefined;
      recoveryRequired = false;
      highWaterSequence = undefined;
      seen.clear();
      order.splice(0, order.length);
    },
    snapshot() {
      return {
        contractVersion: "0.1.0",
        ...(lastAppliedSequence !== undefined ? { lastAppliedSequence } : {}),
        recoveryRequired,
        ...(highWaterSequence !== undefined ? { highWaterSequence } : {})
      };
    }
  };
}

import type {
  RealtimeEventResourceV010,
  RealtimeEventScopeV010,
  RealtimeEventV010
} from "./contracts.js";

export interface ResourceCacheKeyInputV010 {
  scope?: RealtimeEventScopeV010;
  resource: Pick<RealtimeEventResourceV010, "kind" | "resourceId">;
}

export interface ResourceCacheEntryV010<T = unknown> {
  key: string;
  value?: T;
  version?: string | number;
  stale: boolean;
  lastEventSequence?: number;
}

export interface ResourceCacheV010<T = unknown> {
  keyOf(input: ResourceCacheKeyInputV010): string;
  get(key: string): ResourceCacheEntryV010<T> | undefined;
  set(
    key: string,
    value: T,
    metadata?: {
      version?: string | number;
      lastEventSequence?: number;
    }
  ): void;
  markStale(
    key: string,
    metadata?: {
      version?: string | number;
      lastEventSequence?: number;
    }
  ): void;
  invalidateFromEvent(event: RealtimeEventV010): string | undefined;
  subscribe(
    key: string,
    listener: (entry: ResourceCacheEntryV010<T> | undefined) => void
  ): () => void;
  clear(): void;
}

function encode(value: string | undefined): string {
  return encodeURIComponent(value ?? "");
}

export function canonicalResourceCacheKeyV010(
  input: ResourceCacheKeyInputV010
): string {
  return [
    "eidos-resource-v0.1",
    encode(input.scope?.enterpriseId),
    encode(input.scope?.contextId),
    encode(input.scope?.principalSubjectId),
    encode(input.resource.kind),
    encode(input.resource.resourceId)
  ].join("|");
}

export function createResourceCacheV010<T = unknown>(): ResourceCacheV010<T> {
  const entries = new Map<string, ResourceCacheEntryV010<T>>();
  const listeners = new Map<
    string,
    Set<(entry: ResourceCacheEntryV010<T> | undefined) => void>
  >();

  const publish = (key: string) => {
    const value = entries.get(key);
    for (const listener of listeners.get(key) ?? []) {
      listener(value ? { ...value } : undefined);
    }
  };

  return {
    keyOf: canonicalResourceCacheKeyV010,
    get(key) {
      const value = entries.get(key);
      return value ? { ...value } : undefined;
    },
    set(key, value, metadata = {}) {
      entries.set(key, {
        key,
        value,
        ...(metadata.version !== undefined ? { version: metadata.version } : {}),
        stale: false,
        ...(metadata.lastEventSequence !== undefined
          ? { lastEventSequence: metadata.lastEventSequence }
          : {})
      });
      publish(key);
    },
    markStale(key, metadata = {}) {
      const current = entries.get(key);
      entries.set(key, {
        key,
        ...(current?.value !== undefined ? { value: current.value } : {}),
        ...(metadata.version !== undefined
          ? { version: metadata.version }
          : current?.version !== undefined
            ? { version: current.version }
            : {}),
        stale: true,
        ...(metadata.lastEventSequence !== undefined
          ? { lastEventSequence: metadata.lastEventSequence }
          : current?.lastEventSequence !== undefined
            ? { lastEventSequence: current.lastEventSequence }
            : {})
      });
      publish(key);
    },
    invalidateFromEvent(event) {
      if (!event.resource) return undefined;
      const key = canonicalResourceCacheKeyV010({
        scope: event.scope,
        resource: event.resource
      });
      const current = entries.get(key);
      if (
        current
        && event.resource.version !== undefined
        && current.version !== undefined
        && event.resource.version === current.version
      ) {
        return key;
      }
      this.markStale(key, {
        ...(event.resource.version !== undefined
          ? { version: event.resource.version }
          : {}),
        lastEventSequence: event.sequence
      });
      return key;
    },
    subscribe(key, listener) {
      const bucket = listeners.get(key) ?? new Set();
      bucket.add(listener);
      listeners.set(key, bucket);
      listener(this.get(key));
      return () => {
        bucket.delete(listener);
        if (bucket.size === 0) listeners.delete(key);
      };
    },
    clear() {
      const keys = [...entries.keys()];
      entries.clear();
      for (const key of keys) publish(key);
    }
  };
}

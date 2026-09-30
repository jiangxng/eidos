import type {
  LocaleContextV010,
  LocalizationBundleV010,
  LocalizationRuntime,
  PresentableTextV010
} from "./contracts.js";

function unique(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function languageFallback(locale: string): string | undefined {
  const index = locale.indexOf("-");
  return index > 0 ? locale.slice(0, index) : undefined;
}

function renderParams(
  template: string,
  params?: Record<string, string | number | boolean | null>
): string {
  if (!params) return template;
  return template.replace(/\{([A-Za-z0-9_.-]+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key] ?? "") : match
  );
}

export function createLocalizationRuntime(
  initialBundles: readonly LocalizationBundleV010[] = [],
  options: { locale?: string; fallbackLocales?: string[] } = {}
): LocalizationRuntime {
  let locale = options.locale?.trim() || "en";
  let fallbackLocales = unique(options.fallbackLocales ?? ["en"]);
  const listeners = new Set<(context: LocaleContextV010) => void>();
  let bundles = new Map<string, LocalizationBundleV010>();

  function replaceBundles(next: readonly LocalizationBundleV010[]): void {
    const mapped = new Map<string, LocalizationBundleV010>();
    for (const bundle of next) {
      if (
        bundle.contractVersion !== "0.1.0" ||
        !bundle.namespace ||
        !bundle.locale ||
        !bundle.messages ||
        typeof bundle.messages !== "object"
      ) {
        continue;
      }
      mapped.set(`${bundle.namespace}\u0000${bundle.locale}`, {
        contractVersion: "0.1.0",
        namespace: bundle.namespace,
        locale: bundle.locale,
        messages: { ...bundle.messages }
      });
    }
    bundles = mapped;
  }

  function getContext(): LocaleContextV010 {
    return { locale, fallbackLocales: [...fallbackLocales] };
  }

  function publish(): void {
    const context = getContext();
    for (const listener of listeners) listener(context);
  }

  function resolveMessage(
    namespace: string,
    key: string,
    fallback: string,
    params?: Record<string, string | number | boolean | null>
  ): string {
    const language = languageFallback(locale);
    const candidates = unique([
      locale,
      ...(language ? [language] : []),
      ...fallbackLocales.flatMap(item => {
        const base = languageFallback(item);
        return base ? [item, base] : [item];
      })
    ]);

    for (const candidate of candidates) {
      const bundle = bundles.get(`${namespace}\u0000${candidate}`);
      const value = bundle?.messages[key];
      if (typeof value === "string") return renderParams(value, params);
    }
    return renderParams(fallback, params);
  }

  replaceBundles(initialBundles);

  return {
    getContext,

    setLocale(nextLocale: string) {
      const normalized = nextLocale.trim();
      if (!normalized || normalized === locale) return;
      locale = normalized;
      publish();
    },

    replaceBundles,

    availableLocales() {
      return unique([locale, ...[...bundles.values()].map(bundle => bundle.locale)]).sort();
    },

    hasMessage(namespace: string, key: string, requestedLocale = locale) {
      const language = languageFallback(requestedLocale);
      return [requestedLocale, ...(language ? [language] : [])].some(candidate =>
        typeof bundles.get(`${namespace}\u0000${candidate}`)?.messages[key] === "string"
      );
    },

    resolveText(text: PresentableTextV010) {
      if (text.kind === "literal") return text.value;
      return resolveMessage(
        text.message.namespace,
        text.message.key,
        text.message.fallback ?? text.message.key,
        text.message.params
      );
    },

    resolve: resolveMessage,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

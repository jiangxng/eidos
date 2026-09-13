# Multilingual Demo

The commercial showcase currently includes:

- English (`en`)
- 简体中文 (`zh-CN`)
- 繁體中文 (`zh-TW`)
- 日本語 (`ja`)
- Español (`es`)

Language selection is persisted locally.

The demo intentionally keeps:
- capability IDs;
- contract keys;
- error codes;
- version identifiers

language-neutral. Human-facing labels and explanations are localized. This prevents translated terminology from changing machine contracts.

Future locale packs can be added without changing runtime semantics.

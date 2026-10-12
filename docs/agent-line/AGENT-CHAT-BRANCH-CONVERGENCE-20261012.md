# Eidos Agent chat branch reconciliation (2026-10-12)

Original source `improve/agent-chat-interactions-v01` @ `8d83400ff10e6fb8d53f40e91a1f4b5419272637` diverged from main. Direct PR #176 conflicted with newer chat layout and Agent draft-preservation translations. This branch resolves the divergence by retaining the newest main Workbench layout and translations while selectively porting completed improvements:

- Assistant response Copy button (text/evidence/proposal only; activity diagnostics excluded).
- In-flight busy indicator and draft-controlled composer input, Enter/composition handling, compact growth.
- Three icon definitions `plus/archive/copy`, four-locale copy/thinking text.
- Legacy behavioral tests and copy styles, without restoring old global mobile layout CSS.

The source branch is linked as an explicit parent of this reconciliation's merge commit. This records history even where current main takes priority. No 2D/EOG or Platform main changes.

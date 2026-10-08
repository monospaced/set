/// <reference types="node" />

// React uses this flag to decide whether to enable act() scheduling semantics.
// Without it, React logs a warning on every act() call inside tests.
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

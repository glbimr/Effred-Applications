// Removed broken reference to vite/client which caused build errors
// /// <reference types="vite/client" />

// Augment the global NodeJS namespace to include API_KEY in ProcessEnv.
// This resolves the conflict with existing type definitions for 'process' (e.g. from @types/node).
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}

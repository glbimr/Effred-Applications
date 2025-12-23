// Removed broken reference to vite/client which caused build errors
// /// <reference types="vite/client" />

// Manually declare process for client-side code usage
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: any;
  }
};
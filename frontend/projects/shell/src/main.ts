import { initFederation } from '@angular-architects/native-federation';

// Read the manifest that maps remote application names to their entry URLs.
initFederation('federation.manifest.json', {
  // Load the shell's own federation metadata for shared dependencies.
  hostRemoteEntry: { url: './remoteEntry.json' },
  // Listen for remote rebuild notifications and reload the shell during development.
  sse: true,
})
  // Log federation setup errors and allow Angular startup to continue.
  .catch((err) => console.error(err))
  // Load the Angular application after federation setup has finished.
  .then((_) => import('./bootstrap'))
  // Log errors from loading or starting the Angular application.
  .catch((err) => console.error(err));

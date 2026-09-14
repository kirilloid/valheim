import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { analyzer } from 'vite-bundle-analyzer';

function getGitMetadata() {
  const date = new Date().toISOString().slice(0, -8);
  try {
    return {
      commit: execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(),
      date,
    };
  } catch {
    return { commit: 'unknown', date };
  }
}

function buildMetadataPlugin() {
  return {
    name: 'build-metadata',
    transformIndexHtml(html: string) {
      const { commit, date } = getGitMetadata();
      return html.replace(/<html([^>]*)>/, `<html$1 data-build-commit="${commit}" data-build-date="${date}">`);
    },
  };
}

export default defineConfig({
  plugins: [react(), analyzer(), buildMetadataPlugin()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { COMPATIBILITY_DATE, COMPATIBILITY_FLAGS } from '../src/index.js';

const read = (name: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../${name}`, import.meta.url)), 'utf8')) as {
    extends?: string;
    compilerOptions: Record<string, unknown>;
  };

describe('tsconfig presets', () => {
  it('base is strict ES2023 with bundler resolution and verbatimModuleSyntax', () => {
    const { compilerOptions: o } = read('tsconfig.base.json');
    expect(o.strict).toBe(true);
    expect(o.target).toBe('ES2023');
    expect(o.moduleResolution).toBe('bundler');
    expect(o.verbatimModuleSyntax).toBe(true);
  });

  it('worker extends base and adds workers types', () => {
    const w = read('tsconfig.worker.json');
    expect(w.extends).toBe('./tsconfig.base.json');
    expect(w.compilerOptions.types).toEqual(['@cloudflare/workers-types']);
  });

  it('exports the Workers compatibility settings', () => {
    expect(COMPATIBILITY_DATE).toBe('2026-09-01');
    expect(COMPATIBILITY_FLAGS).toEqual(['nodejs_compat']);
  });
});

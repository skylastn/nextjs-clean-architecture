declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: (value: unknown) => { toBe(expected: unknown): void; toHaveProperty(key: string): void };
import { Env } from "./env";

describe("Env", () => {
  it("provides the public logo asset path", () => {
    expect(Env.logoPath).toBe("/assets/logo.png");
  });

  it("exposes an endpoint URL setting", () => {
    expect(Env).toHaveProperty("endpointUrl");
  });
});

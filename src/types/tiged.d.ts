declare module "tiged" {
  interface TigedOptions {
    verbose?: boolean;
    force?: boolean;
  }

  interface TigedEmitter {
    clone(destination: string): Promise<void>;
  }

  export default function tiged(
    repo: string,
    options?: TigedOptions,
  ): TigedEmitter;
}

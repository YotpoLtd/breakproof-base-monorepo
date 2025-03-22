declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: import('@repo/environment').NodeEnv;
  }
}

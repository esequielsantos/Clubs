export interface AmbientVariable {
  ambient: Ambient;
  api: string;
  login: string;
}

export enum Ambient {
  Development,
  Test,
  Production,
  Homologation,
}

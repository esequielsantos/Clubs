export interface AmbientVariable {
  ambient: Ambiente;
  api: string;
  sauUrlLogin: string;
  login: string;
}

export enum Ambiente {
  Desenvolvimento,
  Homologacao,
  Producao,
}

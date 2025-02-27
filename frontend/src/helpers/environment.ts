export interface AmbientVariable {
  ambient: Ambiente;
  api: string;
  sauUrlLogin: string;
  sauUrlLogout: string;
}

export enum Ambiente {
  Desenvolvimento,
  Homologacao,
  Producao,
}

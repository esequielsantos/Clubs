export interface Endpoint {
  "/user": Promise<Users[]>;
}
 
export interface Users {
  id: number;
  nome: string;
  primeiroNome: string;
  email: string;
  acessoAdmin: string;
  acessoPrestadores: string;
  acessoApp: string;
  acessoSequestros: string;
  ativo: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  dtUltimoAcesso: Date;
}
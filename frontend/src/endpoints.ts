export interface Endpoint {
  "/user": Promise<Users[]>;
}

export interface Users {
  id: number;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  dtUltimoAcesso: Date;
}

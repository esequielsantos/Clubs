import { Ambient, type AmbientVariable } from "./helpers/environment";

export const environment: AmbientVariable = {
  ambient: Ambient.Development,
  api: "http://localhost:3101",
  login: "http://localhost:5300",
};

import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenService {
  private invalidTokens = new Set<string>();

  addInvalidToken(token: string) {
    this.invalidTokens.add(token);
  }

  isTokenInvalid(token: string): boolean {
    return this.invalidTokens.has(token);
  }
}
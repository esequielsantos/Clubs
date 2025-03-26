import { BadRequestException } from '@nestjs/common';

export type NomeCampo<T> = keyof T & string;

export class ValidadorHttp<T extends Record<string, unknown>> {
  constructor(private parametros: T) {}

  lerString(nomeCampo: NomeCampo<T>): string {
    const valor = this.parametros[nomeCampo];
    this.assert(valor !== undefined, `Parâmetro ausente: "${nomeCampo}"`);
    this.assert(
      typeof valor === 'string',
      `Valor do parâmetro "${nomeCampo}" deve ser uma string`,
    );

    return valor;
  }

  lerNumero(nomeCampo: NomeCampo<T>): number {
    const valor = this.parametros[nomeCampo];
    this.assert(valor !== undefined, `Parâmetro ausente: "${nomeCampo}"`);
    this.assert(
      typeof valor === 'number',
      `Valor do parâmetro "${nomeCampo}" deve ser um número`,
    );

    return valor;
  }

  lerBooleano(nomeCampo: NomeCampo<T>): boolean {
    const valor = this.parametros[nomeCampo];
    this.assert(valor !== undefined, `Parâmetro ausente: "${nomeCampo}"`);
    this.assert(
      typeof valor === 'boolean',
      `Valor do parâmetro "${nomeCampo}" deve ser um booleano`,
    );

    return valor;
  }

  lerValorEnum<E extends Record<string, string>>(
    nomeCampo: NomeCampo<T>,
    tipoEnum: E,
  ): E[keyof E] {
    const valor = this.lerString(nomeCampo);

    this.assert(
      Object.values(tipoEnum).includes(valor),
      `Valor do parâmetro "${nomeCampo}" deve ser um dos seguintes: ${Object.values(tipoEnum).join(', ')}`,
    );

    return valor as E[keyof E];
  }

  private assert(condicao: boolean, message: string): asserts condicao {
    if (!condicao) {
      throw new BadRequestException(message);
    }
  }
}

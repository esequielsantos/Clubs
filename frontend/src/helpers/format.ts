export function dateFormat(valor: string | Date): string {
  const data = new Date(valor);
  const retorno = data.toLocaleDateString("pt-br", { timeZone: "UTC" });
  return retorno ? retorno : "";
}

export function currencyFormat(valor: number | undefined | null): string {
  return (valor == 0 || valor === undefined || valor === null || isNaN(valor)) ? "R$ 0,00" : valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function percentFormat(valor: string): string {
  return valor ? +valor / 100 + "%" : "";
}

export function cnpjFormat(cnpj: string) {
  if (cnpj) {
    cnpj = cnpj.padStart(14, "0");
    return cnpj.replace(/([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2})/gi, "$1.$2.$3/$4-$5");
  } else {
    return "";
  }
}

export function nameFormat(texto: string): string {
  if (!texto || texto === undefined || texto === null) {
    return "";
  }
  return texto
    .split(" ")
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(" ");
}

export function cnpjMaskFormat(cpf: string, ofuscar = false) {
  if (cpf) {
    cpf = cpf.padStart(11, "0");
    cpf = cpf.replace(/([0-9*]{3})([0-9*]{3})([0-9*]{3})([0-9*]{2})/gi, "$1.$2.$3-$4");

    if (ofuscar) {
      cpf = "***" + cpf.substring(3, 12) + "**";
    }
    return cpf;
  } else {
    return "";
  }
}

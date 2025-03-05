import { BadRequestException } from '@nestjs/common';

/**
 * Retorna apenas os números existentes em um varText
 * @param varTextOrNumber Conteúdo de string
 * @returns Número restante após o processamento
 */
export function numberOnly(
  varTextOrNumber: string | number | undefined,
): number {
  if (varTextOrNumber === undefined) {
    return 0;
  }
  const varText = varTextOrNumber.toString();
  return parseInt(
    varText.replace(/\D/g, ''),
  ); /* \D = qualquer caractere que não seja um dígito */
}

/**
 * Retorna varText como UTF-8
 * @param varText Conteúdo de string
 */
export function correctTextCode(varText: string) {
  return Buffer.from(varText, 'utf8').toString();
}

export function nameFormat(name: string): string {
  if (!name) {
    return '';
  } // Lidando com o caso de name vazio

  const words = name.toLowerCase().split(' ');
  const conjuncoes = [
    'de',
    'da',
    'das',
    'do',
    'dos',
    'di',
    'du',
    'von',
    'van',
    'e',
    'y',
    'a',
    'del',
    'della',
  ];

  const FormatedName = words
    .map((word, index) => {
      if (index === 0 || !conjuncoes.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(' ');

  return FormatedName;
}

/**
 * No Excel o valor de uma célula de data geralmente vem como um número serial
 * que representa o número de dias desde 1º de janeiro de 1900.
 * Para uma data em formato legível é necessário somar
 * a data inicial e o serial em milissegundos
 *
 * @param serial Número de dias desde 1º de janeiro de 1900
 * @example dataExcelParaJS(44561) // serial da planilha
 */
export function dataExcelParaJS(serial: number) {
  const DIA_EM_MILISEGUNDOS = 86400000;
  const DATA_INICIAL = new Date(1899, 11, 30, 0, 0, 0); // 30 de dezembro de 1899
  return new Date(DATA_INICIAL.getTime() + serial * DIA_EM_MILISEGUNDOS);
}

/*
Funcao para anonimizar caracteres importantes do email

*/
export function anonymizeEmail(email: string): string {
  if (!email) {
    throw new BadRequestException('Email não informado.');
  }

  if (!validateEmail(email)) {
    throw new BadRequestException('Email inválido.');
  }

  const [username, domain] = email.split('@');

  if (!username || !domain) {
    return '***@***.***'; // Retorna um valor padrão se o email for inválido
  }

  const usernameStart = username.slice(
    0,
    username.length > 4 ? username.length - 4 : username.length - 2,
  ); //exibe os caracteres do username exceto os ultimos 3
  const usernameMasked = '*'.repeat(username.length - usernameStart.length);

  const domainParts = domain.split('.');
  const domainStart = domainParts[0].slice(0, domainParts[0].length - 4); //exibe o dominio exceto os ultimos 4
  const maskedDomainName = '*'.repeat(
    domainParts[0].length - domainStart.length,
  );

  return `${usernameStart}${usernameMasked}@${domainStart}${maskedDomainName}.${domainParts.slice(1).join('.')}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Remove caracteres acentuados
 * @param varText Conteúdo de string
 */
export function removeAccentuation(varText: string) {
  return varText
    .normalize('NFD')
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s-_])/g, '');
}

export function validatedocId(docId: string): boolean {
  docId = docId.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  if (docId.length !== 11 || /^(\d)\1+$/.test(docId)) {
    return false; // Verifica se o docId tem 11 dígitos ou se todos os dígitos são iguais
  }

  let soma = 0;
  let digitoVerificador1;
  let digitoVerificador2;

  /**
   * Cálculo do primeiro dígito verificador
   */

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(docId.substring(i - 1, i)) * (11 - i);
  }

  digitoVerificador1 = (soma * 10) % 11;
  if (digitoVerificador1 === 10 || digitoVerificador1 === 11) {
    digitoVerificador1 = 0;
  }
  if (digitoVerificador1 !== parseInt(docId.substring(9, 10))) {
    return false;
  }

  /**
   * Cálculo do segundo dígito verificador
   */

  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += parseInt(docId.substring(i - 1, i)) * (12 - i);
  }

  digitoVerificador2 = (soma * 10) % 11;
  if (digitoVerificador2 === 10 || digitoVerificador2 === 11) {
    digitoVerificador2 = 0;
  }
  if (digitoVerificador2 !== parseInt(docId.substring(10, 11))) {
    return false;
  }

  return true;
}

export function validateCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false; // Verifica se o CNPJ tem 14 dígitos ou se todos os dígitos são iguais
  }

  /**
   * Cálculo do primeiro dígito verificador
   */
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  const digitoVerificador1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (digitoVerificador1 !== parseInt(digitos.charAt(0))) {
    return false;
  }

  /**
   * Cálculo do segundo dígito verificador
   */
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  const digitoVerificador2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (digitoVerificador2 !== parseInt(digitos.charAt(1))) {
    return false;
  }

  return true;
}

export function maskdocId(docId: string, ofuscar = false): string {
  docId = docId.replace(
    /([0-9*]{3})([0-9*]{3})([0-9*]{3})([0-9*]{2})/gi,
    '$1.$2.$3-$4',
  );

  if (ofuscar) {
    docId = '***' + docId.substring(3, 12) + '**';
  }

  return docId;
}

export function dateFormat(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `'${day}/${month}/${year}'`; // Note the single quotes around the date
}

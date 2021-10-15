export type uuid = string;
export function isUuid(input: string | uuid) {
  return typeof input === 'string';
}

export type points = number;

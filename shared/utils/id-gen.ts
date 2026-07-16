import { customAlphabet } from "nanoid";

export const IDConfig = {
  alphabet: "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz",
  length: 16,
} as const;

export const prefixes = {
  user: "usr",
  note: "note",
  oauth: "oauth",
} as const;

export type IDPrefix = keyof typeof prefixes;

export const nanoid = customAlphabet(IDConfig.alphabet, IDConfig.length);
export const randomId = (prefix: IDPrefix): string => `${prefixes[prefix]}_${nanoid()}`;

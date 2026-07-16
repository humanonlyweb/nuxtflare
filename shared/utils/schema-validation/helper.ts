import { z } from "zod";

import { IDConfig, prefixes, type IDPrefix } from "../id-gen";

const buildIdPattern = (prefix: string): RegExp =>
  new RegExp(`^${prefix}_[${IDConfig.alphabet}]{${IDConfig.length}}$`);

export const idSchema = (resource: IDPrefix) =>
  z.string().regex(buildIdPattern(prefixes[resource]), `Invalid ${resource} ID.`);

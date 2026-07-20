import type { H3Event } from "h3";
import type { ZodType } from "zod";

function formatZodErrors(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const field = issue.path.length > 0 ? issue.path.join(".") : "_root";

    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export async function validateRequestBody<Output>(
  event: H3Event,
  schema: ZodType<Output>,
): Promise<Output> {
  const { data, error } = await readValidatedBody(event, (body) => schema.safeParse(body));

  if (error) {
    throw Errors.validation("Invalid request body", { errors: formatZodErrors(error.issues) });
  }

  return data;
}

export async function validateRouterParams<Output>(
  event: H3Event,
  schema: ZodType<Output>,
): Promise<Output> {
  const { data, error } = await getValidatedRouterParams(event, (params) =>
    schema.safeParse(params),
  );

  if (error) {
    throw Errors.validation("Invalid route parameters", { errors: formatZodErrors(error.issues) });
  }

  return data;
}

export async function validateRequestQuery<Output>(
  event: H3Event,
  schema: ZodType<Output>,
): Promise<Output> {
  const query = getQuery(event);
  const result = schema.safeParse(query);

  if (!result.success) {
    throw Errors.validation("Invalid query parameters", {
      errors: formatZodErrors(result.error.issues),
    });
  }

  return result.data;
}

export interface UploadedFile {
  filename: string;
  contentType: string;
  data: Buffer;
  size: number;
}

interface FileRules {
  allowedTypes: readonly string[];
  maxBytes: number;
  field?: string;
}

type MultipartPart = { name?: string; filename?: string; type?: string; data: Buffer };

const MULTIPART_OVERHEAD_BYTES = 4096;

// readMultipartFormData() buffers every part in memory, so the per-file limits
// below are already too late. Reject on the declared size before parsing.
function assertDeclaredSizeWithin(event: H3Event, field: string, maxBytes: number): void {
  const declared = Number(getRequestHeader(event, "content-length"));

  if (Number.isFinite(declared) && declared > maxBytes + MULTIPART_OVERHEAD_BYTES) {
    throw Errors.tooLarge("Upload is too large", {
      errors: { [field]: `Keep the upload under ${formatBytes(maxBytes)}` },
    });
  }
}

function validatePart(part: MultipartPart, field: string, rules: FileRules): UploadedFile {
  const contentType = part.type ?? "";
  if (!rules.allowedTypes.includes(contentType)) {
    throw Errors.validation("Unsupported file type", {
      errors: { [field]: `Allowed types: ${rules.allowedTypes.join(", ")}` },
    });
  }

  if (part.data.byteLength > rules.maxBytes) {
    throw Errors.validation("File is too large", {
      errors: { [field]: `Each file must be ${formatBytes(rules.maxBytes)} or smaller` },
    });
  }

  return {
    filename: part.filename ?? "",
    contentType,
    data: part.data,
    size: part.data.byteLength,
  };
}

export async function validateFileUpload(event: H3Event, rules: FileRules): Promise<UploadedFile> {
  const field = rules.field ?? "file";
  assertDeclaredSizeWithin(event, field, rules.maxBytes);

  const parts = await readMultipartFormData(event);
  const part = parts?.find((p) => p.name === field && p.filename && p.data.byteLength);

  if (!part) {
    throw Errors.validation("No file provided", { errors: { [field]: "A file is required" } });
  }

  return validatePart(part, field, rules);
}

export async function validateFileUploads(
  event: H3Event,
  rules: FileRules & { maxFiles: number; maxTotalBytes?: number },
): Promise<UploadedFile[]> {
  const field = rules.field ?? "file";
  assertDeclaredSizeWithin(event, field, rules.maxTotalBytes ?? rules.maxBytes * rules.maxFiles);

  const parts = await readMultipartFormData(event);
  const matched = (parts ?? []).filter((p) => p.name === field && p.filename && p.data.byteLength);

  if (matched.length === 0) {
    throw Errors.validation("No files provided", {
      errors: { [field]: "At least one file is required" },
    });
  }

  if (matched.length > rules.maxFiles) {
    throw Errors.validation(`Too many files — up to ${rules.maxFiles} allowed`, {
      errors: { [field]: `Up to ${rules.maxFiles} files at a time` },
    });
  }

  const files = matched.map((part) => validatePart(part, field, rules));

  if (rules.maxTotalBytes != null) {
    const total = files.reduce((sum, file) => sum + file.size, 0);
    if (total > rules.maxTotalBytes) {
      throw Errors.validation(`Files exceed the ${formatBytes(rules.maxTotalBytes)} total limit`, {
        errors: { [field]: `Keep the combined size under ${formatBytes(rules.maxTotalBytes)}` },
      });
    }
  }

  return files;
}

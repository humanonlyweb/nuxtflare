// oxlint-disable typescript/no-unsafe-assignment -- operates on untyped AST nodes
const isService = (f) => f.endsWith(".service.ts");
const isController = (f) => f.endsWith(".controller.ts");
const isTask = (f) =>
  f.endsWith(".task.ts") || /(^|[\\/])server[\\/]tasks[\\/][^\\/]+[\\/].*\.ts$/.test(f);
const isSchemaModule = (f) => /shared[\\/]utils[\\/]schema-validation[\\/]/.test(f);
const isValidationUtil = (f) => /utils[\\/]validation\.ts$/.test(f);
const isContainer = (f) => /utils[\\/]container\.ts$/.test(f);
const isServer = (f) => /(^|[\\/])server[\\/]/.test(f);

const fileOf = (context) =>
  context.filename ?? context.physicalFilename ?? context.getFilename?.() ?? "";

const isDbImport = (src) =>
  src === "drizzle-orm" ||
  src.startsWith("drizzle-orm/") ||
  /database[\\/](schema|helpers)/.test(src);

// HTTP response / validation helpers that must not appear in a service (they belong
// in the controller). Raw input readers are handled by no-unvalidated-request-reads.
const HTTP_CALLS = new Set([
  "validateRequestBody",
  "validateRouterParams",
  "validateRequestQuery",
  "validateFileUpload",
  "validateFileUploads",
  "setResponseStatus",
  "requireUserSession",
  "getUserSession",
  "setUserSession",
  "getHeader",
  "setHeader",
  "getCookie",
  "setCookie",
  "sendRedirect",
  "useLogger",
  "createContainer",
  "assertWithinRateLimit",
  "checkRateLimit",
  "clientIp",
  "deleteCookie",
]);

const BUILTIN_ERRORS = new Set([
  "Error",
  "TypeError",
  "RangeError",
  "SyntaxError",
  "EvalError",
  "ReferenceError",
  "URIError",
  "AggregateError",
]);

const AUTH_CALLS = new Set(["requireUserSession", "getUserSession"]);

// Raw h3 readers that skip validation → each maps to its validation.ts wrapper.
const UNVALIDATED_READS = new Map([
  ["readBody", "validateRequestBody"],
  ["readValidatedBody", "validateRequestBody"],
  ["getQuery", "validateRequestQuery"],
  ["getValidatedQuery", "validateRequestQuery"],
  ["getRouterParam", "validateRouterParams"],
  ["getRouterParams", "validateRouterParams"],
  ["getValidatedRouterParams", "validateRouterParams"],
  ["readMultipartFormData", "validateFileUpload / validateFileUploads"],
]);

const calleeName = (node) => (node.callee?.type === "Identifier" ? node.callee.name : undefined);

const noDbInControllers = {
  create(context) {
    if (!isController(fileOf(context))) return {};

    return {
      ImportDeclaration(node) {
        if (typeof node.source.value === "string" && isDbImport(node.source.value)) {
          context.report({
            node,
            message:
              "Controllers must not access the database. Move DB work to the service; the controller only orchestrates.",
          });
        }
      },
      CallExpression(node) {
        if (calleeName(node) === "useDrizzle") {
          context.report({
            node,
            message: "Controllers must not call useDrizzle(). The service owns database access.",
          });
        }
      },
    };
  },
};

const noHttpInServices = {
  create(context) {
    if (!isService(fileOf(context))) return {};

    return {
      ImportDeclaration(node) {
        if (node.source.value === "h3") {
          context.report({
            node,
            message: "Services must not import from h3. HTTP concerns belong in the controller.",
          });
        }
      },
      CallExpression(node) {
        const name = calleeName(node);

        if (name && HTTP_CALLS.has(name)) {
          context.report({
            node,
            message: `Services must not call ${name}(). Validation / request parsing belongs in the controller.`,
          });
        }
      },
    };
  },
};

const noUnvalidatedRequestReads = {
  create(context) {
    const file = fileOf(context);
    // validation.ts is the one place the raw readers are legitimately wrapped.
    if (!isServer(file) || isValidationUtil(file)) return {};

    return {
      CallExpression(node) {
        const name = calleeName(node);
        const replacement = name ? UNVALIDATED_READS.get(name) : undefined;

        if (replacement) {
          context.report({
            node,
            message: `Don't call ${name}() directly. Request input must be validated. Use ${replacement}() from server/utils/validation.ts.`,
          });
        }
      },
    };
  },
};

const noServiceInstantiationOutsideContainer = {
  create(context) {
    const file = fileOf(context);
    if (isContainer(file) || isTask(file)) return {};

    return {
      NewExpression(node) {
        const name = calleeName(node);
        if (name && /(Service|Controller)$/.test(name)) {
          context.report({
            node,
            message: `Construct ${name} in the DI container (server/utils/container.ts), not here. Tasks may build services directly.`,
          });
        }
      },
    };
  },
};

const authorizeBeforeValidate = {
  create(context) {
    if (!isController(fileOf(context))) return {};

    return {
      CallExpression(node) {
        const callee = node.callee;
        if (
          callee?.type !== "MemberExpression" ||
          callee.object?.name !== "Promise" ||
          !["all", "allSettled"].includes(callee.property?.name)
        ) {
          return;
        }

        const names = (node.arguments[0]?.elements ?? [])
          .filter((element) => element?.type === "CallExpression")
          .map((element) => calleeName(element))
          .filter(Boolean);

        const authCall = names.find((name) => AUTH_CALLS.has(name));
        if (!authCall || !names.some((name) => name.startsWith("validate"))) return;

        context.report({
          node,
          message: `Await ${authCall}() before validating. Racing them lets an anonymous request reach the parser, so a bad body answers 400 (and leaks the schema) where it should answer 401.`,
        });
      },
    };
  },
};

const noRawErrorThrow = {
  create(context) {
    if (!isServer(fileOf(context))) return {};

    return {
      ThrowStatement(node) {
        const name =
          node.argument?.type === "NewExpression" ? calleeName(node.argument) : undefined;

        if (name && BUILTIN_ERRORS.has(name)) {
          context.report({
            node,
            message: `Throwing a raw ${name} answers 500 with no status or code. Use Errors.* from server/utils/error.ts, or a domain error class the controller maps.`,
          });
        }
      },
    };
  },
};

const noProcessEnv = {
  create(context) {
    if (!isServer(fileOf(context))) return {};

    return {
      MemberExpression(node) {
        if (node.object?.name === "process" && node.property?.name === "env") {
          context.report({
            node,
            message:
              "process.env is inlined at build time on Workers and is empty for per-request values. Use useRuntimeConfig(event) for config and event.context.cloudflare.env for bindings.",
          });
        }
      },
    };
  },
};

const zodSchemasInShared = {
  create(context) {
    if (isSchemaModule(fileOf(context))) return {};

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (typeof source !== "string" || (source !== "zod" && !source.startsWith("zod/"))) return;
        // `import type { ZodType }` is generic plumbing, not a schema definition.
        if (node.importKind === "type") return;
        if (!(node.specifiers ?? []).some((specifier) => specifier.importKind !== "type")) return;

        context.report({
          node,
          message:
            "Define Zod schemas in shared/utils/schema-validation/<feature>.schema.ts and import them from #shared/utils/schema-validation, so client and server validate against one shape. Type-only imports are fine.",
        });
      },
    };
  },
};

const domainTypesInTypeFile = {
  create(context) {
    const file = fileOf(context);
    if (!isService(file) && !isController(file)) return {};

    const layer = isService(file) ? "service" : "controller";

    const report = (node, name) =>
      context.report({
        node,
        message: `Move '${name}' to <feature>.type.ts and import it — a ${layer} implements behaviour, it does not declare the feature's domain types.`,
      });

    return {
      TSInterfaceDeclaration(node) {
        report(node, node.id?.name ?? "interface");
      },
      TSTypeAliasDeclaration(node) {
        report(node, node.id?.name ?? "type");
      },
    };
  },
};

export default {
  meta: { name: "arch" },
  rules: {
    "no-service-instantiation-outside-container": noServiceInstantiationOutsideContainer,
    "no-unvalidated-request-reads": noUnvalidatedRequestReads,
    "authorize-before-validate": authorizeBeforeValidate,
    "domain-types-in-type-file": domainTypesInTypeFile,
    "no-db-access-in-controllers": noDbInControllers,
    "zod-schemas-in-shared": zodSchemasInShared,
    "no-http-in-services": noHttpInServices,
    "no-raw-error-throw": noRawErrorThrow,
    "no-process-env": noProcessEnv,
  },
};

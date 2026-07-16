// oxlint-disable typescript/no-unsafe-assignment -- operates on untyped AST nodes
// Custom oxlint JS plugin (alpha API) that enforces the nuxt-fullstack layering:
// Routes → Controllers → Services. Rules self-scope by filename, so they're
// cheap no-ops on unrelated files. See DOCS/ARCHITECTURE.md.

const isController = (f) => f.endsWith(".controller.ts");
const isService = (f) => f.endsWith(".service.ts");
const isTask = (f) => f.endsWith(".task.ts");
const isContainer = (f) => /utils[\\/]container\.ts$/.test(f);
const isValidationUtil = (f) => /utils[\\/]validation\.ts$/.test(f);
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
  "getHeader",
  "setHeader",
  "getCookie",
  "setCookie",
  "sendRedirect",
  "useLogger",
  "createContainer",
]);

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

export default {
  meta: { name: "arch" },
  rules: {
    "no-db-access-in-controllers": noDbInControllers,
    "no-http-in-services": noHttpInServices,
    "no-unvalidated-request-reads": noUnvalidatedRequestReads,
    "no-service-instantiation-outside-container": noServiceInstantiationOutsideContainer,
  },
};

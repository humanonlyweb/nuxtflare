# useForm

A small Zod-native form helper — validation, touched/dirty tracking, submit state. No
runtime beyond `klona` and `dequal`. Auto-imported from `app/composables/use-form.ts`.

> **Optional.** It covers the common case. Swap in a real form library whenever it doesn't.

## Options

| Option             | Type                                            | Default  | Notes                                        |
| ------------------ | ----------------------------------------------- | -------- | -------------------------------------------- |
| `validationSchema` | `ZodType`                                       | —        | Drives validation and types                  |
| `initialValues`    | `z.input<Schema>`                               | —        | Starting values                              |
| `onSubmit`         | `(values: z.output<Schema>) => void \| Promise` | —        | Gets **parsed** values                       |
| `onError`          | `(error: unknown) => void`                      | —        | When `onSubmit` throws; see below            |
| `validateOn`       | `"blur" \| "input" \| "submit"`                 | `"blur"` | When a field becomes touched                 |
| `formRef`          | `Ref<HTMLElement \| null>`                      | —        | The `<form>`; needed for blur/input tracking |

## Returns

| Key                   | Type                           | Notes                                        |
| --------------------- | ------------------------------ | -------------------------------------------- |
| `form`                | reactive values                | `v-model="form.x"`                           |
| `errors`              | `{ [field]: message }`         | Touched/submitted fields, plus server errors |
| `isValid` / `isDirty` | `ComputedRef<boolean>`         | `isDirty` deep-compares against the baseline |
| `processing`          | `Ref<boolean>`                 | True while `onSubmit` runs                   |
| `shouldDisableSubmit` | `ComputedRef<boolean>`         | Mirrors `processing` only — see notes        |
| `submit`              | `(e?: Event) => Promise<void>` | `@submit="submit"` (calls preventDefault)    |
| `reset` / `setValues` | functions                      | Restore baseline / replace values            |
| `setErrors`           | `(fields) => void`             | Apply server field errors by hand            |
| `validateField`       | `(field) => void`              | Marks a field touched                        |

## Usage

```vue
<script setup lang="ts">
import { createNoteSchema } from "#shared/utils/schema-validation";

const formRef = useTemplateRef<HTMLElement>("formRef");
const { form, errors, submit, shouldDisableSubmit } = useForm({
  validationSchema: createNoteSchema,
  initialValues: { title: "", body: "" },
  formRef,
  onSubmit: (values) => {
    // typed and already parsed
  },
});
</script>

<template>
  <form ref="formRef" novalidate @submit="submit">
    <input v-model="form.title" name="title" />
    <p v-if="errors.title">{{ errors.title }}</p>

    <textarea v-model="form.body" name="body" />
    <p v-if="errors.body">{{ errors.body }}</p>

    <UiButton type="submit" :disabled="shouldDisableSubmit">Save</UiButton>
  </form>
</template>
```

## Server errors

`submit()` catches whatever `onSubmit` throws. If the response carries field errors — what
`Errors.validation()` / `Errors.conflict()` send — they merge into `errors` and the first
invalid control gets focus. Your page never unwraps or reshapes an error; `$fetch` plus a
thrown `Errors.*` is the whole contract:

```ts
import { parseError } from "evlog";

const { form, errors, submit } = useForm({
  validationSchema: createNoteSchema,
  initialValues: { title: "" },
  formRef,
  onSubmit: (values) => $fetch("/api/notes", { method: "POST", body: values }),
  onError: (error) => toast.error(parseError(error).message),
});
```

Field keys are the input's `name`, so `Errors.conflict("…", { email: "Already taken" })`
lands on `<input name="email">`. `app/pages/components.vue` +
`server/api/demo/profile.post.ts` are a live end-to-end example.

Without `onError`, an error carrying no field data is re-thrown so it surfaces instead of
vanishing. Errors clear per-field as the user edits, and wholesale on the next submit.

## Notes

- **`shouldDisableSubmit` tracks `processing` only.** Disabling on `!isValid` leaves a new
  user with a dead button and no reason why; submitting invalid instead reveals every
  message and focuses the first bad field.
- Blur/input tracking keys off each field's native `name`, which must match a schema key.
  No `name` means submit-only validation.
- Focus management reads `[aria-invalid="true"]` in DOM order, so a control only
  participates if it sets it. `UiInput`, `UiTextarea`, `UiSelect`, `UiRadioGroup` and
  `UiSpinButton` do (via `error`). `UiCheckbox` and `UiSwitch` don't — render their message
  yourself, like the `/components` demo does for the terms checkbox.
- Put `novalidate` on the `<form>` so Zod owns validation, not the browser.
- `onSubmit` receives `z.output` (post-transform) values, not the raw form.

# useForm

A small, Zod-native form helper — validation, touched/dirty tracking, and submit
state, with no runtime beyond `klona`. Auto-imported as `useForm` from
`app/composables/use-form.ts`.

> **Optional.** It covers the common case. Prefer a dedicated form library ala Bring your own.

## Options

`useForm({ … })`:

| Option             | Type                                            | Default  | Notes                                                  |
| ------------------ | ----------------------------------------------- | -------- | ------------------------------------------------------ |
| `validationSchema` | `ZodType`                                       | —        | Zod object schema; drives validation and types         |
| `initialValues`    | `z.input<Schema>`                               | —        | Starting values                                        |
| `onSubmit`         | `(values: z.output<Schema>) => void \| Promise` | —        | Receives **parsed** (transformed/coerced) values       |
| `validateOn`       | `"blur" \| "input" \| "submit"`                 | `"blur"` | When a field becomes "touched"                         |
| `formRef`          | `Ref<HTMLElement \| null>`                      | —        | The `<form>` element; required for blur/input tracking |

## Returns

| Key                   | Type                           | Notes                                          |
| --------------------- | ------------------------------ | ---------------------------------------------- |
| `form`                | reactive values                | Bind fields with `v-model="form.x"`            |
| `errors`              | `{ [field]: message }`         | Only for touched or submitted fields           |
| `isValid` / `isDirty` | `ComputedRef<boolean>`         |                                                |
| `processing`          | `Ref<boolean>`                 | True while `onSubmit` is running               |
| `shouldDisableSubmit` | `ComputedRef<boolean>`         | `processing                                    |     | !isValid` |
| `submit`              | `(e?: Event) => Promise<void>` | Bind `@submit="submit"` (calls preventDefault) |
| `reset` / `setValues` | functions                      | Restore baseline / replace values              |
| `validateField`       | `(field) => void`              | Marks a field touched                          |

## Usage

```vue
<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

const formRef = useTemplateRef<HTMLElement>("formRef");
const { form, errors, submit, shouldDisableSubmit } = useForm({
  validationSchema: schema,
  initialValues: { email: "", name: "" },
  formRef,
  onSubmit: (values) => {
    // values is fully typed and already parsed
  },
});
</script>

<template>
  <form ref="formRef" novalidate @submit="submit">
    <input v-model="form.email" name="email" type="email" />
    <p v-if="errors.email">{{ errors.email }}</p>

    <input v-model="form.name" name="name" />
    <p v-if="errors.name">{{ errors.name }}</p>

    <UiButton type="submit" :disabled="shouldDisableSubmit">Save</UiButton>
  </form>
</template>
```

## Notes

- Blur/input touch-tracking keys off each field's native `name` attribute, which must
  match a schema key. Fields without a `name` are validated on submit only.
- Add `novalidate` to the `<form>` so Zod owns validation instead of the browser.
- `onSubmit` receives `z.output` (post-transform/coercion) values, not the raw form.

<script setup lang="ts">
import type { AvatarItem, IconName, SelectOption, TableColumn } from "~/types/components.type";

useSeoMeta({ title: "Design system — flaremail-studio" });

const toast = useToast();

const heading = ref("The trail kit, rebuilt for spring");
const replyTo = ref("not-an-email");
const width = ref(648);
const body = ref("Twelve months of testing on wet granite and cold mornings.");
const search = ref("");

const fonts: SelectOption<string>[] = [
  { label: "Archivo", value: "archivo" },
  { label: "Archivo Semibold", value: "archivo-semibold" },
  { label: "JetBrains Mono", value: "mono", disabled: true },
];
const font = ref("archivo");
const blocks = ref<string[]>([]);

const alignments: SelectOption<string>[] = [
  { label: "Align left", value: "left" },
  { label: "Align center", value: "center" },
  { label: "Align right", value: "right", disabled: true },
];
const align = ref("left");

const modes: SelectOption<string>[] = [
  { label: "Design", value: "design" },
  { label: "HTML", value: "html" },
];
const mode = ref("design");

const devices: SelectOption<string>[] = [
  { label: "Desktop", value: "monitor" },
  { label: "Mobile", value: "smartphone" },
];
const device = ref("monitor");

const panelTabs: SelectOption<string>[] = [
  { label: "Content", value: "content" },
  { label: "Style", value: "style" },
  { label: "Settings", value: "settings" },
];
const panelTab = ref("content");

const tools = [
  { icon: "type", label: "Text block" },
  { icon: "image", label: "Image block" },
  { icon: "rectangle-horizontal", label: "Button block" },
  { icon: "divider", label: "Divider block" },
] as const;
const tool = ref<string>("type");

const unsubscribe = ref(true);
const trackOpens = ref(false);
const inlineCss = ref(true);
const darkVariant = ref(false);
const compact = ref(true);

const leading = ref(40);

// Built here rather than in the template: `{{` inside an interpolation would be
// re-read as a second mustache and fail to parse.
const variables = ["first_name", "order_id", "store_url"].map((name) => `{{${name}}}`);

const menuItems: SelectOption<string>[] = [
  { label: "Duplicate", value: "duplicate" },
  { label: "Move up", value: "up" },
  { label: "Move down", value: "down", disabled: true },
];

const sectionOpen = ref<string | undefined>("typography");
const dialogOpen = ref(false);
const confirmOpen = ref(false);
const popoverOpen = ref(false);
const sendMenuOpen = ref(false);

const sendOptions = [
  { icon: "mail", label: "Send to me" },
  { icon: "clock", label: "Schedule for later" },
  { icon: "eye", label: "Preview in inbox" },
] as const;

interface Campaign {
  id: number;
  name: string;
  status: "Sent" | "Draft" | "Bounced";
  opens: number;
}

const columns: TableColumn<Campaign>[] = [
  { key: "name", header: "Campaign" },
  { key: "status", header: "Status" },
  { key: "opens", header: "Opens", numeric: true },
];

const campaigns: Campaign[] = [
  { id: 1, name: "Spring trail kit", status: "Sent", opens: 4812 },
  { id: 2, name: "Winter clearance", status: "Draft", opens: 0 },
  { id: 3, name: "Restock: alpine liner", status: "Bounced", opens: 137 },
];

function onSearch() {
  toast.success(`Searching for “${search.value.trim()}”`);
}

const totalOpens = computed(() => campaigns.reduce((sum, c) => sum + c.opens, 0));

const recipients: AvatarItem[] = [
  { id: 1, name: "Maya Koenig" },
  { id: 2, name: "Ana Ruiz" },
  { id: 3, name: "Tomas Vale" },
  { id: 4, name: "Priya Raman" },
  { id: 5, name: "Nils Berg" },
];

const badgeClass = {
  Sent: "badge--sent",
  Draft: "badge--draft",
  Bounced: "badge--failed",
} as const;
</script>

<template>
  <div :class="$style.sheet">
    <header :class="$style.head">
      <div>
        <h1 :class="$style.title">Design system</h1>
        <p :class="$style.sub">
          Every component wired to the token layer. Build from these — no one-off CSS in feature
          code.
        </p>
      </div>
      <span class="mono">v0.1 · draft</span>
    </header>

    <section :class="$style.sec">
      <div :class="$style.aside">
        <span class="label label--ink">Buttons</span>
        <span class="hint">
          md 32px, sm 28px. Label 13/500, icons 14px. A leading or trailing icon pulls its side of
          the padding in so the shape reads optically centred.
        </span>
      </div>
      <div :class="$style.body">
        <div :class="$style.row">
          <UiButton variant="primary">
            <template #leading><UiIcon name="send" /></template>
            Send test
          </UiButton>
          <UiButton variant="solid">
            <template #leading><UiIcon name="code" /></template>
            Copy HTML
          </UiButton>
          <UiButton variant="secondary">
            Preview
            <template #trailing><UiIcon name="eye" /></template>
          </UiButton>
          <UiButton variant="ghost">Cancel</UiButton>
          <UiButton variant="danger">Delete block</UiButton>
          <UiButton variant="link">Learn more</UiButton>
          <UiButton variant="primary" disabled>Send test</UiButton>
          <UiButton variant="primary" loading>Sending</UiButton>
        </div>

        <div :class="$style.row">
          <UiButton variant="secondary" size="small">Manage</UiButton>
          <UiButton variant="secondary">Manage</UiButton>
          <UiButton variant="primary" size="large">Get started</UiButton>
        </div>

        <div :class="$style.row">
          <UiTooltip text="Edit block">
            <UiIconButton label="Edit block"><UiIcon name="pencil" /></UiIconButton>
          </UiTooltip>
          <UiIconButton label="Delete block" variant="secondary">
            <UiIcon name="trash" />
          </UiIconButton>
          <UiIconButton label="Dismiss" variant="ghost" size="small">
            <UiIcon name="x" />
          </UiIconButton>

          <!-- The toggle half owns the disclosure: the popover's trigger attrs go
               to it via `trigger-attrs`, which is also what rotates the caret. -->
          <UiPopover v-model:open="sendMenuOpen" label="Send options" align="end">
            <template #trigger="{ attrs }">
              <UiSplitButton
                menu-label="More send options"
                variant="primary"
                :trigger-attrs="attrs"
                @action="toast.success('Test email sent.')"
                @toggle="sendMenuOpen = !sendMenuOpen"
              >
                Send test
              </UiSplitButton>
            </template>

            <template #default="{ close }">
              <div data-part="popover-body">
                <button
                  v-for="option in sendOptions"
                  :key="option.label"
                  type="button"
                  data-part="menu-item"
                  @click="(close(), toast.success(option.label))"
                >
                  <UiIcon :name="option.icon" />
                  {{ option.label }}
                </button>
              </div>
            </template>
          </UiPopover>

          <UiSplitButton
            menu-label="More save options"
            variant="secondary"
            @action="toast.success('Draft saved.')"
          >
            Save draft
          </UiSplitButton>
        </div>

        <div :class="$style.row">
          <UiButton variant="secondary" full-width>Full width</UiButton>
        </div>
      </div>
    </section>

    <section :class="$style.sec">
      <div :class="$style.aside">
        <span class="label label--ink">Fields</span>
        <span class="hint">
          34px tall, hairline border. Focus is an accent border plus a soft ring — never an outline.
          Units and affixes sit inside the field, not beside it.
        </span>
      </div>
      <div :class="$style.body">
        <div :class="$style.grid">
          <UiInput v-model="heading" label="Heading" optional hint="Shown in the inbox preview." />
          <UiInput
            v-model="replyTo"
            label="Reply-to"
            type="email"
            error="Enter a valid email address."
          />
          <UiInput v-model.number="width" label="Width" prefix="max" suffix="px" />
          <UiInput v-model="heading" label="Small" size="small" placeholder="Compact field" />
          <UiSelect v-model="font" label="Font" :options="fonts" />
          <UiSelect
            v-model="blocks"
            label="Blocks"
            multiple
            :options="[
              { label: 'Text', value: 'text' },
              { label: 'Image', value: 'image' },
              { label: 'Button', value: 'button' },
            ]"
          />
          <UiSpinButton v-model="leading" label="Line height" :min="0" :max="200" />
          <UiInput label="Disabled" model-value="Locked" disabled />
        </div>

        <UiTextarea
          v-model="body"
          label="Body"
          :rows="3"
          :max-length="140"
          hint="Plain text, no markup."
        />

        <!-- A real <form> so Enter submits; the icon sits inside the field via the
             prefix slot, and both halves land on --control-sm so they align. -->
        <form :class="$style.searchForm" @submit.prevent="onSearch">
          <UiInput
            v-model="search"
            type="search"
            size="small"
            aria-label="Search templates"
            placeholder="Search templates"
          >
            <template #prefix><UiIcon name="search" /></template>
          </UiInput>

          <UiButton type="submit" size="small" variant="primary" :disabled="!search.trim()">
            Search
          </UiButton>
        </form>
      </div>
    </section>

    <section :class="$style.sec">
      <div :class="$style.aside">
        <span class="label label--ink">Selection</span>
        <span class="hint">
          Keyboard and screen-reader correct out of the box. Toggles apply immediately — never
          behind a confirm.
        </span>
      </div>
      <div :class="$style.body">
        <div :class="$style.row" style="gap: var(--space-11)">
          <div :class="$style.stack">
            <UiCheckbox v-model="unsubscribe" label="Include unsubscribe" />
            <UiCheckbox v-model="trackOpens" label="Track opens" />
            <UiCheckbox indeterminate label="Partially selected" />
            <UiCheckbox disabled label="Disabled" />
          </div>

          <UiRadioGroup v-model="align" label="Text alignment" :options="alignments" />

          <div :class="$style.stack">
            <UiSwitch v-model="inlineCss" label="Inline CSS on export" />
            <UiSwitch v-model="darkVariant" label="Dark mode variant" />
            <UiSwitch v-model="compact" size="small" label="Compact spacing" />
          </div>
        </div>

        <div :class="$style.row">
          <UiSegmented v-model="mode" label="Editor mode" :options="modes" />

          <UiSegmented v-model="device" label="Preview device" :options="devices" icon-only>
            <template #option="{ option }">
              <UiIcon :name="option.value as IconName" />
            </template>
          </UiSegmented>

          <UiSegmented v-model="mode" label="Editor mode, small" :options="modes" size="small" />
        </div>

        <UiTabs v-model="panelTab" label="Block settings" :items="panelTabs">
          <template #default="{ value }">
            <p class="hint">Panel content for the “{{ value }}” tab.</p>
          </template>
        </UiTabs>
      </div>
    </section>

    <section :class="$style.sec">
      <div :class="$style.aside">
        <span class="label label--ink">Overlays</span>
        <span class="hint">
          Menus, popovers and dialogs share one surface: hairline border, radius-md, shadow-3.
          Panels scale from their trigger; only the dialog scales from its centre.
        </span>
      </div>
      <div :class="$style.body">
        <div :class="$style.row">
          <UiMenu
            label="Block actions"
            :items="menuItems"
            @select="(value) => toast.success(`Menu: ${value}`)"
          />

          <UiPopover v-model:open="popoverOpen" label="Variables">
            <template #trigger="{ attrs }">
              <UiButton v-bind="attrs" variant="secondary" @click="popoverOpen = !popoverOpen">
                <template #leading><UiIcon name="braces" /></template>
                Variables
              </UiButton>
            </template>

            <div data-part="popover-header"><span>Variables</span></div>
            <div data-part="popover-body">
              <button v-for="v in variables" :key="v" data-part="menu-item" type="button">
                <span class="chip-var">{{ v }}</span>
              </button>
            </div>
            <div data-part="popover-footer">
              <span class="hint">Click a variable to insert at cursor</span>
            </div>
          </UiPopover>

          <UiButton variant="secondary" @click="dialogOpen = true">Open dialog</UiButton>
          <UiButton variant="danger" @click="confirmOpen = true">Delete block</UiButton>
          <UiButton variant="ghost" @click="toast.success('Draft saved.')">Success toast</UiButton>
          <UiButton variant="ghost" @click="toast.error('Could not send the test email.')">
            Error toast
          </UiButton>
        </div>
      </div>
    </section>

    <section :class="$style.sec">
      <div :class="$style.aside">
        <span class="label label--ink">Data</span>
        <span class="hint">
          Table headers use the caps label style; numeric columns align end with tabular figures.
          The accordion animates 0fr → 1fr so it never needs a measured height.
        </span>
      </div>
      <div :class="$style.body">
        <UiTable :columns="columns" :rows="campaigns" row-key="id" caption="Recent campaigns">
          <template #status-cell="{ value }">
            <span class="badge" :class="badgeClass[value as Campaign['status']]">
              <span class="badge__dot" />{{ value }}
            </span>
          </template>
          <template #opens-cell="{ value }">{{ (value as number).toLocaleString() }}</template>

          <template #footer>
            <UiTableRow>
              <UiTableCell>{{ campaigns.length }} campaigns</UiTableCell>
              <UiTableCell />
              <UiTableCell numeric>{{ totalOpens.toLocaleString() }}</UiTableCell>
            </UiTableRow>
          </template>
        </UiTable>

        <UiTable :columns="columns" :rows="[]" row-key="id">
          <template #empty>No campaigns yet. Create one to get started.</template>
        </UiTable>

        <UiAccordion v-model="sectionOpen">
          <UiAccordionItem value="typography" title="Typography">
            Family, size and leading for the selected block.
          </UiAccordionItem>
          <UiAccordionItem value="spacing" title="Spacing">
            Padding and margins, in the email's own units.
          </UiAccordionItem>
          <UiAccordionItem value="export" title="Export">
            Inlining, minification and the dark-mode variant.
          </UiAccordionItem>
        </UiAccordion>
      </div>
    </section>

    <section :class="$style.sec">
      <div :class="$style.aside">
        <span class="label label--ink">Status &amp; identity</span>
        <span class="hint">
          Amber is the only colour outside the neutral/accent pair, and it only ever means “not sent
          yet”. Avatars stack with a surface-coloured ring; past the cap the rest collapse into one
          counted chip.
        </span>
      </div>
      <div :class="$style.body">
        <div :class="$style.row">
          <span class="badge badge--draft"><span class="badge__dot" />Draft</span>
          <span class="badge badge--live"><span class="badge__dot" />Scheduled</span>
          <span class="badge badge--sent"><span class="badge__dot" />Sent</span>
          <span class="badge badge--failed"><span class="badge__dot" />Bounced</span>
          <span class="chip-var">{{ variables[0] }}</span>
        </div>

        <div :class="$style.row">
          <UiAvatar name="Maya Koenig" size="small" />
          <UiAvatar name="Maya Koenig" />
          <UiAvatar name="Maya Koenig" size="large" />

          <UiAvatarGroup :items="recipients.slice(0, 3)" />
          <UiAvatarGroup :items="recipients" :max="3" entity="more recipients" />
          <UiAvatarGroup :items="recipients" :max="3" size="large" entity="more recipients" />
        </div>
      </div>
    </section>

    <section :class="$style.sec">
      <div :class="$style.aside">
        <span class="label label--ink">Surfaces</span>
        <span class="hint">
          Four surfaces total: panel (docked), card (email), toolbar (floating), popover (anchored).
          Nothing else gets a shadow.
        </span>
      </div>
      <div :class="$style.body">
        <div class="stage" :class="$style.stage">
          <div :class="$style.specimen">
            <div class="toolbar">
              <UiTooltip v-for="t in tools" :key="t.icon" :text="t.label">
                <UiIconButton
                  :label="t.label"
                  shape="round"
                  :aria-pressed="tool === t.icon"
                  @click="tool = t.icon"
                >
                  <UiIcon :name="t.icon" />
                </UiIconButton>
              </UiTooltip>

              <span class="toolbar__sep" />

              <UiTooltip text="All blocks">
                <UiIconButton label="All blocks" shape="round">
                  <UiIcon name="layout-grid" />
                </UiIconButton>
              </UiTooltip>
              <UiTooltip text="Variables">
                <UiIconButton label="Variables" shape="round">
                  <UiIcon name="braces" />
                </UiIconButton>
              </UiTooltip>
            </div>
            <span class="mono">.toolbar</span>
          </div>

          <div :class="$style.specimen">
            <div class="panel" :class="$style.panelDemo">
              <div class="panel__section">
                <span class="label">Typography</span>
                <UiSelect v-model="font" :options="fonts" />
                <div :class="$style.pair">
                  <UiSpinButton v-model="leading" label="Size" :min="8" :max="96" />
                  <UiSpinButton v-model="leading" label="Leading" :min="8" :max="120" />
                </div>
              </div>
            </div>
            <span class="mono">.panel / .panel__section</span>
          </div>

          <div :class="$style.specimen">
            <div class="card" :class="$style.cardDemo">
              <div :class="$style.cardBar">NORTHBOUND</div>
              <div :class="$style.cardBody">
                <div :class="$style.cardHeading">The trail kit, rebuilt for spring</div>
                <p :class="$style.cardCopy">
                  Lighter frames, warmer liners, and a pack that finally sits where it should.
                </p>
              </div>
            </div>
            <span class="mono">.card</span>
          </div>

          <div :class="$style.specimen">
            <div class="card" :class="$style.rowsDemo">
              <button
                v-for="(v, i) in variables"
                :key="v"
                type="button"
                class="list-row"
                :aria-current="i === 0 || undefined"
              >
                <span class="chip-var">{{ v }}</span>
                <span class="list-row__value">{{ ["Ava", "#48219", "northbound.co"][i] }}</span>
              </button>
            </div>
            <span class="mono">.list-row</span>
          </div>
        </div>
      </div>
    </section>

    <UiDialog
      v-model:open="dialogOpen"
      title="Send a test email"
      description="We'll send the current draft to a single address."
    >
      <UiInput label="Send to" type="email" placeholder="you@example.com" />

      <template #footer="{ close }">
        <UiButton variant="ghost" @click="close">Cancel</UiButton>
        <UiButton variant="primary" @click="close">Send test</UiButton>
      </template>
    </UiDialog>

    <UiDialogConfirm
      v-model:open="confirmOpen"
      title="Delete this block?"
      description="Deleted blocks can't be restored once the draft is saved."
      confirm-text="Delete block"
      danger
      @confirm="toast.error('Block deleted.')"
    />

    <UiToast>
      <template #close-icon><UiIcon name="x" /></template>
    </UiToast>
  </div>
</template>

<style module>
.sheet {
  display: flex;
  flex-direction: column;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-10);
  padding-block: var(--space-9);
  border-block-end: 1px solid var(--color-hairline);
}

.title {
  font-family: var(--font-display);
  font-size: clamp(28px, 5vw, 44px);
  line-height: 1.1;
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-display);
}

.sub {
  max-width: 52ch;
  margin-block-start: var(--space-4);
  color: var(--color-muted);
}

.sec {
  display: flex;
  gap: var(--space-11);
  padding-block: var(--space-10);
  border-block-end: 1px solid var(--color-hairline);
}

.aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: none;
  width: 200px;
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--space-9);
  flex: 1;
  min-width: 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-7);
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-7);
  align-items: start;
}

.searchForm {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  max-width: 360px;
}

/* The field is a flex column that would otherwise size to its content. */
.searchForm > :global([data-part="field"]) {
  flex: 1;
}

.stage {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-10);
}

.specimen {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.pair {
  display: flex;
  gap: var(--space-4);
}

/* Docked panels have no border of their own on the open edge; boxed here so the
   specimen reads as an object rather than a slice of the layout. */
.panelDemo {
  width: 280px;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.cardDemo,
.rowsDemo {
  width: 280px;
}

.cardBar {
  padding: var(--space-7) var(--space-8);
  border-block-end: 1px solid var(--color-hairline);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.08em;
}

.cardBody {
  padding: var(--space-8);
}

.cardHeading {
  font-family: var(--font-display);
  font-size: 24px;
  line-height: 30px;
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-display);
}

.cardCopy {
  margin-block-start: var(--space-4);
  font-size: var(--text-xs);
  line-height: 18px;
  color: var(--color-muted);
}

.rowsDemo {
  padding: var(--space-2);
}

@media (max-width: 900px) {
  .sec,
  .head {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-7);
  }

  .aside {
    width: auto;
  }
}
</style>

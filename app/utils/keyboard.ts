export interface KeyCap {
  glyph: string;
  label: string;
}

interface KeyDefinition extends KeyCap {
  pc?: { glyph: string; label?: string };
}

const KEYS: Record<string, KeyDefinition> = {
  mod: { glyph: "⌘", label: "Command", pc: { glyph: "Ctrl", label: "Control" } },
  cmd: { glyph: "⌘", label: "Command", pc: { glyph: "Ctrl", label: "Control" } },
  ctrl: { glyph: "⌃", label: "Control", pc: { glyph: "Ctrl" } },
  alt: { glyph: "⌥", label: "Option", pc: { glyph: "Alt", label: "Alt" } },
  shift: { glyph: "⇧", label: "Shift", pc: { glyph: "Shift" } },
  enter: { glyph: "↵", label: "Enter", pc: { glyph: "Enter" } },
  backspace: { glyph: "⌫", label: "Backspace", pc: { glyph: "Backspace" } },
  tab: { glyph: "⇥", label: "Tab", pc: { glyph: "Tab" } },
  esc: { glyph: "Esc", label: "Escape" },
  space: { glyph: "Space", label: "Space" },
  up: { glyph: "↑", label: "Up arrow" },
  down: { glyph: "↓", label: "Down arrow" },
  left: { glyph: "←", label: "Left arrow" },
  right: { glyph: "→", label: "Right arrow" },
};

export function parseChord(chord: string, isApple: boolean): KeyCap[] {
  return chord
    .split(/[+\s]+/)
    .filter(Boolean)
    .map((token) => {
      const key = KEYS[token.toLowerCase()];
      if (!key) {
        const glyph = token.length === 1 ? token.toUpperCase() : token;
        return { glyph, label: glyph };
      }
      if (isApple || !key.pc) return { glyph: key.glyph, label: key.label };
      return { glyph: key.pc.glyph, label: key.pc.label ?? key.label };
    });
}

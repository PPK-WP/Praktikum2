import type {
  DefaultFilterPreference,
  ThemePreference,
  UserPreference,
} from "@/types/shared";

export const PREFERENCE_COOKIE = "et_preference";
export const PREFERENCE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const DEFAULT_PREFERENCE: UserPreference = {
  theme: "light",
  defaultFilter: "all",
};

const THEMES: readonly ThemePreference[] = ["light", "dark"];
const FILTERS: readonly DefaultFilterPreference[] = ["all", "income", "expense"];

function isTheme(value: unknown): value is ThemePreference {
  return THEMES.includes(value as ThemePreference);
}

function isFilter(value: unknown): value is DefaultFilterPreference {
  return FILTERS.includes(value as DefaultFilterPreference);
}

/** Reads a cookie value, falling back to defaults for anything missing or malformed. */
export function parsePreference(value: string | undefined): UserPreference {
  if (!value) {
    return DEFAULT_PREFERENCE;
  }
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return {
      theme: isTheme(parsed.theme) ? parsed.theme : DEFAULT_PREFERENCE.theme,
      defaultFilter: isFilter(parsed.defaultFilter)
        ? parsed.defaultFilter
        : DEFAULT_PREFERENCE.defaultFilter,
    };
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

/** Validates a PATCH body. Returns null when a provided field has an invalid value. */
export function parsePreferencePatch(body: unknown): Partial<UserPreference> | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { theme, defaultFilter } = body as Record<string, unknown>;
  const patch: Partial<UserPreference> = {};

  if (theme !== undefined) {
    if (!isTheme(theme)) return null;
    patch.theme = theme;
  }
  if (defaultFilter !== undefined) {
    if (!isFilter(defaultFilter)) return null;
    patch.defaultFilter = defaultFilter;
  }
  return patch;
}

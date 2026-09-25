export interface PreferenceState {
  theme: "light" | "dark";
  defaultFilter: "all" | "income" | "expense";
}

const defaultPreference: PreferenceState = {
  theme: "light",
  defaultFilter: "all",
};

export async function getPreference(): Promise<PreferenceState> {
  return defaultPreference;
}

export async function savePreference(preference: PreferenceState): Promise<PreferenceState> {
  return preference;
}

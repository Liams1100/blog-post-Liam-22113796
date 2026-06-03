"use client";

import { SearchInput } from "../Menu/SearchInput";
import ThemeSwitch from "../Themes/ThemeSwitcher";

export function TopMenu({ query }: { query?: string }) {

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <SearchInput query={query} />
      <div className="flex items-center gap-x-6">
        <ThemeSwitch />
      </div>
    </div>
  );
}

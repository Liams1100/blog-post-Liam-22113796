"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      className="rounded border border-border bg-surface px-3 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;

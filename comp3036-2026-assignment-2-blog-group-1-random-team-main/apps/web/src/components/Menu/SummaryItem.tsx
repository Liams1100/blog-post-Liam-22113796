import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li>
      <Link
        href={link}
        title={title}
        className={`group flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface ${
          isSelected
            ? "selected border-accentSurface bg-accentSurface text-accentForeground"
            : "border-border bg-background text-primary hover:bg-surface hover:text-accentHover"
        }`}
      >
        <span className="font-medium">{name}</span>
        <span
          data-test-id="post-count"
          className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
            isSelected
              ? "bg-background text-primary"
              : "bg-surface text-secondary group-hover:text-primary"
          }`}
        >
          ({count}) 
        </span>
      </Link>
    </li>
  );
}

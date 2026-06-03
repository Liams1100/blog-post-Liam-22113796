import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";

export function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  return (
    <>
      {historyItems.map((item) => {
        const isSelected = selectedYear === item.year.toString() && selectedMonth === item.month.toString();
        const monthName = new Date(item.year, item.month - 1).toLocaleString('default', { month: 'long' });

        return (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            name={`${monthName}, ${item.year}`}
            count={item.count}
            isSelected={isSelected}
            link={`/history/${item.year}/${item.month}`}
            title={`History / ${monthName}, ${item.year}`}
          />
        );
      })}
    </>
  );
}

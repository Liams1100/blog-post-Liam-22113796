export function history(posts: { date: Date; active: boolean }[]): { month: number; year: number; count: number }[] {
  // Get unique month/year combinations from active posts, sorted by most recent first
  const historyMap = posts
    .filter((p) => p.active)
    .reduce((acc, post) => {
      const year = post.date.getFullYear();
      const month = post.date.getMonth() + 1; // getMonth() returns 0-11
      const key = `${year}-${month}`;

      if (acc[key]) {
        acc[key].count++;
      } else {
        acc[key] = { month, year, count: 1 };
      }

      return acc;
    }, {} as Record<string, { month: number; year: number; count: number }>);

  // 
  return Object.values(historyMap)
    .sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year; //
      }
      return b.month - a.month; // Most recent month first
    });
}

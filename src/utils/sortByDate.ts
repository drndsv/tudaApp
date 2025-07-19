export function sortByDate<T extends { date?: string | Date }>(
  array: T[]
): T[] {
  return [...array].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  });
}

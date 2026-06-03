import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

export function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = tags(posts);

  return (
    <>
      {postTags.map((item) => {
        const slug = toUrlPath(item.name);
        const isSelected = selectedTag
          ? toUrlPath(selectedTag) === slug
          : false;

        return (
          <SummaryItem
            key={item.name}
            name={item.name}
            count={item.count}
            isSelected={isSelected}
            link={`/tags/${slug}`}
            title={`Tag / ${item.name}`}
          />
        );
      })}
    </>
  );
}

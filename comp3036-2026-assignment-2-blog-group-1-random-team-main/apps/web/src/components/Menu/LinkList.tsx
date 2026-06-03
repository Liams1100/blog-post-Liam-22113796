import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{props.title}</h3>
      <ul>{props.children}</ul>
    </div>
  );
}
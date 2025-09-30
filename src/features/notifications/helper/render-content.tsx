import { JSX } from "react";
import Text from "@/components/atoms/text";

export function renderContent(template: string, values: Record<string, string | JSX.Element>) {
  const regex = /\{(\w+)\}/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push(template.slice(lastIndex, match.index));
    }
    parts.push(values[match[1]]);
    lastIndex = match.index + match[0].length;
    // console.log(match);
  }

  if (lastIndex < template.length) {
    parts.push(template.slice(lastIndex));
  }

  return <>{parts.map((part) => part)}</>;
}

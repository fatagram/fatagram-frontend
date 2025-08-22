import Text from "@/components/common/ui/Text";
import { JSX } from "react";

export const renderContent = (template: string, values: Record<string, string | JSX.Element>) => {
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
        console.log(match);
    }
    
    if (lastIndex < template.length) {
        parts.push(template.slice(lastIndex));
    }

    return (
        <Text>
            {parts.map((part, index) => {
                return part;
            })}
        </Text>
    )
}
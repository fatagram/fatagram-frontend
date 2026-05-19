export const isOnlyEmoji = (text?: string): boolean => {
  if (!text) return false;
  const trimmed = text.trim();

  try {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const segments = [...segmenter.segment(trimmed)];

    if (segments.length === 0 || segments.length > 7) return false;

    return segments.every((seg) => {
      const grapheme = seg.segment;
      const hasEmoji = /[\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Component}]/u.test(
        grapheme,
      );
      const hasNormalText = /[\p{Alphabetic}\p{Decimal_Number}]/u.test(grapheme);
      return hasEmoji && !hasNormalText;
    });
  } catch (e) {
    const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F){1,7}$/u;
    return emojiRegex.test(trimmed);
  }
};

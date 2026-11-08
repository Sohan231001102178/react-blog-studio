import { useMemo } from 'react';

/**
 * Custom hook to calculate word count and enforce the 1,000-word constraint.
 * Tokenizes text by normalizing whitespace:
 * text.trim().split(/\s+/).filter(Boolean).length
 * 
 * @param {string} text - The content body input
 * @param {number} maxWords - Maximum word threshold (default 1000)
 * @returns {Object} { wordCount, isOverLimit, excessWords, percentage, remainingWords }
 */
export function useWordCount(text = '', maxWords = 1000) {
  return useMemo(() => {
    if (!text || typeof text !== 'string') {
      return {
        wordCount: 0,
        isOverLimit: false,
        excessWords: 0,
        percentage: 0,
        remainingWords: maxWords,
        isValid: true
      };
    }

    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const count = words.length;
    const isOver = count > maxWords;
    const excess = isOver ? count - maxWords : 0;
    const remaining = isOver ? 0 : maxWords - count;
    const percentage = Math.min(100, Math.round((count / maxWords) * 100));

    return {
      wordCount: count,
      isOverLimit: isOver,
      excessWords: excess,
      percentage,
      remainingWords: remaining,
      isValid: !isOver && count > 0
    };
  }, [text, maxWords]);
}

export default useWordCount;

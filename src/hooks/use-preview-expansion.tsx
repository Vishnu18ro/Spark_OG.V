import { useState } from "react";

export function usePreviewExpansion<T>(items: T[], limit: number = 6) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const displayedItems = isExpanded ? items : items.slice(0, limit);
  const showToggle = items.length > limit;
  const hiddenCount = items.length - limit;
  
  const toggleExpansion = () => setIsExpanded(!isExpanded);
  
  return {
    displayedItems,
    showToggle,
    isExpanded,
    toggleExpansion,
    hiddenCount,
  };
}

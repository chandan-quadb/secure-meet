// Convert ISO -> local date + time
export const formatDateTime = (isoOrLocalString) => {
  if (!isoOrLocalString) return "-";

  // If string looks like "YYYY-MM-DDTHH:mm" (no timezone), treat as local:
  const isBareLocal = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(isoOrLocalString);

  const d = isBareLocal
    ? new Date(isoOrLocalString)           // parsed as local
    : new Date(isoOrLocalString);         // ISO with Z or offset -> parsed correctly

  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};


// Calculate duration in minutes
export const calcDuration = (start, end) => {
  if (!start || !end) return "-";

  const parseDate = (s) => {
    // same logic as above: if bare local, parse as local; else Date handles ISO/offset/Z
    const isBareLocal = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s);
    return isBareLocal ? new Date(s) : new Date(s);
  };

  const s = parseDate(start);
  const e = parseDate(end);
  if (isNaN(s) || isNaN(e)) return "-";

  const diffMin = Math.round((e - s) / (1000 * 60));
  return diffMin >= 0 ? `${diffMin} min` : "-";
};

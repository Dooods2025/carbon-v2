import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type ReportRecord = { id: string; source_file?: string | null };
type ReportData = { reportHtml?: string | null; [key: string]: unknown };
type UserReportRow = { emissions_data_id?: string | null; filename?: string | null; report_data?: ReportData | null };

/**
 * Loads the saved leadership reports (full HTML from the calculator) for a user,
 * keyed by emissions record id and by filename (older reports).
 */
export function useLeadershipReports(userId?: string) {
  const [reports, setReports] = useState<Record<string, ReportData | null | undefined>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("user_reports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("Error fetching user_reports:", error);
      } else if (data) {
        // Newest first, so the latest report wins for each key
        const map: Record<string, ReportData | null | undefined> = {};
        (data as UserReportRow[]).forEach((r) => {
          if (r.emissions_data_id && !map[`id:${r.emissions_data_id}`]) map[`id:${r.emissions_data_id}`] = r.report_data;
          if (r.filename && !map[r.filename]) map[r.filename] = r.report_data;
        });
        setReports(map);
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const getReportHtml = useCallback(
    (record?: ReportRecord | null): string | null => {
      if (!record) return null;
      const data = reports[`id:${record.id}`] ?? (record.source_file ? reports[record.source_file] : null);
      return data?.reportHtml ?? null;
    },
    [reports]
  );

  return { getReportHtml, loaded };
}

/**
 * Opens a leadership report in a new tab. With print = true the print dialog opens
 * once the logo has loaded (choose "Save as PDF" to download it).
 * Must be called directly from a click so the browser allows the new tab.
 */
export function openLeadershipReport(html: string, print = false): boolean {
  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  win.focus();
  if (print) {
    const started = Date.now();
    const printWhenReady = () => {
      const images = Array.from(win.document.images);
      if (images.every((img) => img.complete) || Date.now() - started > 4000) win.print();
      else setTimeout(printWhenReady, 200);
    };
    setTimeout(printWhenReady, 300);
  }
  return true;
}

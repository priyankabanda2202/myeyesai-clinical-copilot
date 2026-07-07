"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAuditTrail, fetchDailyBrief, fetchPatients, DailyBrief, Patient, AuditEntry } from "@/lib/api";

export function useLiveData(intervalMs = 5000) {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activity, setActivity] = useState<AuditEntry[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [b, p, a] = await Promise.all([
        fetchDailyBrief(),
        fetchPatients(),
        fetchAuditTrail(),
      ]);
      setBrief(b);
      setPatients(p);
      setActivity(a.slice(0, 8));
      setLastSync(new Date());
      setConnected(true);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);

  return { brief, patients, activity, lastSync, connected, loading, refresh };
}

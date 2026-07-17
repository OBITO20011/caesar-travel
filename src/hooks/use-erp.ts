import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

type ErpRow = Record<string, unknown>;

type ErpListOptions = {
  limit?: number;
};

export function useErpList(table: string, options: ErpListOptions = {}) {
  const { limit = 10 } = options;

  return useQuery({
    queryKey: ["erp-list", table, limit],
    queryFn: async () => {
      let query = supabase.from(table).select("*");

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Failed to load ERP table "${table}"`, error);
        return { data: [] as ErpRow[] };
      }

      return { data: (data ?? []) as ErpRow[] };
    },
    staleTime: 60_000,
    retry: false,
  });
}

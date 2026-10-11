import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlayerCard } from "@/components/player-card";
import { Field } from "@/components/field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listWatchlist, updateWatchItem } from "@/lib/server/scout";
import { SHORTLIST_STATUSES } from "@/lib/football";
import { useI18n } from "@/lib/i18n";
import type { ShortlistStatus } from "@/lib/types";

export const Route = createFileRoute("/app/shortlist")({ component: ShortlistPage });

function ShortlistPage() {
  const { t, locale } = useI18n();
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["watch"], queryFn: () => listWatchlist() });
  const update = useMutation({
    mutationFn: (input: { id: number; notes?: string; status?: ShortlistStatus }) =>
      updateWatchItem({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watch"] }),
  });

  if (list.data && list.data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">{t("scout.emptyList")}</p>
        <Link to="/discover" className="mt-4 inline-block text-sm text-primary">
          {t("nav.discover")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <h1 className="font-display text-3xl">{t("nav.shortlist")}</h1>
      <div className="grid gap-6">
        {list.data?.map((item) => (
          <div key={item.id} className="grid gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-[220px_1fr]">
            <PlayerCard player={item.player} />
            <div className="grid gap-3">
              <Field label={t("dash.status")}>
                <Select
                  value={item.status}
                  onChange={(e) =>
                    update.mutate({ id: item.id, status: e.target.value as ShortlistStatus })
                  }
                >
                  {SHORTLIST_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s[locale]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={t("scout.notes")}>
                <Textarea
                  defaultValue={item.notes ?? ""}
                  onBlur={(e) => update.mutate({ id: item.id, notes: e.target.value })}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

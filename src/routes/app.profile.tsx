import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { COUNTRIES, FEET, LEVELS, POSITIONS, VIDEO_CATEGORIES } from "@/lib/football";
import { useI18n } from "@/lib/i18n";
import { getMyProfile, saveMyProfile, submitMyProfile, type ProfilePayload } from "@/lib/server/player";
import { getAccess, submitYouthVerification } from "@/lib/server/billing";
import type { ClubStint } from "@/lib/types";

export const Route = createFileRoute("/app/profile")({ component: ProfileEditor });

type VideoDraft = { youtubeUrl: string; title: string; category: string };

function ProfileEditor() {
  const { t, locale } = useI18n();
  const qc = useQueryClient();
  const mine = useQuery({ queryKey: ["my-profile"], queryFn: () => getMyProfile() });
  const access = useQuery({ queryKey: ["access"], queryFn: () => getAccess() });
  const [idDoc, setIdDoc] = useState("");
  const [selfie, setSelfie] = useState("");
  const [youthVideo, setYouthVideo] = useState("");
  const youth = useMutation({
    mutationFn: () =>
      submitYouthVerification({ data: { idDocUrl: idDoc, selfieUrl: selfie, videoUrl: youthVideo || null } }),
    onSuccess: () => {
      toast.success(t("youth.send"));
      void qc.invalidateQueries({ queryKey: ["access"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const [form, setForm] = useState<ProfilePayload | null>(null);
  const [history, setHistory] = useState<ClubStint[]>([]);
  const [videos, setVideos] = useState<VideoDraft[]>([]);

  useEffect(() => {
    const p = mine.data;
    if (!p) return;
    setForm({
      firstName: p.firstName,
      lastName: p.lastName,
      dob: p.dob,
      nationality: p.nationality,
      country: p.country,
      city: p.city,
      heightCm: p.heightCm,
      weightKg: p.weightKg,
      preferredFoot: p.preferredFoot,
      primaryPosition: p.primaryPosition,
      secondaryPositions: p.secondaryPositions,
      jerseyNumber: p.jerseyNumber,
      currentClub: p.currentClub,
      playingLevel: p.playingLevel,
      achievements: p.achievements,
      injuryStatus: p.injuryStatus,
      languages: p.languages,
      education: p.education,
      bio: p.bio,
      instagram: p.instagram,
      photoUrl: p.photoUrl,
      fullBodyUrl: p.fullBodyUrl,
    });
    setHistory(p.clubHistory);
    setVideos(
      p.videos.map((v) => ({
        youtubeUrl: v.youtubeUrl,
        title: v.title ?? "",
        category: v.category ?? "other",
      })),
    );
  }, [mine.data]);

  const save = useMutation({
    mutationFn: () =>
      saveMyProfile({
        data: { ...form!, clubHistory: history, videos },
      }),
    onSuccess: () => {
      toast.success(t("profileForm.saved"));
      void qc.invalidateQueries({ queryKey: ["my-profile"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const submit = useMutation({
    mutationFn: async () => {
      await saveMyProfile({ data: { ...form!, clubHistory: history, videos } });
      await submitMyProfile();
    },
    onSuccess: () => {
      toast.success(t("profileForm.submitted"));
      void qc.invalidateQueries({ queryKey: ["my-profile"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!form) return null;
  const locked = mine.data?.status === "pending";
  const set = (k: keyof ProfilePayload, v: unknown) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">{t("profileForm.title")}</h1>
          {mine.data && <Badge className="mt-2">{t(`status.${mine.data.status}`)}</Badge>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={locked || save.isPending} onClick={() => save.mutate()}>
            {t("profileForm.save")}
          </Button>
          <Button disabled={locked || submit.isPending} onClick={() => submit.mutate()}>
            {t("profileForm.submit")}
          </Button>
        </div>
      </div>
      {locked && <p className="text-sm text-muted-foreground">{t("profileForm.locked")}</p>}
      {mine.data?.reviewNote && (
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
          {t("profileForm.revision")}: {mine.data.reviewNote}
        </p>
      )}
      {access.data && !access.data.canPublish && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-2xl">{t("youth.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("youth.body")}</p>
          {access.data.publishBlock === "youth" && access.data.youthStatus !== "pending" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label={t("youth.id")}>
                <Input value={idDoc} onChange={(e) => setIdDoc(e.target.value)} />
              </Field>
              <Field label={t("youth.selfie")}>
                <Input value={selfie} onChange={(e) => setSelfie(e.target.value)} />
              </Field>
              <Field label={t("youth.video")} className="sm:col-span-2">
                <Input value={youthVideo} onChange={(e) => setYouthVideo(e.target.value)} />
              </Field>
              <Button disabled={youth.isPending} onClick={() => youth.mutate()}>
                {t("youth.send")}
              </Button>
            </div>
          )}
          {access.data.youthStatus === "pending" && (
            <p className="mt-3 text-sm text-muted-foreground">{t("youth.pending")}</p>
          )}
          {access.data.youthStatus === "approved" && <p className="mt-3 text-sm">{t("youth.approved")}</p>}
          {access.data.youthStatus === "rejected" && (
            <p className="mt-3 text-sm text-destructive">{t("youth.rejected")}</p>
          )}
          {(access.data.publishBlock === "pay_u24" || access.data.publishBlock === "pay_senior") && (
            <Button asChild className="mt-4">
              <Link
                to="/app/wallet"
                search={{ plan: access.data.neededPlan === "player_senior" ? "player_senior" : "player_u24" }}
              >
                {t("plans.ctaPay")}
              </Link>
            </Button>
          )}
        </div>
      )}

      <fieldset disabled={locked} className="grid gap-8">
        <section className="grid gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">{t("profileForm.basic")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("profileForm.first")}>
              <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </Field>
            <Field label={t("profileForm.last")}>
              <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </Field>
            <Field label={t("profileForm.dob")}>
              <Input type="date" value={form.dob ?? ""} onChange={(e) => set("dob", e.target.value)} />
            </Field>
            <Field label={t("discover.country")}>
              <Select value={form.country ?? ""} onChange={(e) => set("country", e.target.value || null)}>
                <option value="">{t("discover.any")}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c[locale]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("profileForm.city")}>
              <Input value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label={t("profileForm.nationality")}>
              <Select value={form.nationality ?? ""} onChange={(e) => set("nationality", e.target.value || null)}>
                <option value="">{t("discover.any")}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c[locale]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">{t("profileForm.sport")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("discover.position")}>
              <Select
                value={form.primaryPosition ?? ""}
                onChange={(e) => set("primaryPosition", e.target.value || null)}
              >
                <option value="">{t("discover.any")}</option>
                {POSITIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c[locale]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("profileForm.secondary")}>
              <Input
                value={form.secondaryPositions ?? ""}
                onChange={(e) => set("secondaryPositions", e.target.value)}
              />
            </Field>
            <Field label={t("profileForm.height")}>
              <Input
                inputMode="numeric"
                value={form.heightCm ?? ""}
                onChange={(e) => set("heightCm", e.target.value ? Number(e.target.value) : null)}
              />
            </Field>
            <Field label={t("profileForm.weight")}>
              <Input
                inputMode="numeric"
                value={form.weightKg ?? ""}
                onChange={(e) => set("weightKg", e.target.value ? Number(e.target.value) : null)}
              />
            </Field>
            <Field label={t("discover.foot")}>
              <Select
                value={form.preferredFoot ?? ""}
                onChange={(e) => set("preferredFoot", (e.target.value || null) as ProfilePayload["preferredFoot"])}
              >
                <option value="">{t("discover.any")}</option>
                {FEET.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c[locale]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("discover.level")}>
              <Select
                value={form.playingLevel ?? ""}
                onChange={(e) => set("playingLevel", (e.target.value || null) as ProfilePayload["playingLevel"])}
              >
                <option value="">{t("discover.any")}</option>
                {LEVELS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c[locale]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("profileForm.club")}>
              <Input value={form.currentClub ?? ""} onChange={(e) => set("currentClub", e.target.value)} />
            </Field>
            <Field label={t("profileForm.jersey")}>
              <Input
                inputMode="numeric"
                value={form.jerseyNumber ?? ""}
                onChange={(e) => set("jerseyNumber", e.target.value ? Number(e.target.value) : null)}
              />
            </Field>
            <Field label={t("profileForm.achievements")}>
              <Input value={form.achievements ?? ""} onChange={(e) => set("achievements", e.target.value)} />
            </Field>
            <Field label={t("profileForm.injury")}>
              <Input value={form.injuryStatus ?? ""} onChange={(e) => set("injuryStatus", e.target.value)} />
            </Field>
          </div>
          <div>
            <p className="mb-2 text-xs text-muted-foreground">{t("player.career")}</p>
            {history.map((h, i) => (
              <div key={i} className="mb-2 grid grid-cols-[1fr_80px_80px] gap-2">
                <Input
                  value={h.club}
                  onChange={(e) =>
                    setHistory((rows) => rows.map((r, j) => (j === i ? { ...r, club: e.target.value } : r)))
                  }
                />
                <Input
                  inputMode="numeric"
                  value={h.from}
                  onChange={(e) =>
                    setHistory((rows) =>
                      rows.map((r, j) => (j === i ? { ...r, from: Number(e.target.value) } : r)),
                    )
                  }
                />
                <Input
                  inputMode="numeric"
                  value={h.to ?? ""}
                  onChange={(e) =>
                    setHistory((rows) =>
                      rows.map((r, j) => (j === i ? { ...r, to: e.target.value ? Number(e.target.value) : null } : r)),
                    )
                  }
                />
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setHistory((h) => [...h, { club: "", from: 2024, to: null }])}
            >
              +
            </Button>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">{t("profileForm.extra")}</h2>
          <Field label={t("profileForm.bio")}>
            <Textarea value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("profileForm.languages")}>
              <Input value={form.languages ?? ""} onChange={(e) => set("languages", e.target.value)} />
            </Field>
            <Field label={t("profileForm.education")}>
              <Input value={form.education ?? ""} onChange={(e) => set("education", e.target.value)} />
            </Field>
            <Field label={t("profileForm.instagram")}>
              <Input value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} />
            </Field>
            <Field label={t("profileForm.photo")}>
              <Input value={form.photoUrl ?? ""} onChange={(e) => set("photoUrl", e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">{t("profileForm.media")}</h2>
          {videos.map((v, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-3">
              <Field label={t("profileForm.videoUrl")}>
                <Input
                  value={v.youtubeUrl}
                  onChange={(e) =>
                    setVideos((rows) => rows.map((r, j) => (j === i ? { ...r, youtubeUrl: e.target.value } : r)))
                  }
                />
              </Field>
              <Field label={t("profileForm.videoTitle")}>
                <Input
                  value={v.title}
                  onChange={(e) =>
                    setVideos((rows) => rows.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)))
                  }
                />
              </Field>
              <Field label={t("discover.any")}>
                <Select
                  value={v.category}
                  onChange={(e) =>
                    setVideos((rows) => rows.map((r, j) => (j === i ? { ...r, category: e.target.value } : r)))
                  }
                >
                  {VIDEO_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c[locale]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setVideos((v) => [...v, { youtubeUrl: "", title: "", category: "other" }])}
          >
            {t("profileForm.addVideo")}
          </Button>
        </section>
      </fieldset>
    </div>
  );
}

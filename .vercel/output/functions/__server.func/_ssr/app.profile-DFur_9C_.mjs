import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as getAccess, s as submitYouthVerification } from "./billing-CF5MKqf_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
import { t as Textarea } from "./textarea-BvR3MxFv.mjs";
import { a as POSITIONS, c as VIDEO_CATEGORIES, n as FEET, r as LEVELS, t as COUNTRIES } from "./football-Bg2Gurrr.mjs";
import { t as Badge } from "./badge-C3cEAyiX.mjs";
import { i as submitMyProfile, r as saveMyProfile, t as getMyProfile } from "./player-BTTs285P.mjs";
import { t as Field } from "./field-DL4pxiur.mjs";
import { t as Input } from "./input-CTJ5Pcod.mjs";
import { t as Select } from "./select-Clmy6nRx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.profile-DFur_9C_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfileEditor() {
	const { t, locale } = useI18n();
	const qc = useQueryClient();
	const mine = useQuery({
		queryKey: ["my-profile"],
		queryFn: () => getMyProfile()
	});
	const access = useQuery({
		queryKey: ["access"],
		queryFn: () => getAccess()
	});
	const [idDoc, setIdDoc] = (0, import_react.useState)("");
	const [selfie, setSelfie] = (0, import_react.useState)("");
	const [youthVideo, setYouthVideo] = (0, import_react.useState)("");
	const youth = useMutation({
		mutationFn: () => submitYouthVerification({ data: {
			idDocUrl: idDoc,
			selfieUrl: selfie,
			videoUrl: youthVideo || null
		} }),
		onSuccess: () => {
			toast.success(t("youth.send"));
			qc.invalidateQueries({ queryKey: ["access"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const [form, setForm] = (0, import_react.useState)(null);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [videos, setVideos] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
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
			fullBodyUrl: p.fullBodyUrl
		});
		setHistory(p.clubHistory);
		setVideos(p.videos.map((v) => ({
			youtubeUrl: v.youtubeUrl,
			title: v.title ?? "",
			category: v.category ?? "other"
		})));
	}, [mine.data]);
	const save = useMutation({
		mutationFn: () => saveMyProfile({ data: {
			...form,
			clubHistory: history,
			videos
		} }),
		onSuccess: () => {
			toast.success(t("profileForm.saved"));
			qc.invalidateQueries({ queryKey: ["my-profile"] });
			qc.invalidateQueries({ queryKey: ["me"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const submit = useMutation({
		mutationFn: async () => {
			await saveMyProfile({ data: {
				...form,
				clubHistory: history,
				videos
			} });
			await submitMyProfile();
		},
		onSuccess: () => {
			toast.success(t("profileForm.submitted"));
			qc.invalidateQueries({ queryKey: ["my-profile"] });
			qc.invalidateQueries({ queryKey: ["me"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!form) return null;
	const locked = mine.data?.status === "pending";
	const set = (k, v) => setForm((f) => f ? {
		...f,
		[k]: v
	} : f);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: t("profileForm.title")
				}), mine.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "mt-2",
					children: t(`status.${mine.data.status}`)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: locked || save.isPending,
						onClick: () => save.mutate(),
						children: t("profileForm.save")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: locked || submit.isPending,
						onClick: () => submit.mutate(),
						children: t("profileForm.submit")
					})]
				})]
			}),
			locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("profileForm.locked")
			}),
			mine.data?.reviewNote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-lg border border-border bg-card px-4 py-3 text-sm",
				children: [
					t("profileForm.revision"),
					": ",
					mine.data.reviewNote
				]
			}),
			access.data && !access.data.canPublish && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: t("youth.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: t("youth.body")
					}),
					access.data.publishBlock === "youth" && access.data.youthStatus !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("youth.id"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: idDoc,
									onChange: (e) => setIdDoc(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("youth.selfie"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: selfie,
									onChange: (e) => setSelfie(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("youth.video"),
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: youthVideo,
									onChange: (e) => setYouthVideo(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: youth.isPending,
								onClick: () => youth.mutate(),
								children: t("youth.send")
							})
						]
					}),
					access.data.youthStatus === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: t("youth.pending")
					}),
					access.data.youthStatus === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm",
						children: t("youth.approved")
					}),
					access.data.youthStatus === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-destructive",
						children: t("youth.rejected")
					}),
					(access.data.publishBlock === "pay_u24" || access.data.publishBlock === "pay_senior") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/wallet",
							search: { plan: access.data.neededPlan === "player_senior" ? "player_senior" : "player_u24" },
							children: t("plans.ctaPay")
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				disabled: locked,
				className: "grid gap-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium text-muted-foreground",
							children: t("profileForm.basic")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t("profileForm.first"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.firstName,
										onChange: (e) => set("firstName", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t("profileForm.last"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.lastName,
										onChange: (e) => set("lastName", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t("profileForm.dob"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: form.dob ?? "",
										onChange: (e) => set("dob", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t("discover.country"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.country ?? "",
										onChange: (e) => set("country", e.target.value || null),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: t("discover.any")
										}), COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.id,
											children: c[locale]
										}, c.id))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t("profileForm.city"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.city ?? "",
										onChange: (e) => set("city", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t("profileForm.nationality"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.nationality ?? "",
										onChange: (e) => set("nationality", e.target.value || null),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: t("discover.any")
										}), COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.id,
											children: c[locale]
										}, c.id))]
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium text-muted-foreground",
								children: t("profileForm.sport")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("discover.position"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.primaryPosition ?? "",
											onChange: (e) => set("primaryPosition", e.target.value || null),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: t("discover.any")
											}), POSITIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c.id,
												children: c[locale]
											}, c.id))]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.secondary"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.secondaryPositions ?? "",
											onChange: (e) => set("secondaryPositions", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.height"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: form.heightCm ?? "",
											onChange: (e) => set("heightCm", e.target.value ? Number(e.target.value) : null)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.weight"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: form.weightKg ?? "",
											onChange: (e) => set("weightKg", e.target.value ? Number(e.target.value) : null)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("discover.foot"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.preferredFoot ?? "",
											onChange: (e) => set("preferredFoot", e.target.value || null),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: t("discover.any")
											}), FEET.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c.id,
												children: c[locale]
											}, c.id))]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("discover.level"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.playingLevel ?? "",
											onChange: (e) => set("playingLevel", e.target.value || null),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: t("discover.any")
											}), LEVELS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c.id,
												children: c[locale]
											}, c.id))]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.club"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.currentClub ?? "",
											onChange: (e) => set("currentClub", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.jersey"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: form.jerseyNumber ?? "",
											onChange: (e) => set("jerseyNumber", e.target.value ? Number(e.target.value) : null)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.achievements"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.achievements ?? "",
											onChange: (e) => set("achievements", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.injury"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.injuryStatus ?? "",
											onChange: (e) => set("injuryStatus", e.target.value)
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-xs text-muted-foreground",
									children: t("player.career")
								}),
								history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 grid grid-cols-[1fr_80px_80px] gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: h.club,
											onChange: (e) => setHistory((rows) => rows.map((r, j) => j === i ? {
												...r,
												club: e.target.value
											} : r))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: h.from,
											onChange: (e) => setHistory((rows) => rows.map((r, j) => j === i ? {
												...r,
												from: Number(e.target.value)
											} : r))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: h.to ?? "",
											onChange: (e) => setHistory((rows) => rows.map((r, j) => j === i ? {
												...r,
												to: e.target.value ? Number(e.target.value) : null
											} : r))
										})
									]
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => setHistory((h) => [...h, {
										club: "",
										from: 2024,
										to: null
									}]),
									children: "+"
								})
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium text-muted-foreground",
								children: t("profileForm.extra")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("profileForm.bio"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: form.bio ?? "",
									onChange: (e) => set("bio", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.languages"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.languages ?? "",
											onChange: (e) => set("languages", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.education"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.education ?? "",
											onChange: (e) => set("education", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.instagram"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.instagram ?? "",
											onChange: (e) => set("instagram", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.photo"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.photoUrl ?? "",
											onChange: (e) => set("photoUrl", e.target.value)
										})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium text-muted-foreground",
								children: t("profileForm.media")
							}),
							videos.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.videoUrl"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: v.youtubeUrl,
											onChange: (e) => setVideos((rows) => rows.map((r, j) => j === i ? {
												...r,
												youtubeUrl: e.target.value
											} : r))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("profileForm.videoTitle"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: v.title,
											onChange: (e) => setVideos((rows) => rows.map((r, j) => j === i ? {
												...r,
												title: e.target.value
											} : r))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: t("discover.any"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											value: v.category,
											onChange: (e) => setVideos((rows) => rows.map((r, j) => j === i ? {
												...r,
												category: e.target.value
											} : r)),
											children: VIDEO_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c.id,
												children: c[locale]
											}, c.id))
										})
									})
								]
							}, i)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setVideos((v) => [...v, {
									youtubeUrl: "",
									title: "",
									category: "other"
								}]),
								children: t("profileForm.addVideo")
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { ProfileEditor as component };

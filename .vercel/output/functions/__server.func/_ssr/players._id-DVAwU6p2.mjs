import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as ageFromDob } from "./utils-D6GH5reL.mjs";
import { a as getAccess } from "./billing-CF5MKqf_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$1, s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
import { r as useCurrentUserState, t as PageShell } from "./page-shell-CxYFDWwf.mjs";
import { t as Textarea } from "./textarea-BvR3MxFv.mjs";
import { t as Skeleton } from "./skeleton-6tIUPdsb.mjs";
import { a as POSITIONS, c as VIDEO_CATEGORIES, n as FEET, r as LEVELS, t as COUNTRIES, u as labeled } from "./football-Bg2Gurrr.mjs";
import { n as PlayerPhoto, t as PitchMark } from "./pitch-mark-DUe--7pM.mjs";
import { t as Badge } from "./badge-C3cEAyiX.mjs";
import { i as toggleWatchlist, o as watchlistIds, r as sendContact } from "./scout-BJTjTagO.mjs";
import { n as getPublicPlayer, r as searchPlayers, t as Paywall } from "./public-BBLNnq-h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/players._id-DVAwU6p2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var D = {
	"Arman Rahimi": {
		placeOfBirth: "Tehran",
		marketValueEur: 18e4,
		joinedOn: "2025-07-01",
		contractUntil: "2027-06-30",
		agentName: null,
		outfitter: "Nike",
		nationalTeam: "Iran U20",
		nationalCaps: 6,
		nationalGoals: 2,
		seasons: [
			{
				club: "Oghab Tehran",
				from: 2021,
				to: 2023,
				competition: "Tehran Youth League",
				appearances: 34,
				goals: 19,
				assists: 6,
				minutes: 2610,
				yellow: 3,
				red: 0
			},
			{
				club: "Esteghlal U19",
				from: 2023,
				to: 2025,
				competition: "Iran U19 League",
				appearances: 41,
				goals: 22,
				assists: 8,
				minutes: 3120,
				yellow: 4,
				red: 0
			},
			{
				club: "Esteghlal U21",
				from: 2025,
				to: null,
				competition: "Iran U21",
				appearances: 18,
				goals: 14,
				assists: 5,
				minutes: 1420,
				yellow: 2,
				red: 0
			}
		]
	},
	"Yuki Nakamura": {
		placeOfBirth: "Osaka",
		marketValueEur: 35e4,
		joinedOn: "2022-02-01",
		contractUntil: "2027-01-31",
		agentName: null,
		outfitter: "Mizuno",
		nationalTeam: "Japan U21",
		nationalCaps: 4,
		nationalGoals: 0,
		seasons: [{
			club: "Gamba Osaka Youth",
			from: 2018,
			to: 2022,
			competition: "J Youth",
			appearances: 62,
			goals: 11,
			assists: 24,
			minutes: 4980,
			yellow: 5,
			red: 0
		}, {
			club: "Cerezo Osaka U23",
			from: 2022,
			to: null,
			competition: "J3 League",
			appearances: 37,
			goals: 6,
			assists: 12,
			minutes: 2890,
			yellow: 3,
			red: 0
		}]
	},
	"Min-jun Park": {
		placeOfBirth: "Busan",
		marketValueEur: 22e4,
		joinedOn: "2019-03-01",
		contractUntil: "2027-12-31",
		agentName: null,
		outfitter: "Adidas",
		nationalTeam: "Korea Republic U19",
		nationalCaps: 3,
		nationalGoals: 0,
		seasons: [{
			club: "Busan IPark Academy",
			from: 2019,
			to: null,
			competition: "K League U18",
			appearances: 58,
			goals: 4,
			assists: 2,
			minutes: 5010,
			yellow: 8,
			red: 1
		}]
	},
	"Fahad Al-Mutairi": {
		placeOfBirth: "Riyadh",
		marketValueEur: 4e5,
		joinedOn: "2024-07-01",
		contractUntil: "2028-06-30",
		agentName: null,
		outfitter: "Puma",
		nationalTeam: "Saudi Arabia U19",
		nationalCaps: 8,
		nationalGoals: 2,
		seasons: [{
			club: "Al-Nassr U17",
			from: 2022,
			to: 2024,
			competition: "Saudi U17",
			appearances: 29,
			goals: 9,
			assists: 14,
			minutes: 2210,
			yellow: 2,
			red: 0
		}, {
			club: "Al-Nassr U19",
			from: 2024,
			to: null,
			competition: "Saudi U19",
			appearances: 22,
			goals: 7,
			assists: 11,
			minutes: 1760,
			yellow: 1,
			red: 0
		}]
	},
	"Javohir Karimov": {
		placeOfBirth: "Tashkent",
		marketValueEur: 45e4,
		joinedOn: "2022-01-15",
		contractUntil: "2027-12-31",
		agentName: "Central Asia Sports",
		outfitter: "Adidas",
		nationalTeam: "Uzbekistan",
		nationalCaps: 2,
		nationalGoals: 0,
		seasons: [{
			club: "Bunyodkor U21",
			from: 2019,
			to: 2022,
			competition: "Uzbek U21",
			appearances: 44,
			goals: 0,
			assists: 0,
			minutes: 3960,
			yellow: 2,
			red: 0
		}, {
			club: "Pakhtakor",
			from: 2022,
			to: null,
			competition: "Super League",
			appearances: 14,
			goals: 0,
			assists: 1,
			minutes: 1260,
			yellow: 1,
			red: 0
		}]
	},
	"Putri Andini": {
		placeOfBirth: "Bandung",
		marketValueEur: 9e4,
		joinedOn: "2024-01-10",
		contractUntil: "2027-06-30",
		agentName: null,
		outfitter: "Specs",
		nationalTeam: "Indonesia U18",
		nationalCaps: 5,
		nationalGoals: 3,
		seasons: [{
			club: "Persib Academy",
			from: 2021,
			to: 2024,
			competition: "PSSI Youth",
			appearances: 40,
			goals: 16,
			assists: 11,
			minutes: 3100,
			yellow: 2,
			red: 0
		}, {
			club: "Persib Putri",
			from: 2024,
			to: null,
			competition: "Liga Putri",
			appearances: 16,
			goals: 7,
			assists: 6,
			minutes: 1288,
			yellow: 1,
			red: 0
		}]
	},
	"Emre Yildiz": {
		placeOfBirth: "Istanbul",
		marketValueEur: 28e4,
		joinedOn: "2022-08-01",
		contractUntil: "2026-06-30",
		agentName: null,
		outfitter: "Nike",
		nationalTeam: "Türkiye U19",
		nationalCaps: 4,
		nationalGoals: 0,
		seasons: [{
			club: "Galatasaray U16",
			from: 2018,
			to: 2022,
			competition: "ELIT U16",
			appearances: 51,
			goals: 3,
			assists: 12,
			minutes: 4080,
			yellow: 7,
			red: 0
		}, {
			club: "Fatih Karagumruk U19",
			from: 2022,
			to: null,
			competition: "U19 Süper Lig",
			appearances: 33,
			goals: 2,
			assists: 9,
			minutes: 2750,
			yellow: 6,
			red: 0
		}]
	},
	"Arjun Mehta": {
		placeOfBirth: "Mumbai",
		marketValueEur: 12e4,
		joinedOn: "2023-06-01",
		contractUntil: "2027-05-31",
		agentName: null,
		outfitter: "Nivia",
		nationalTeam: "India U20",
		nationalCaps: 7,
		nationalGoals: 4,
		seasons: [{
			club: "RFYC",
			from: 2019,
			to: 2023,
			competition: "RFYC",
			appearances: 48,
			goals: 31,
			assists: 10,
			minutes: 3720,
			yellow: 3,
			red: 0
		}, {
			club: "Mumbai City FC Academy",
			from: 2023,
			to: null,
			competition: "RFYC / ISL Academy",
			appearances: 21,
			goals: 12,
			assists: 5,
			minutes: 1680,
			yellow: 2,
			red: 0
		}]
	},
	"Niran Chaiyasit": {
		placeOfBirth: "Bangkok",
		marketValueEur: 15e4,
		joinedOn: "2023-01-01",
		contractUntil: "2026-12-31",
		agentName: null,
		outfitter: "Warrix",
		nationalTeam: "Thailand U19",
		nationalCaps: 9,
		nationalGoals: 1,
		seasons: [{
			club: "Muangthong U17",
			from: 2020,
			to: 2023,
			competition: "Thai U17",
			appearances: 36,
			goals: 8,
			assists: 11,
			minutes: 2540,
			yellow: 4,
			red: 0
		}, {
			club: "BG Pathum United U21",
			from: 2023,
			to: null,
			competition: "Thai U21",
			appearances: 24,
			goals: 6,
			assists: 9,
			minutes: 1890,
			yellow: 2,
			red: 0
		}]
	},
	"Noor Al-Attiyah": {
		placeOfBirth: "Doha",
		marketValueEur: 9e5,
		joinedOn: "2021-07-01",
		contractUntil: "2028-06-30",
		agentName: "Aspire Sports",
		outfitter: "Nike",
		nationalTeam: "Qatar",
		nationalCaps: 5,
		nationalGoals: 0,
		seasons: [{
			club: "Aspire Academy",
			from: 2014,
			to: 2021,
			competition: "Aspire",
			appearances: 0,
			goals: 0,
			assists: 0,
			minutes: 0,
			yellow: 0,
			red: 0
		}, {
			club: "Al-Sadd",
			from: 2021,
			to: null,
			competition: "Qatar Stars League",
			appearances: 31,
			goals: 2,
			assists: 5,
			minutes: 2140,
			yellow: 4,
			red: 0
		}]
	},
	"Hana Kobayashi": {
		placeOfBirth: "Yokohama",
		marketValueEur: 2e5,
		joinedOn: "2021-04-01",
		contractUntil: "2027-03-31",
		agentName: null,
		outfitter: "Asics",
		nationalTeam: "Japan U20",
		nationalCaps: 6,
		nationalGoals: 1,
		seasons: [{
			club: "Nippon TV Tokyo Verdy Beleza U18",
			from: 2021,
			to: null,
			competition: "WE League youth",
			appearances: 39,
			goals: 11,
			assists: 14,
			minutes: 2980,
			yellow: 1,
			red: 0
		}]
	},
	"Ali Hussein": {
		placeOfBirth: "Baghdad",
		marketValueEur: 16e4,
		joinedOn: "2022-09-01",
		contractUntil: "2026-06-30",
		agentName: null,
		outfitter: "Adidas",
		nationalTeam: "Iraq U20",
		nationalCaps: 8,
		nationalGoals: 0,
		seasons: [{
			club: "Al-Zawraa Youth",
			from: 2018,
			to: 2022,
			competition: "Iraq Youth",
			appearances: 47,
			goals: 3,
			assists: 4,
			minutes: 3890,
			yellow: 9,
			red: 0
		}, {
			club: "Al-Shorta U21",
			from: 2022,
			to: null,
			competition: "Iraq U21",
			appearances: 28,
			goals: 1,
			assists: 3,
			minutes: 2410,
			yellow: 6,
			red: 1
		}]
	}
};
function dossierFor(first, last) {
	return D[`${first} ${last}`] ?? null;
}
function enrichHistory(player) {
	const d = dossierFor(player.firstName, player.lastName);
	if (d?.seasons.length) return d.seasons;
	return player.clubHistory;
}
function formatEur(n) {
	if (n >= 1e6) {
		const v = n / 1e6;
		return `€${Number.isInteger(v) ? v : v.toFixed(1)}m`;
	}
	if (n >= 1e3) return `€${Math.round(n / 1e3)}k`;
	return `€${n}`;
}
function formatHeightM(cm) {
	return `${(cm / 100).toFixed(2).replace(".", ",")} m`;
}
function formatDate(iso, locale) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	const loc = locale === "fa" ? "fa-IR" : locale === "ar" ? "ar" : locale === "tr" ? "tr-TR" : locale === "az" ? "az-AZ" : locale === "ur" ? "ur-PK" : locale === "ku" ? "ckb" : "en-GB";
	try {
		return new Intl.DateTimeFormat(loc, {
			day: "numeric",
			month: "short",
			year: "numeric"
		}).format(d);
	} catch {
		return iso;
	}
}
function extractYoutubeId(url) {
	const trimmed = url.trim();
	if (!trimmed) return null;
	return trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1] ?? null;
}
function youtubeThumb(id) {
	return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
function youtubeEmbed(id) {
	return `https://www.youtube-nocookie.com/embed/${id}`;
}
function Flag({ code }) {
	if (!code) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: `https://flagcdn.com/w40/${code.toLowerCase()}.png`,
		alt: "",
		className: "inline-block h-3.5 w-5 rounded-sm object-cover",
		onError: (e) => {
			e.currentTarget.style.display = "none";
		}
	});
}
function PlayerPage() {
	const { id } = Route$1.useParams();
	const profileId = Number(id);
	const { t, locale } = useI18n();
	const nav = useNavigate();
	const qc = useQueryClient();
	const { user, isPending } = useCurrentUserState();
	const [message, setMessage] = (0, import_react.useState)("");
	const [activeVideo, setActiveVideo] = (0, import_react.useState)(0);
	const [tab, setTab] = (0, import_react.useState)("overview");
	const result = useQuery({
		queryKey: ["player", profileId],
		queryFn: () => getPublicPlayer({ data: profileId })
	});
	const access = useQuery({
		queryKey: ["access"],
		queryFn: () => getAccess()
	});
	const watched = useQuery({
		queryKey: ["watch-ids"],
		queryFn: () => watchlistIds(),
		enabled: Boolean(user)
	});
	const toggle = useMutation({
		mutationFn: () => toggleWatchlist({ data: profileId }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["watch-ids"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const contact = useMutation({
		mutationFn: () => sendContact({ data: {
			profileId,
			message
		} }),
		onSuccess: () => {
			toast.success(t("scout.sent"));
			setMessage("");
		},
		onError: (e) => toast.error(e.message)
	});
	const similar = useQuery({
		queryKey: ["similar", result.data && "player" in result.data ? result.data.player?.primaryPosition : null],
		queryFn: () => searchPlayers({ data: { position: result.data && "access" in result.data && result.data.access ? result.data.player.primaryPosition ?? void 0 : void 0 } }),
		enabled: Boolean(result.data && "access" in result.data && result.data.access)
	});
	if (result.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[70vh] w-full rounded-xl" })
	}) });
	if (!result.data?.player) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: t("discover.empty")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/discover",
				children: t("nav.discover")
			})
		})]
	}) });
	if (!result.data.access) {
		const sealed = result.data.player;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl items-start gap-8 px-4 py-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "talent-blur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerPhoto, {
						url: sealed.photoUrl,
						first: "—",
						last: "—",
						className: "aspect-[3/4] w-full"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-background/40" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: labeled(POSITIONS, sealed.primaryPosition, locale) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-4 text-4xl",
					children: t("paywall.sealed")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: t("positions.locked")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paywall, { loggedIn: Boolean(access.data?.loggedIn) })
				})
			] })]
		}) });
	}
	const p = result.data.player;
	const age = ageFromDob(p.dob);
	const onWatch = watched.data?.includes(p.id);
	const video = p.videos[activeVideo];
	const yt = video ? extractYoutubeId(video.youtubeUrl) : null;
	const d = dossierFor(p.firstName, p.lastName);
	const seasons = enrichHistory(p);
	const similarPlayers = similar.data && similar.data.access ? similar.data.players.filter((x) => x.id !== p.id).slice(0, 6) : [];
	const facts = [
		[t("player.dateOfBirth"), p.dob ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatDate(p.dob, locale), age != null ? ` (${age})` : ""] }) : "—"],
		[t("player.placeOfBirth"), d?.placeOfBirth ?? p.city ?? "—"],
		[t("player.citizenship"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { code: p.nationality ?? p.country }), labeled(COUNTRIES, p.nationality ?? p.country, locale)]
		})],
		[t("player.height"), p.heightCm ? formatHeightM(p.heightCm) : "—"],
		[t("player.weight"), p.weightKg ? `${p.weightKg} ${t("common.kg")}` : "—"],
		[t("player.position"), labeled(POSITIONS, p.primaryPosition, locale)],
		[t("player.foot"), labeled(FEET, p.preferredFoot, locale)],
		[t("player.shirt"), p.jerseyNumber != null ? `#${p.jerseyNumber}` : "—"],
		[t("player.club"), p.currentClub ?? "—"],
		[t("player.joined"), d?.joinedOn ? formatDate(d.joinedOn, locale) : "—"],
		[t("player.contract"), d?.contractUntil ? formatDate(d.contractUntil, locale) : "—"],
		[t("player.agent"), d?.agentName ?? t("player.none")],
		[t("player.outfitter"), d?.outfitter ?? "—"],
		[t("player.nationalTeam"), d?.nationalTeam ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [d.nationalTeam, d.nationalCaps ? ` · ${d.nationalCaps}/${d.nationalGoals}` : ""] }) : "—"],
		[t("player.languages"), p.languages ?? "—"]
	];
	const tabs = [
		["overview", t("player.overview")],
		["stats", t("player.stats")],
		["transfers", t("player.transfers")],
		["videos", t("player.videos")]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-card/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl items-stretch gap-0 lg:grid-cols-[200px_minmax(0,1fr)_240px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden border-b border-border lg:border-b-0 lg:border-e",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerPhoto, {
							url: p.photoUrl,
							first: p.firstName,
							last: p.lastName,
							className: "aspect-[3/4] w-full"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-6 md:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { code: p.country }),
									labeled(COUNTRIES, p.country, locale),
									p.city ? ` · ${p.city}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display mt-2 text-3xl md:text-5xl",
								children: [
									p.firstName,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "uppercase",
										children: p.lastName
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PitchMark, {
										position: p.primaryPosition,
										className: "h-14 w-9 shrink-0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: labeled(POSITIONS, p.primaryPosition, locale) }),
									p.playingLevel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "muted",
										children: labeled(LEVELS, p.playingLevel, locale)
									}),
									p.jerseyNumber != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "muted",
										children: ["#", p.jerseyNumber]
									}),
									age != null && age < 18 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "warn",
										children: t("player.youth")
									})
								]
							}),
							p.currentClub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm",
								children: p.currentClub
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "mt-6 grid grid-cols-1 gap-x-8 text-sm sm:grid-cols-2",
								children: facts.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4 border-b border-border py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: k
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-end font-medium tabular-nums",
										children: v
									})]
								}, k))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex flex-col justify-between border-t border-border p-6 lg:border-s lg:border-t-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: t("player.currentValue")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display mt-2 text-4xl text-primary",
								children: d ? formatEur(d.marketValueEur) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									t("player.lastUpdate"),
									" · ",
									t("player.views"),
									" ",
									p.views
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: onWatch ? "secondary" : "default",
								onClick: () => {
									if (!user && !isPending) nav({ to: "/login" });
									else toggle.mutate();
								},
								children: onWatch ? t("player.shortlisted") : t("player.shortlist")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									navigator.clipboard.writeText(window.location.href);
									toast.success(t("player.share"));
								},
								children: t("player.share")
							})]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4",
				children: tabs.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `shrink-0 border-b-2 px-4 py-3 text-sm ${tab === id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: label
				}, id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-10",
			children: [
				tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: t("player.about")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: p.bio
						}),
						p.achievements && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: t("player.achievements")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: p.achievements
							})]
						}),
						p.injuryStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: t("player.injury")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: p.injuryStatus
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareerTable, {
							seasons,
							t
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: t("player.contact")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-2",
								value: message,
								onChange: (e) => setMessage(e.target.value),
								placeholder: t("scout.message")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-3",
								disabled: contact.isPending || !message.trim(),
								onClick: () => {
									if (!user) nav({ to: "/login" });
									else contact.mutate();
								},
								children: t("scout.send")
							})
						]
					}), similarPlayers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: t("player.similar")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: similarPlayers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/players/$id",
								params: { id: String(s.id) },
								className: "flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									s.firstName,
									" ",
									s.lastName
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: labeled(POSITIONS, s.primaryPosition, locale)
								})]
							}) }, s.id))
						})]
					})] })]
				}),
				tab === "stats" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareerTable, {
					seasons,
					t
				}),
				tab === "transfers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: t("player.transfers")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "mt-4 w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-start text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pe-3 font-medium",
									children: t("player.season")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pe-3 font-medium",
									children: t("player.club")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: t("player.competition")
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: seasons.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-3 pe-3 tabular-nums",
								children: [
									c.from,
									"–",
									c.to ?? t("player.present")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pe-3",
								children: c.club
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 text-muted-foreground",
								children: c.competition ?? "—"
							})
						]
					}, i)) })]
				})] }),
				tab === "videos" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: t("player.videos")
				}), p.videos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: t("player.noVideos")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-xl border border-border bg-card",
						children: [yt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: video?.title ?? "video",
							src: youtubeEmbed(yt),
							className: "aspect-video w-full",
							allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
							allowFullScreen: true
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid aspect-video place-items-center text-sm text-muted-foreground",
							children: video?.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: video?.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: labeled(VIDEO_CATEGORIES, video?.category ?? null, locale)
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: p.videos.map((v, i) => {
							const idv = extractYoutubeId(v.youtubeUrl);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveVideo(i),
								className: "flex gap-3 rounded-lg border border-border bg-card p-2 text-start",
								children: [idv && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: youtubeThumb(idv),
									alt: "",
									className: "h-16 w-28 rounded-md object-cover",
									onError: (e) => {
										e.currentTarget.style.display = "none";
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: v.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: labeled(VIDEO_CATEGORIES, v.category, locale)
								})] })]
							}, v.id);
						})
					})]
				})] })
			]
		})
	] });
}
function CareerTable({ seasons, t }) {
	const totals = seasons.reduce((acc, c) => ({
		appearances: acc.appearances + (c.appearances ?? 0),
		goals: acc.goals + (c.goals ?? 0),
		assists: acc.assists + (c.assists ?? 0),
		minutes: acc.minutes + (c.minutes ?? 0)
	}), {
		appearances: 0,
		goals: 0,
		assists: 0,
		minutes: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 overflow-x-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-medium",
			children: t("player.stats")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "mt-4 w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-xs text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pe-3 text-start font-medium",
							children: t("player.season")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pe-3 text-start font-medium",
							children: t("player.club")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pe-3 text-start font-medium",
							children: t("player.competition")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pe-3 text-end font-medium",
							children: t("player.appearances")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pe-3 text-end font-medium",
							children: t("player.goals")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pe-3 text-end font-medium",
							children: t("player.assists")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 text-end font-medium",
							children: t("player.minutes")
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [seasons.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "py-3 pe-3 tabular-nums",
						children: [
							c.from,
							"–",
							c.to ?? t("player.present")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3",
						children: c.club
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3 text-muted-foreground",
						children: c.competition ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3 text-end tabular-nums",
						children: c.appearances ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3 text-end tabular-nums",
						children: c.goals ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3 text-end tabular-nums",
						children: c.assists ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 text-end tabular-nums",
						children: c.minutes ?? "—"
					})
				]
			}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "font-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3",
						colSpan: 3,
						children: t("player.career")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3 text-end tabular-nums",
						children: totals.appearances
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3 text-end tabular-nums",
						children: totals.goals
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pe-3 text-end tabular-nums",
						children: totals.assists
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 text-end tabular-nums",
						children: totals.minutes
					})
				]
			})] })]
		})]
	});
}
//#endregion
export { PlayerPage as component };

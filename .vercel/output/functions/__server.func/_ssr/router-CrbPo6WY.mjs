import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useRouter, _ as createFileRoute, d as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as __exportAll, r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-g1L-zjb2.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CrbPo6WY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-medium",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted-foreground",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var LOCALES = [
	"fa",
	"en",
	"ar",
	"tr",
	"az",
	"ur",
	"ku"
];
var RTL_LOCALES = /* @__PURE__ */ new Set([
	"fa",
	"ar",
	"ur",
	"ku"
]);
var LOCALE_META = {
	fa: {
		native: "فارسی",
		short: "فا",
		html: "fa",
		english: "Persian"
	},
	en: {
		native: "English",
		short: "EN",
		html: "en",
		english: "English"
	},
	ar: {
		native: "العربية",
		short: "ع",
		html: "ar",
		english: "Arabic"
	},
	tr: {
		native: "Türkçe",
		short: "TR",
		html: "tr",
		english: "Turkish"
	},
	az: {
		native: "Azərbaycan",
		short: "AZ",
		html: "az",
		english: "Azerbaijani"
	},
	ur: {
		native: "اردو",
		short: "UR",
		html: "ur",
		english: "Urdu"
	},
	ku: {
		native: "کوردی",
		short: "کورد",
		html: "ckb",
		english: "Kurdish"
	}
};
function isLocale(value) {
	return !!value && LOCALES.includes(value);
}
function dirOf(locale) {
	return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}
function detectLocale(lang) {
	const l = lang.toLowerCase();
	if (l.startsWith("fa") || l.startsWith("ps") || l.startsWith("tg")) return "fa";
	if (l.startsWith("ar")) return "ar";
	if (l.startsWith("tr")) return "tr";
	if (l.startsWith("az")) return "az";
	if (l.startsWith("ur")) return "ur";
	if (l.startsWith("ku") || l.startsWith("ckb") || l.startsWith("kmr")) return "ku";
	if (l.startsWith("en")) return "en";
	return "fa";
}
var en = {
	brand: "Soccer Scouting",
	tagline: "From the pitch to the club",
	nav: {
		discover: "Discover",
		how: "How it works",
		coverage: "Coverage",
		method: "Method",
		pricing: "Pricing",
		signIn: "Sign in",
		dashboard: "Dashboard",
		profile: "Profile",
		shortlist: "Watchlist",
		inbox: "Inbox",
		admin: "Admin",
		account: "Account",
		wallet: "Billing"
	},
	theme: {
		light: "Light",
		dark: "Dark",
		toggle: "Colour mode"
	},
	hero: {
		kicker: "AFC region · Players, scouts, clubs",
		live: "Live network",
		title: "Asia's talent, in front of the clubs.",
		body: "Soccer Scouting is the professional football scouting platform for Asia. Players publish a verified profile with match film, physical data and career history. Clubs, academies and scouts search the continent by position, age, country and level — then make contact.",
		ctaPlayer: "Create player profile",
		ctaScout: "Club & scout access",
		ctaDiscover: "Browse the catalogue",
		trust: "Profiles are reviewed before they go public. Contact with under-18s is restricted. Soccer Scouting is a discovery platform, not an agency, and does not negotiate contracts.",
		fact1k: "47",
		fact1v: "talent markets",
		fact2k: "15",
		fact2v: "positions on the pitch",
		fact3k: "7",
		fact3v: "interface languages",
		fact4k: "12",
		fact4v: "months of access",
		slogan: "From the pitch to the club"
	},
	stats: {
		talents: "Markets covered",
		countries: "Countries",
		scouts: "Interface languages",
		views: "Months of access"
	},
	featured: {
		title: "Selected talent",
		subtitle: "Reviewed profiles already in the catalogue.",
		all: "View all",
		badge: "Selected"
	},
	method: {
		kicker: "How a name reaches a club",
		title: "A scouting file, not a highlight reel.",
		subtitle: "The public homepage never lists players. What you see here is the standard — the same fields a professional recruitment week already uses, built for the AFC region.",
		s1t: "A complete player file",
		s1b: "Height, foot, languages, club history, market data and match film on one page — the layout desks already work from.",
		s2t: "Reviewed before it is searchable",
		s2b: "Identity, age and media are checked. Until that happens, the name does not exist in the catalogue.",
		s3t: "Visible after a club subscription",
		s3b: "Clubs, agencies and scouts unlock every reviewed profile with an annual seat. There is no free scrapeable directory.",
		s4t: "Youth lane is free — and proven",
		s4b: "Players aged 16–19 publish at no charge once ID and a selfie are approved. This is not a marketplace for children."
	},
	clubs: {
		kicker: "Clubs across the AFC region",
		trusted: "Crests of clubs the network is built to reach — West Asia to the Pacific."
	},
	coverage: {
		title: "One continent. One map.",
		subtitle: "West Asia to the Pacific — the filters a recruitment desk actually uses.",
		west: "West Asia",
		gulf: "Gulf",
		central: "Central Asia",
		south: "South Asia",
		east: "East Asia",
		sea: "Southeast Asia",
		open: "Open"
	},
	positions: {
		title: "Recruit from the pitch.",
		subtitle: "Open the catalogue at the role you actually sign. Until a club subscription is active, portraits stay locked.",
		hint: "Positions",
		locked: "Locked until club access is active."
	},
	how: {
		title: "Three steps to the catalogue",
		s1t: "Professional profile",
		s1b: "Physicals, club history, languages and match film — one page, the same fields a desk already works with.",
		s2t: "Quality review",
		s2b: "Nothing is searchable until identity, age and media have been checked.",
		s3t: "Subscribe, then see",
		s3b: "A club or agency subscription unlocks the continent. Players 16–19 publish free after documents. Older players buy an annual lane."
	},
	split: {
		playerTitle: "For players",
		playerBody: "No agent required. One profile. The youth lane is free after proof of age. From 20, an annual plan publishes you and notifies club desks.",
		scoutTitle: "For scouts",
		scoutBody: "Structured search, private notes, and contact that only opens on an approved account. One thousand dollars a year.",
		clubTitle: "For clubs and agencies",
		clubBody: "Filter by position, age, foot and level. Watchlist the names that matter. No leaked catalogue on the public site."
	},
	principles: {
		title: "How the platform is run",
		p1t: "Review before public",
		p1b: "Every file is checked for identity, age and media before it can be searched.",
		p2t: "Youth protection",
		p2b: "Players under 18 are marked. The 16–19 lane is free and proven with documents. It is not a marketplace for minors.",
		p3t: "Discovery, not agency",
		p3b: "Soccer Scouting does not represent players or negotiate contracts. Talks happen off-platform.",
		p4t: "Pay to see, not to exist",
		p4b: "The public homepage never lists a player. Clubs unlock files only after a subscription. Notes stay private."
	},
	voices: {
		title: "From the recruitment desk",
		q1: "We were losing names because the tape sat on three different Instagram accounts. One page with film is what a recruitment week actually needs.",
		a1: "Academy recruitment",
		r1: "West Asia",
		q2: "The standard is the point. Height, foot, history, language — the same fields we already put in a report.",
		a2: "First-team scout",
		r2: "Gulf"
	},
	faq: {
		title: "Questions clubs ask",
		q1: "Is Soccer Scouting an agent?",
		a1: "No. Soccer Scouting is a discovery platform. We do not represent players, take commissions, or negotiate contracts. Those talks happen off-platform.",
		q2: "Who can see a player profile?",
		a2: "Nobody on the public homepage. Clubs, agencies and scouts see files only after an annual $1,000 subscription. Until then every portrait is locked.",
		q3: "What about players under 18?",
		a3: "Players 16–19 can publish for free once an ID document and a selfie (photo or short video) are approved. Contact rules are stricter. Under 16 is not accepted.",
		q4: "How do players pay?",
		a4: "Ages 20–24: $200 a year. Ages 25 and over: $400 a year. Pay by card (Visa, Mastercard, Amex), PayPal, or crypto (USDT, Bitcoin, Ethereum). Access opens as soon as payment clears.",
		q5: "Which countries are covered?",
		a5: "The AFC region: West Asia, the Gulf, Central Asia, South Asia, East Asia and Southeast Asia."
	},
	ctaBand: {
		title: "Put a name on a club's desk — or open the desk.",
		body: "Players build a profile in minutes. Clubs unlock twelve months of the catalogue. Nothing is shown for free."
	},
	footer: {
		note: "Soccer Scouting is a discovery platform, not an agency. Contract talks happen off-platform. Player files are never listed on the public homepage.",
		privacy: "Privacy",
		terms: "Terms",
		platform: "Platform",
		players: "Players",
		clubs: "Clubs & scouts",
		languages: "Languages",
		rights: "© 2026 Soccer Scouting",
		payments: "Payments",
		afc: "AFC region",
		afcNote: "Coverage across the Asian Football Confederation. Independent platform — not an official AFC product."
	},
	lang: { label: "Language" },
	discover: {
		title: "Talent catalogue",
		subtitle: "Filter the continent. Files stay locked until club access is active.",
		search: "Name, club or city",
		age: "Age",
		position: "Position",
		country: "Country",
		foot: "Preferred foot",
		level: "Level",
		any: "Any",
		sort: "Sort",
		newest: "Newest",
		views: "Most viewed",
		height: "Height",
		empty: "No profiles match these filters.",
		results: "profiles",
		filters: "Filters"
	},
	player: {
		about: "About",
		career: "Career",
		videos: "Videos",
		physical: "Physical",
		height: "Height",
		weight: "Weight",
		foot: "Foot",
		age: "Age",
		club: "Current club",
		languages: "Languages",
		achievements: "Honours",
		injury: "Injury status",
		views: "Profile views",
		contact: "Request contact",
		shortlist: "Add to watchlist",
		shortlisted: "On watchlist",
		share: "Share",
		youth: "Under 18",
		present: "Present",
		noVideos: "No videos yet.",
		position: "Position",
		overview: "Overview",
		facts: "Player data",
		placeOfBirth: "Place of birth",
		citizenship: "Citizenship",
		dateOfBirth: "Date of birth / Age",
		marketValue: "Market value",
		currentValue: "Current market value",
		joined: "Joined",
		contract: "Contract expires",
		agent: "Player agent",
		outfitter: "Outfitter",
		nationalTeam: "National team",
		caps: "Caps / Goals",
		season: "Season",
		competition: "Competition",
		appearances: "Apps",
		goals: "Goals",
		assists: "Assists",
		minutes: "Min.",
		transfers: "Transfer history",
		similar: "Similar players",
		shirt: "Shirt number",
		stats: "Career statistics",
		yellow: "YC",
		red: "RC",
		sample: "Sample file",
		none: "—",
		lastUpdate: "Last update",
		nameInHome: "Name in home country"
	},
	auth: {
		title: "Sign in to Soccer Scouting",
		subtitle: "One account for players, scouts and clubs.",
		email: "Email",
		password: "Password",
		name: "Name",
		signIn: "Sign in with email",
		signUp: "Create account",
		or: "or",
		have: "Have an account? Sign in",
		need: "Need an account? Sign up",
		google: "Continue with Google",
		x: "Continue with X",
		error: "Sign-in failed. Try again."
	},
	onboarding: {
		title: "Choose your role",
		subtitle: "Support can change this later if needed.",
		player: "Player",
		playerHint: "Build a profile and, after review, appear in the club catalogue.",
		scout: "Scout / club / agent",
		scoutHint: "A $1,000 annual subscription to search, shortlist and contact.",
		org: "Organisation or club",
		orgRole: "Role",
		continue: "Continue",
		claimAdmin: "You're first — activate admin access"
	},
	dash: {
		welcome: "Hello",
		playerTitle: "Player dashboard",
		scoutTitle: "Scout dashboard",
		status: "Profile status",
		complete: "Complete profile",
		submit: "Submit for review",
		views: "Views",
		requests: "Requests",
		pendingScout: "Your scout account is awaiting review. A subscription is still required before profiles unlock.",
		rejectedScout: "This scout account was declined.",
		emptyInbox: "No messages yet.",
		notifications: "Notifications",
		markRead: "Mark read"
	},
	profileForm: {
		title: "Player profile",
		basic: "Basics",
		sport: "Football",
		media: "Media",
		extra: "More",
		first: "First name",
		last: "Last name",
		dob: "Date of birth",
		city: "City",
		nationality: "Nationality",
		height: "Height (cm)",
		weight: "Weight (kg)",
		jersey: "Shirt number",
		secondary: "Secondary positions",
		club: "Current club",
		achievements: "Honours",
		injury: "Current injury",
		bio: "Short biography",
		instagram: "Instagram",
		photo: "Portrait photo URL",
		fullBody: "Full-body photo URL",
		languages: "Languages",
		education: "Education",
		videoUrl: "YouTube link",
		videoTitle: "Video title",
		addVideo: "Add video",
		save: "Save draft",
		submit: "Submit for review",
		locked: "This profile is in review and locked until a decision.",
		revision: "Needs revision",
		saved: "Saved",
		submitted: "Submitted"
	},
	status: {
		draft: "Draft",
		pending: "Pending review",
		approved: "Approved",
		needs_revision: "Needs revision",
		rejected: "Rejected"
	},
	scout: {
		notes: "Private note",
		saveNotes: "Save note",
		message: "Message to player",
		send: "Send request",
		sent: "Request sent",
		needApproved: "Contact unlocks after your scout account is approved.",
		emptyList: "Watchlist is empty. Add players from the catalogue.",
		lists: "Lists"
	},
	admin: {
		title: "Admin",
		queue: "Profile queue",
		scouts: "Scouts",
		users: "Users",
		approve: "Approve",
		reject: "Reject",
		revision: "Request revision",
		note: "Review note",
		empty: "Queue is clear.",
		bootstrap: "Activate admin access",
		youth: "Youth documents"
	},
	common: {
		loading: "Loading",
		save: "Save",
		cancel: "Cancel",
		close: "Close",
		years: "yrs",
		cm: "cm",
		kg: "kg",
		back: "Back",
		required: "Required"
	},
	plans: {
		kicker: "Annual access",
		title: "One price. Twelve months. Instant once payment clears.",
		subtitle: "Players 16–19 publish free after proof of age. Everyone else — including every club and agency — buys a year. Pay by card, PayPal or crypto.",
		year: "/ year",
		free: "Free",
		ctaPay: "Go to billing",
		ctaYouth: "Start youth proof",
		youth: {
			kicker: "16–19",
			title: "Academy lane",
			body: "For players still in the youth window. Prove age with an ID document and a selfie. Once approved, publishing costs nothing.",
			f1: "ID document + selfie (photo or short video)",
			f2: "Reviewed by Soccer Scouting",
			f3: "Public profile after approval — $0",
			f4: "Stricter contact rules"
		},
		player_u24: {
			kicker: "20–24",
			title: "First-contract window",
			body: "The years clubs actually shop. Your profile is published and a notice is queued to clubs in the region.",
			f1: "$200, billed once a year",
			f2: "Profile goes public after review",
			f3: "Notice to club emails on the network",
			f4: "Card, PayPal or crypto — access on payment"
		},
		player_senior: {
			kicker: "25+",
			title: "Senior market",
			body: "For players already in the adult game who still need a clean, searchable file on Asian desks.",
			f1: "$400, billed once a year",
			f2: "Full publication after review",
			f3: "Club alerts included",
			f4: "Card, PayPal or crypto — access on payment"
		},
		desk: {
			kicker: "Club / agent / scout",
			title: "Club access",
			body: "The only way a name unlocks. Filter the continent, keep private notes, request contact. One subscription for the whole desk.",
			f1: "$1,000, billed once a year",
			f2: "Unlock every reviewed profile",
			f3: "Watchlists and private notes",
			f4: "Contact after your account is approved",
			f5: "Card, PayPal or crypto — instant unlock"
		}
	},
	wallet: {
		title: "Billing",
		subtitle: "Pay by card, PayPal or crypto. Access opens the moment payment covers the plan.",
		address: "Your deposit address",
		network: "Network",
		asset: "Asset",
		balance: "Balance",
		copy: "Copy address",
		copied: "Copied",
		detect: "Payment sent — confirm",
		detecting: "Confirming…",
		amount: "Amount (USD)",
		subscribe: "Activate access now",
		active: "Active access",
		until: "Until",
		empty: "No movements yet.",
		deposit: "Payment",
		spend: "Subscription",
		hint: "Choose a method, pay the plan amount, and access opens immediately."
	},
	pay: {
		card: "Card",
		paypal: "PayPal",
		crypto: "Crypto",
		cardNumber: "Card number",
		expiry: "Expiry",
		cvc: "CVC",
		cardName: "Name on card",
		payNow: "Pay now",
		processing: "Processing…",
		success: "Payment received",
		methods: "Accepted methods",
		choose: "Choose a method",
		usdt: "USDT (TRC20)",
		btc: "Bitcoin",
		eth: "Ethereum"
	},
	paywall: {
		title: "Profiles are locked",
		body: "The public site never lists a player. Create an account, then subscribe for club access. Until then every portrait stays locked.",
		register: "Create an account",
		pay: "Open club access",
		price: "Club & agency access · $1,000 / year · card, PayPal or crypto",
		sealed: "Locked profile"
	},
	youth: {
		title: "Prove the academy lane",
		body: "Players aged 16–19 publish free. Send a government ID, a clear selfie, and optionally a short selfie video. Age is checked before anything goes public.",
		id: "ID document URL",
		selfie: "Selfie photo URL",
		video: "Selfie video URL (optional)",
		send: "Submit for age check",
		pending: "Documents are under review.",
		approved: "Youth lane approved — publishing is free.",
		rejected: "Documents were declined. Please resubmit."
	}
};
var ar = {
	...en,
	brand: "Soccer Scouting",
	tagline: "من الملعب إلى النادي",
	nav: {
		...en.nav,
		discover: "الدليل",
		how: "كيف يعمل",
		coverage: "التغطية",
		method: "المنهج",
		pricing: "الأسعار",
		signIn: "دخول",
		dashboard: "لوحة التحكم",
		profile: "الملف",
		shortlist: "قائمة المتابعة",
		inbox: "الرسائل",
		admin: "الإدارة",
		account: "الحساب",
		wallet: "الدفع"
	},
	theme: {
		light: "نهار",
		dark: "ليل",
		toggle: "الوضع اللوني"
	},
	hero: {
		...en.hero,
		kicker: "منطقة الاتحاد الآسيوي · لاعب وكشاف ونادٍ",
		live: "الشبكة نشطة",
		title: "موهبة آسيا، أمام الأندية.",
		body: "ساكر سكاوتينغ منصة احترافية لاكتشاف مواهب كرة القدم في آسيا. يبني اللاعب ملفاً موثّقاً بفيلم المباريات والبيانات البدنية والمسيرة. بعد المراجعة يظهر أمام الأندية والأكاديميات والكشافين. الأندية تفتح الدليل باشتراك سنوي.",
		ctaPlayer: "إنشاء ملف لاعب",
		ctaScout: "دخول النادي والكشاف",
		ctaDiscover: "تصفح الدليل",
		trust: "لا يُنشر أي ملف قبل المراجعة. التواصل مع من دون ١٨ سنة مقيّد. المنصة أداة اكتشاف وليست وكالة ولا تفاوض العقود.",
		fact1v: "أسواق مواهب",
		fact2v: "مراكز على الملعب",
		fact3v: "لغات الواجهة",
		fact4v: "أشهر من الوصول",
		slogan: "من الملعب إلى النادي"
	},
	method: {
		...en.method,
		kicker: "كيف يصل الاسم إلى النادي",
		title: "ملف كشفي، لا مجرد أهداف.",
		subtitle: "الصفحة الرئيسية لا تعرض قائمة اللاعبين. ما تراه هو المعيار المهني لمنطقة الاتحاد الآسيوي."
	},
	clubs: {
		kicker: "أندية منطقة الاتحاد الآسيوي",
		trusted: "شعارات أندية بُنيت الشبكة لتصل إليها — من غرب آسيا إلى المحيط الهادئ."
	},
	footer: {
		...en.footer,
		note: "ساكر سكاوتينغ أداة اكتشاف وليست وكالة. التفاوض يتم خارج المنصة. ملفات اللاعبين لا تُعرض في الصفحة الرئيسية.",
		privacy: "الخصوصية",
		terms: "الشروط",
		platform: "المنصة",
		players: "اللاعبون",
		clubs: "الأندية والكشافون",
		languages: "اللغات",
		rights: "© ٢٠٢٦ Soccer Scouting",
		payments: "طرق الدفع",
		afc: "منطقة الاتحاد الآسيوي",
		afcNote: "تغطية منطقة الاتحاد الآسيوي لكرة القدم. منصة مستقلة — ليست منتجاً رسمياً للاتحاد."
	},
	plans: {
		...en.plans,
		title: "سعر واحد. اثنا عشر شهراً. يُفعَّل فور إتمام الدفع.",
		free: "مجاناً",
		year: "/ سنة",
		ctaPay: "الذهاب للدفع",
		ctaYouth: "بدء إثبات السن"
	},
	paywall: {
		...en.paywall,
		title: "الملفات مقفلة",
		register: "إنشاء حساب",
		pay: "فتح وصول النادي",
		sealed: "ملف مقفل"
	},
	wallet: {
		...en.wallet,
		title: "الدفع",
		copy: "نسخ العنوان",
		copied: "تم النسخ",
		detect: "تم الدفع — تأكيد",
		subscribe: "فعّل الوصول الآن"
	},
	pay: {
		...en.pay,
		card: "بطاقة",
		paypal: "باي بال",
		crypto: "عملة رقمية",
		payNow: "ادفع الآن",
		processing: "جارٍ المعالجة…",
		success: "تم استلام الدفع"
	},
	common: {
		...en.common,
		back: "رجوع",
		loading: "جارٍ التحميل"
	}
};
var az = {
	...en,
	brand: "Soccer Scouting",
	tagline: "Meydandan klubadək",
	nav: {
		...en.nav,
		discover: "Kataloq",
		how: "Necə işləyir",
		coverage: "Əhatə",
		method: "Üsul",
		pricing: "Qiymətlər",
		signIn: "Giriş",
		dashboard: "Panel",
		profile: "Profil",
		shortlist: "İzləmə siyahısı",
		inbox: "Mesajlar",
		admin: "İdarə",
		account: "Hesab",
		wallet: "Ödəniş"
	},
	theme: {
		light: "Gündüz",
		dark: "Gecə",
		toggle: "Rəng rejimi"
	},
	hero: {
		...en.hero,
		kicker: "AFC regionu · oyunçu, skaut, klub",
		live: "Şəbəkə aktivdir",
		title: "Asiyanın istedadı, klubların qarşısında.",
		body: "Soccer Scouting Asiya üçün peşəkar futbol skautinq platformasıdır. Oyunçu matç filmi, fiziki məlumat və karyera tarixçəsi ilə təsdiqlənmiş profil dərc edir. Klublar illik abunə ilə kataloqu açır.",
		ctaPlayer: "Oyunçu profili yarat",
		ctaScout: "Klub və skaut girişi",
		ctaDiscover: "Kataloqa bax",
		trust: "Heç bir profil yoxlanışdan əvvəl dərc olunmur. 18 yaşdan kiçiklərlə əlaqə məhduddur. Soccer Scouting agentlik deyil.",
		slogan: "Meydandan klubadək"
	},
	footer: {
		...en.footer,
		note: "Soccer Scouting kəşf platformasıdır, agentlik deyil. Müqavilə danışıqları platformadan kənarda aparılır.",
		privacy: "Məxfilik",
		terms: "Şərtlər",
		platform: "Platforma",
		players: "Oyunçular",
		clubs: "Klublar və skautlar",
		languages: "Dillər",
		rights: "© 2026 Soccer Scouting",
		payments: "Ödəniş üsulları",
		afc: "AFC regionu",
		afcNote: "Asiya Futbol Konfederasiyası regionu. Müstəqil platforma — rəsmi AFC məhsulu deyil."
	},
	plans: {
		...en.plans,
		free: "Pulsuz",
		year: "/ il",
		ctaPay: "Ödənişə keç"
	},
	paywall: {
		...en.paywall,
		title: "Profillər bağlıdır",
		register: "Hesab yarat",
		pay: "Klub girişini aç"
	},
	wallet: {
		...en.wallet,
		title: "Ödəniş",
		copy: "Ünvanı kopyala",
		copied: "Kopyalandı"
	},
	common: {
		...en.common,
		back: "Geri"
	}
};
var fa = {
	brand: "Soccer Scouting",
	tagline: "از زمین تا باشگاه",
	nav: {
		discover: "کاتالوگ",
		how: "روش کار",
		coverage: "پوشش",
		method: "روش کار",
		pricing: "تعرفه‌ها",
		signIn: "ورود",
		dashboard: "پیشخوان",
		profile: "پروفایل",
		shortlist: "فهرست پیگیری",
		inbox: "پیام‌ها",
		admin: "مدیریت",
		account: "حساب",
		wallet: "پرداخت"
	},
	theme: {
		light: "روز",
		dark: "شب",
		toggle: "حالت رنگ"
	},
	hero: {
		kicker: "منطقه AFC · بازیکن، اسکات، باشگاه",
		live: "شبکه فعال",
		title: "استعداد فوتبال آسیا، پیشِ روی باشگاه‌ها.",
		body: "ساکر اسکاتینگ پلتفرم حرفه‌ای استعدادیابی فوتبال در قاره آسیاست. بازیکن پروفایل کامل می‌سازد، فیلم بازی و داده‌های فیزیکی را ثبت می‌کند و پس از بررسی، در معرض دید باشگاه‌ها، آکادمی‌ها و اسکات‌ها قرار می‌گیرد. باشگاه‌ها با اشتراک سالانه کل کاتالوگ را می‌بینند.",
		ctaPlayer: "ساخت پروفایل بازیکن",
		ctaScout: "ورود باشگاه و اسکات",
		ctaDiscover: "مشاهده کاتالوگ",
		trust: "هیچ پروفایلی پیش از بررسی منتشر نمی‌شود. ارتباط با بازیکنان زیر ۱۸ سال محدود است. ساکر اسکاتینگ ایجنت نیست و در مذاکره قرارداد دخالت نمی‌کند.",
		fact1k: "۴۷",
		fact1v: "بازار استعداد",
		fact2k: "۱۵",
		fact2v: "پست روی زمین",
		fact3k: "۷",
		fact3v: "زبان رابط",
		fact4k: "۱۲",
		fact4v: "ماه دسترسی",
		slogan: "از زمین تا باشگاه"
	},
	stats: {
		talents: "بازار تحت پوشش",
		countries: "کشور",
		scouts: "زبان رابط",
		views: "ماه اعتبار اشتراک"
	},
	featured: {
		title: "استعدادهای منتخب",
		subtitle: "پروفایل‌های بررسی‌شده در کاتالوگ.",
		all: "مشاهده همه",
		badge: "منتخب"
	},
	method: {
		kicker: "مسیر رسیدن نام به باشگاه",
		title: "پروفایل اسکاتینگ، نه فقط کلیپ گل.",
		subtitle: "صفحهٔ اصلی هرگز فهرست بازیکنان را نشان نمی‌دهد. آنچه می‌بینید استاندارد کار است؛ همان فیلدهایی که یک هفته جذب حرفه‌ای واقعاً به آن‌ها نیاز دارد، مخصوص منطقه AFC.",
		s1t: "پرونده کامل بازیکن",
		s1b: "قد، پای غالب، زبان، سابقه باشگاهی، ارزش بازار و فیلم بازی روی یک صفحه می‌نشیند؛ همان ساختاری که گزارش اسکات با آن نوشته می‌شود.",
		s2t: "اول بررسی، بعد جستجو",
		s2b: "هویت، سن و رسانه کنترل می‌شود. تا آن لحظه، آن نام در کاتالوگ وجود ندارد.",
		s3t: "مشاهده پس از اشتراک باشگاه",
		s3b: "باشگاه، آژانس و اسکات با اشتراک سالانه به تمام پروفایل‌های تأییدشده دسترسی پیدا می‌کنند. فهرست رایگان برای اسکرپ وجود ندارد.",
		s4t: "مسیر نوجوانان رایگان است و باید اثبات شود",
		s4b: "بازیکنان ۱۶ تا ۱۹ سال پس از تأیید مدرک شناسایی و سلفی، بدون هزینه منتشر می‌شوند. این شبکه بازار کودک نیست."
	},
	clubs: {
		kicker: "باشگاه‌های منطقه AFC",
		trusted: "آرم باشگاه‌هایی که این شبکه برای رساندن استعداد به آن‌ها ساخته شده — از غرب آسیا تا اقیانوس آرام."
	},
	coverage: {
		title: "یک قاره، یک نقشه.",
		subtitle: "از غرب آسیا تا اقیانوس آرام؛ همان فیلترهایی که یک واحد جذب واقعاً با آن کار می‌کند.",
		west: "غرب آسیا",
		gulf: "خلیج فارس",
		central: "آسیای مرکزی",
		south: "جنوب آسیا",
		east: "شرق آسیا",
		sea: "جنوب‌شرق آسیا",
		open: "باز کردن"
	},
	positions: {
		title: "جذب از روی زمین.",
		subtitle: "کاتالوگ را از همان پستی باز کنید که واقعاً جذب می‌کنید. تا فعال شدن اشتراک باشگاه، تصاویر قفل می‌مانند.",
		hint: "پست‌ها",
		locked: "تا فعال شدن اشتراک باشگاه قفل است."
	},
	how: {
		title: "سه قدم تا کاتالوگ",
		s1t: "پروفایل حرفه‌ای",
		s1b: "مشخصات فیزیکی، سابقه باشگاهی، زبان و فیلم بازی — یک صفحه، همان فیلدهایی که واحد جذب با آن‌ها کار می‌کند.",
		s2t: "بررسی کیفیت",
		s2b: "تا وقتی هویت، سن و رسانه بررسی نشده، پروفایل قابل جستجو نیست.",
		s3t: "اشتراک، سپس مشاهده",
		s3b: "اشتراک باشگاه یا آژانس قاره را باز می‌کند. بازیکن ۱۶ تا ۱۹ سال پس از مدارک رایگان منتشر می‌شود. بازیکنان بزرگ‌تر مسیر سالانه می‌خرند."
	},
	split: {
		playerTitle: "برای بازیکنان",
		playerBody: "ایجنت لازم نیست. یک پروفایل. مسیر نوجوانان پس از اثبات سن رایگان است. از ۲۰ سالگی، اشتراک سالانه شما را منتشر می‌کند و به باشگاه‌های منطقه اطلاع می‌دهد.",
		scoutTitle: "برای اسکات‌ها",
		scoutBody: "هزار دلار در سال. جستجوی ساخت‌یافته، یادداشت خصوصی، و تماسی که فقط روی حساب تأییدشده باز می‌شود.",
		clubTitle: "برای باشگاه و آژانس",
		clubBody: "فیلتر پست، سن، پا و سطح. فهرست پیگیری برای نام‌هایی که مهم‌اند. در صفحهٔ اصلی هیچ کاتالوگی لو نمی‌رود."
	},
	principles: {
		title: "اصول اداره پلتفرم",
		p1t: "اول بررسی، بعد انتشار",
		p1b: "هویت، سن و رسانه هر پروفایل پیش از ورود به جستجو کنترل می‌شود.",
		p2t: "حفاظت از نوجوانان",
		p2b: "بازیکنان زیر ۱۸ سال مشخص‌اند. مسیر ۱۶ تا ۱۹ سال رایگان است و با مدرک ثابت می‌شود. بازار افراد زیر سن قانونی نیست.",
		p3t: "کشف استعداد، نه نمایندگی",
		p3b: "ساکر اسکاتینگ بازیکن را نمایندگی نمی‌کند و قرارداد نمی‌بندد. مذاکره بیرون از پلتفرم است.",
		p4t: "برای دیدن باید پرداخت کرد، برای وجود داشتن نه",
		p4b: "صفحهٔ اصلی هرگز بازیکنی را فهرست نمی‌کند. باشگاه فقط پس از اشتراک پروفایل را می‌بیند. یادداشت‌ها خصوصی می‌مانند."
	},
	voices: {
		title: "از واحد جذب",
		q1: "اسم‌ها از دست می‌رفت چون فیلم روی سه حساب اینستاگرام پخش بود. یک صفحه با فیلم همان چیزی است که یک هفته جذب واقعاً لازم دارد.",
		a1: "جذب آکادمی",
		r1: "غرب آسیا",
		q2: "استاندارد اصل ماجراست. قد، پا، سابقه، زبان — همان فیلدهایی که از قبل در گزارش می‌گذاریم.",
		a2: "اسکات تیم اول",
		r2: "خلیج فارس"
	},
	faq: {
		title: "پرسش‌های باشگاه‌ها",
		q1: "ساکر اسکاتینگ ایجنت است؟",
		a1: "خیر. ساکر اسکاتینگ ابزار کشف استعداد است. بازیکن را نمایندگی نمی‌کند، کمیسیون نمی‌گیرد و قرارداد نمی‌بندد. مذاکره بیرون از پلتفرم انجام می‌شود.",
		q2: "چه کسی پروفایل بازیکن را می‌بیند؟",
		a2: "در صفحهٔ اصلی هیچ‌کس. باشگاه، آژانس و اسکات فقط پس از اشتراک سالانهٔ ۱۰۰۰ دلاری پروفایل را می‌بینند. تا آن لحظه هر تصویر قفل است.",
		q3: "وضعیت بازیکنان زیر ۱۸ سال چیست؟",
		a3: "بازیکنان ۱۶ تا ۱۹ سال پس از تأیید مدرک شناسایی و یک سلفی (عکس یا ویدیوی کوتاه) رایگان منتشر می‌شوند. قوانین تماس سخت‌گیرانه‌تر است. زیر ۱۶ سال پذیرفته نمی‌شود.",
		q4: "بازیکن چگونه پرداخت می‌کند؟",
		a4: "۲۰ تا ۲۴ سال: ۲۰۰ دلار در سال. ۲۵ سال به بالا: ۴۰۰ دلار در سال. پرداخت با کارت (ویزا، مسترکارت، آمریکن اکسپرس)، پی‌پال یا رمزارز (تتر، بیت‌کوین، اتریوم). به‌محض تسویه، دسترسی باز می‌شود.",
		q5: "کدام کشورها پوشش داده می‌شوند؟",
		a5: "منطقه AFC: غرب آسیا، خلیج فارس، آسیای مرکزی، جنوب، شرق و جنوب‌شرق آسیا."
	},
	ctaBand: {
		title: "نامی روی میز باشگاه بگذارید — یا میز را باز کنید.",
		body: "بازیکن در چند دقیقه پروفایل می‌سازد. باشگاه با پرداخت، دوازده ماه کاتالوگ را باز می‌کند. هیچ‌چیز رایگان نشان داده نمی‌شود."
	},
	footer: {
		note: "ساکر اسکاتینگ ابزار کشف استعداد است، نه ایجنت. مذاکره قرارداد بیرون از پلتفرم است. پروفایل بازیکنان هرگز در صفحهٔ اصلی فهرست نمی‌شود.",
		privacy: "حریم خصوصی",
		terms: "شرایط استفاده",
		platform: "پلتفرم",
		players: "بازیکنان",
		clubs: "باشگاه و اسکات",
		languages: "زبان‌ها",
		rights: "© ۲۰۲۶ Soccer Scouting",
		payments: "روش‌های پرداخت",
		afc: "منطقه AFC",
		afcNote: "پوشش منطقه کنفدراسیون فوتبال آسیا. پلتفرمی مستقل — محصول رسمی AFC نیست."
	},
	lang: { label: "زبان" },
	discover: {
		title: "کاتالوگ استعدادها",
		subtitle: "قاره را فیلتر کنید. پروفایل‌ها تا فعال شدن اشتراک باشگاه قفل می‌مانند.",
		search: "نام، باشگاه یا شهر",
		age: "سن",
		position: "پست",
		country: "کشور",
		foot: "پای غالب",
		level: "سطح",
		any: "همه",
		sort: "مرتب‌سازی",
		newest: "جدیدترین",
		views: "پربازدید",
		height: "قد",
		empty: "پروفایلی با این فیلترها پیدا نشد.",
		results: "پروفایل",
		filters: "فیلترها"
	},
	player: {
		about: "درباره",
		career: "سابقه",
		videos: "ویدیوها",
		physical: "فیزیک",
		height: "قد",
		weight: "وزن",
		foot: "پا",
		age: "سن",
		club: "باشگاه فعلی",
		languages: "زبان‌ها",
		achievements: "افتخارات",
		injury: "وضعیت مصدومیت",
		views: "بازدید پروفایل",
		contact: "درخواست تماس",
		shortlist: "افزودن به فهرست پیگیری",
		shortlisted: "در فهرست پیگیری",
		share: "اشتراک‌گذاری",
		youth: "زیر ۱۸ سال",
		present: "اکنون",
		noVideos: "ویدیویی ثبت نشده.",
		position: "پست",
		overview: "نمای کلی",
		facts: "اطلاعات بازیکن",
		placeOfBirth: "محل تولد",
		citizenship: "تابعیت",
		dateOfBirth: "تاریخ تولد / سن",
		marketValue: "ارزش بازار",
		currentValue: "ارزش فعلی بازار",
		joined: "تاریخ پیوستن",
		contract: "پایان قرارداد",
		agent: "ایجنت بازیکن",
		outfitter: "اسپانسر پوشاک",
		nationalTeam: "تیم ملی",
		caps: "بازی ملی / گل",
		season: "فصل",
		competition: "رقابت",
		appearances: "بازی",
		goals: "گل",
		assists: "پاس گل",
		minutes: "دقیقه",
		transfers: "تاریخچه انتقال",
		similar: "بازیکنان مشابه",
		shirt: "شماره پیراهن",
		stats: "آمار دوران بازی",
		yellow: "کارت زرد",
		red: "کارت قرمز",
		sample: "نمونه پروفایل",
		none: "—",
		lastUpdate: "آخرین به‌روزرسانی",
		nameInHome: "نام در کشور مبدأ"
	},
	auth: {
		title: "ورود به Soccer Scouting",
		subtitle: "یک حساب برای بازیکن، اسکات و باشگاه.",
		email: "ایمیل",
		password: "رمز عبور",
		name: "نام",
		signIn: "ورود با ایمیل",
		signUp: "ساخت حساب",
		or: "یا",
		have: "حساب دارید؟ ورود",
		need: "حساب ندارید؟ ثبت‌نام",
		google: "ادامه با گوگل",
		x: "ادامه با X",
		error: "ورود ناموفق بود. دوباره تلاش کنید."
	},
	onboarding: {
		title: "نقش خود را انتخاب کنید",
		subtitle: "در صورت نیاز، پشتیبانی بعداً آن را تغییر می‌دهد.",
		player: "بازیکن",
		playerHint: "پروفایل بسازید و پس از بررسی در کاتالوگ باشگاه‌ها دیده شوید.",
		scout: "اسکات / باشگاه / ایجنت",
		scoutHint: "اشتراک سالانهٔ ۱۰۰۰ دلاری برای جستجو، فهرست پیگیری و تماس.",
		org: "نام سازمان یا باشگاه",
		orgRole: "سمت",
		continue: "ادامه",
		claimAdmin: "اولین کاربر هستید — دسترسی مدیریت را فعال کنید"
	},
	dash: {
		welcome: "سلام",
		playerTitle: "پیشخوان بازیکن",
		scoutTitle: "پیشخوان اسکات",
		status: "وضعیت پروفایل",
		complete: "تکمیل پروفایل",
		submit: "ارسال برای بررسی",
		views: "بازدید",
		requests: "درخواست‌ها",
		pendingScout: "حساب اسکات در انتظار بررسی است. برای دیدن پروفایل‌ها باید اشتراک را هم بخرید.",
		rejectedScout: "حساب اسکات رد شده است.",
		emptyInbox: "پیامی نیست.",
		notifications: "اعلان‌ها",
		markRead: "خوانده شد"
	},
	profileForm: {
		title: "پروفایل بازیکن",
		basic: "اطلاعات پایه",
		sport: "اطلاعات ورزشی",
		media: "رسانه",
		extra: "تکمیلی",
		first: "نام",
		last: "نام خانوادگی",
		dob: "تاریخ تولد",
		city: "شهر",
		nationality: "ملیت",
		height: "قد (سانتی‌متر)",
		weight: "وزن (کیلوگرم)",
		jersey: "شماره پیراهن",
		secondary: "پست‌های فرعی",
		club: "باشگاه فعلی",
		achievements: "افتخارات",
		injury: "مصدومیت فعلی",
		bio: "بیوگرافی کوتاه",
		instagram: "اینستاگرام",
		photo: "آدرس عکس پرتره",
		fullBody: "آدرس عکس تمام‌قد",
		languages: "زبان‌ها",
		education: "تحصیلات",
		videoUrl: "لینک یوتیوب",
		videoTitle: "عنوان ویدیو",
		addVideo: "افزودن ویدیو",
		save: "ذخیره پیش‌نویس",
		submit: "ارسال برای تأیید",
		locked: "پروفایل در صف بررسی است و تا اعلام نتیجه قفل است.",
		revision: "نیاز به اصلاح",
		saved: "ذخیره شد",
		submitted: "ارسال شد"
	},
	status: {
		draft: "پیش‌نویس",
		pending: "در انتظار بررسی",
		approved: "تأیید شده",
		needs_revision: "نیاز به اصلاح",
		rejected: "رد شده"
	},
	scout: {
		notes: "یادداشت خصوصی",
		saveNotes: "ذخیره یادداشت",
		message: "پیام به بازیکن",
		send: "ارسال درخواست",
		sent: "درخواست ارسال شد",
		needApproved: "پس از تأیید حساب اسکات می‌توانید تماس بگیرید.",
		emptyList: "فهرست پیگیری خالی است. از کاتالوگ بازیکن اضافه کنید.",
		lists: "لیست‌ها"
	},
	admin: {
		title: "پنل مدیریت",
		queue: "صف پروفایل‌ها",
		scouts: "اسکات‌ها",
		users: "کاربران",
		approve: "تأیید",
		reject: "رد",
		revision: "درخواست اصلاح",
		note: "یادداشت بررسی",
		empty: "موردی در صف نیست.",
		bootstrap: "فعال‌سازی دسترسی مدیر",
		youth: "مدارک نوجوانان"
	},
	common: {
		loading: "در حال بارگذاری",
		save: "ذخیره",
		cancel: "انصراف",
		close: "بستن",
		years: "سال",
		cm: "سانتی‌متر",
		kg: "کیلوگرم",
		back: "بازگشت",
		required: "الزامی"
	},
	plans: {
		kicker: "دسترسی سالانه",
		title: "یک قیمت. دوازده ماه. به‌محض تسویه فعال می‌شود.",
		subtitle: "بازیکنان ۱۶ تا ۱۹ سال پس از اثبات سن رایگان منتشر می‌شوند. بقیه — از جمله هر باشگاه و آژانس — یک سال می‌خرند. پرداخت با کارت، پی‌پال یا رمزارز.",
		year: "/ سال",
		free: "رایگان",
		ctaPay: "رفتن به پرداخت",
		ctaYouth: "شروع اثبات سن",
		youth: {
			kicker: "۱۶ تا ۱۹",
			title: "مسیر آکادمی",
			body: "برای بازیکنانی که هنوز در پنجرهٔ نوجوانان هستند. سن را با مدرک شناسایی و یک سلفی ثابت کنید. پس از تأیید، انتشار هیچ هزینه‌ای ندارد.",
			f1: "مدرک شناسایی + سلفی (عکس یا ویدیوی کوتاه)",
			f2: "بررسی توسط Soccer Scouting",
			f3: "پروفایل عمومی پس از تأیید — صفر دلار",
			f4: "قوانین تماس سخت‌گیرانه‌تر"
		},
		player_u24: {
			kicker: "۲۰ تا ۲۴",
			title: "پنجرهٔ قرارداد اول",
			body: "سال‌هایی که باشگاه‌ها واقعاً جذب می‌کنند. پروفایل منتشر می‌شود و به باشگاه‌های منطقه اطلاع داده می‌شود.",
			f1: "۲۰۰ دلار، سالی یک‌بار",
			f2: "پروفایل پس از بررسی عمومی می‌شود",
			f3: "اطلاع به ایمیل باشگاه‌های شبکه",
			f4: "کارت، پی‌پال یا رمزارز — دسترسی با پرداخت"
		},
		player_senior: {
			kicker: "۲۵ به بالا",
			title: "بازار بزرگسال",
			body: "برای بازیکنانی که در سطح بزرگسال بازی می‌کنند و هنوز به یک پروفایل تمیز و قابل جستجو روی میزهای آسیا نیاز دارند.",
			f1: "۴۰۰ دلار، سالی یک‌بار",
			f2: "انتشار کامل پس از بررسی",
			f3: "اطلاع به باشگاه‌ها",
			f4: "کارت، پی‌پال یا رمزارز — دسترسی با پرداخت"
		},
		desk: {
			kicker: "باشگاه / ایجنت / اسکات",
			title: "دسترسی باشگاه",
			body: "تنها راهی که یک نام از حالت قفل خارج می‌شود. قاره را فیلتر کنید، یادداشت خصوصی بگذارید، درخواست تماس بفرستید. یک اشتراک برای کل واحد جذب.",
			f1: "۱۰۰۰ دلار، سالی یک‌بار",
			f2: "باز شدن همه پروفایل‌های بررسی‌شده",
			f3: "فهرست پیگیری و یادداشت خصوصی",
			f4: "تماس پس از تأیید حساب شما",
			f5: "کارت، پی‌پال یا رمزارز — فعال‌سازی فوری"
		}
	},
	wallet: {
		title: "پرداخت",
		subtitle: "با کارت، پی‌پال یا رمزارز پرداخت کنید. به‌محض پوشش مبلغ پلن، دسترسی باز می‌شود.",
		address: "آدرس واریز شما",
		network: "شبکه",
		asset: "دارایی",
		balance: "موجودی",
		copy: "کپی آدرس",
		copied: "کپی شد",
		detect: "پرداخت انجام شد — تأیید",
		detecting: "در حال تأیید…",
		amount: "مبلغ (دلار)",
		subscribe: "الان دسترسی را فعال کن",
		active: "دسترسی فعال",
		until: "تا",
		empty: "هنوز حرکتی ثبت نشده.",
		deposit: "پرداخت",
		spend: "اشتراک",
		hint: "روش را انتخاب کنید، مبلغ پلن را بپردازید؛ دسترسی همان لحظه باز می‌شود."
	},
	pay: {
		card: "کارت بانکی",
		paypal: "پی‌پال",
		crypto: "رمزارز",
		cardNumber: "شماره کارت",
		expiry: "تاریخ انقضا",
		cvc: "CVC",
		cardName: "نام روی کارت",
		payNow: "پرداخت",
		processing: "در حال پردازش…",
		success: "پرداخت دریافت شد",
		methods: "روش‌های پذیرفته‌شده",
		choose: "روش پرداخت را انتخاب کنید",
		usdt: "تتر (TRC20)",
		btc: "بیت‌کوین",
		eth: "اتریوم"
	},
	paywall: {
		title: "پروفایل‌ها قفل‌اند",
		body: "سایت عمومی هرگز بازیکنی را فهرست نمی‌کند. حساب بسازید، سپس اشتراک باشگاه را بخرید. تا آن لحظه هر تصویر قفل می‌ماند.",
		register: "ساخت حساب",
		pay: "باز کردن دسترسی باشگاه",
		price: "دسترسی باشگاه و آژانس · ۱۰۰۰ دلار در سال · کارت، پی‌پال یا رمزارز",
		sealed: "پروفایل قفل‌شده"
	},
	youth: {
		title: "اثبات مسیر آکادمی",
		body: "بازیکنان ۱۶ تا ۱۹ سال رایگان منتشر می‌شوند. مدرک شناسایی دولتی، یک سلفی واضح، و در صورت تمایل یک ویدیوی کوتاه سلفی بفرستید. سن پیش از هر انتشار عمومی بررسی می‌شود.",
		id: "آدرس تصویر مدرک شناسایی",
		selfie: "آدرس عکس سلفی",
		video: "آدرس ویدیوی سلفی (اختیاری)",
		send: "ارسال برای بررسی سن",
		pending: "مدارک در حال بررسی است.",
		approved: "مسیر آکادمی تأیید شد — انتشار رایگان است.",
		rejected: "مدارک رد شد. لطفاً دوباره بفرستید."
	}
};
var ku = {
	...en,
	brand: "Soccer Scouting",
	tagline: "لە یاریگا بۆ یانە",
	nav: {
		...en.nav,
		discover: "کاتالۆگ",
		how: "چۆن کاردەکات",
		coverage: "پوشش",
		method: "ڕێباز",
		pricing: "نرخەکان",
		signIn: "چوونەژوورەوە",
		dashboard: "داشبۆرد",
		profile: "پڕۆفایل",
		shortlist: "لیستی بەدواداچوون",
		inbox: "نامەکان",
		admin: "بەڕێوەبەر",
		account: "هەژمار",
		wallet: "پارەدان"
	},
	theme: {
		light: "ڕۆژ",
		dark: "شەو",
		toggle: "دۆخی ڕەنگ"
	},
	hero: {
		...en.hero,
		kicker: "ناوچەی AFC · یاریزان، سکاوت، یانە",
		live: "تۆڕ چالاکە",
		title: "بەهرەی ئاسیا، بەردەم یانەکان.",
		body: "سۆکەر سکاوتینگ پلاتفۆرمی پیشەیی دۆزینەوەی بەهرەی تۆپی پێیە بۆ ئاسیا. یاریزان پڕۆفایلی پشتڕاستکراو بڵاو دەکاتەوە. یانەکان بە بەشداریی ساڵانە کاتالۆگ دەکەنەوە.",
		ctaPlayer: "پڕۆفایلی یاریزان دروست بکە",
		ctaScout: "چوونەژوورەی یانە و سکاوت",
		ctaDiscover: "کاتالۆگ ببینە",
		trust: "هیچ پڕۆفایلێک پێش پێداچوونەوە بڵاو نابێتەوە. پەیوەندی لەگەڵ خوار ١٨ ساڵ سنووردارە. سۆکەر سکاوتینگ بریکار نییە.",
		slogan: "لە یاریگا بۆ یانە"
	},
	footer: {
		...en.footer,
		note: "سۆکەر سکاوتینگ ئامرازی دۆزینەوەیە، نەک بریکار. گفتوگۆی گرێبەست لە دەرەوەی پلاتفۆرمە.",
		privacy: "تایبەتمەندی",
		terms: "مەرجەکان",
		platform: "پلاتفۆرم",
		players: "یاریزانەکان",
		clubs: "یانە و سکاوت",
		languages: "زمانەکان",
		rights: "© ٢٠٢٦ Soccer Scouting",
		payments: "شێوازەکانی پارەدان",
		afc: "ناوچەی AFC",
		afcNote: "ناوچەی یەکێتی تۆپی پێی ئاسیا. پلاتفۆرمێکی سەربەخۆ — بەرهەمی فەرمی AFC نییە."
	},
	plans: {
		...en.plans,
		free: "بەخۆڕایی",
		year: "/ ساڵ",
		ctaPay: "بڕۆ بۆ پارەدان"
	},
	paywall: {
		...en.paywall,
		title: "پڕۆفایلەکان قفڵن",
		register: "هەژمار دروست بکە",
		pay: "دەستپێگەیشتنی یانە بکەرەوە"
	},
	wallet: {
		...en.wallet,
		title: "پارەدان",
		copy: "ناونیشان کۆپی بکە",
		copied: "کۆپی کرا"
	},
	common: {
		...en.common,
		back: "گەڕانەوە"
	}
};
var messages = {
	fa,
	en,
	ar,
	tr: {
		...en,
		brand: "Soccer Scouting",
		tagline: "Sahadan kulübe",
		nav: {
			...en.nav,
			discover: "Katalog",
			how: "Nasıl çalışır",
			coverage: "Kapsam",
			method: "Yöntem",
			pricing: "Fiyatlar",
			signIn: "Giriş",
			dashboard: "Panel",
			profile: "Profil",
			shortlist: "İzleme listesi",
			inbox: "Mesajlar",
			admin: "Yönetim",
			account: "Hesap",
			wallet: "Ödeme"
		},
		theme: {
			light: "Gündüz",
			dark: "Gece",
			toggle: "Renk modu"
		},
		hero: {
			...en.hero,
			kicker: "AFC bölgesi · oyuncu, scout, kulüp",
			live: "Ağ açık",
			title: "Asya'nın yeteneği, kulüplerin önünde.",
			body: "Soccer Scouting, Asya için profesyonel futbol scouting platformudur. Oyuncu; maç filmi, fiziksel veriler ve kariyer geçmişiyle doğrulanmış bir profil yayımlar. İncelemeden sonra kulüpler, akademiler ve scoutlar kıtayı arar.",
			ctaPlayer: "Oyuncu profili oluştur",
			ctaScout: "Kulüp ve scout girişi",
			ctaDiscover: "Kataloğa bak",
			trust: "Hiçbir profil incelemeden yayımlanmaz. 18 yaş altıyla iletişim kısıtlıdır. Soccer Scouting bir ajans değildir ve sözleşme müzakere etmez.",
			fact1v: "yetenek pazarı",
			fact2v: "sahadaki mevki",
			fact3v: "arayüz dili",
			fact4v: "ay erişim",
			slogan: "Sahadan kulübe"
		},
		clubs: {
			kicker: "AFC bölgesindeki kulüpler",
			trusted: "Ağın ulaşmak için kurulduğu kulüp armaları — Batı Asya'dan Pasifik'e."
		},
		footer: {
			...en.footer,
			note: "Soccer Scouting bir keşif platformudur, ajans değildir. Sözleşme görüşmeleri platform dışında yapılır.",
			privacy: "Gizlilik",
			terms: "Şartlar",
			platform: "Platform",
			players: "Oyuncular",
			clubs: "Kulüpler ve scoutlar",
			languages: "Diller",
			rights: "© 2026 Soccer Scouting",
			payments: "Ödeme yöntemleri",
			afc: "AFC bölgesi",
			afcNote: "Asya Futbol Konfederasyonu bölgesi. Bağımsız platform — resmi AFC ürünü değildir."
		},
		plans: {
			...en.plans,
			title: "Tek fiyat. On iki ay. Ödeme geçince anında açılır.",
			free: "Ücretsiz",
			year: "/ yıl",
			ctaPay: "Ödemeye git",
			ctaYouth: "Yaş kanıtına başla"
		},
		paywall: {
			...en.paywall,
			title: "Profiller kilitli",
			register: "Hesap oluştur",
			pay: "Kulüp erişimini aç",
			sealed: "Kilitli profil"
		},
		wallet: {
			...en.wallet,
			title: "Ödeme",
			copy: "Adresi kopyala",
			copied: "Kopyalandı",
			detect: "Ödeme gönderildi — onayla",
			subscribe: "Erişimi şimdi aç"
		},
		common: {
			...en.common,
			back: "Geri",
			loading: "Yükleniyor"
		}
	},
	az,
	ur: {
		...en,
		brand: "Soccer Scouting",
		tagline: "میدان سے کلب تک",
		nav: {
			...en.nav,
			discover: "کیٹلاگ",
			how: "طریقۂ کار",
			coverage: "کوریج",
			method: "طریقہ",
			pricing: "قیمتیں",
			signIn: "داخلہ",
			dashboard: "ڈیش بورڈ",
			profile: "پروفائل",
			shortlist: "واچ لسٹ",
			inbox: "پیغامات",
			admin: "ایڈمن",
			account: "اکاؤنٹ",
			wallet: "ادائیگی"
		},
		theme: {
			light: "دن",
			dark: "رات",
			toggle: "رنگ موڈ"
		},
		hero: {
			...en.hero,
			kicker: "AFC علاقہ · کھلاڑی، اسکاؤٹ، کلب",
			live: "نیٹ ورک فعال",
			title: "ایشیا کی صلاحیت، کلبوں کے سامنے.",
			body: "ساکر اسکاؤٹنگ ایشیا کے لیے پیشہ ورانہ فٹ بال اسکاؤٹنگ پلیٹ فارم ہے۔ کھلاڑی میچ فلم، جسمانی ڈیٹا اور کیریئر کے ساتھ تصدیق شدہ پروفائل شائع کرتا ہے۔ کلب سالانہ سبسکرپشن سے کیٹلاگ کھولتے ہیں۔",
			ctaPlayer: "پلیئر پروفائل بنائیں",
			ctaScout: "کلب اور اسکاؤٹ رسائی",
			ctaDiscover: "کیٹلاگ دیکھیں",
			trust: "کوئی پروفائل جائزے سے پہلے شائع نہیں ہوتا۔ ۱۸ سال سے کم عمر سے رابطہ محدود ہے۔ ساکر اسکاؤٹنگ ایجنٹ نہیں ہے۔",
			slogan: "میدان سے کلب تک"
		},
		footer: {
			...en.footer,
			note: "ساکر اسکاؤٹنگ دریافت کا پلیٹ فارم ہے، ایجنسی نہیں۔ معاہدے پلیٹ فارم سے باہر ہوتے ہیں۔",
			privacy: "پرائیویسی",
			terms: "شرائط",
			platform: "پلیٹ فارم",
			players: "کھلاڑی",
			clubs: "کلب اور اسکاؤٹس",
			languages: "زبانیں",
			rights: "© ۲۰۲۶ Soccer Scouting",
			payments: "ادائیگی کے طریقے",
			afc: "AFC علاقہ",
			afcNote: "ایشین فٹ بال کنفیڈریشن کا علاقہ۔ آزاد پلیٹ فارم — AFC کی سرکاری پروڈکٹ نہیں۔"
		},
		plans: {
			...en.plans,
			free: "مفت",
			year: "/ سال",
			ctaPay: "ادائیگی پر جائیں"
		},
		paywall: {
			...en.paywall,
			title: "پروفائلز مقفل ہیں",
			register: "اکاؤنٹ بنائیں",
			pay: "کلب رسائی کھولیں"
		},
		wallet: {
			...en.wallet,
			title: "ادائیگی",
			copy: "ایڈریس کاپی",
			copied: "کاپی ہو گیا"
		},
		common: {
			...en.common,
			back: "واپس"
		}
	},
	ku
};
var STORAGE_KEY$1 = "kavosh-locale";
function lookup(obj, path) {
	const parts = path.split(".");
	let cur = obj;
	for (const p of parts) if (cur && typeof cur === "object" && p in cur) cur = cur[p];
	else return path;
	return typeof cur === "string" ? cur : path;
}
var I18nContext = (0, import_react.createContext)(null);
function I18nProvider({ children }) {
	const [locale, setLocaleState] = (0, import_react.useState)("fa");
	(0, import_react.useEffect)(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY$1);
			if (isLocale(stored)) {
				setLocaleState(stored);
				return;
			}
			const nav = window.navigator.language || window.navigator.languages?.[0] || "fa";
			setLocaleState(detectLocale(nav));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = LOCALE_META[locale].html;
		document.documentElement.dir = dirOf(locale);
		document.documentElement.dataset.locale = locale;
	}, [locale]);
	const value = (0, import_react.useMemo)(() => {
		const setLocale = (l) => {
			setLocaleState(l);
			try {
				window.localStorage.setItem(STORAGE_KEY$1, l);
			} catch {}
		};
		return {
			locale,
			setLocale,
			t: (key) => lookup(messages[locale], key),
			dir: dirOf(locale)
		};
	}, [locale]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	const ctx = (0, import_react.useContext)(I18nContext);
	if (!ctx) throw new Error("useI18n outside provider");
	return ctx;
}
var STORAGE_KEY = "kavosh-theme";
var ThemeContext = (0, import_react.createContext)(null);
function applyTheme(t) {
	const d = document.documentElement;
	d.dataset.theme = t;
	d.classList.toggle("dark", t === "dark");
	d.classList.toggle("light", t === "light");
	const meta = document.querySelector("meta[name=\"theme-color\"]");
	if (meta) meta.setAttribute("content", t === "light" ? "#f3efe6" : "#0b0d0c");
}
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)("dark");
	(0, import_react.useEffect)(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored === "light" || stored === "dark") {
				setThemeState(stored);
				applyTheme(stored);
				return;
			}
			const next = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
			setThemeState(next);
			applyTheme(next);
		} catch {}
	}, []);
	const value = (0, import_react.useMemo)(() => {
		const setTheme = (t) => {
			setThemeState(t);
			applyTheme(t);
			try {
				window.localStorage.setItem(STORAGE_KEY, t);
			} catch {}
		};
		return {
			theme,
			setTheme,
			toggle: () => setTheme(theme === "dark" ? "light" : "dark")
		};
	}, [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
function useTheme() {
	const ctx = (0, import_react.useContext)(ThemeContext);
	if (!ctx) throw new Error("useTheme outside provider");
	return ctx;
}
var styles_default = "/assets/styles-Cz5aECjN.css";
var APP_NAME = "Soccer Scouting";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$12 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "From the pitch to the club — Asia's football scouting platform"
			},
			{
				name: "theme-color",
				content: "#0b0d0c"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Vazirmatn:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function ThemedToaster() {
	const { theme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme,
		position: "bottom-center"
	});
}
function RootDocument() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		suppressHydrationWarning: true,
		className: "antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var rtl={fa:1,ar:1,ur:1,ku:1};var html={ku:"ckb"};var l=localStorage.getItem("kavosh-locale");if(!l){var n=(navigator.language||"").toLowerCase();if(n.indexOf("fa")===0||n.indexOf("ps")===0||n.indexOf("tg")===0)l="fa";else if(n.indexOf("ar")===0)l="ar";else if(n.indexOf("tr")===0)l="tr";else if(n.indexOf("az")===0)l="az";else if(n.indexOf("ur")===0)l="ur";else if(n.indexOf("ku")===0||n.indexOf("ckb")===0)l="ku";else if(n.indexOf("en")===0)l="en";else l="fa";}var d=document.documentElement;d.lang=html[l]||l;d.dir=rtl[l]?"rtl":"ltr";d.dataset.locale=l;var t=localStorage.getItem("kavosh-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}d.dataset.theme=t;d.classList.toggle("dark",t==="dark");d.classList.toggle("light",t==="light");}catch(e){}})();` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-screen bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
					client: queryClient,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(I18nProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemedToaster, {})] }) }) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$10 = () => import("./routes-DewcvvTc.mjs");
var Route$11 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin-D_KiqL6V.mjs");
var Route$10 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./app-Ba5utOpo.mjs");
var Route$9 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./discover-Dy48caDv.mjs");
var Route$8 = createFileRoute("/discover")({
	validateSearch: (search) => {
		const next = {};
		if (typeof search.position === "string" && search.position) next.position = search.position;
		if (typeof search.country === "string" && search.country) next.country = search.country;
		return next;
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./login-Bgo2llIm.mjs");
var Route$7 = createFileRoute("/login")({
	validateSearch: (search) => {
		const next = typeof search.next === "string" && search.next.startsWith("/") && !search.next.startsWith("//") ? search.next : void 0;
		return next ? { next } : {};
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./onboarding-BK3o15uh.mjs");
var Route$6 = createFileRoute("/onboarding")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./app.index-CVL9LCs6.mjs");
var Route$5 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./app.profile-DFur_9C_.mjs");
var Route$4 = createFileRoute("/app/profile")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./app.shortlist-C5fxCcbs.mjs");
var Route$3 = createFileRoute("/app/shortlist")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./app.wallet-BP7LPMv6.mjs");
var Route$2 = createFileRoute("/app/wallet")({
	validateSearch: (search) => {
		const plan = search.plan;
		if (plan === "player_u24" || plan === "player_senior" || plan === "desk") return { plan };
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./players._id-DVAwU6p2.mjs");
var Route$1 = createFileRoute("/players/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var AdminRoute = Route$10.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$12
});
var AppRoute = Route$9.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$12
});
var DiscoverRoute = Route$8.update({
	id: "/discover",
	path: "/discover",
	getParentRoute: () => Route$12
});
var LoginRoute = Route$7.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$12
});
var OnboardingRoute = Route$6.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$12
});
var AppIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppProfileRoute = Route$4.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppRoute
});
var AppShortlistRoute = Route$3.update({
	id: "/shortlist",
	path: "/shortlist",
	getParentRoute: () => AppRoute
});
var AppWalletRoute = Route$2.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => AppRoute
});
var PlayersIdRoute = Route$1.update({
	id: "/players/$id",
	path: "/players/$id",
	getParentRoute: () => Route$12
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$12
});
var AppRouteChildren = {
	AppProfileRoute,
	AppShortlistRoute,
	AppWalletRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	DiscoverRoute,
	LoginRoute,
	OnboardingRoute,
	PlayersIdRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$8 as a, LOCALES as c, Route$7 as i, LOCALE_META as l, Route$1 as n, useTheme as o, Route$2 as r, useI18n as s, router_exports as t, dirOf as u };

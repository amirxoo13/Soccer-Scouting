import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-D6GH5reL.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function ageFromDob(dob) {
	if (!dob) return null;
	const d = new Date(dob);
	if (Number.isNaN(d.getTime())) return null;
	const now = /* @__PURE__ */ new Date();
	let age = now.getFullYear() - d.getFullYear();
	const m = now.getMonth() - d.getMonth();
	if (m < 0 || m === 0 && now.getDate() < d.getDate()) age -= 1;
	return age;
}
function initials(first, last) {
	return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}
//#endregion
export { cn as n, initials as r, ageFromDob as t };

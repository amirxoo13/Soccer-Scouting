import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn, r as initials } from "./utils-D6GH5reL.mjs";
import { i as PITCH_COORDS } from "./football-Bg2Gurrr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pitch-mark-DUe--7pM.js
var import_jsx_runtime = require_jsx_runtime();
function PlayerPhoto({ url, first, last, className }) {
	if (url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: `${first} ${last}`,
		className: cn("object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid place-items-center bg-muted font-display text-2xl text-muted-foreground", className),
		children: initials(first, last)
	});
}
function PitchMark({ position, className }) {
	const coord = position ? PITCH_COORDS[position] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 80 120",
		className: cn("text-pitch", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "2",
				y: "2",
				width: "76",
				height: "116",
				rx: "4",
				fill: "#0e1411",
				stroke: "currentColor",
				strokeWidth: "1.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "2",
				y1: "60",
				x2: "78",
				y2: "60",
				stroke: "currentColor",
				strokeWidth: "0.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "40",
				cy: "60",
				r: "12",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "0.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "22",
				y: "2",
				width: "36",
				height: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "0.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "22",
				y: "102",
				width: "36",
				height: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "0.8"
			}),
			coord && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: coord.x * .8,
				cy: coord.y * 1.2,
				r: "4.5",
				fill: "#c5d0c8"
			})
		]
	});
}
//#endregion
export { PlayerPhoto as n, PitchMark as t };

import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scout-BJTjTagO.js
var listWatchlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("32535b832e9e53a8dece1be169b8adbc4735c7a612bfc349342bdd000c1ce30e"));
var watchlistIds = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9dfbad5ccfb044aa466337d010235a12f99c7c7c096a85c10e7849b075de19c4"));
var toggleWatchlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((profileId) => profileId).handler(createSsrRpc("c09c55275b23465866010bdf872f105766efc1144b00413603c618a9433e7a49"));
var updateWatchItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("72452753eb9ac767e4705ee9b0c431a4f034cf0221cb71247db7c333ea7630b1"));
var sendContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("86d628ff2af005d29e2c5221e5fda5624fd0f77dee4e2938adb254b09f7093da"));
var listSentRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("01c48254c094290fe4b53975700301503911b04e72bc50733e2eb5ba244056ba"));
//#endregion
export { updateWatchItem as a, toggleWatchlist as i, listWatchlist as n, watchlistIds as o, sendContact as r, listSentRequests as t };

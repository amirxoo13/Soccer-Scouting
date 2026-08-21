import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-DvIP4gK3.js
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9bd8037c200ab7b640b046e87c2b79fbaa6387f31dd76fb43dde046bee313019"));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fb624c1069da20095dbd193ec1823ad302414197f8632215c82cb358b9076b8b"));
var claimAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("b3dfe91e4dd064ba2c5ded393a73aa5c7552afb04fd10cdabbb7601f5c5720b6"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ebb1b342bcad2b0b500b3203f63788ba3dba9c1b5350acc0b40122697280ebe9"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("1d312f7e61baffd918c3bf6aabd99eee581d60168eb454a1dc3227bc51330a60"));
//#endregion
export { markNotificationsRead as a, listNotifications as i, completeOnboarding as n, getMe as r, claimAdmin as t };

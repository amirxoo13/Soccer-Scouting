import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/player-BTTs285P.js
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("12b7abd36edbc8b50cbfcba361b30daba5bc8052f71aeab08e469a7cdfcb5c50"));
var saveMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ec8a3e2ce551f078f48e8d2791143057c603eacb4e7505a933717ebc666910a6"));
var submitMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("9197e3199b7038873d31e81a844bb0e147b8d45749280f58eab04030afc2f303"));
var listMyInbox = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f497900c31a6be699343f0e36b398542f2f449c5632794d9d0e004ef8d7c949a"));
//#endregion
export { submitMyProfile as i, listMyInbox as n, saveMyProfile as r, getMyProfile as t };

//#region node_modules/.nitro/vite/services/ssr/assets/plans-C5YhbBM0.js
var PLANS = [
	{
		id: "youth",
		usd: 0,
		audience: "player",
		ageMin: 16,
		ageMax: 19
	},
	{
		id: "player_u24",
		usd: 200,
		audience: "player",
		ageMin: 20,
		ageMax: 24
	},
	{
		id: "player_senior",
		usd: 400,
		audience: "player",
		ageMin: 25
	},
	{
		id: "desk",
		usd: 1e3,
		audience: "desk"
	}
];
function planById(id) {
	return PLANS.find((p) => p.id === id);
}
function playerPlanForAge(age) {
	if (age == null) return null;
	if (age >= 16 && age <= 19) return "youth";
	if (age >= 20 && age <= 24) return "player_u24";
	if (age >= 25) return "player_senior";
	return null;
}
//#endregion
export { planById as n, playerPlanForAge as r, PLANS as t };

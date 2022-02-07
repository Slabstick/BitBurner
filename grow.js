/** @param {NS} ns **/
export async function main(ns) {

	var serverName = ns.args[0];
	var moneyThresh = ns.getServerMaxMoney(serverName) * 0.75;

	while (true) {
		
		ns.print("If the amount of money, namely " + ns.nFormat(ns.getServerMoneyAvailable(serverName), '$0.000a') + " is below the threshold of " + ns.nFormat(moneyThresh, '$0.000a') + ", then grow!");
		
		 if (ns.getServerMoneyAvailable(serverName) < moneyThresh) {
			ns.print("Grow " + serverName + '!')
			await ns.grow(serverName);
			await ns.sleep(30);
		} else {
			await ns.sleep(5000);
		}


	}
}

/** @param {NS} ns **/
export async function main(ns) {

	var serverName = ns.args[0];
	var moneyThresh = ns.getServerMaxMoney(serverName) * 0.75;

	while (true) {
		
		ns.print("Wenn Servergeld von " + ns.nFormat(ns.getServerMoneyAvailable(serverName), '0a') + " unter dem Threshold von " + ns.nFormat(moneyThresh, '0a') + " liegt, dann führe Grow durch!");
		
		 if (ns.getServerMoneyAvailable(serverName) < moneyThresh) {
			ns.print("Grow " + serverName + '!')
			await ns.grow(serverName);
			await ns.sleep(30);
		} else {
			await ns.sleep(5000);
		}


	}
}
/** @param {NS} ns **/
export async function main(ns) {

	var ServerName = ns.getHostname();

	if (ServerName == "avmnite-02h") {
		ServerName = "silver-helix";
	}

	if (ServerName == "CSEC") {
		ServerName = "neo-net";
	}

	if (ServerName == "home") {
		ServerName = "crush-fitness";
	}

	if (ServerName == 'foodnstuff') {
		ServerName = "n00dles";
	}
	var moneyThresh = ns.getServerMaxMoney(ServerName) * 0.5;
	var secThresh = ns.getServerMinSecurityLevel(ServerName) + 5;



	while (true) {
		ns.print("If ServerSecurity " + ns.nFormat(ns.getServerSecurityLevel(ServerName), '0a') + " is higher than the threshold of " + ns.nFormat(secThresh, '0a') + " , start to weaken!");
		ns.print("If the available money of " + ns.nFormat(ns.getServerMoneyAvailable(ServerName), '$0.000a') + " is lower than the threshold of " + ns.nFormat(moneyThresh, '$0.000a') + " start to grow!");
		if (ns.getServerSecurityLevel(ServerName) > secThresh) {
			ns.print("Weaken!");
			await ns.weaken(ServerName);
			await ns.sleep(30);
		} else if (ns.getServerMoneyAvailable(ServerName) < moneyThresh) {
			ns.print("Grow!")
			await ns.grow(ServerName);
			await ns.sleep(30);
		} else {
			ns.print("Everything perfect! Give da monies!")
			await ns.hack(ServerName);
			await ns.sleep(30);
		}
	}
}

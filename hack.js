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
		ns.print("Wenn ServerSecurity von " + ns.nFormat(ns.getServerSecurityLevel(ServerName), '0a') + " über dem Threshold von " + ns.nFormat(secThresh, '0a') + " liegt, dann starte Weaken!");
		ns.print("Wenn Servergeld von " + ns.nFormat(ns.getServerMoneyAvailable(ServerName), '0a') + " unter dem Threshold von " + ns.nFormat(moneyThresh, '0a') + " liegt, dann führe Grow durch!");
		if (ns.getServerSecurityLevel(ServerName) > secThresh) {
			ns.print("Weaken gestartet!");
			await ns.weaken(ServerName);
			await ns.sleep(30);
		} else if (ns.getServerMoneyAvailable(ServerName) < moneyThresh) {
			ns.print("Grow gestartet!")
			await ns.grow(ServerName);
			await ns.sleep(30);
		} else {
			ns.print("Alles ok! Starte Hack!")
			await ns.hack(ServerName);
			await ns.sleep(30);
		}
	}
}
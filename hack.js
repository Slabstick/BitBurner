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
	var moneyThresh = ns.getServerMaxMoney(ServerName) * 0.75;
	var secThresh = ns.getServerMinSecurityLevel(ServerName) + 5;



	while (true) {
		ns.print("Wenn ServerSecurity von " + ns.getServerSecurityLevel(ServerName) + " über dem Threshold von " + secThresh + " liegt, dann starte Weaken!");
		ns.print("Wenn Servergeld von " + ns.getServerMoneyAvailable(ServerName) + " unter dem Threshold von " + moneyThresh + " liegt, dann führe Grow durch!");
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

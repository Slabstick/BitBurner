/** @param {NS} ns **/
/** 2 Argumente. 1.:Server 2.:Wieviele Ports wir öffnen können */
export async function main(ns) {
	var serverName = ns.args[0];
	var reqPorts = ns.getServerNumPortsRequired(serverName);
	var persHack = ns.getHackingLevel();
	var reqHack = ns.getServerRequiredHackingLevel(serverName);
	var serverRam = ns.getServerMaxRam(serverName);
	var scriptRam = ns.getScriptRam("hack.js");
	/**Wieviele Threads sind auf dem Server möglich? */
	var threads = serverRam / scriptRam;
	/**verliere alle Dezimalstellen */
	threads = Math.trunc(threads);
	ns.alert("Threads betragen: " + threads);
	await ns.scp("hack.js", "home", serverName);
	ns.alert("hack.js wurde erfolgreich kopiert!");
	/**Wenn vorhandene Ports gehackt werden können */
	if (reqPorts <= ns.args[1]) {
		ns.alert("Die Anzahl der Ports beträgt: " + reqPorts);
		/** Falls Rootaccess noch NICHT besteht */
		if (ns.hasRootAccess(serverName) == false) {
			ns.alert("Es besteht kein RootAccess!");
			/**Wenn das benötigte Level unser Level nicht übersteigt */
			if (persHack >= reqHack) {
				ns.alert("Das persönliche Hack Level von " + persHack + " ist höher, als das benötigte von " + reqHack);
				/**Erster Port */
				if (reqPorts >= 1) {
					ns.brutessh(serverName);
					ns.alert("1. Brutessh wurde durchgeführt!");
				}
				/**Zweiter Port */
				if (reqPorts >= 2) {
					ns.ftpcrack(serverName);
					ns.alert("2. ftpcrack wurde durchgeführt!");
				}
				/**Nuke */
				ns.nuke(serverName);
				ns.alert("Der Server wurde genuked!");
				/**Nocheinmal checken ob JETZT Rootaccess besteht. Wenn ja, dann starte hack.js */
				if (ns.hasRootAccess(serverName) == true) {
					ns.killall(serverName);
					ns.alert("KillAll durchgeführt.");
					ns.exec("hack.js", serverName, threads);
					ns.alert("hack.js wurde gestartet!");
				} else {
					ns.alert("Something went wrong");
				}
			}
			/**Starte hack.js wenn RootAccess schon besteht */
		} else {
			ns.killall(serverName);
			ns.alert("KillAll durchgeführt.");
			ns.exec("hack.js", serverName, threads);
			ns.alert("Hack gestartet");
		}
	}
}

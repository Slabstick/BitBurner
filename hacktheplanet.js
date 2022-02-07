/** @param {NS} ns **/
// 2 Arguments. 1.:Server 2.:How many ports you're able to open
export async function main(ns) {
	var serverName = ns.args[0];
	var reqPorts = ns.getServerNumPortsRequired(serverName);
	var persHack = ns.getHackingLevel();
	var reqHack = ns.getServerRequiredHackingLevel(serverName);
	var serverRam = ns.getServerMaxRam(serverName);
	var scriptRam = ns.getScriptRam("hack.js");
	// depending on the ram of the target server, calculate how many threads of the hack script it can run
	var threads = serverRam / scriptRam;
	// loose all decimals
	threads = Math.trunc(threads);
	ns.tprint("Max number of threads: " + threads);
	await ns.scp("hack.js", "home", serverName);
	ns.tprint("hack.js was copied to target!");
	// Able to open ports?
	if (reqPorts <= ns.args[1]) {
		ns.tprint("Number of ports to open: " + reqPorts);
		// Check if rootAccess is already given
		if (ns.hasRootAccess(serverName) == false) {
			ns.tprint("No RootAccess!");
			// Check if your hacking level is higher than required
			if (persHack >= reqHack) {
				ns.tprint("Personal hacking level of " + persHack + " is higher than the required " + reqHack);
				// Open first port
				if (reqPorts >= 1) {
					ns.brutessh(serverName);
					ns.tprint("1. Brutessh deployed!");
				}
				// Open second port
				if (reqPorts >= 2) {
					ns.ftpcrack(serverName);
					ns.tprint("2. ftpCrack deployed!");
				}
				// Open third port
				if (reqPorts >= 3) {
					ns.relaysmtp(serverName);
					ns.tprint("3. relaySMTP deployed!");
				}
				// Open fourth port
				if (reqPorts >= 4) {
					ns.httpworm(serverName);
					ns.tprint("4. httpWorm deployed!");
				}
				// Open fifth port
				if (reqPorts >= 5) {
					ns.sqlinject(serverName);
					ns.tprint("5. SQLinject deployed!");
				}
				/**Nuke */
				ns.nuke(serverName);
				ns.tprint("Server nuked!");
				// Check again if rootAccess is given. If so, kill all running scripts to free the RAM and deploy the hack!
				if (ns.hasRootAccess(serverName) == true && ns.getServerMaxRam(serverName) >= 3) {
					ns.killall(serverName);
					ns.tprint("All scripts killed.");
					ns.exec("hack.js", serverName, threads);
					ns.tprint("hack.js deployed!");
				// If the RAM doesn't suffice
				} else {
					ns.tprint("RAM of: " + ns.getServerMaxRam(serverName) + 'GB is not enough to start any script!');
				}
			}
			// Start the hack if rootAccess is already given!
		} else {
			ns.killall(serverName);
			ns.tprint("All scripts killed");
			ns.exec("hack.js", serverName, threads);
			ns.tprint("Hack started");
		}
	}
}

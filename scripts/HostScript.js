/**Creates a monitoring script that runs occasionally and determines whether it's an appropriate time to hack,
 * Upon which it will run as many threads in order to hack 10% of income, or as many as available if less threads are avaiable.
 * After which it resumes growing and weakening according to a super basic check.
 * Could be a lot more efficient and utilize less ram, but I went a bit crazy. **/
export async function main(ns) {
var host = ns.args[0]
var time = (ns.getHackTime(host))
var growweakenthreads = ((Math.floor(ns.getServerMaxRam(host) - 5.15) / ns.getScriptRam('/scripts/growweaken.script')))
while (true) {
	if (ns.getServerMoneyAvailable(host) / ns.getServerMaxMoney(host) > .9) {
		var threads = (ns.hackAnalyzeThreads(host, (ns.getServerMoneyAvailable(host) * .1)));

		/**Upon the server reaching 90% income, it determines how many threads are required to hack 10% of it max. */

		if (threads * ns.getScriptRam('/scripts/hack.script') > (ns.getServerMaxRam(host) - ns.getServerUsedRam(host))) {
			var availram = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
			var threads = (Math.floor((ns.getScriptRam('/scripts/hack.script') / availram)))

			/**Makes sure that the suggested thread count can actually be run on the server given it's current available RAM.
			 * Would use less RAM if I were to just kill the growweaken script no matter what, but it didn't matter that much to me.
			 */

			if ((availram * threads) < ns.getScriptRam('/scripts/hack.script')) {
				ns.scriptKill('/scripts/growweaken.script', host);
				await ns.sleep(5000)
				availram = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
				threads = (Math.floor(availram / ns.getScriptRam('/scripts/hack.script')));

				/** If the available threads are too much for the current server RAM, then delete the growweaken script.
				 * Waits a bit, probably unnessecarily and then recalculates.
				 */

				if (threads == 0) {
					threads == 1
					ns.run('/scripts/hack.script', threads, host);
					await ns.sleep(time + 50);
					ns.run('/scripts/growweaken.script', growweakenthreads, host);
					continue;

				/**If threads are still 0, put it to 1 and attempt to run anyway. 
				 * In retrospect I don't know why I did this but I'm not going to touch it while it works lol. */

				}
				else {
					ns.run('/scripts/hack.script', threads, host);
					await ns.sleep(time + 50);
					ns.run('/scripts/growweaken.script', growweakenthreads, host);
					continue;
				
				/**I think everything beyond this point is if things go correctly upon an if loop check,
				 * so it just runs as expected. Nothing to interesting and nothing worth commenting.
				 */

				}
			}
			else {
				ns.run('/scripts/hack.script', threads, host);
				await ns.sleep(time + 50);
				continue;
			}

		}
		else {
			ns.run('/scripts/hack.script', threads, host);
			await ns.sleep(time + 3000);
			continue;
		}
	}
	else {
		if (ns.isRunning('/scripts/growweaken.script', host, host) == false) {
			ns.run('/scripts/growweaken.script', growweakenthreads, host);
			await ns.sleep(time + 3000);
			continue;
		}
		else {
			await ns.sleep(time + 3000);
		}
	}
}
}

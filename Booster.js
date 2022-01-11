/** A script designed to be used early on to give servers a boost in income.
 * Just so it doesn't take 4 hours for higher tier servers to produce income.**/

export async function main(ns) {
var serversStr = ns.read("ListOfServers");
var serversSeen = serversStr.split(",");
var threads = (Math.floor(((ns.getServerMaxRam('home')/serversSeen.length)) / ns.getScriptRam('/scripts/aboosting.script')))

/**Assumes that ListOfServers has been created by another script and utilizes that.
 * Could have this script link to its function but I'm not that smart.
 * Threads is calculated by dividing home's max ram by the amount of servers, then dividing that further by the RAM of the script.
 */

for (var b = 1; b < serversSeen.length; b++) {
    if (ns.getHackingLevel < ns.getServerRequiredHackingLevel(serversSeen[b])) {
        continue
    }
    if ((ns.hasRootAccess(serversSeen[b])) == false) {
        continue
    }
    if ((ns.getServerMaxMoney(serversSeen[b])) <= 10) {
        continue
    }
    if (ns.isRunning('/scripts/aboosting.script', serversSeen[b], 'home' == true)) {
        continue;
    }
    else
    ns.exec('/scripts/aboosting.script', 'home', threads, serversSeen[b])

    /**Ensures that I have adequate hacking level, root access and the server produces money before boosting it.
     *aboosting is named as such because without the 'a' it interfered with tab autocomplete and it was driving me nuts.
     */

}
}

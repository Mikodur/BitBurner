/** Essentially just Booster.js but for all currently owned servers. **/

export async function main(ns) {
    var serversStr = ns.read("ListOfServers");
    var serversSeen = serversStr.split(",");
    var c = 0;
    var amount = 1;
    var threads = (Math.floor(((ns.getServerMaxRam('pserv-' + c) / serversSeen.length)) / ns.getScriptRam('/scripts/aboosting.script')))

    for (c < amount;;) {
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
            if (ns.getServerMaxRam('pserv-' + c) <= 128) {
                ns.tprint('pserv-', c, ' has insufficent RAM, needs to meet 256GB')
                break
            }
            if (ns.isRunning('/scripts/aboosting.script', serversSeen[b], 'home' == true)) {
                continue;
            }
            else {
                await ns.scp('/scripts/aboosting.script', 'pserv-' + c)
                ns.exec('/scripts/aboosting.script', 'pserv-' + c, threads, serversSeen[b]);
            }

        /**C equals the personal server number, which will only go up when all eligable non-owned servers are being boosted. 
         * RAM was determined by multiplying script ram by serversSeen.length. All in all nothing too complicated.*/
        }

        if (ns.serverExists('pserv-' + (c + 1))== true) {
            amount = amount + 1;
            c = c + 1;
            b = 1
        }

        /** After all eligable servers are being boosted, a check is done to see if the next server numerically exists.
         * If it does, the counter rises and the loop is done again. If not then the loop breaks and the script is finished.
         */

        else {
            break;
        }
    }



}

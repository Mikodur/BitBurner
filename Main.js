/** This is a script that upon use, will attempt to root all servers and run a script on them to hack themselves
 * with as many threads as they can spare. Also puts a monitoring script which will run a hack with the appropriate amount of
 * threads in order to hack only 10% of income, then resumes growing and weakening. **/

export async function main(ns) {
function scanan() {
    serversSeen = ['home']
    for (var i = 0; i < serversSeen.length; i++) {
        thisScan = ns.scan(serversSeen[i]);
        for (var j = 0; j < thisScan.length; j++) {
            if (serversSeen.indexOf(thisScan[j]) === -1) {
                serversSeen.push(thisScan[j]);
            }
        }
    }
    return serversSeen;
}
if (ns.fileExists("ListOfServers.txt")) {
    var serversStr = ns.read("ListOfServers");
    var serversSeen = serversStr.split(",");
}
else {
    scanan()
    await ns.write("ListOfServers.txt", serversSeen.join());
}
/**The above goes to each server and scans it, compiling any results 
 * not previously found into a document that it then
 * reads from to perform the rest of the script. 
 * However if the end result file already exists it will
 * not scan, which saves a little bit of time.**/

for (var b = 1; b < serversSeen.length; b++) {
    if (ns.getHackingLevel(serversSeen[b]) < ns.getServerRequiredHackingLevel(serversSeen[b])) {
        continue
    }
    if ((ns.getServerMaxMoney(serversSeen[b])) <= 10) {
        continue
    }

/**B starts at 1 because 0 will always be the home server,
 * which I don't want to be affected. These two ifs make sure that
 * 1: I have the hacking level to go into the server, and
 * 2: The server has money on it. <=10 is an arbitrary number.
 */
    var portsNeeded = ns.getServerNumPortsRequired(serversSeen[b])
    var open = 0
    var ram = ns.getServerMaxRam(serversSeen[b])
    var threads = (Math.floor(ram / ns.getScriptRam('/scripts/growweaken.script')) - 2)

/**Ram is a variable because I don't know what I'm doing, 
 * and I cannot be bothered to fix it because it seems to work.
 * Threads gets the rounded down value of the servers max ram and divides it by the script ram.
 * This gives the amount of threads that can be used, however because I will have a hostscript
 * micromanaging the server with a few GB of ram I need to reduce its threads by about 2 to accomidate.
 */
    if (ns.hasRootAccess(serversSeen[b]) == false) {
        if (ns.fileExists("BruteSSH.exe") && portsNeeded > 0) {
            ns.brutessh(serversSeen[b]);
            open++
        }
        if (ns.fileExists("FTPCrack.exe") && portsNeeded > 1) {
            ns.ftpcrack(serversSeen[b]);
            open++
        }
        if (ns.fileExists("relaySMTP.exe") && portsNeeded > 2) {
            ns.relaysmtp(serversSeen[b]);
            open++
        }
        if (ns.fileExists("HTTPWorm.exe") && portsNeeded > 3) {
            ns.httpworm(serversSeen[b]);
            open++
        }
        if (ns.fileExists("SQLInject.exe") && portsNeeded > 4) {
            ns.sqlinject(serversSeen[b]);
            open++
        }
        if (portsNeeded <= open) {
            ns.nuke(serversSeen[b]);
        }
        else if (portsNeeded > open) {
            continue
        }
    }

/**If I have enough port openers to root the server it will, if not it will continue. */

    if (ns.getServerMaxRam(serversSeen[b]) <= 7) {
        continue
    }

/**Ensures that the server has enough ram to accomidate the scripts. If not then it skips it. */

    if (threads <= 0) {
        continue
    }

/**Ensures that even if it gets past the other check, if the scripts cannot be run with any threads it skips it. */

    if (ns.isRunning('/scripts/HostScript.js', serversSeen[b], serversSeen[b]) == true) {
        ns.tprint("Script already running on ", serversSeen[b],'.');
        continue;
    }

/** Because some scripts take ages to run, this makes sure that if the same script is running, it doesnt interupt it.*/

    ns.nuke(serversSeen[b]);
    ns.killall(serversSeen[b]);
    await ns.scp('/scripts/HostScript.js', serversSeen[b])
    await ns.scp('/scripts/growweaken.script', serversSeen[b])
    await ns.scp('/scripts/hack.script', serversSeen[b])
    ns.exec('/scripts/HostScript.js', serversSeen[b], 1, serversSeen[b])
    if (threads <= 2) {
        ns.exec('/scripts/growweaken.script', serversSeen[b], threads, serversSeen[b]);
        ns.tprint("Success on Server ", serversSeen[b], '.');
        continue
    }
    ns.exec('/scripts/growweaken.script', serversSeen[b], threads - 2, serversSeen[b]);
    ns.tprint("Success on Server ", serversSeen[b], '.');

/**Clears the server of all running script, sends the files for the scripts I want it to run and runs it with the
 * arguments of the current server.
 */

}
}

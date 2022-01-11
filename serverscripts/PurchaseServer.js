/**Simple script to purchase servers, and ensures they follow the naming scheme. Change hn variable to change server names.*/
export async function main(ns) {
	var amount = ns.args[0]
	var ram = ns.args[1]
	var hn = "pserv-"
	var bought = 0
	if (amount > 25) {
		throw new Error("Amount is too great, enter a value that is 25 or less.")
	}
	/**Max of 25 servers, more than that it yells at me in the terminal. Just ensuring that doesn't happen. */
	while(ram != 1) {
		if (ram%2 != 0) {
			throw new Error("RAM is not a power of two.")
		}
		ram = ram/2
	}
	/**Ram needs to be divisable by a power of 2, so this keeps dividing it until it equals 1, which if it were a power of two
	 * will need to happen eventually. If at any point it becomes an odd number it throws an error.
	 */
	var ram = ns.args[1]
	for (var i = 0; i < amount; ++i) {
		ns.print("In i=0 loop, ", amount, ram)
		if (amount < 25) {
			if (ns.serverExists(hn + i) == true) {
				ns.print("in exists loop")
				++amount;
				++bought;
				continue;
			}
		}

		/**Makes sure that hostname+number doesnt exist before trying to create it.
		 * If it does exist, it adds onto the counter and attempts to try again until numbers are free. */

		else if (bought > 0) {
			ns.tprint("Bought ", bought, " servers, but capped out at 25 before full order was filled.")
		}
		else {
			throw new Error("You already have 25 servers. Delete some before trying again.")
		}

		/**Just a few error scripts because I just realized I could do them.  */
		ns.purchaseServer(hn + i, ram);
		ns.tprint(hn + i, " with ", ram, "GB RAM is now yours.")
	}
}

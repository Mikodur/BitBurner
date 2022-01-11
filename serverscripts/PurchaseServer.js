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
	if (((ram / 2) / 2) % 2 !== 0) {
		throw new Error("RAM must be divisable by a power of two.")
	}
	/**Ram needs to be divisable by a power of 2, so after a bit of thinking, if I half any even number not divisable by two
	 * twice then it ends up as an odd number. Therefore this checks that after two divisions it is still an even number.
	 * Odd numbers divided end up in decimals so I don't think any numbers will break this. Probably wrong though.
	 */
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

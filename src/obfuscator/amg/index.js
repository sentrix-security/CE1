const random = require("random");

async function generateMath(int, isfromrecursion, extravar) {
	return new Promise(async (resolve) => {
		let [Enum, New, rightHand, Recursion] = [random.int(1, 4), int, random.int(1, 999), isfromrecursion ? false : random.int(1, 2) > 1]; //
		let Extra = random.int(1, 999);
		New += Extra;

		switch (Enum) {
			case 1: { // Addition 
				resolve(`((${(New+rightHand)}-${Recursion ? await generateMath(rightHand, true) : rightHand})-${Extra}/${"_CF"}) ${extravar ? `- ${extravar}` : ""}`);
                break;
			}
			case 2: { // Subtraction
				resolve(`((${New-rightHand}+${Recursion ? await generateMath(rightHand, true) : rightHand})-${Extra}/${"_CF"}) ${extravar ? `- ${extravar}` : ""}`);
                break;
			}
            case 3: { // Xor
                resolve(`(_xor(${New^rightHand}, ${Recursion ? await generateMath(rightHand, true) : rightHand})-${Extra}/_CF) ${extravar ? `- ${extravar}` : ""}`);
				break;
            }
			case 4: {
				rightHand = random.int(2, 4);
				resolve(`(_rshift(${New<<rightHand}, ${Recursion ? await generateMath(rightHand, true) : rightHand})-${Extra}/_CF) ${extravar ? `- ${extravar}` : ""}`);
				break;
			}
		}
	});
}



module.exports = generateMath;
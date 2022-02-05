/** @param {NS} ns **/
export async function main(ns) {

	var invested = false;

	while (true) {
		var stonks = ns.stock.getSymbols().sort(function (a, b) { return ns.stock.getForecast(b) - ns.stock.getForecast(a); })

		for (const stonk of stonks) {

			ns.print('FC of ' + stonk + ' is ' + ns.stock.getForecast(stonk));
		}

		var pMoney = ns.getServerMoneyAvailable('home') * 0.9;
		var toBuy = stonks[0];
		var sharesToBuy = Math.floor(pMoney / ns.stock.getAskPrice(toBuy));

		/** In case of limited supply only buy the maximum amount */

		if (invested == false) {

			if (ns.stock.getMaxShares(toBuy) < sharesToBuy) {
				sharesToBuy = ns.stock.getMaxShares(toBuy);
				ns.tprint('Sellout of ' + nFormatter(sharesToBuy, 1) + ' Stonks');

			} else {

				sharesToBuy = Math.floor(pMoney / ns.stock.getAskPrice(toBuy));
				ns.tprint('There are still Stonks available for others!');

			}
		}

		if (sharesToBuy < 1) {
			ns.tprint('you are too poor');
		}

		else {

			if (invested == false) {

				ns.tprint('Bought ' + nFormatter(sharesToBuy, 1) + ' Stonks of ' + toBuy + ' for ' + nFormatter(Math.floor(pMoney), 1) + ' because current FC is: ' + ns.stock.getForecast(toBuy).toFixed(2));
				ns.stock.buy(stonks[0], sharesToBuy);
				invested = true;
				var toSell = toBuy;
				var amtToSell = sharesToBuy;
				ns.tprint('And now wait 6 seconds!');
				await ns.sleep(6000);

			} else if (ns.stock.getForecast(toSell) < 0.5) {

				ns.tprint('Sell ' + nFormatter(amtToSell, 1) + ' Shares of ' + toSell + ' because it fell below the threshold!')
				ns.stock.sell(toSell, amtToSell);
				invested = false;
				await ns.sleep(60);

			} else {

				ns.tprint('FC of ' + toSell + ' is still ' + ns.stock.getForecast(toSell).toFixed(2) + ' so we wait to sell');
				await ns.sleep(6000);

			}
		}
	}
}

function nFormatter(num, digits) {
	var si = [
		{ value: 1, symbol: "" },
		{ value: 1E3, symbol: "k" },
		{ value: 1E6, symbol: "m" },
		{ value: 1E9, symbol: "b" },
		{ value: 1E12, symbol: "t" },
		{ value: 1E15, symbol: "q" },
		{ value: 1E18, symbol: "s" }
	];
	var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}
	return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

/** @param {NS} ns **/
export async function main(ns) {

	var invested = false;
	var pricePaid = 0;

	while (true) {
		
		let date = new Date();
		let cHours = date.getHours();
		let cMinutes = date.getMinutes();
		let cSeconds = date.getSeconds();
		let curTime = ('0' + cHours).slice(-2)+':'+('0'+ cMinutes).slice(-2)+':'+('0'+cSeconds).slice(-2)+':';
		var stonks = ns.stock.getSymbols().sort(function (a, b) { return ns.stock.getForecast(b) - ns.stock.getForecast(a); })

		for (const stonk of stonks) {

			ns.print('FC of ' + stonk + ' is ' + ns.stock.getForecast(stonk));
		}

		// The variable that says how much of our money we want to invest max
		var pMoney = ns.getServerMoneyAvailable('home') * 0.9;
		// which stock we buy
		var toBuy = stonks[0];
		// how much of it we bought
		var sharesToBuy = Math.floor(pMoney / ns.stock.getAskPrice(toBuy));

		// In case of limited supply only buy the maximum amount

		if (invested == false) {

			// We can't invest all the money because there isn't enough shares to buy.
			if (ns.stock.getMaxShares(toBuy) < sharesToBuy) {
				sharesToBuy = ns.stock.getMaxShares(toBuy);
				//In case of max amount, we need the buyout price in a new variable
				pricePaid = sharesToBuy * ns.stock.getAskPrice(toBuy);
				ns.tprint(curTime + 'Bought all the stonks of ' + ns.nFormat(sharesToBuy, '0a'));

				// We can invest all our money
			} else {

				sharesToBuy = Math.floor(pMoney / ns.stock.getAskPrice(toBuy));
				pricePaid = sharesToBuy * ns.stock.getAskPrice(toBuy);
				ns.tprint(curTime + 'There are still Stonks available for others!');

			}
		}

		if (sharesToBuy < 1) {
			ns.tprint(curTime + 'you are too poor');
		}

		else {

			// Buy
			if (invested == false) {

				ns.tprint(curTime + 'Bought ' + ns.nFormat(sharesToBuy, '0a') + ' Stonks of ' + toBuy + ' for ' + ns.nFormat(Math.floor(pricePaid), '0a') + ' because current Forecast is: ' + ns.stock.getForecast(toBuy).toFixed(2));
				ns.stock.buy(stonks[0], sharesToBuy);
				invested = true;
				var toSell = toBuy;
				var amtToSell = sharesToBuy;
				ns.tprint(curTime + 'And now we wait!');
				await ns.sleep(6000);

				// Sell
			} else if (ns.stock.getForecast(toSell) < 0.5) {

				// We need the Price we sold the stonks for and then calculate the money we made by selling
				var soldFor = ns.stock.getBidPrice(toSell) * amtToSell;
				var win = soldFor - pricePaid;
				ns.tprint(curTime + 'Sell ' + ns.nFormat(amtToSell, '0a') + ' stonks of ' + toSell + ' for ' + ns.nFormat(soldFor, '0a') + ' because Forecast fell to ' + ns.stock.getForecast(toSell));
				ns.tprint(curTime + 'We made ' + ns.nFormat(win, '0a') + ' because ' + ns.nFormat(soldFor, '0a') + ' times ' + ns.nFormat(amtToSell, '0a') + ' minus ' + ns.nFormat(pricePaid, '0a'));
				// And now we sell!
				ns.stock.sell(toSell, amtToSell);
				// Put invested variable to false so the next round the script knows it can buy again.
				invested = false;
				// Don't need to wait that long because we can immediately buy another stock again.
				await ns.sleep(60);

				// Wait to Sell
			} else {

				// ns.tprint('FC of ' + toSell + ' is still ' + ns.stock.getForecast(toSell).toFixed(2) + ' so we wait to sell');
				var soldFor = ns.stock.getBidPrice(toSell) * amtToSell;
				var curWinnings = soldFor - pricePaid;
				ns.print(curTime + 'Until now we generated winnings of ' + ns.nFormat(curWinnings,'0a') + ' with our ' + ns.nFormat(amtToSell, '0a') + ' stonks of ' + toSell,);
				ns.print(curTime + 'because we paid ' + ns.nFormat(pricePaid, '0a'));
				await ns.sleep(6000);

			}
		}
	}
}

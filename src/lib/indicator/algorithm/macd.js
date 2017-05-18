"use strict";


import ema from "./ema";

import { isDefined, zipper } from "../../utils";
import { MACD as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { fast, slow, signal, sourcePath } = defaultOptions;

	function calculator(data) {

		var fastEMA = ema()
			.windowSize(fast)
			.sourcePath(sourcePath);
		var slowEMA = ema()
			.windowSize(slow)
			.sourcePath(sourcePath);
		var signalEMA = ema()
			.windowSize(signal)
			.sourcePath(undefined);

		var macdCalculator = zipper()
			.combine((fastEMA, slowEMA) => (isDefined(fastEMA) && isDefined(slowEMA)) ? fastEMA - slowEMA : undefined);

		var macdArray = macdCalculator(fastEMA(data), slowEMA(data));

		var undefinedArray = new Array(slow);
		var signalArray = undefinedArray.concat(signalEMA(macdArray.slice(slow)));

		var zip = zipper()
			.combine((macd, signal) => ({
				macd,
				signal,
				divergence: (isDefined(macd) && isDefined(signal)) ? macd - signal : undefined,
			}));

		var macd = zip(macdArray, signalArray);

		return macd;
	}

	calculator.undefinedLength = function() {
		return slow + signal - 1;
	};
	calculator.fast = function(x) {
		if (!arguments.length) {
			return fast;
		}
		fast = x;
		return calculator;
	};

	calculator.slow = function(x) {
		if (!arguments.length) {
			return slow;
		}
		slow = x;
		return calculator;
	};

	calculator.signal = function(x) {
		if (!arguments.length) {
			return signal;
		}
		signal = x;
		return calculator;
	};

	calculator.sourcePath = function(x) {
		if (!arguments.length) {
			return sourcePath;
		}
		sourcePath = x;
		return calculator;
	};

	/* calculator.options = function(options) {
		if (options) {
			var { fast, slow, signal, source } = options;
			underlyingAlgorithm
				.fast(fast)
				.slow(slow)
				.signal(signal)
				.source()
		}
		return {

		}
	}; */

	return calculator;
}

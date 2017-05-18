"use strict";

import { mean } from "d3-array";

import { isDefined, last, slidingWindow, path } from "../../utils";
import { RSI as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { windowSize, sourcePath } = defaultOptions;

	function calculator(data) {

		var source = path(sourcePath);
		var prevAvgGain, prevAvgLoss;
		var rsiAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.accumulator((values) => {

				var avgGain = isDefined(prevAvgGain)
					? (prevAvgGain * (windowSize - 1) + last(values).gain) / windowSize
					: mean(values, (each) => each.gain);

				var avgLoss = isDefined(prevAvgLoss)
					? (prevAvgLoss * (windowSize - 1) + last(values).loss) / windowSize
					: mean(values, (each) => each.loss);

				var relativeStrength = avgGain / avgLoss;
				var rsi = 100 - (100 / (1 + relativeStrength));

				prevAvgGain = avgGain;
				prevAvgLoss = avgLoss;

				return rsi;
			});

		var gainsAndLossesCalculator = slidingWindow()
			.windowSize(2)
			.undefinedValue(() => [0, 0])
			.accumulator(tuple => {
				var prev = tuple[0];
				var now = tuple[1];
				var change = source(now) - source(prev);
				return {
					gain: Math.max(change, 0),
					loss: Math.abs(Math.min(change, 0)),
				};
			});

		var gainsAndLosses = gainsAndLossesCalculator(data);

		var rsiData = rsiAlgorithm(gainsAndLosses);

		return rsiData;
	}
	calculator.undefinedLength = function() {
		return windowSize;
	};
	calculator.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return calculator;
	};
	calculator.sourcePath = function(x) {
		if (!arguments.length) {
			return sourcePath;
		}
		sourcePath = x;
		return calculator;
	};

	return calculator;
}

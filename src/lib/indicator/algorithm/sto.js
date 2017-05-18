"use strict";


import { max, min, mean } from "d3-array";

import { last, slidingWindow, zipper } from "../../utils";
import { FullStochasticOscillator as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { windowSize, kWindowSize, dWindowSize } = defaultOptions;

	var source = d => ({ open: d.open, high: d.high, low: d.low, close: d.close });
	var high = d => source(d).high,
		low = d => source(d).low,
		close = d => source(d).close;

	function calculator(data) {
		var kWindow = slidingWindow()
			.windowSize(windowSize)
			.accumulator(values => {

				var highestHigh = max(values, high);
				var lowestLow = min(values, low);

				var currentClose = close(last(values));
				var k = (currentClose - lowestLow) / (highestHigh - lowestLow) * 100;

				return k;
			});

		var kSmoothed = slidingWindow()
			.skipInitial(windowSize - 1)
			.windowSize(kWindowSize)
			.accumulator(values => mean(values));

		var dWindow = slidingWindow()
			.skipInitial(windowSize - 1 + kWindowSize - 1)
			.windowSize(dWindowSize)
			.accumulator(values => mean(values));

		var stoAlgorithm = zipper()
			.combine((K, D) => ({ K, D }));

		var kData = kSmoothed(kWindow(data));
		var dData = dWindow(kData);

		var newData = stoAlgorithm(kData, dData);

		return newData;
	}
	calculator.undefinedLength = function() {
		return windowSize + kWindowSize + dWindowSize;
	};
	calculator.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return calculator;
	};
	calculator.kWindowSize = function(x) {
		if (!arguments.length) {
			return kWindowSize;
		}
		kWindowSize = x;
		return calculator;
	};
	calculator.dWindowSize = function(x) {
		if (!arguments.length) {
			return dWindowSize;
		}
		dWindowSize = x;
		return calculator;
	};
	calculator.source = function(x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};

	return calculator;
}

"use strict";

import { mean } from "d3-array";

import ema from "./ema";

import { ElderRay as defaultOptions } from "../defaultOptionsForComputation";
import { isDefined, zipper, slidingWindow } from "../../utils";

export default function() {

	var { windowSize, sourcePath, movingAverageType } = defaultOptions;
	var ohlc = d => ({ open: d.open, high: d.high, low: d.low, close: d.close });

	function calculator(data) {

		var meanAlgorithm = movingAverageType === "ema"
			? ema().windowSize(windowSize).sourcePath(sourcePath)
			: slidingWindow().windowSize(windowSize).accumulator(values => mean(values)).sourcePath(sourcePath);

		var zip = zipper()
			.combine((datum, mean) => {
				var bullPower = isDefined(mean) ? ohlc(datum).high - mean : undefined;
				var bearPower = isDefined(mean) ? ohlc(datum).low - mean : undefined;
				return { bullPower, bearPower };
			});

		var newData = zip(data, meanAlgorithm(data));
		return newData;
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
	calculator.ohlc = function(x) {
		if (!arguments.length) {
			return ohlc;
		}
		ohlc = x;
		return calculator;
	};

	calculator.movingAverageType = function(x) {
		if (!arguments.length) {
			return movingAverageType;
		}
		movingAverageType = x;
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

"use strict";


import { mean, deviation } from "d3-array";

import ema from "./ema";
import { last, slidingWindow, zipper, path } from "../../utils";

import { BollingerBand as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { windowSize, multiplier, movingAverageType, sourcePath } = defaultOptions;

	function calculator(data) {
		var source = path(sourcePath);
		var meanAlgorithm = movingAverageType === "ema"
			? ema().windowSize(windowSize).sourcePath(sourcePath)
			: slidingWindow().windowSize(windowSize)
				.accumulator(values => mean(values)).sourcePath(sourcePath);

		var bollingerBandAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.accumulator((values) => {
				var avg = last(values).mean;
				var stdDev = deviation(values, (each) => source(each.datum));
				return {
					top: avg + multiplier * stdDev,
					middle: avg,
					bottom: avg - multiplier * stdDev
				};
			});

		var zip = zipper()
			.combine((datum, mean) => ({ datum, mean }));

		var tuples = zip(data, meanAlgorithm(data));
		return bollingerBandAlgorithm(tuples);
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

	calculator.multiplier = function(x) {
		if (!arguments.length) {
			return multiplier;
		}
		multiplier = x;
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

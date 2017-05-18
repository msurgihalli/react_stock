"use strict";


import { isNotDefined, path } from "../../utils";
import { EMA as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { windowSize, sourcePath } = defaultOptions;

	function calculator(data) {

		var source = path(sourcePath);
		var alpha = 2 / (windowSize + 1);
		var previous;
		var initialAccumulator = 0;
		var skip = 0;

		return data.map(function(d, i) {
			var v = source(d, i);
			if (isNotDefined(previous) && isNotDefined(v)) {
				skip++;
				return undefined;
			} else if (i < windowSize + skip - 1) {
				initialAccumulator += v;
				return undefined;
			} else if (i === windowSize + skip - 1) {
				initialAccumulator += v;
				var initialValue = initialAccumulator / windowSize;
				previous = initialValue;
				return initialValue;
			} else {
				var nextValue = v * alpha + (1 - alpha) * previous;
				previous = nextValue;
				return nextValue;
			}
		});
	}
	calculator.undefinedLength = function() {
		return windowSize - 1;
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

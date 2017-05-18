"use strict";


import noop from "./noop";
import { path, functor } from "./index";

export default function() {

	var undefinedValue = undefined,
		windowSize = 10,
		accumulator = noop,
		sourcePath,
		source,
		skipInitial = 0,
		misc;

	var slidingWindow = function(data) {
		var sourceFunction = source || path(sourcePath);

		var size = functor(windowSize).apply(this, arguments);
		var windowData = data.slice(skipInitial, size + skipInitial).map(sourceFunction);
		var accumulatorIdx = 0;
		var undef = functor(undefinedValue);
		// console.log(skipInitial, size, data.length, windowData.length);
		return data.map(function(d, i) {
			// console.log(d, i);
			if (i < (skipInitial + size - 1)) {
				return undef(sourceFunction(d), i, misc);
			}
			if (i >= (skipInitial + size)) {
				// Treat windowData as FIFO rolling buffer
				windowData.shift();
				windowData.push(sourceFunction(d, i));
			}
			return accumulator(windowData, i, accumulatorIdx++, misc);
		});
	};

	slidingWindow.undefinedValue = function(x) {
		if (!arguments.length) {
			return undefinedValue;
		}
		undefinedValue = x;
		return slidingWindow;
	};
	slidingWindow.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return slidingWindow;
	};
	slidingWindow.misc = function(x) {
		if (!arguments.length) {
			return misc;
		}
		misc = x;
		return slidingWindow;
	};
	slidingWindow.accumulator = function(x) {
		if (!arguments.length) {
			return accumulator;
		}
		accumulator = x;
		return slidingWindow;
	};
	slidingWindow.skipInitial = function(x) {
		if (!arguments.length) {
			return skipInitial;
		}
		skipInitial = x;
		return slidingWindow;
	};
	slidingWindow.sourcePath = function(x) {
		if (!arguments.length) {
			return sourcePath;
		}
		sourcePath = x;
		return slidingWindow;
	};
	slidingWindow.source = function(x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return slidingWindow;
	};

	return slidingWindow;
}

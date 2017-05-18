"use strict";


import noop from "./noop";
import identity from "./identity";
import { functor } from "./index";

export default function() {

	var accumulateTill = functor(false),
		accumulator = noop,
		value = identity,
		discardTillStart = false,
		discardTillEnd = false;

	var accumulatingWindow = function(data) {
		var accumulatedWindow = discardTillStart ? undefined : [];
		var response = [];
		var accumulatorIdx = 0;
		var i = 0;
		for (i = 0; i < data.length; i++) {
			var d = data[i];
			// console.log(d, accumulateTill(d));
			if (accumulateTill(d, i)) {
				if (accumulatedWindow && accumulatedWindow.length > 0) response.push(accumulator(accumulatedWindow, i, accumulatorIdx++));
				accumulatedWindow = [value(d)];
			} else {
				if (accumulatedWindow) accumulatedWindow.push(value(d));
			}
		}
		if (!discardTillEnd) response.push(accumulator(accumulatedWindow, i, accumulatorIdx));
		return response;
	};

	accumulatingWindow.accumulateTill = function(x) {
		if (!arguments.length) {
			return accumulateTill;
		}
		accumulateTill = functor(x);
		return accumulatingWindow;
	};
	accumulatingWindow.accumulator = function(x) {
		if (!arguments.length) {
			return accumulator;
		}
		accumulator = x;
		return accumulatingWindow;
	};
	accumulatingWindow.value = function(x) {
		if (!arguments.length) {
			return value;
		}
		value = x;
		return accumulatingWindow;
	};
	accumulatingWindow.discardTillStart = function(x) {
		if (!arguments.length) {
			return discardTillStart;
		}
		discardTillStart = x;
		return accumulatingWindow;
	};
	accumulatingWindow.discardTillEnd = function(x) {
		if (!arguments.length) {
			return discardTillEnd;
		}
		discardTillEnd = x;
		return accumulatingWindow;
	};
	return accumulatingWindow;
}
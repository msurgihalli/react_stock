
import identity from "./identity";
import zipper from "./zipper";
import noop from "./noop";

import { isNotDefined } from "./index";

// applies an algorithm to an array, merging the result back into
// the source array using the given merge function.
export default function() {

	var algorithm = identity,
		skipUndefined = true,
		merge = noop;

	function mergeCompute(data) {
		var zip = zipper()
			.combine((datum, indicator) => {
				var result = (skipUndefined && isNotDefined(indicator))
					? datum
					: merge(datum, indicator);
				return isNotDefined(result) ? datum : result;
			});

		// console.log(data);
		return zip(data, algorithm(data));
	}

	mergeCompute.algorithm = function(x) {
		if (!arguments.length) {
			return algorithm;
		}
		algorithm = x;
		return mergeCompute;
	};

	mergeCompute.merge = function(x) {
		if (!arguments.length) {
			return merge;
		}
		merge = x;
		return mergeCompute;
	};
	mergeCompute.skipUndefined = function(x) {
		if (!arguments.length) {
			return skipUndefined;
		}
		skipUndefined = x;
		return mergeCompute;
	};

	return mergeCompute;
}
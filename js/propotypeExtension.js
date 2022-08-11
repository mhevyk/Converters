Array.prototype.getUniqueElements = function(){
	return Array.from(new Set(this));
}
Array.prototype.createDeepCopy = function(){
	return JSON.parse(JSON.stringify(this));
}
Big.prototype.equals = function(number){
	return !this.cmp(new Big(number));
};

Big.prototype.toStandardForm = function(precision){
	//NORMAL DISPLAY CONSTANTS
	//numbers in range from (10 ^ -MAX_NOT_STANDARD_EXPONENT) to (10 ^ MAX_NOT_STANDARD_EXPONENT) do not display in standard form
	const MAX_SMALL_EXPONENT = 3;

	const tenToPowerPart = exponent => `10 <sup>${exponent}</sup>`;
	const isExponentSmallerThan = limit => Math.abs(intExponent) <= limit;

	const exponential = this.toExponential();

	//split exponential from using `e` symbol, because Big.toExponential() incudes only lowercase e
	let [stringMantissa, stringExponent] = exponential.split("e");

	//convert exponent to int to remove `+` sign before number
	const intExponent = parseInt(stringExponent);
	/*if number is written in form 1 x 10 ^ x, we skip 1 and return 10 ^ x
	* we don`t use it in printing, because it can cause loss of data
	* use parseFloat, because if we parseInt stringMantissa, 1.1313 and 1 will be equal to 1, but it is wrong because loss of data
	*/
	const decimalMantissa = parseFloat(stringMantissa);

	//if this number is one, we return 1 in order to avoid rounding problems
	//Big.cmp() returns 0 if numbers are equal
	if(this.equals(1)){
		return 1;
	}
	//condition to show number without standard form
	else if(isExponentSmallerThan(MAX_SMALL_EXPONENT) && this.c.length <= MAX_SMALL_EXPONENT){
		return this.toNumber();
	}
	//if mantissa is 1, it means, that numbers contains only ten to power part
	else if(decimalMantissa === 1){
		return tenToPowerPart(intExponent);
	}
	//convert bigMantissa to Big in order to use Big.toFixed() method
	else if(precision && Number.isInteger(precision)){
		const bigMantissa = new Big(stringMantissa);
		//if number has very small mantissa
		if(isExponentSmallerThan(MAX_SMALL_EXPONENT - 1)){
			//nultiply comma by exponent and set it to fixed
			return (bigMantissa.times(10 ** intExponent)).toFixed(precision);
		}
		stringMantissa = bigMantissa.toFixed(precision);
	}
	//if intExponent equals 0, we do not show it, because 10 ^ 0 = 1, and mantissa * 1 = mantissa
	return `${stringMantissa} ${intExponent ? ("x " + tenToPowerPart(intExponent)) : ""}</sup>`;
}
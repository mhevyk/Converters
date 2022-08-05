Array.prototype.getUniqueElements = function(){
	return Array.from(new Set(this));
}
Array.prototype.createDeepCopy = function(){
	return JSON.parse(JSON.stringify(this));
}
Big.prototype.toStandardForm = function(precision){
	//NORMAL DISPLAY CONSTANTS
	//numbers in range from (10 ^ -ND_EXPONENT) to (10 ^ ND_EXPONENT) do not display in standard form
	const ND_EXPONENT = 4;
	//numbers, which mantissa`s length is less than ND_MANTISSA do not display in standard form
	const ND_MANTISSA = ND_EXPONENT + 2;

	const exponential = this.toExponential();

	//split exponential from using `e` symbol, because Big.toExponential() incudes only lowercase e
	let [stringMantissa, stringExponent] = exponential.split("e");

	//convert exponent to int to remove `+` sign before number
	const numericExponent = parseInt(stringExponent);

	//condition to show number without standard form
	if(Math.abs(numericExponent) <= ND_EXPONENT && stringMantissa.length <= ND_MANTISSA){
		return this.toNumber();
	}
	/*if number is written in form 1 x 10 ^ x, we skip 1 and return 10 ^ x
	* we don`t use it in printing, because it can cause loss of data
	* use parseFloat, because if we parseInt stringMantissa, 1.1313 and 1 will be equal to 1, but it is wrong because loss of data
	*/
	const numericMantissa = parseFloat(stringMantissa);

	if(numericMantissa === 1){
		return `10 <sup>${numericExponent}</sup>`;
	}
	//convert bigMantissa to Big in order to use Big.toFixed() method
	if(precision && Number.isInteger(precision)){
		const bigMantissa = new Big(stringMantissa);
		stringMantissa = bigMantissa.toFixed(precision);
	}
	//if numericExponent equals 0, we do not show it, because 10 ^ 0 = 1, and mantissa * 1 = mantissa
	return `${stringMantissa} ${numericExponent ? `x 10 <sup>${numericExponent}` : ""}</sup>`;
}
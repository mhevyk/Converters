Number.prototype.roundTo = function(precision){
	if(!Number.isInteger(precision)) return new Error(`Precision '${precision}' in not an integer!`);
	//round number and remain only integer part
	if(precision <= 0){
		return Math.round(this);
	}
	//round number due to precision value
	const precisionCoefitient = Math.pow(10, precision);
	return (Math.round(this * precisionCoefitient)) / precisionCoefitient;
}
Number.prototype.toStandardForm = function(precision){
	const sign = (Math.sign(this) === -1) ? "-" : "";
	//get absolute value, because toExponential() method to not work with negative numbers
	const absoluteNumber = Math.abs(this);
	//lowerCase, because number can contain 'e' or 'E', it becomes easier to catch needed symbol 'e'
	const exponentialForm = absoluteNumber.toExponential().toLowerCase();

	//mapping with parseFloat() to convert it to floats
	let [mantissa, exponent] = exponentialForm.split("e").map(part => parseFloat(part));

	if(Number.isInteger(precision) && precision >= 0){
		//cut off all numbers after precision + 1, because we round number at (precision) position using (precision+1) position
		//also we cut off number, because extra digits, like 1.000000000001 can influence rounding
		const cutMantissa = mantissa.toFixed(precision + 1);

		//get integer part of mantissa and check if it has more than 1 digit
		const integerMantissa = cutMantissa.slice(0, cutMantissa.indexOf("."));
		const integerMantissaShift = integerMantissa.length;

		//if integer mantissa has more than one digit, we generate 10 ^ integerMantissaShift - 1 shift to mantissa
		const extraShift = (integerMantissaShift > 1) ? Math.pow(10, integerMantissaShift - 1) : 1;
		//shift comma, then round to precision, then fill rest space with zeror
		mantissa = (parseFloat(cutMantissa) / extraShift).roundTo(precision).toFixed(precision);
		if(integerMantissaShift > 1){
			exponent += extraShift - 1;
		}
	}

	//if shift is 0, there is no point in showing it, because 10 ^ 0 = 1
	exponent = exponent ? ` x 10 <sup>${exponent}</sup>` : ``;
	return sign + mantissa + exponent;
}
String.prototype.removeAt = function(index){
	return this.slice(0, index) + this.slice(index + 1);
}
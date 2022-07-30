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

class Converter{
	static measurementUnitGroups = {
		area: {
			list: [
				{id: "mcm2", value: 1e12, names: {short: "мкм&sup2", full: "квадратний мікрометр"}},
				{id: "mm2", value: 1000000, names: {short: "мм&sup2", full: "квадратний міліметр"}},
				{id: "sm2", value: 10000, names: {short: "см&sup2", full: "квадратний сантиметр"}},
				{id: "dm2", value: 100, names: {short: "дм&sup2", full: "квадратний дециметр"}},
				{id: "m2", value: 1, names: {short: "м&sup2", full: "квадратний метр"}},
				{id: "ar", value: 0.01, names: {short: "а", full: "ар/сотка"}},
				{id: "ha", value: 0.0001, names: {short: "га", full: "гектар"}},
				{id: "km2", value: 0.000001, names: {short: "км&sup2", full: "квадратний кілометр"}},

				{id: "township", value: 1.072506e-8, names: {short: "twsp", full: "тауншип"}},
				{id: "mi2", value: 3.861022e-7, names: {short: "mi&sup2", full: "квадратна миля"}},
				{id: "homestead", value: 0.000001544409, names: {short: "hmst", full: "хоумстед"}},
				{id: "acre", value: 0.0002471055, names: {short: "acre", full: "акр"}},
				{id: "rod", value: 0.0009884220, names: {short: "rod", full: "род"}},
				{id: "rod2", value: 0.03953687, names: {short: "rod&sup2", full: "квадратний род"}},
				{id: "yd2", value: 1.195990, names: {short: "yd&sup2", full: "квадратний ярд"}},
				{id: "ft2", value: 10.76391, names: {short: "ft&sup2", full: "квадратний фут"}},
				{id: "in2", value: 1550, names: {short: "in2", full: "квадратний дюйм"}}
			],
		},
		length:{
			
		}
	};
	constructor(props){
		//unit of measurement group
		this.type = props.type || "area";
		//object, that contains all units of measurement from current group (for example if type is 'area', it contains 'm2', 'mm2' etc.)
		this.dataByType = Converter.measurementUnitGroups[this.type];
	}
	convert(props){
		console.log(`${props.value} ${props.from} to ${props.to || "all"}`)
 
		if(!props.value) return new Error("'value' parameter is required!");

		const getById = function(id){
			return this.list.find(unit => unit.id === id);
		}

		//value of unit, that we are converting from
		const fromUnitOfMeasurement = getById.call(this.dataByType, props.from);
		if(!fromUnitOfMeasurement) return new Error("valid 'from' parameter is required!");

		//copy array to avoid it`s change
		const unitsOfMeasurementList = this.dataByType.list.slice();

		/*it is special coefitient, that makes first (props.from) unit of measurement value equal 1 (because a * (1/a) = 1)
		* other units of measurement, multiplied by this value become value of conversion from 1 "from-unit" to 1 "to-unit"
		* for example we want to convert km2 to m2. By default m2 is reset (because it is equal 1)
		* firstly, we get km2 value, it is 0.000001. Then we multiply all by 1/0.000001. km becomes 1 (reset), m2 becomes 1000000.
		* Now we know, that 1 km2 is 1000000 m2
		*/
		const reduceFraction = (1 / fromUnitOfMeasurement.value);
		//If we want to have (props.value) km2, we multiply it by reduceFraction
		const convertedValue = props.value * reduceFraction;

		for(let unit of unitsOfMeasurementList){
			unit.value *= convertedValue;
		}

		const toUnitOfMeasurement = getById.call(this.dataByType, props.to);

		return toUnitOfMeasurement || unitsOfMeasurementList;
	}
	toHtml(props){
		//console.log(props.precision);
		const data = props.converted;
		const tableRow = (name, value) => {
			return `<tr>
				<td>${name}</td>
				<td>${value}</td>
			</tr>`;
		};
		const parseValue = converted => {
			return converted.value ? converted.value.toStandardForm(props.precision) : 0;
		};
		return Array.isArray(props.converted)
			? data.map(a => tableRow(a.names.short || "Некоректний ввід!", parseValue(a))).join("<br>")
			: tableRow(data.names.short || "Некоректний ввід!", parseValue(data));
	}
}
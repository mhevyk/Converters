String.prototype.removeAt = function(index){
	return this.slice(0, index) + this.slice(index + 1);
}
function roundTo(number, precision){
	//round number and remain only integer part
	if(precision <= 0){
		return Math.round(number);
	}
	//round number due to precision value
	const precisionCoefitient = 10 ** precision;
	return (Math.round(number * precisionCoefitient)) / precisionCoefitient;
}

class Converter{
	static measurementUnitGroups = {
		area:{
			//metrics
			nm2: 1e18,
			mcm2: 1e12,
			mm2: 1000000,
			sm2: 10000,
			dm2: 100,
			m2: 1, //value by default
			a: 0.01,
			ha: 0.0001,
			km2: 0.000001,
			//british and american
			township: 1.072506e-8,
			mi2: 3.861022e-7,
			homestead: 0.000001544409,
			acre: 0.0002471055,
			rod: 0.0009884220,
			rod2: 0.03953687,
			yd2: 1.195990,
			ft2: 10.76391,
			in2: 1550
		},
		length:{
			
		}
	};
	constructor(props){
		//unit of measurement group
		this.type = props.type || "area";
		//object, that contains all units of measurement from current group (for example if type is 'area', it contains 'm2', 'mm2' etc.)
		this.measurementUnits = Converter.measurementUnitGroups[this.type];
	}
	
	convert(props){
		console.log(`${props.value} ${props.from} to ${props.to || "all"}`)
		if(props.from in this.measurementUnits){
			//copy object to avoid changes to this.measurementUnits
			const measurementUnits = {...this.measurementUnits};
			/*it is special coefitient, that makes first (props.from) unit of measurement value equal 1 (because a * (1/a) = 1)
			* other units of measurement, multiplied by this value become value of conversion from 1 "from-unit" to 1 "to-unit"
			* for example we want to convert km2 to m2. By default m2 is reset (because it is equal 1)
			* firstly, we get km2 value, it is 0.000001. Then we multiply all by 1/0.000001. km becomes 1 (reset), m2 becomes 1000000.
			* Now we know, that 1 km2 is 1000000 m2
			*/
			const reduceFraction = (1 / measurementUnits[props.from]);
			//If we want to have (props.value) km2, we multiply it by reduceFraction
			const convertedValue = props.value * reduceFraction;

			const measurementUnitNames = Object.keys(measurementUnits);

			for(let name of measurementUnitNames){
				measurementUnits[name] *= convertedValue;
				//convert each measurement unit to standard form (mantissa * 10 ^ n)
				if(props.standardForm){
					measurementUnits[name] = this.toStandardForm({
						number: measurementUnits[name],
						precision: props.precision
					});
				}
				else if(props.precision > 0){
					measurementUnits[name] = roundTo(measurementUnits[name], props.precision);
				}
			}

			if(props.to in measurementUnits){
				return measurementUnits[props.to];
			}
			else{
				return {
					...measurementUnits,
					toString: function(){
						const result = [];
						for(let name of measurementUnitNames){
							result.push(name + ": " + measurementUnits[name].toString());
						}
						return result;
					}
				};
			}
		}
	}
	toStandardForm(props){
		const numberWithoutSign = Math.abs(props.number);
		const digits = String(numberWithoutSign);
		const result = {};

		const isNumberBetween0And1 = (0 < numberWithoutSign && numberWithoutSign < 1);

		//position of floating dot in number
		const dotPosition = isNumberBetween0And1 ? 1 : ((digits.indexOf(".") != -1) ? digits.indexOf(".") : digits.length);

		//if number is written in exponential form, we simply replace exp part, for example 1.05e-6 becomes 1.05 * 10 ^ -6
		if(digits.includes("e") || digits.includes("E")){
			//find position of exponent symbol (e or E)
			let exponentPosition = digits.indexOf("e");
			if(exponentPosition === -1){
				exponentPosition = digits.indexOf("E");
			}
			//mantissa with dot
			const rawMantissa = digits.slice(0, exponentPosition);
			//mantissa without dot
			result.mantissaDigits = rawMantissa.removeAt(dotPosition);
			result.shift = parseInt(digits.slice(exponentPosition + 1));
		}
		else if(isNumberBetween0And1){
			//number between 0 and 1 contains a lot of zeros, so we count them and find first not zero symbol after dot
			//it will become our mantissa
			const notZeroInAfterDotPartPosition = digits.split("").findIndex((digit, currentPosition) => {
				return ((digit !== "0") && (currentPosition > dotPosition));
			});
			//slice all zeros after dot and before first not zero symbol
			result.mantissaDigits = digits.slice(notZeroInAfterDotPartPosition);
			result.shift = dotPosition - notZeroInAfterDotPartPosition;
		}
		else{
			//remove dot from digits variable using slice()
			result.mantissaDigits = digits.removeAt(dotPosition);
			result.shift = dotPosition - 1;
		}
		return {
			...result,
			initial: props.number,
			getNumericMantissa: function(){
				return parseFloat(this.mantissaDigits[0] + "." + this.mantissaDigits.slice(1));
			},
			toString: function(){
				//get sign of mantissa, using initial number
				const sign = Math.sign(this.initial);
				let mantissa = this.getNumericMantissa();
				//if precision is bigger of equal 0, we round it due to precision
				if(props.precision >= 0){
					mantissa = roundTo(mantissa, props.precision);
				}
				//if shift is 0, we do not show it, because 10 ^ 0 = 1
				const shift = this.shift ? (` * 10 ^ ${this.shift}`) : ``;
				return (sign * mantissa) + shift;
			},
		};
	}
}

const areaConverter = new Converter({type: "area"});
//const lengthConverter = new Converter({type: "length"});

const cnv20ft2 = areaConverter.convert({ value: 100, standardForm: true, from: "km2"});

console.log(cnv20ft2);
console.log(cnv20ft2.toString());
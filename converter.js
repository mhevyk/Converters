class Converter{
	static measurementUnitGroups = {
		area:{
			mm2: 1000000,
			sm2: 10000,
			dm2: 100,
			m2: 1, //value by default
			a: 0.01,
			ha: 0.0001,
			km2: 0.000001,
			in2: 1550,
			ft2: 10.76391,
			yd2: 1.195990,
			ac: 0.0002471055,
			mi2: 3.861022e-7,
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
				measurementUnits[name] = this.toStandardForm({
					number: measurementUnits[name],
					precision: props.precision
				});
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
							result.push(measurementUnits[name].toString());
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

		let mantissa = null;

		if(isNumberBetween0And1){
			//number between 0 and 1 contains a lot of zeros, so we count them and find first not zero symbol after dot
			//it will become our mantissa
			const notZeroInAfterDotPartPosition = digits.split("").findIndex((digit, currentPosition) => {
				return ((digit !== "0") && (currentPosition > dotPosition));
			});
			//slice all zeros after dot and before first not zero symbol
			mantissa = digits.slice(notZeroInAfterDotPartPosition);
			result.shift = dotPosition - notZeroInAfterDotPartPosition;
		}
		else{
			//remove dot from digits variable using slice()
			mantissa = digits.slice(0, dotPosition) + digits.slice(dotPosition + 1);
			result.shift = dotPosition - 1;
		}
		return {
			...result,
			initial: props.number,
			mantissa: {
				integer: mantissa[0],
				decimal: mantissa.slice(1)
			},
			toString: function(){
				//uses to store default mantissa or mantissa with precision
				let rawDecimalMantissa = this.mantissa.decimal;
				if(props.precision){
					//leave props.precision digits in mantissa decimal part
					let precision = rawDecimalMantissa.slice(0, props.precision);
					//if user precision is bigger than calculated mantissa, we will rest with zeros
					if(precision.length < props.precision){
						precision += "0".repeat(props.precision - precision.length);
					}
					//now mantissa is with precision
					rawDecimalMantissa = precision;
				}
				const integerMantissa = Math.sign(this.initial) * this.mantissa.integer;
				//if decimal part is all zeros (for example "000000000"), we do not show decimalPart
				const decimalMantissa = parseInt(this.mantissa.decimal) ? `.${rawDecimalMantissa}` : ``;
				//if shift is 0, we do not show it, because 10 ^ 0 = 1
				const shift = this.shift ? (` * 10 ^ ${this.shift}`) : ``;
				return integerMantissa + decimalMantissa + shift;
			},
		};
	}
}

const areaConverter = new Converter({type: "area"});
//const lengthConverter = new Converter({type: "length"});

const cnv20ft2tokm2 = areaConverter.convert({ value: 20, from: "ft2", to: "km2", precision: 2});

const cnv20ft2 = areaConverter.convert({ value: 20, from: "ft2", precision: 2});

console.log(cnv20ft2tokm2);
console.log(cnv20ft2tokm2.toString());

console.log(cnv20ft2);
console.log(cnv20ft2.toString());
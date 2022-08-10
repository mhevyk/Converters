class Converter{
	//private fields
	#appended = false;
	#measurementUnitGroupData = null;

	constructor(props = {}){
		//if type is not key in in Converter.measurementUnitGroups, we set area by default
		this.type = (props.type in Converter.measurementUnitGroups) ? props.type : "area";
		//object, that contains all units of measurement from current group (for example if type is 'area', it contains 'm2', 'mm2' etc.)
		this.#measurementUnitGroupData = Converter.measurementUnitGroups[this.type];
		if(props.selector){
			this.appendTo(props.selector);
		}
	}
	appendTo(selector){
		try{
			//checking selector validity
			const resultContainer = document.querySelector(selector);
			if(!resultContainer) throw new Error("Cannot append converter because of wrong selector!");

			//avoid multiple appending one converter to page
			if(this.#appended) throw new Error("This converter was already appended!");
			this.#appended = true;

			//create wrapper of converter
			const wrapper = createContainerWithClasses("div", this.type, "converter");

			const converterTitle = createContainerWithClasses("h2", "converter-main-title");
			converterTitle.innerHTML = this.#measurementUnitGroupData.icon + this.type + " converter";

			//input for typing value
			const valueInput = createConverterValueInput(this.type);

			//title and select for "from" unit of measurement
			const fromTitle = createConverterTitle(`Convert ${this.type} from:`);
			const fromSelect = createFromConverterSelect(this.type);

			//title and select for "to" unit of measurement
			const toTitle = createConverterTitle(`to:`, {reverse: true});
			const toSelect = createToConverterSelect(this.type);

			const optgroups = createOptgroups(this.#measurementUnitGroupData.list);
			fromSelect.innerHTML += optgroups;
			toSelect.innerHTML += optgroups;

			const precisionRange = createConverterPrecisionRange(this.type);

			//link, that opens more options
			const moreToggle = createConverterMoreToggle(precisionRange);

			const result = createContainerWithClasses("div", "converter-result");

			//reads value from input, from and to units of measurements from selects and precision from range and passes it to converter, that prints result of error
			const startConverting = converterHandler.bind(this, {valueInput, fromSelect, toSelect, precisionRange, result});

			//limit length of value input field
			valueInput.oninput = event => {
				//max symbols limit
				const LIMIT = 10;
				const value = event.target.value;
				if(value.length >= LIMIT){
					event.target.value = value.slice(0, -1);
				}
				else startConverting();
			};
			fromSelect.onchange = startConverting;
			toSelect.onchange = startConverting;
			//moving range caption when changing its status
			precisionRange.oninput = event => {
				moveConverterRangeCaption(event.target.parentNode);
				startConverting();
			};
			precisionRange.onclick = event => moveConverterRangeCaption(event.target.parentNode);

			//appending elements to wrapper and then appending to block with parameter selector:
			wrapper.appendChild(converterTitle);
			wrapper.appendChild(fromTitle);
			wrapper.appendChild(valueInput);
			wrapper.appendChild(fromSelect);
			wrapper.appendChild(toTitle);
			wrapper.appendChild(toSelect);
			wrapper.appendChild(moreToggle);
			wrapper.appendChild(result);
			resultContainer.appendChild(wrapper);
		}
		catch(error){
			console.error(error);
		}
	}
	//created separate method, because it has to work with mupliple lists
	getById(id, from){
		return from.find(record => record.id === id);
	}
	convert(props = {}){
		console.log(`Converting ${props.value} ${props.from} to ${props.to || "all"}`);
		if(!props.value) return "Value is invalid!";

		//deep copy of array. This kind of copy makes functions null and they dissapear
		const unitsOfMeasurementList = this.#measurementUnitGroupData.list.createDeepCopy();

		//value of unit, that we are converting from
		const fromUnitOfMeasurement = this.getById(props.from, unitsOfMeasurementList);
		if(!fromUnitOfMeasurement) return "From value is invalid!";

		const toUnitOfMeasurement = this.getById(props.to, unitsOfMeasurementList);

		const convertionData = {
			...props,
			list: unitsOfMeasurementList,
			fromCopy: fromUnitOfMeasurement,
		};

		this.#measurementUnitGroupData.manual ? this.#specialConvert(convertionData) : this.#basicConvert(convertionData);

		return {
			fromNames: fromUnitOfMeasurement.names,
			result: (toUnitOfMeasurement || unitsOfMeasurementList)
		};
	}
	#specialConvert(props){
		//get original from, because copying with json causes lost of functions
		const originalFrom = this.getById(props.from, this.#measurementUnitGroupData.list);
		//getting manualConverts object of functions
		const manualConverts = originalFrom.manualConverts;
		props.list.forEach(unit => {
			//example: if we convert 5 K to K, we get 5 (props.value), if we convert 5 K to C, we must use special conversion function
			const numericValue = (props.from === unit.id) ? props.value : manualConverts[unit.id](props.value);
			//convert number to Big in order to use Big.toStandardForm() function
			unit.value = new Big(numericValue);
		});
	}
	#basicConvert(props){
		/*it is special coefitient, that makes first (props.from) unit of measurement value equal 1 (because a * (1/a) = 1)
		* other units of measurement, multiplied by this value become value of conversion from 1 "from-unit" to 1 "to-unit"
		* for example we want to convert km2 to m2. By default m2 is reset (because it is equal 1)
		* firstly, we get km2 value, it is 0.000001. Then we multiply all by 1/0.000001. km becomes 1 (reset), m2 becomes 1000000.
		* Now we know, that 1 km2 is 1000000 m2
		*/
		let reduceFraction = new Big(1 / props.fromCopy.value);
		//If we want to have (props.value) km2, we multiply it by reduceFraction
		const convertedValue = reduceFraction.times(props.value);

		//multiply unit value by converted value
		props.list.forEach(unit => {
			//if from and to value are equal, we set value of it props.value, because there can be rounding issues
			unit.value = (unit.id === props.from)
				? new Big(props.value)
				: convertedValue.times(unit.value);
		});
	}
	toHtmlList(props = {}){
		const converted = props.converted;
		const liWrapper = record => {
			if(record.error) throw record.error;
			return `
			<li>
				${record.value.toStandardForm(props.precision)}
				<span class="primary-text">${record.names.short || record.names.full}</span>
			</li>`;
		};

		const liList = Array.isArray(converted)
			? converted.map(liContent => liWrapper(liContent)).join("")
			: liWrapper(converted);
		
		return `<ul class="result-list">${liList}</ul>`;
	}
}

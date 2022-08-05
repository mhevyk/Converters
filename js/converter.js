class Converter{
	static measurementUnitGroups = {
		area: {
			list: [
				{id: "nm2", value: 1e18, names: {short: "nm&sup2", full: "square nanometer"}, group: "Metric system"},
				{id: "mcm2", value: 1e12, names: {short: "mcm&sup2", full: "square micrometer"}, group: "Metric system"},
				{id: "mm2", value: 1000000, names: {short: "mm&sup2", full: "square millimeter"}, group: "Metric system"},
				{id: "sm2", value: 10000, names: {short: "cm&sup2", full: "square centimeter"}, group: "Metric system"},
				{id: "dm2", value: 100, names: {short: "dm&sup2", full: "square decimeter"}, group: "Metric system"},
				{id: "m2", value: 1, names: {short: "m&sup2", full: "square meter"}, group: "Metric system"},
				{id: "ar", value: 0.01, names: {short: "a", full: "ar/hectare"}, group: "Metric system"},
				{id: "ha", value: 0.0001, names: {short: "ha", full: "hectare"}, group: "Metric system"},
				{id: "km2", value: 0.000001, names: {short: "km&sup2", full: "square kilometer"}, group: "Metric system"},

				{id: "township", value: 1.072506e-8, names: {short: "twsp", full: "township"}, group: "Anglo-american units"},
				{id: "mi2", value: 3.861022e-7, names: {short: "mi&sup2", full: "square mile"}, group: "Anglo-american units"},
				{id: "homestead", value: 0.000001544409, names: {short: "hmst", full: "homestead"}, group: "Anglo-american units"},
				{id: "acre", value: 0.0002471055, names: {short: "acre", full: "acre"}, group: "Anglo-american units"},
				{id: "rod", value: 0.0009884220, names: {short: "rod", full: "rod"}, group: "Anglo-american units"},
				{id: "rod2", value: 0.03953687, names: {short: "rod&sup2", full: "square rod"}, group: "Anglo-american units"},
				{id: "yd2", value: 1.195990, names: {short: "yd&sup2", full: "square yard"}, group: "Anglo-american units"},
				{id: "ft2", value: 10.76391, names: {short: "ft&sup2", full: "square foot"}, group: "Anglo-american units"},
				{id: "in2", value: 1550, names: {short: "in&sup2", full: "square inch"}, group: "Anglo-american units"}
			],
		},
		length:{
			list: []
		}
	};
	constructor(props = {}){
		//unit of measurement group
		this.type = props.type || "area";
		//object, that contains all units of measurement from current group (for example if type is 'area', it contains 'm2', 'mm2' etc.)
		this.dataByType = Converter.measurementUnitGroups[this.type];
		if(props.selector){
			this.appendTo(props.selector);
		}
	}
	appendTo(selector){
		//avoid multiple appending one converter to page
		if(this.appended) return;
		this.appended = true;

		//create wrapper of converter
		const wrapper = createContainerWithClasses("div", this.type, "converter");

		//input for typing value
		const valueInput = createConverterValueInput(this.type);

		//title and select for "from" unit of measurement
		const fromTitle = createConverterTitle(`Convert ${this.type} from:`);
		const fromSelect = createFromConverterSelect(this.type);

		//title and select for "to" unit of measurement
		const toTitle = createConverterTitle("to:");
		const toSelect = createToConverterSelect(this.type);

		const optgroups = createOptgroups(this.dataByType.list);
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
		wrapper.appendChild(fromTitle);
		wrapper.appendChild(valueInput);
		wrapper.appendChild(fromSelect);
		wrapper.appendChild(toTitle);
		wrapper.appendChild(toSelect);
		wrapper.appendChild(moreToggle);
		wrapper.appendChild(result);
		document.querySelector(selector).appendChild(wrapper);
	}
	//created separate method, because it has to work with mupliple lists
	getById(id, from){
		return from.find(record => record.id === id);
	}
	convert(props = {}){
		console.log(`Converting ${props.value} ${props.from} to ${props.to || "all"}`);
		if(!props.value) return "Value is invalid!";

		//deep copy of array
		const unitsOfMeasurementList = this.dataByType.list.createDeepCopy();

		//value of unit, that we are converting from
		const fromUnitOfMeasurement = this.getById(props.from, unitsOfMeasurementList);
		if(!fromUnitOfMeasurement) return "From value is invalid!";

		/*it is special coefitient, that makes first (props.from) unit of measurement value equal 1 (because a * (1/a) = 1)
		* other units of measurement, multiplied by this value become value of conversion from 1 "from-unit" to 1 "to-unit"
		* for example we want to convert km2 to m2. By default m2 is reset (because it is equal 1)
		* firstly, we get km2 value, it is 0.000001. Then we multiply all by 1/0.000001. km becomes 1 (reset), m2 becomes 1000000.
		* Now we know, that 1 km2 is 1000000 m2
		*/
		let reduceFraction = new Big(1 / fromUnitOfMeasurement.value);
		//If we want to have (props.value) km2, we multiply it by reduceFraction
		const convertedValue = reduceFraction.times(props.value);

		//multiply unit value ny converted value
		unitsOfMeasurementList.forEach(unit => unit.value = convertedValue.times(unit.value));

		const toUnitOfMeasurement = this.getById(props.to, unitsOfMeasurementList);

		return toUnitOfMeasurement || unitsOfMeasurementList;
	}
	toHtmlList(props = {}){
		const converted = props.converted;
		const liWrapper = record => {
			if(record.error) throw record.error;
			return `
			<li>
				${record.value.toStandardForm(props.precision)}
				<span class="primary-text">${record.names.short}</span>
			</li>`;
		};

		const liList = Array.isArray(converted)
			? converted.map(liContent => liWrapper(liContent)).join("")
			: liWrapper(converted);
		
		return `<ul class="result-list">${liList}</ul>`;
	}
}

const areaConverter = new Converter({
	type: "area",
	selector: "#area-converter"
});

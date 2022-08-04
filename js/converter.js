class Converter{
	static measurementUnitGroups = {
		getById: function(id){
			return this.list.find(unit => unit.id === id);
		},
		area: {
			list: [
				{id: "mcm2", value: 1e12, names: {short: "mcm&sup2", full: "квадратний мікрометр"}, group: "Метрична система"},
				{id: "mm2", value: 1000000, names: {short: "mm&sup2", full: "квадратний міліметр"}, group: "Метрична система"},
				{id: "sm2", value: 10000, names: {short: "sm&sup2", full: "квадратний сантиметр"}, group: "Метрична система"},
				{id: "dm2", value: 100, names: {short: "dm&sup2", full: "квадратний дециметр"}, group: "Метрична система"},
				{id: "m2", value: 1, names: {short: "m&sup2", full: "квадратний метр"}, group: "Метрична система"},
				{id: "ar", value: 0.01, names: {short: "a", full: "ар/сотка"}, group: "Метрична система"},
				{id: "ha", value: 0.0001, names: {short: "ha", full: "гектар"}, group: "Метрична система"},
				{id: "km2", value: 0.000001, names: {short: "km&sup2", full: "квадратний кілометр"}, group: "Метрична система"},

				{id: "township", value: 1.072506e-8, names: {short: "twsp", full: "тауншип"}, group: "Англо-американські одиниці"},
				{id: "mi2", value: 3.861022e-7, names: {short: "mi&sup2", full: "квадратна миля"}, group: "Англо-американські одиниці"},
				{id: "homestead", value: 0.000001544409, names: {short: "hmst", full: "хоумстед"}, group: "Англо-американські одиниці"},
				{id: "acre", value: 0.0002471055, names: {short: "acre", full: "акр"}, group: "Англо-американські одиниці"},
				{id: "rod", value: 0.0009884220, names: {short: "rod", full: "род"}, group: "Англо-американські одиниці"},
				{id: "rod2", value: 0.03953687, names: {short: "rod&sup2", full: "квадратний род"}, group: "Англо-американські одиниці"},
				{id: "yd2", value: 1.195990, names: {short: "yd&sup2", full: "квадратний ярд"}, group: "Англо-американські одиниці"},
				{id: "ft2", value: 10.76391, names: {short: "ft&sup2", full: "квадратний фут"}, group: "Англо-американські одиниці"},
				{id: "in2", value: 1550, names: {short: "in&sup2", full: "квадратний дюйм"}, group: "Англо-американські одиниці"}
			],
		},
		length:{
			list: []
		}
	};
	constructor(props){
		//unit of measurement group
		this.type = props.type || "area";
		//object, that contains all units of measurement from current group (for example if type is 'area', it contains 'm2', 'mm2' etc.)
		this.dataByType = Converter.measurementUnitGroups[this.type];
		this.appendTo(props.selector || "body");
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
		const fromSelect = createConverterSelect({
			role: "from",
			type: this.type,
			defaultOptionText: "Choose unit of measurement...",
			disableDefaultOption: true
		});

		//title and select for "to" unit of measurement
		const toTitle = createConverterTitle("to:");
		const toSelect = createConverterSelect({
			role: "to",
			type: this.type,
			defaultOptionText: "All measurement units",
		});

		//fill selects with same options using this.dataByType.list objects list
		const groups = getUniqueElements(this.dataByType.list.map(a => a.group));
		const optgroups = [];
		for(let group of groups){
			const groupContent = this.dataByType.list.filter(a => a.group === group);
			optgroups.push(
				`<optgroup label="${group}">
					${groupContent.map(a => `<option value="${a.id}">${a.names.full} (${a.names.short})</option>`).join("")}
				</optgroup>`
			)
		}
		fromSelect.innerHTML += optgroups.join("");
		toSelect.innerHTML += optgroups.join("");

		//link, that opens more options
		const toggleLink = createContainerWithClasses("div", "converter-more-header");
		toggleLink.innerHTML = `<span>Click here for more options...</span>`;
		toggleLink.querySelector("span").onclick = event => $(event.target.parentNode.nextElementSibling).slideToggle();

		const precisionRange = createConverterPrecisionRange(this.type);

		//contents, that toggles due to toggle link
		const toggleContent = createContainerWithClasses("div", "converter-more-content");
		toggleContent.appendChild(precisionRange);

		const result = createContainerWithClasses("div", "converter-result");

		//reads value from input, from and to units of measurements from selects and precision from range and passes it to converter, that prints result of error
		const startConverting = () => {
			try{
				const value = parseFloat(valueInput.value);
				if(!value){
					throw new Error(`Invalid input! Type ${this.type} value again!`);
				}
				const from = getSelectedOption(fromSelect);
				if(!from){
					throw new Error("You forgot to choose <span class='primary-text'>from</span> unit of measurement!");
				}

				const to = getSelectedOption(toSelect);

				const precision = parseInt(precisionRange.querySelector("input").value);
				
				//list of objects, that contain converted values
				const converted = this.convert({value, from, to});
				//get short name of selected "from" value
				const fromShortName = this.getById(from).names.short;
				//list of options containing all converted units of measurement
				const liList = this.toHtml({converted, precision});

				const resultHeader = `<div class="result-header">${value} ${fromShortName} is:</div>`;
				const resultContent = `<ul class="result-list">${liList}</ul>`;
				result.innerHTML = resultHeader + resultContent;
			}
			catch(error){
				result.innerHTML = error.message;
			}
		};

		//limit length of field
		valueInput.oninput = event => {
			const value = event.target.value;
			if(value.length > 9){
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
		wrapper.appendChild(toggleLink);
		wrapper.appendChild(toggleContent);
		wrapper.appendChild(result);
		document.querySelector(selector).appendChild(wrapper);
	}
	getById(id){
		return Converter.measurementUnitGroups.getById.call(this.dataByType, id);
	}
	convert(props){
		console.log(`${props.value} ${props.from} to ${props.to || "all"}`);

		//value of unit, that we are converting from
		const fromUnitOfMeasurement = this.getById(props.from);

		//copy array to avoid it`s change
		const unitsOfMeasurementList = this.dataByType.list.slice();

		/*it is special coefitient, that makes first (props.from) unit of measurement value equal 1 (because a * (1/a) = 1)
		* other units of measurement, multiplied by this value become value of conversion from 1 "from-unit" to 1 "to-unit"
		* for example we want to convert km2 to m2. By default m2 is reset (because it is equal 1)
		* firstly, we get km2 value, it is 0.000001. Then we multiply all by 1/0.000001. km becomes 1 (reset), m2 becomes 1000000.
		* Now we know, that 1 km2 is 1000000 m2
		*/
		let reduceFraction = 1 / fromUnitOfMeasurement.value;
		//If we want to have (props.value) km2, we multiply it by reduceFraction
		const convertedValue = props.value * reduceFraction;

		for(const unit of unitsOfMeasurementList){
			unit.value *= convertedValue;
		}

		const toUnitOfMeasurement = this.getById(props.to);

		return toUnitOfMeasurement || unitsOfMeasurementList;
	}
	toHtml(props){
		console.log(props.converted)
		const data = props.converted;
		const toStandardForm = converted => converted.value.toStandardForm(props.precision);
		const tableRow = record => {
			if(record.error) throw record.error;
			return `<li>${toStandardForm(record)}<span class="primary-text">${record.names.short}</span></li>`;
		};
		
		return Array.isArray(props.converted)
			? data.map(a => tableRow(a)).join("")
			: tableRow(data);
	}
}

const areaConverter = new Converter({
	type: "area",
	selector: "#area-converter"
});

const getSelectedOption = select => select.options[select.selectedIndex].value;

const createContainerWithClasses = (tagName, ...classes) => {
	const container = document.createElement(tagName);
	container.classList.add(...classes);
	return container;
};
const createConverterTitle = (title, props = {}) => {
	const titleContainer = createContainerWithClasses("div", "converter-title");
	titleContainer.innerHTML = title;
	return titleContainer;
};
const createConverterReverseButton = (fromSelect, toSelect) => {
	const reverseButton = createContainerWithClasses("i", "fas", "fa-sync-alt");
	reverseButton.title = "Reverse from and to units of measurement";
	reverseButton.onclick = function(event){
		const from = getSelectedOption(fromSelect);
		const to = getSelectedOption(toSelect);
		if(!from || !to || (from === to)) return;

		const reverseButton = event.target;

		reverseButton.classList.add("rotate");
		reverseButton.onanimationend = () => {
			fromSelect.querySelector(`[value='${to}']`).selected = true;
			toSelect.querySelector(`[value='${from}']`).selected = true;

			fromSelect.dispatchEvent(new Event("change"));
			reverseButton.classList.remove("rotate");
		}
	}
	return reverseButton;
}

const createConverterSelect = props => {
	const select = createContainerWithClasses("select", "converter-select", `converter-${props.role}`, "converter-action-item")
	select.dataset.type = props.type;
	select.innerHTML = `<option value="" selected ${props.disableDefaultOption ? "disabled" : ""}>${props.defaultOptionText}</option>`;
	return select;
};

const createFromConverterSelect = type => createConverterSelect({
	role: "from",
	type: type,
	defaultOptionText: "Choose unit of measurement...",
	disableDefaultOption: true
});

const createToConverterSelect = type => createConverterSelect({
	role: "to",
	type: type,
	defaultOptionText: "All measurement units",
});

const createOptionsList = array => {
	return array.map(record => {
		const shortName = record.names.short ? `(${record.names.short})` : ``;
		return `<option value="${record.id}">${record.names.full} ${shortName}</option>`;
	});
};

const createOptgroups = list => {
	const groups = list.map(record => record.group).getUniqueElements().filter(Boolean);
	if(!groups.length){
		return createOptionsList(list);
	}
	const optgroups = groups.map(group => {
		const groupContent = list.filter(record => record.group === group);
		return `<optgroup label="${group}">${createOptionsList(groupContent).join("")}</optgroup>`;
	});
	return optgroups.join("");
};

const createConverterMoreToggle = toggleContent => {
	const header = createContainerWithClasses("div", "converter-more-header");
	header.innerHTML = `<span class="converter-more-header-clickable">Click here for more options...</span>`;
	header.querySelector("span").onclick = event => {
		let header = event.target;
		/*if we translate with google translator, it adds font tag, that crushes toggle button work
		* to avoid it we find element with class converter-more-header-clickable
		*/
		while(!header.classList.contains("converter-more-header-clickable")){
			header = header.parentNode;
		}
		$(header.parentNode.nextElementSibling).slideToggle();
	}

	const content = createContainerWithClasses("div", "converter-more-content");
	content.appendChild(toggleContent);
	const wrapper = createContainerWithClasses("div", "converter-more-wrapper");
	wrapper.appendChild(header);
	wrapper.appendChild(content);
	return wrapper;
};

const createConverterValueInput = type => {
	const input = createContainerWithClasses("input", "converter-value", "converter-action-item");
	input.dataset.type = type;
	input.type = "text";
	input.setAttribute("maxlength", 10);
	input.value = 1;
	input.placeholder = `Enter ${type}...`;
	return input;
};

function converterHandler(props){
	try{
		const value = parseFloat(props.valueInput.value);
		if(!value){
			throw new Error(`Invalid input! Type ${this.type} value again!`);
		}
		const from = getSelectedOption(props.fromSelect);
		if(!from){
			throw new Error("You forgot to choose <span class='primary-text'>from</span> unit of measurement!");
		}

		const to = getSelectedOption(props.toSelect);

		const precision = parseInt(props.precisionRange.querySelector("input").value);

		if(to && from !== to){
			props.reverseButton.classList.add("active");
		}
		else{
			props.reverseButton.classList.remove("active");
		}
		//list of objects, that contain converted values
		const converted = this.convert({value, from, to});
		//get short name of selected "from" value
		const fromNames = converted.fromNames;

		const resultHeader = `<div class="result-header">${value} ${fromNames.short || fromNames.full} is:</div>`;
		const resultContent = this.toHtmlList({converted: converted.result, precision});
		props.result.innerHTML = resultHeader + resultContent;
	}
	catch(error){
		props.result.innerHTML = error.message;
	}
};
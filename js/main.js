function getUniqueElements(array){
	return Array.from(new Set(array));
}
function getSelectedOption(select){
    return select.options[select.selectedIndex].value;
}
function createContainerWithClasses(tagName, ...classes){
	const container = document.createElement(tagName);
	container.classList.add(...classes);
	return container;
}
function createConverterTitle(title){
	const titleContainer = createContainerWithClasses("div", "converter-title");
	titleContainer.textContent = title;
	return titleContainer;
}
function createConverterSelect(props){
	const select = createContainerWithClasses("select", "converter-select", `converter-${props.role}`, "converter-action-item")
	select.dataset.type = props.type;
	select.innerHTML = `<option value="" selected ${props.disableDefaultOption ? "disabled" : ""}>${props.defaultOptionText}</option>`;
	return select;
}
function createConverterValueInput(type){
	const input = createContainerWithClasses("input", "converter-value", "converter-action-item");
	input.dataset.type = type;
	input.type = "number";
	input.value = 1;
	input.placeholder = `Enter ${type}...`;
	return input;
}
document.querySelector("#mobile-menu").addEventListener("click", () => {
	const menu = $("#menu");
	menu.slideToggle(500);
	$("#mobile-menu > .fas").toggleClass("fa-angle-down");
	$("#mobile-menu > .fas").toggleClass("fa-angle-up");
});
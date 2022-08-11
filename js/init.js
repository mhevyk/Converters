//init tabs
const menu = new Tabs("main-navigation-tabs");

//as id`s are same as Converter.measurementUnitGroups, we use forEach to reduce code for creating all converters
const converterNames = Object.keys(Converter.measurementUnitGroups);
converterNames.forEach(name => new Converter({type: name, selector: `#${name}-converter`}));

//init mobile menu
document.querySelector("#mobile-menu").addEventListener("click", () => {
	const menu = $("#menu");
	const mobileMenuArrow = $("#mobile-menu > .fas");
	menu.slideToggle(500);
	mobileMenuArrow.toggleClass("fa-angle-down");
	mobileMenuArrow.toggleClass("fa-angle-up");
});
//init tabs
const menu = new Tabs("main-navigation-tabs");

//init convertes
const areaConverter = new Converter({
    type: "area",
    selector: "#area-converter"
});
const lengthConverter = new Converter({
    type: "length",
    selector: "#length-converter"
});
const temperatureConverter = new Converter({
    type: "temperature",
    selector: "#temperature-converter"
});
const volumeConverter = new Converter({
    type: "volume",
    selector: "#volume-converter"
});
const weightConverter = new Converter({
    type: "weight",
    selector: "#weight-converter"
});
const dataConverter = new Converter({
    type: "data",
    selector: "#data-converter"
});
const speedConverter = new Converter({
    type: "speed",
    selector: "#speed-converter"
});
const timeConverter = new Converter({
    type: "time",
    selector: "#time-converter"
});

//init mobile menu
document.querySelector("#mobile-menu").addEventListener("click", () => {
	const menu = $("#menu");
	const mobileMenuArrow = $("#mobile-menu > .fas");
	menu.slideToggle(500);
	mobileMenuArrow.toggleClass("fa-angle-down");
	mobileMenuArrow.toggleClass("fa-angle-up");
});
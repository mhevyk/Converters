const moveConverterRangeCaption = rangeWrapper => {
	const range = rangeWrapper.querySelector("input");
	const {min, max, value} = range;
	const percentPad = Number((value - min) * 100 / (max - min));
	const pixelPad = 10 - (percentPad * 0.2);
	const rangeCaption = rangeWrapper.querySelector(".range-value-caption");
	rangeCaption.querySelector("span").textContent = value;
	rangeCaption.style.left = `calc(${percentPad}% + (${pixelPad}px))`;
};
const createConverterPrecisionRange = type => {
	const wrapper = createContainerWithClasses("div", "range-wrapper");
	const precisionTitle = createConverterTitle("Decimal value precision:");
	const rangeCaption = createContainerWithClasses("div", "range-value-caption");
	rangeCaption.innerHTML = "<span>0</span>";
	const range = createContainerWithClasses("input", "converter-precision");
	range.type = "range";
	range.step = 1;
	range.min = 1;
	range.max = 8;
	range.value = 2;
	range.dataset.type = type;
	wrapper.appendChild(precisionTitle);
	wrapper.appendChild(rangeCaption);
	wrapper.appendChild(range);
	moveConverterRangeCaption(wrapper);
	return wrapper;
}
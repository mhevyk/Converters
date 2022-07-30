function moveRangeLabel(element){
	const {min, max, value} = element;
	const percentPad = Number((value - min) * 100 / (max - min));
	const pixelPad = 10 - (percentPad * 0.2);
	const rangeCaption = element.previousElementSibling;
	rangeCaption.querySelector("span").textContent = value;
	rangeCaption.style.left = `calc(${percentPad}% + (${pixelPad}px))`;
};

document.addEventListener("DOMContentLoaded", () => {
    const precisionRanges = document.querySelectorAll("input[data-role='precision']");
    for(let range of precisionRanges){
        moveRangeLabel(range);
        range.onclick = event => moveRangeLabel(event.target);
        range.oninput = event => {
            moveRangeLabel(event.target);
            convertHandler(event);
        }
    }
});
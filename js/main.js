const getInputValue = (inputSelector, parsingFunction) => {
    const input = document.querySelector(inputSelector);
    return parsingFunction(input.value);
}
const getSelectedOptionValue = selectSelector => {
    const select = document.querySelector(selectSelector);
    return select.options[select.selectedIndex].value;
}
const limitInputLength = (event, limit) => {
    const value = event.target.value;
    if(value.length > limit){
        event.target.value = value.slice(0, -1);
        throw new Error("Limit of input was reached!");
    }
};
function convertHandler(event){
	const type = event.target.dataset.type;

    const value = getInputValue(`.${type} .converter-value`, parseFloat);
    const from = getSelectedOptionValue(`.${type} .converter-from`);
	const to = getSelectedOptionValue(`.${type} .converter-to`);
    const precision = getInputValue(`.${type} .converter-precision`, parseInt);

	const result = document.querySelector(`.${type} .converter-result`);

	const converter = new Converter({type});

	const converted = converter.convert({value, from, to});

	try{
		result.innerHTML = `<tr class="header">
			<td>Unit of measurement</td>
			<td>Value</td>
		</tr>`;

		result.innerHTML += converter.toHtml({converted, precision});
	}
	catch(error){
		switch(error.message){
			case "invalid 'from' parameter!":
				result.innerHTML = "You forgot to select <span style='color: var(--primary-blue)'>from</span> unit of measurement!";
				break;
			default: 
				result.innerHTML = `Invalid input! Type again!`;
				break;
		}
	}
}

const valueInputs = document.querySelectorAll(".converter-value");
const fromSelects = document.querySelectorAll(".converter-from");
const toSelects = document.querySelectorAll(".converter-to");
const precisionRanges = document.querySelectorAll(".converter-precision");

for(let i = 0; i < valueInputs.length; i++){
	valueInputs[i].oninput = function(event){
        try{
            limitInputLength(event, 9);
		    convertHandler(event);
        }
        catch(error){

        }
	}
    valueInputs[i].onclick = event => {
        event.target.value = "";
    }
	fromSelects[i].onchange = convertHandler;
	toSelects[i].onchange = convertHandler;
}

document.querySelector("#mobile-menu").addEventListener("click", () => {
	const menu = $("#menu");
	menu.slideToggle(500);
	$("#mobile-menu > .fas").toggleClass("fa-angle-down");
	$("#mobile-menu > .fas").toggleClass("fa-angle-up");
});

document.querySelectorAll(".converter-more-header").forEach(header => {
	header.onclick = event => {
		let clicked = event.target;
		if(clicked.tagName === "A"){
			clicked = clicked.parentNode;
		}
		$(clicked.nextElementSibling).slideToggle();
	};
});
class Tabs{
	constructor(id){
		this.link = document.querySelector(`#${id}`);

		this.headers = this.link.querySelectorAll(`.menu-header`);
		this.contents = this.link.querySelectorAll(`.menu-content`);

		this.init();
	}
	init(){
		//create tab-index attribute
		for(let index = 0; index < this.headers.length; index++){
			this.headers[index].setAttribute("tab-index", index);
		}

		//if tab was selected and it is in sessionStorage, it loads and sets
		const savedTabIndex = parseInt(sessionStorage.getItem("converters-active-tab"));
		this.setActive(savedTabIndex || 0);

		for(const header of this.headers){
			header.onclick = event => {
				//if we click on children block, then we return to parent while we find block with attribute "tab-index"
				let clickedBlock = event.target;
				while(!clickedBlock.getAttribute("tab-index")){
					clickedBlock = clickedBlock.parentNode;
				}
				let tab = parseInt(clickedBlock.getAttribute("tab-index"));
				if(!this.isActive(tab)){
					if($("#mobile-menu").is(":visible")){
						$("#menu").slideUp();
					}
					this.setActive(tab);
				}
			};
		}
	}
	setActive(index){
		for(const header of this.headers){
			header.classList.remove("active");
		}
		this.headers[index].classList.add("active");

		for(const content of this.contents){
			content.style.display = "none";
		}
		this.contents[index].style.display = "block";

		sessionStorage.setItem("converters-active-tab", index);
	}
	isActive(index){
		return this.headers[index].classList.contains("active");
	}
}
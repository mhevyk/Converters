class Tabs{
	constructor(id){
		this.link = document.querySelector(`#${id}`);
		this.link.classList.add("tabs");
	}
	init(){
		//create tab-index attribute
		for(let index = 0; index < this.headers.length; index++){
			this.headers[index].setAttribute("tab-index", index);
		}
		this.setActive(0);//sets first tab active
		for(let header of this.headers){
			header.onclick = event => {
				let clickedBlock = event.target;
				if(clickedBlock.tagName === "I"){
					clickedBlock = clickedBlock.parentNode;
				}
				let tab = parseInt(clickedBlock.getAttribute("tab-index"));
				if(!this.isActive(tab)){
					this.setActive(tab);
				}
			};
		}
	}
}
class NavigationTabs extends Tabs{
	constructor(id){
		super(id);
		this.headers = this.link.querySelectorAll(`.menu-header`);
		this.contents = this.link.querySelectorAll(`.menu-content`);

		this.link.classList.add("tabs-navigation");

		super.init();
	}
	setActive(index){
		for(let header of this.headers){
			header.classList.remove("active");
		}
		this.headers[index].classList.add("active");

		for(let content of this.contents){
			content.style.display = "none";
		}
		this.contents[index].style.display = "block";
	}
	isActive(index){
		return this.headers[index].classList.contains("active");
	}
}
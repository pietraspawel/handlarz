export class TooltipsView {
	tooltipList;

	constructor() {
		const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
		this.tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		    return new bootstrap.Tooltip(tooltipTriggerEl);
		});	
		this.handleTooltips();	
	}

	handleTooltips() {
        let checkbox = $(".menu-container #checkShowTooltips");
        let data = new Date();
        data.setTime(data.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + data.toUTCString();                

        if (checkbox.prop("checked")) {
            for (let i = 0; i < this.tooltipList.length; i++) {
                this.tooltipList[i].enable();
                document.cookie = `tooltips=1; ${expires}; path=/`;
            }
        } else {
            for (let i = 0; i < this.tooltipList.length; i++) {
                this.tooltipList[i].disable();
                document.cookie = `tooltips=0; ${expires}; path=/`;
            }
        }
    }
}
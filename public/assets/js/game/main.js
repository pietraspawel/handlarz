$().ready(() => {
    let data = JSON.parse(atob($(".js-data").data("json")));
    let world = new World(data);
    let player = new Trader(world);

    world.refreshAll(player);

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    handleTooltips();

    $(".map .tile").on("click", "img.city", (e) => {
        let target = $(e.target);
        let id = target.data("id");
        let city = world.getCity(id);
        if (city.name != player.city.name) {
            player.goTo(city);
            world.nextTurn(player);
        }
    }); 

    $(".city-info .buy").on("click", "button", (e) => {
        let target = $(e.target);
        let id = target.data("id");
        player.buy(id);
        world.refreshAll(player);
    })

    $(".city-info .sell").on("click", "button", (e) => {
        let target = $(e.target);
        let id = target.data("id");
        player.sell(id);
        world.refreshAll(player);
    })

    $(".menu-container").on("change", "#checkShowTooltips", () => {
        handleTooltips();
    });

    function handleTooltips() {
        let checkbox = $(".menu-container #checkShowTooltips");
        let data = new Date();
        data.setTime(data.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + data.toUTCString();                

        if (checkbox.prop("checked")) {
            for (let i = 0; i < tooltipList.length; i++) {
                tooltipList[i].enable();
                document.cookie = `tooltips=1; ${expires}; path=/`;
            }
        } else {
            for (let i = 0; i < tooltipList.length; i++) {
                tooltipList[i].disable();
                document.cookie = `tooltips=0; ${expires}; path=/`;
            }
        }
    }
});

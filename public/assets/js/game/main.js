$().ready(() => {
    let data = JSON.parse(atob($(".js-data").data("json")));
    let world = new World(data);
    let player = new Trader(world);

    world.refreshAll(player);
    
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
});

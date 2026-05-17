$().ready(() => {
    let data = JSON.parse(atob($(".js-data").data("json")));
    let world = new World(data);
    let player = new Trader(world);
    let aiPlayerStrategy = new GreedyStrategy();
    const aiPlayers = [ 
        new TraderAI(world, 0, 'AITrader0', world.cities[0], aiPlayerStrategy),
        new TraderAI(world, 1, 'AITrader1', world.cities[1], aiPlayerStrategy),
        new TraderAI(world, 2, 'AITrader2', world.cities[2], aiPlayerStrategy),
        new TraderAI(world, 3, 'AITrader3', world.getRandomCity(), aiPlayerStrategy),
        new TraderAI(world, 4, 'AITrader4', world.getRandomCity(), aiPlayerStrategy),
        new TraderAI(world, 5, 'AITrader5', world.getRandomCity(), aiPlayerStrategy),
    ];

    world.refreshAll(player, aiPlayers);

    let tooltipsView = new TooltipsView();

    $("#cities").on("click", ".city-group", (e) => {
        let target = $(e.currentTarget);
        let id = target.data("id");
        let city = world.getCity(id);
        if (city.name != player.city.name) {
            player.goTo(city);
            world.nextTurn(player, aiPlayers);
        }
    }); 

    $(".city-info .buy").on("click", "button", (e) => {
        let target = $(e.target);
        let id = target.data("id");
        player.buy(id);
        world.refreshPlayer(player);
    })

    $(".city-info .sell").on("click", "button", (e) => {
        let target = $(e.target);
        let id = target.data("id");
        player.sell(id);
        world.refreshPlayer(player);
    })

    $(".menu-container").on("change", "#checkShowTooltips", () => {
        tooltipsView.handleTooltips();
    });
});

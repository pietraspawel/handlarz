$().ready(() => {
    let data = JSON.parse(atob($(".js-data").data("json")));
    let world = new World(data);
    let player = new Trader(world);

    world.refreshView(player);
    player.refreshView();
    
    $(".map .tile").on("click", "img.city", (e) => {
        let target = $(e.target);
        let id = target.data("id");
        console.log(`City ${id} clicked.`);
    }); 

    $(".city-info .buy").on("click", "button", (e) => {
        let target = $(e.target);
        let id = target.data("id");
        console.log(`Buy ${id} clicked.`);
    })

    $(".city-info .sell").on("click", "button", (e) => {
        let target = $(e.target);
        let id = target.data("id");
        console.log(`Sell ${id} clicked.`);
    })
});

$().ready(() => {
    let data = JSON.parse(atob($(".js-data").data("json")));
    let world = new World(data);
    let player = new Trader(world);

    world.refreshView(player);
    player.refreshView();
    
    // eventy - może w klasach?
});

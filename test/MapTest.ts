/// <reference path="../src/Map.ts"/>

let map = new duice.Map({
    name: 'value'
});
map.get('name');
map.set("name", "james");
console.log(map);

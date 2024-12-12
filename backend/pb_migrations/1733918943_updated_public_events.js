/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.id, events.racesLimit, events.name, servers.id as \"server\" FROM events LEFT JOIN servers ON events.server = servers.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_7ZIu")

  // remove field
  collection.fields.removeById("_clone_nJkN")

  // remove field
  collection.fields.removeById("_clone_4opN")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_YgSO",
    "max": null,
    "min": 0,
    "name": "racesLimit",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_XkoP",
    "max": 16,
    "min": 3,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.id, events.racesLimit, tracks.name, tracks.style, servers.id as \"server\" FROM events, tracks LEFT JOIN servers ON events.server = servers.id WHERE events.track = tracks.id"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_7ZIu",
    "max": null,
    "min": 0,
    "name": "racesLimit",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_nJkN",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "_clone_4opN",
    "maxSelect": 1,
    "name": "style",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "SL",
      "GS",
      "SG",
      "DH"
    ]
  }))

  // remove field
  collection.fields.removeById("_clone_YgSO")

  // remove field
  collection.fields.removeById("_clone_XkoP")

  return app.save(collection)
})

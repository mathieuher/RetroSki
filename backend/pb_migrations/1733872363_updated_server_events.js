/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.id, events.racesLimit, tracks.name, tracks.style, servers.id as \"server\" FROM events, tracks LEFT JOIN servers ON events.server = servers.id WHERE events.track = tracks.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_ysR2")

  // remove field
  collection.fields.removeById("_clone_ZABW")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_UB1O",
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
    "id": "_clone_0PwD",
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
    "id": "_clone_0UKH",
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.id, tracks.name, tracks.style, servers.id as \"server\" FROM events, tracks LEFT JOIN servers ON events.server = servers.id WHERE events.track = tracks.id"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_ysR2",
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
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_ZABW",
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
  collection.fields.removeById("_clone_UB1O")

  // remove field
  collection.fields.removeById("_clone_0PwD")

  // remove field
  collection.fields.removeById("_clone_0UKH")

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.id, events.racesLimit, events.name, servers.id as \"server\", events.created FROM events LEFT JOIN servers ON events.server = servers.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_YgSO")

  // remove field
  collection.fields.removeById("_clone_XkoP")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_biXB",
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
    "id": "_clone_TGgt",
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

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_vtl6",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.id, events.racesLimit, events.name, servers.id as \"server\" FROM events LEFT JOIN servers ON events.server = servers.id"
  }, collection)

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

  // remove field
  collection.fields.removeById("_clone_biXB")

  // remove field
  collection.fields.removeById("_clone_TGgt")

  // remove field
  collection.fields.removeById("_clone_vtl6")

  return app.save(collection)
})

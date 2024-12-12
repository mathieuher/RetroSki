/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT servers.id, events.id as \"eventId\", tracks.name, tracks.style FROM servers, tracks JOIN events ON events.server = servers.id WHERE events.track = tracks.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_vCkP")

  // remove field
  collection.fields.removeById("_clone_qwRg")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_riIf",
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
    "id": "_clone_UGhs",
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
    "viewQuery": "SELECT servers.id, events.id as \"eventId\", tracks.name, tracks.style FROM servers, events, tracks WHERE events.server = servers.id AND events.track = tracks.id"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_vCkP",
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
    "id": "_clone_qwRg",
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
  collection.fields.removeById("_clone_riIf")

  // remove field
  collection.fields.removeById("_clone_UGhs")

  return app.save(collection)
})

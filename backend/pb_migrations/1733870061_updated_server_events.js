/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.id, tracks.name, tracks.style FROM events, tracks LEFT JOIN servers ON events.server = servers.id WHERE events.track = tracks.id"
  }, collection)

  // remove field
  collection.fields.removeById("relation724482924")

  // remove field
  collection.fields.removeById("_clone_yjkP")

  // remove field
  collection.fields.removeById("_clone_KXoG")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_SoBw",
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
    "id": "_clone_53mg",
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
    "viewQuery": "SELECT servers.id, events.id as \"eventId\", tracks.name, tracks.style FROM servers, tracks LEFT JOIN events ON events.server = servers.id WHERE events.track = tracks.id"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1687431684",
    "hidden": false,
    "id": "relation724482924",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "eventId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_yjkP",
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
    "id": "_clone_KXoG",
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
  collection.fields.removeById("_clone_SoBw")

  // remove field
  collection.fields.removeById("_clone_53mg")

  return app.save(collection)
})

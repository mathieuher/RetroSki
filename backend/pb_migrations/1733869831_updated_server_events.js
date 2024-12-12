/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT servers.id, events.id as \"eventId\", tracks.name, tracks.style FROM servers, events, tracks WHERE events.server = servers.id AND events.track = tracks.id"
  }, collection)

  // remove field
  collection.fields.removeById("relation2363233923")

  // remove field
  collection.fields.removeById("_clone_5z29")

  // remove field
  collection.fields.removeById("_clone_yb6u")

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
    "id": "_clone_w0RD",
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
    "id": "_clone_vPba",
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
    "viewQuery": "SELECT servers.id as \"x\", events.id, tracks.name, tracks.style FROM servers, events, tracks WHERE events.server = servers.id AND events.track = tracks.id"
  }, collection)

  // add field
  collection.fields.addAt(0, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3738798621",
    "hidden": false,
    "id": "relation2363233923",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "x",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_5z29",
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
    "id": "_clone_yb6u",
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
  collection.fields.removeById("relation724482924")

  // remove field
  collection.fields.removeById("_clone_w0RD")

  // remove field
  collection.fields.removeById("_clone_vPba")

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1396804425")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT records.id, records.rider, records.timing, records.event, events.server FROM records, events JOIN servers ON servers.id = events.server WHERE records.event = events.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_UmgF")

  // remove field
  collection.fields.removeById("_clone_o3h1")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_HsWG",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "rider",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_y6ZM",
    "max": null,
    "min": null,
    "name": "timing",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1687431684",
    "hidden": false,
    "id": "_clone_EzmL",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "event",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3738798621",
    "hidden": false,
    "id": "_clone_lr4d",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "server",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1396804425")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT records.rider, records.timing, servers.id FROM records, events INNER JOIN servers ON events.server = servers.id WHERE records.event = events.id"
  }, collection)

  // add field
  collection.fields.addAt(0, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_UmgF",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "rider",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_o3h1",
    "max": null,
    "min": null,
    "name": "timing",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("_clone_HsWG")

  // remove field
  collection.fields.removeById("_clone_y6ZM")

  // remove field
  collection.fields.removeById("_clone_EzmL")

  // remove field
  collection.fields.removeById("_clone_lr4d")

  return app.save(collection)
})

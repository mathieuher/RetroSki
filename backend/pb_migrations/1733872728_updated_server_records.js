/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1396804425")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT records.rider, records.timing, servers.id FROM records, events LEFT JOIN servers ON events.server = servers.id WHERE records.event = events.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_Udbc")

  // remove field
  collection.fields.removeById("_clone_ugzw")

  // add field
  collection.fields.addAt(0, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_DZK2",
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
    "id": "_clone_m9sy",
    "max": null,
    "min": null,
    "name": "timing",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1396804425")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT records.rider, records.timing, servers.id FROM records, events JOIN servers ON events.server = servers.id WHERE records.event = events.id"
  }, collection)

  // add field
  collection.fields.addAt(0, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_Udbc",
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
    "id": "_clone_ugzw",
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
  collection.fields.removeById("_clone_DZK2")

  // remove field
  collection.fields.removeById("_clone_m9sy")

  return app.save(collection)
})

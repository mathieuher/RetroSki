/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1396804425")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT records.rider, records.timing, servers.id FROM records, events JOIN servers ON events.server = servers.id WHERE records.event = events.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_QEoH")

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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1396804425")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT records.rider, servers.id FROM records, events JOIN servers ON events.server = servers.id WHERE records.event = events.id"
  }, collection)

  // add field
  collection.fields.addAt(0, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_QEoH",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "rider",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_Udbc")

  // remove field
  collection.fields.removeById("_clone_ugzw")

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1396804425")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT records.id, users.name, records.timing, records.created, records.event, events.server FROM records, events, users JOIN servers ON servers.id = events.server WHERE records.event = events.id AND records.rider = users.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_unWF")

  // remove field
  collection.fields.removeById("_clone_gVvg")

  // remove field
  collection.fields.removeById("_clone_tOv9")

  // remove field
  collection.fields.removeById("_clone_2tG3")

  // remove field
  collection.fields.removeById("_clone_aWSw")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_ZWB7",
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
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_8Clp",
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
    "hidden": false,
    "id": "_clone_ifzF",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1687431684",
    "hidden": false,
    "id": "_clone_344K",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "event",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3738798621",
    "hidden": false,
    "id": "_clone_0lGZ",
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
    "viewQuery": "SELECT records.id, records.rider, records.timing, records.created, records.event, events.server FROM records, events JOIN servers ON servers.id = events.server WHERE records.event = events.id"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_unWF",
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
    "id": "_clone_gVvg",
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
    "hidden": false,
    "id": "_clone_tOv9",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1687431684",
    "hidden": false,
    "id": "_clone_2tG3",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "event",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3738798621",
    "hidden": false,
    "id": "_clone_aWSw",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "server",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_ZWB7")

  // remove field
  collection.fields.removeById("_clone_8Clp")

  // remove field
  collection.fields.removeById("_clone_ifzF")

  // remove field
  collection.fields.removeById("_clone_344K")

  // remove field
  collection.fields.removeById("_clone_0lGZ")

  return app.save(collection)
})

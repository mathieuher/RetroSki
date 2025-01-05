/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.query.server = server"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_QKDJ")

  // remove field
  collection.fields.removeById("_clone_93dA")

  // remove field
  collection.fields.removeById("_clone_mz7f")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_Sqfl",
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
    "id": "_clone_3VmJ",
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
    "id": "_clone_vWIZ",
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
    "listRule": "@request.auth.id != \"\" && @request.query.server = server"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_QKDJ",
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
    "id": "_clone_93dA",
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
    "id": "_clone_mz7f",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_Sqfl")

  // remove field
  collection.fields.removeById("_clone_3VmJ")

  // remove field
  collection.fields.removeById("_clone_vWIZ")

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_327047008")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json3973362638",
    "maxSize": 0,
    "name": "gates",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_327047008")

  // remove field
  collection.fields.removeById("json3973362638")

  return app.save(collection)
})

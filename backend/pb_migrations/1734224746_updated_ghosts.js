/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2379182763")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number723676812",
    "max": null,
    "min": null,
    "name": "totalTime",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2379182763")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number723676812",
    "max": null,
    "min": null,
    "name": "totalTime",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_327047008")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = owner.id",
    "listRule": "@request.auth.id = owner.id"
  }, collection)

  // remove field
  collection.fields.removeById("relation1517147638")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation3479234172",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "owner",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_327047008")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = server.owner.id",
    "listRule": "@request.auth.id = server.owner.id"
  }, collection)

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3738798621",
    "hidden": false,
    "id": "relation1517147638",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "server",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("relation3479234172")

  return app.save(collection)
})

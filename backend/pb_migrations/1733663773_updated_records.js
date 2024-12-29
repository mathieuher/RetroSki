/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != ''",
    "listRule": "@request.auth.id != ''"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null
  }, collection)

  return app.save(collection)
})

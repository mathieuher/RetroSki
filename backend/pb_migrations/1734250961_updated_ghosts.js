/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2379182763")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != '' && @request.query.track = track && (@request.query.event = \"undefined\" || @request.query.event = event)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2379182763")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != '' && @request.query.track = track && (@request.query.event = \"\" || @request.query.event = event)"
  }, collection)

  return app.save(collection)
})

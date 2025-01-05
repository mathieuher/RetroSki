/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != '' && @request.auth.verified = true && (@request.query.server = event.server || @request.query.event = event)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != '' && (@request.query.server = event.server || @request.query.event = event)"
  }, collection)

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" \n&& owner = @request.auth.id \n&& (owner.premium = true || @collection.servers.owner !~ @request.auth.id  )"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" \n&& owner = @request.auth.id \n&& (owner.premium = true || @collection.servers.owner ?!= @request.auth.id  )"
  }, collection)

  return app.save(collection)
})

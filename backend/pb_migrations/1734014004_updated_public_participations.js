/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1080299099")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.server, servers.name, users.name as \"owner\", events.id, records.rider, records.updated FROM events, servers, records, users WHERE events.server = servers.id AND records.event = events.id GROUP BY events.server, records.rider ORDER BY records.updated DESC"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_dzhV")

  // remove field
  collection.fields.removeById("_clone_zk7f")

  // remove field
  collection.fields.removeById("_clone_7RfR")

  // remove field
  collection.fields.removeById("_clone_8fFg")

  // remove field
  collection.fields.removeById("_clone_EQWS")

  // add field
  collection.fields.addAt(0, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3738798621",
    "hidden": false,
    "id": "_clone_bsVQ",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "server",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_DRYL",
    "max": 0,
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
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_fg5i",
    "max": 16,
    "min": 3,
    "name": "owner",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_xu4v",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "rider",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_yH3C",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1080299099")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT events.server, servers.name, users.name as \"owner\", events.id, records.rider, records.updated FROM events, servers, records JOIN users ON users.id = servers.owner WHERE events.server = servers.id AND records.event = events.id GROUP BY events.server, records.rider ORDER BY records.updated DESC"
  }, collection)

  // add field
  collection.fields.addAt(0, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3738798621",
    "hidden": false,
    "id": "_clone_dzhV",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "server",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_zk7f",
    "max": 0,
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
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_7RfR",
    "max": 16,
    "min": 3,
    "name": "owner",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_8fFg",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "rider",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_EQWS",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_bsVQ")

  // remove field
  collection.fields.removeById("_clone_DRYL")

  // remove field
  collection.fields.removeById("_clone_fg5i")

  // remove field
  collection.fields.removeById("_clone_xu4v")

  // remove field
  collection.fields.removeById("_clone_yH3C")

  return app.save(collection)
})

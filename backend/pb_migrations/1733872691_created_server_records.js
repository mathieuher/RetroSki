/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "_clone_QEoH",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "rider",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      }
    ],
    "id": "pbc_1396804425",
    "indexes": [],
    "listRule": null,
    "name": "server_records",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT records.rider, servers.id FROM records, events JOIN servers ON events.server = servers.id WHERE records.event = events.id",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1396804425");

  return app.delete(collection);
})

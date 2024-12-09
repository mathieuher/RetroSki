/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "cascadeDelete": true,
        "collectionId": "pbc_3738798621",
        "hidden": false,
        "id": "_clone_0m5R",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "server",
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
      },
      {
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "_clone_Q4nx",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "rider",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      }
    ],
    "id": "pbc_1080299099",
    "indexes": [],
    "listRule": null,
    "name": "participations",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT events.server, events.id, records.rider FROM events JOIN records ON events.id = records.event",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1080299099");

  return app.delete(collection);
})

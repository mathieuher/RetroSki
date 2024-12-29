/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3738798621",
        "hidden": false,
        "id": "relation2363233923",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "x",
        "presentable": false,
        "required": false,
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
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_5z29",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "_clone_yb6u",
        "maxSelect": 1,
        "name": "style",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "SL",
          "GS",
          "SG",
          "DH"
        ]
      }
    ],
    "id": "pbc_901890428",
    "indexes": [],
    "listRule": null,
    "name": "server_events",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT servers.id as \"x\", events.id, tracks.name, tracks.style FROM servers, events, tracks WHERE events.server = servers.id AND events.track = tracks.id",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_901890428");

  return app.delete(collection);
})

/// <reference path="../pb_data/types.d.ts" />

// Track creation
onRecordCreateRequest((e) => {
    if(e.requestInfo().auth) {
        // Set owner to the user who created the track
        e.record.set("owner", e.requestInfo().auth.get("id").toString());
        // Activating the track
        e.record.set("active", true);
    }
    e.next()
}, 'tracks');
import PocketBase from 'pocketbase';

const serverUrl = 'https://server.retro-ski.ch';

export const environment = {
    pb: new PocketBase(serverUrl),
    apiUrl: `${serverUrl}/api`
};

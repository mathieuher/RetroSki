import PocketBase from 'pocketbase';

const serverUrl = 'http://127.0.0.1:8090';

export const environment = {
    pb: new PocketBase(serverUrl),
    apiUrl: `${serverUrl}/api`
};

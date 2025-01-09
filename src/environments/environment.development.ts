import PocketBase from 'pocketbase';

export const environment = {
    pb: new PocketBase('http://127.0.0.1:8090')
};

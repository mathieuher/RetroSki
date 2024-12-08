import PocketBase from 'pocketbase';

export const environment = {
    pb: new PocketBase('http://localhost:8090')
};

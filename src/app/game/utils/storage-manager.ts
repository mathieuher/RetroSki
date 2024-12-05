export class StorageManager {
    public static save(key: string, value: string): void {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('Unable to persist data to localStorage :', `${key}:${value}`, error);
        }
    }

    public static remove(keys: string[]): void {
        for (const key of keys) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Unable to remove the local storage data :', `${key}`);
            }
        }
    }
}

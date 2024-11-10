export class StorageManager {
    public static save(key: string, value: string): void {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('Unable to persist data to localStorage :', `${key}:${value}`, error);
        }
    }
}

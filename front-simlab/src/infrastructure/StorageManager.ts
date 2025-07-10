export class StorageManager {
    private static KEY_ACCESS_TOKEN = 'token'

    static hasSession(): boolean {
        return localStorage.getItem(StorageManager.KEY_ACCESS_TOKEN) != null
    }

    static clear() {
        localStorage.removeItem(StorageManager.KEY_ACCESS_TOKEN)
    }

    static getAccessToken(): string | null {
        return localStorage.getItem(StorageManager.KEY_ACCESS_TOKEN)
    }

    static setAccessToken(value: string): void {
        localStorage.setItem(StorageManager.KEY_ACCESS_TOKEN, value)
    }
}
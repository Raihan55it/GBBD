const STORAGE_PREFIX = 'gbbd_';

/**
 * Storage utility - wrapper for localStorage with error handling
 */
export class StorageService {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage: ${key}`, error);
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage: ${key}`, error);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(STORAGE_PREFIX + key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage: ${key}`, error);
            return false;
        }
    }

    static clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage', error);
            return false;
        }
    }
}

export default StorageService;

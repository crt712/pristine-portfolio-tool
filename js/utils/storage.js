// Local Storage and State Management utilities

class StorageManager {
    constructor() {
        this.prefix = 'pristine_';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Local Storage helpers with prefix
    set(key, value, expiry = null) {
        try {
            const item = {
                value,
                timestamp: new Date().getTime(),
                expiry: expiry ? new Date().getTime() + expiry : null
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (!item) return defaultValue;

            const parsed = JSON.parse(item);
            
            // Check if expired
            if (parsed.expiry && new Date().getTime() > parsed.expiry) {
                this.remove(key);
                return defaultValue;
            }

            return parsed.value;
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    }

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
            return false;
        }
    }

    // In-memory cache for API responses
    setCache(key, value, timeout = this.cacheTimeout) {
        this.cache.set(key, {
            value,
            expiry: new Date().getTime() + timeout
        });
    }

    getCache(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (new Date().getTime() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    clearCache() {
        this.cache.clear();
    }

    // User preferences
    setUserPreference(key, value) {
        const preferences = this.getUserPreferences();
        preferences[key] = value;
        return this.set('user_preferences', preferences);
    }

    getUserPreference(key, defaultValue = null) {
        const preferences = this.getUserPreferences();
        return preferences[key] !== undefined ? preferences[key] : defaultValue;
    }

    getUserPreferences() {
        return this.get('user_preferences', {});
    }

    // App settings
    setAppSetting(key, value) {
        const settings = this.getAppSettings();
        settings[key] = value;
        return this.set('app_settings', settings);
    }

    getAppSetting(key, defaultValue = null) {
        const settings = this.getAppSettings();
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    getAppSettings() {
        return this.get('app_settings', {
            theme: 'light',
            sidebarCollapsed: false,
            tablePageSize: 25,
            autoSave: true,
            notifications: true,
            language: 'en'
        });
    }

    // Recent items tracking
    addRecentItem(type, item) {
        const recentKey = `recent_${type}`;
        const recent = this.get(recentKey, []);
        
        // Remove if already exists
        const filtered = recent.filter(r => r.id !== item.id);
        
        // Add to beginning
        filtered.unshift({
            ...item,
            accessedAt: new Date().toISOString()
        });
        
        // Keep only last 10
        const limited = filtered.slice(0, 10);
        
        return this.set(recentKey, limited, 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    getRecentItems(type) {
        return this.get(`recent_${type}`, []);
    }

    // Search history
    addSearchHistory(query, results = 0) {
        const history = this.getSearchHistory();
        const existing = history.find(h => h.query.toLowerCase() === query.toLowerCase());
        
        if (existing) {
            existing.count++;
            existing.lastSearched = new Date().toISOString();
            existing.results = results;
        } else {
            history.unshift({
                query,
                count: 1,
                results,
                lastSearched: new Date().toISOString()
            });
        }
        
        // Keep only last 50 searches
        const limited = history.slice(0, 50);
        return this.set('search_history', limited, 90 * 24 * 60 * 60 * 1000); // 90 days
    }

    getSearchHistory() {
        return this.get('search_history', []);
    }

    getPopularSearches(limit = 10) {
        const history = this.getSearchHistory();
        return history
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    // Draft management
    saveDraft(type, id, data) {
        const draftKey = `draft_${type}_${id}`;
        return this.set(draftKey, {
            data,
            savedAt: new Date().toISOString(),
            version: (this.get(draftKey)?.version || 0) + 1
        }, 7 * 24 * 60 * 60 * 1000); // 7 days
    }

    getDraft(type, id) {
        const draftKey = `draft_${type}_${id}`;
        return this.get(draftKey);
    }

    removeDraft(type, id) {
        const draftKey = `draft_${type}_${id}`;
        return this.remove(draftKey);
    }

    getAllDrafts() {
        const drafts = [];
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix + 'draft_')) {
                const draft = this.get(key.replace(this.prefix, ''));
                if (draft) {
                    const [, type, id] = key.replace(this.prefix, '').split('_');
                    drafts.push({
                        type,
                        id,
                        ...draft
                    });
                }
            }
        });
        
        return drafts.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    }

    // Form state persistence
    saveFormState(formId, state) {
        const formKey = `form_${formId}`;
        return this.set(formKey, {
            state,
            savedAt: new Date().toISOString()
        }, 24 * 60 * 60 * 1000); // 24 hours
    }

    getFormState(formId) {
        const formKey = `form_${formId}`;
        const saved = this.get(formKey);
        return saved ? saved.state : null;
    }

    clearFormState(formId) {
        const formKey = `form_${formId}`;
        return this.remove(formKey);
    }

    // Offline support
    queueOfflineAction(action) {
        const queue = this.getOfflineQueue();
        queue.push({
            ...action,
            id: `offline_${new Date().getTime()}_${Math.random().toString(36).substring(2)}`,
            timestamp: new Date().toISOString()
        });
        return this.set('offline_queue', queue);
    }

    getOfflineQueue() {
        return this.get('offline_queue', []);
    }

    clearOfflineQueue() {
        return this.set('offline_queue', []);
    }

    removeOfflineAction(actionId) {
        const queue = this.getOfflineQueue();
        const filtered = queue.filter(action => action.id !== actionId);
        return this.set('offline_queue', filtered);
    }

    // Data export
    exportUserData() {
        const userData = {};
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                const cleanKey = key.replace(this.prefix, '');
                userData[cleanKey] = JSON.parse(localStorage.getItem(key));
            }
        });
        
        return {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            data: userData
        };
    }

    // Data import
    importUserData(exportedData) {
        try {
            if (!exportedData.data) {
                throw new Error('Invalid export format');
            }
            
            Object.keys(exportedData.data).forEach(key => {
                this.set(key, exportedData.data[key].value);
            });
            
            return true;
        } catch (error) {
            console.error('Failed to import user data:', error);
            return false;
        }
    }

    // Storage cleanup
    cleanup() {
        const now = new Date().getTime();
        const keys = Object.keys(localStorage);
        let cleaned = 0;
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (item.expiry && now > item.expiry) {
                        localStorage.removeItem(key);
                        cleaned++;
                    }
                } catch (error) {
                    // Invalid JSON, remove it
                    localStorage.removeItem(key);
                    cleaned++;
                }
            }
        });
        
        // Also cleanup memory cache
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
        
        return cleaned;
    }

    // Storage usage monitoring
    getStorageUsage() {
        let totalSize = 0;
        let pristineSize = 0;
        
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const size = (localStorage.getItem(key) || '').length;
                totalSize += size;
                
                if (key.startsWith(this.prefix)) {
                    pristineSize += size;
                }
            }
        }
        
        return {
            total: totalSize,
            pristine: pristineSize,
            percentage: totalSize > 0 ? (pristineSize / totalSize) * 100 : 0,
            limit: 5 * 1024 * 1024 // 5MB typical localStorage limit
        };
    }
}

// Create global storage instance
window.storage = new StorageManager();

// React hook for storage
function useStorage() {
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    
    const setItem = React.useCallback((key, value, expiry) => {
        const result = window.storage.set(key, value, expiry);
        forceUpdate();
        return result;
    }, []);
    
    const getItem = React.useCallback((key, defaultValue) => {
        return window.storage.get(key, defaultValue);
    }, []);
    
    const removeItem = React.useCallback((key) => {
        const result = window.storage.remove(key);
        forceUpdate();
        return result;
    }, []);
    
    return {
        setItem,
        getItem,
        removeItem,
        setUserPreference: window.storage.setUserPreference.bind(window.storage),
        getUserPreference: window.storage.getUserPreference.bind(window.storage),
        saveDraft: window.storage.saveDraft.bind(window.storage),
        getDraft: window.storage.getDraft.bind(window.storage),
        addRecentItem: window.storage.addRecentItem.bind(window.storage),
        getRecentItems: window.storage.getRecentItems.bind(window.storage)
    };
}

window.useStorage = useStorage;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
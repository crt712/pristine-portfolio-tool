/**
 * API Configuration for Pristine Portfolio Tool
 * Production-ready endpoint management
 */

// Production API Configuration
const API_CONFIG = {
    // Production endpoints (planpulse.us)
    PRODUCTION: {
        BASE_URL: 'https://api.planpulse.us',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3
    },
    
    // Development endpoints (local testing)
    DEVELOPMENT: {
        BASE_URL: '/api', // Local development
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 1
    },
    
    // Staging endpoints (testing deployment)
    STAGING: {
        BASE_URL: 'https://pristine-api-staging.workers.dev',
        TIMEOUT: 20000,
        RETRY_ATTEMPTS: 2
    }
};

// Detect environment
function getEnvironment() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'DEVELOPMENT';
    } else if (hostname.includes('staging') || hostname.includes('.pages.dev')) {
        return 'STAGING';  
    } else {
        return 'PRODUCTION';
    }
}

// Get current configuration
const CURRENT_ENV = getEnvironment();
const CONFIG = API_CONFIG[CURRENT_ENV];

console.log(`🌐 API Environment: ${CURRENT_ENV}`);
console.log(`🔗 API Base URL: ${CONFIG.BASE_URL}`);

/**
 * Enhanced API client with retry logic and error handling
 */
class ApiClient {
    constructor() {
        this.baseURL = CONFIG.BASE_URL;
        this.timeout = CONFIG.TIMEOUT;
        this.retryAttempts = CONFIG.RETRY_ATTEMPTS;
    }

    /**
     * Make HTTP request with retry logic
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const requestOptions = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(url, {
                    ...requestOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return await response.json();
            } catch (error) {
                console.warn(`API request attempt ${attempt} failed:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    throw new Error(`API request failed after ${this.retryAttempts} attempts: ${error.message}`);
                }
                
                // Exponential backoff delay
                const delay = Math.pow(2, attempt - 1) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET'
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * PATCH request
     */
    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH', 
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// Global API instance
window.apiClient = new ApiClient();

/**
 * Table API Helper Functions
 * Production-ready CRUD operations
 */
window.tableAPI = {
    /**
     * Get records from table with pagination and search
     */
    async getRecords(tableName, options = {}) {
        const {
            page = 1,
            limit = 10,
            search = '',
            sort = '',
            filters = {}
        } = options;

        const params = {
            page,
            limit,
            ...(search && { search }),
            ...(sort && { sort }),
            ...filters
        };

        return window.apiClient.get(`/tables/${tableName}`, params);
    },

    /**
     * Get single record by ID
     */
    async getRecord(tableName, recordId) {
        return window.apiClient.get(`/tables/${tableName}/${recordId}`);
    },

    /**
     * Create new record
     */
    async createRecord(tableName, data) {
        return window.apiClient.post(`/tables/${tableName}`, data);
    },

    /**
     * Update existing record (full replace)
     */
    async updateRecord(tableName, recordId, data) {
        return window.apiClient.put(`/tables/${tableName}/${recordId}`, data);
    },

    /**
     * Patch record (partial update)
     */
    async patchRecord(tableName, recordId, data) {
        return window.apiClient.patch(`/tables/${tableName}/${recordId}`, data);
    },

    /**
     * Delete record (soft delete)
     */
    async deleteRecord(tableName, recordId) {
        return window.apiClient.delete(`/tables/${tableName}/${recordId}`);
    },

    /**
     * Bulk operations
     */
    async bulkCreate(tableName, records) {
        return window.apiClient.post(`/tables/${tableName}/bulk`, { records });
    },

    async bulkUpdate(tableName, updates) {
        return window.apiClient.patch(`/tables/${tableName}/bulk`, { updates });
    },

    async bulkDelete(tableName, recordIds) {
        return window.apiClient.delete(`/tables/${tableName}/bulk`, { ids: recordIds });
    }
};

/**
 * AI API Helper Functions  
 * OpenAI GPT-4 integration
 */
window.aiAPI = {
    /**
     * Generate forward concepts (idea → product concepts)
     */
    async generateForwardConcept(data) {
        return window.apiClient.post('/ai/forward-concept', data);
    },

    /**
     * Generate reverse concepts (product → optimization)
     */
    async generateReverseConcept(data) {
        return window.apiClient.post('/ai/reverse-concept', data);
    },

    /**
     * Analyze product market fit
     */
    async analyzeMarketFit(data) {
        return window.apiClient.post('/ai/market-fit', data);
    },

    /**
     * Generate product suggestions
     */
    async generateSuggestions(data) {
        return window.apiClient.post('/ai/suggestions', data);
    }
};

/**
 * Health check and connectivity test
 */
window.apiHealth = {
    async check() {
        try {
            const response = await window.apiClient.get('/health');
            console.log('✅ API Health Check:', response);
            return response;
        } catch (error) {
            console.error('❌ API Health Check Failed:', error);
            throw error;
        }
    },

    async testConnection() {
        try {
            await this.check();
            showNotification('API connection successful', 'success');
            return true;
        } catch (error) {
            showNotification(`API connection failed: ${error.message}`, 'error');
            return false;
        }
    }
};

// Auto-test API connection on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        try {
            await window.apiHealth.check();
        } catch (error) {
            console.warn('Initial API health check failed - this is normal for mock/development mode');
        }
    }, 2000);
});

console.log('🔧 API Client initialized:', {
    environment: CURRENT_ENV,
    baseURL: CONFIG.BASE_URL,
    timeout: CONFIG.TIMEOUT,
    retryAttempts: CONFIG.RETRY_ATTEMPTS
});
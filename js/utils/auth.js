// Authentication and Authorization utility functions

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.permissions = null;
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours
        this.init();
    }

    init() {
        // Check for existing session
        const savedUser = localStorage.getItem('pristine_user');
        const sessionExpiry = localStorage.getItem('pristine_session_expiry');
        
        if (savedUser && sessionExpiry) {
            const now = new Date().getTime();
            if (now < parseInt(sessionExpiry)) {
                this.currentUser = JSON.parse(savedUser);
                this.loadPermissions();
                this.scheduleSessionRefresh();
            } else {
                this.logout();
            }
        }
    }

    // Mock authentication - in production this would integrate with Cloudflare Access
    async login(email, password) {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mock user lookup - in production this would validate against user table
            const mockUsers = {
                'admin@pristine.com': {
                    id: 'user_001',
                    email: 'admin@pristine.com',
                    name: 'Pristine Admin',
                    role: 'owner',
                    status: 'active'
                },
                'product@pristine.com': {
                    id: 'user_002',
                    email: 'product@pristine.com',
                    name: 'Product Manager',
                    role: 'admin',
                    status: 'active'
                },
                'formulator@pristine.com': {
                    id: 'user_003',
                    email: 'formulator@pristine.com',
                    name: 'Lead Formulator',
                    role: 'contributor',
                    status: 'active'
                }
            };

            const user = mockUsers[email.toLowerCase()];
            if (!user || user.status !== 'active') {
                throw new Error('Invalid credentials or inactive account');
            }

            // Set session
            this.currentUser = user;
            const expiryTime = new Date().getTime() + this.sessionTimeout;
            
            localStorage.setItem('pristine_user', JSON.stringify(user));
            localStorage.setItem('pristine_session_expiry', expiryTime.toString());
            
            await this.loadPermissions();
            this.scheduleSessionRefresh();
            
            // Log authentication
            this.logActivity('login', 'User logged in successfully');
            
            return { success: true, user };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: error.message };
        }
    }

    logout() {
        if (this.currentUser) {
            this.logActivity('logout', 'User logged out');
        }
        
        this.currentUser = null;
        this.permissions = null;
        
        localStorage.removeItem('pristine_user');
        localStorage.removeItem('pristine_session_expiry');
        localStorage.removeItem('pristine_permissions');
        
        // Redirect to login or reload page
        window.location.reload();
    }

    async loadPermissions() {
        if (!this.currentUser) return;

        // Define role-based permissions matrix
        const rolePermissions = {
            owner: {
                // Full access to everything
                products: ['view', 'create', 'edit', 'delete'],
                formulas: ['view', 'create', 'edit', 'delete', 'approve'],
                vendors: ['view', 'create', 'edit', 'delete'],
                costs: ['view', 'create', 'edit', 'delete'],
                packaging: ['view', 'create', 'edit', 'delete'],
                compliance: ['view', 'create', 'edit', 'delete'],
                testing: ['view', 'create', 'edit', 'delete'],
                fulfillment: ['view', 'create', 'edit', 'delete'],
                marketing: ['view', 'create', 'edit', 'delete'],
                ai_insights: ['view', 'approve', 'reject'],
                users: ['view', 'create', 'edit', 'delete'],
                settings: ['view', 'edit']
            },
            admin: {
                // Most access, limited user management
                products: ['view', 'create', 'edit', 'delete'],
                formulas: ['view', 'create', 'edit', 'approve'],
                vendors: ['view', 'create', 'edit'],
                costs: ['view', 'create', 'edit'],
                packaging: ['view', 'create', 'edit'],
                compliance: ['view', 'create', 'edit'],
                testing: ['view', 'create', 'edit'],
                fulfillment: ['view', 'create', 'edit'],
                marketing: ['view', 'create', 'edit'],
                ai_insights: ['view', 'approve', 'reject'],
                users: ['view'],
                settings: ['view']
            },
            contributor: {
                // Can contribute but not delete or approve
                products: ['view', 'create', 'edit'],
                formulas: ['view', 'create', 'edit'],
                vendors: ['view', 'create', 'edit'],
                costs: ['view', 'create', 'edit'],
                packaging: ['view', 'create', 'edit'],
                compliance: ['view', 'create'],
                testing: ['view', 'create', 'edit'],
                fulfillment: ['view'],
                marketing: ['view', 'create', 'edit'],
                ai_insights: ['view'],
                users: [],
                settings: []
            },
            viewer: {
                // Read-only access
                products: ['view'],
                formulas: ['view'],
                vendors: ['view'],
                costs: ['view'],
                packaging: ['view'],
                compliance: ['view'],
                testing: ['view'],
                fulfillment: ['view'],
                marketing: ['view'],
                ai_insights: ['view'],
                users: [],
                settings: []
            }
        };

        this.permissions = rolePermissions[this.currentUser.role] || rolePermissions.viewer;
        localStorage.setItem('pristine_permissions', JSON.stringify(this.permissions));
    }

    // Check if user has specific permission
    hasPermission(module, action) {
        if (!this.currentUser || !this.permissions) {
            return false;
        }

        const modulePermissions = this.permissions[module] || [];
        return modulePermissions.includes(action);
    }

    // Check if user has any of the specified permissions
    hasAnyPermission(module, actions) {
        return actions.some(action => this.hasPermission(module, action));
    }

    // Check if user has all of the specified permissions
    hasAllPermissions(module, actions) {
        return actions.every(action => this.hasPermission(module, action));
    }

    // Role checks
    isOwner() {
        return this.currentUser?.role === 'owner';
    }

    isAdmin() {
        return ['owner', 'admin'].includes(this.currentUser?.role);
    }

    isContributor() {
        return ['owner', 'admin', 'contributor'].includes(this.currentUser?.role);
    }

    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }

    getUserRole() {
        return this.currentUser?.role;
    }

    // Session management
    scheduleSessionRefresh() {
        // Refresh session 30 minutes before expiry
        const refreshTime = this.sessionTimeout - (30 * 60 * 1000);
        
        setTimeout(async () => {
            if (this.currentUser) {
                await this.refreshSession();
            }
        }, refreshTime);
    }

    async refreshSession() {
        try {
            // In production, this would call the authentication server
            const expiryTime = new Date().getTime() + this.sessionTimeout;
            localStorage.setItem('pristine_session_expiry', expiryTime.toString());
            
            this.scheduleSessionRefresh();
            this.logActivity('session_refresh', 'Session refreshed automatically');
        } catch (error) {
            console.error('Session refresh failed:', error);
            this.logout();
        }
    }

    // Activity logging
    async logActivity(action, description) {
        if (!this.currentUser) return;

        try {
            const logEntry = {
                table_name: 'users',
                record_id: this.currentUser.id,
                action: 'update',
                field_name: 'activity',
                new_value: JSON.stringify({
                    action,
                    description,
                    timestamp: new Date().toISOString(),
                    ip_address: await this.getClientIP(),
                    user_agent: navigator.userAgent
                }),
                changed_by: this.currentUser.id,
                change_reason: 'User activity log',
                session_id: this.getSessionId()
            };

            // In production, this would call the change_log API
            console.log('Activity logged:', logEntry);
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }

    getSessionId() {
        let sessionId = localStorage.getItem('pristine_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('pristine_session_id', sessionId);
        }
        return sessionId;
    }

    // Password strength validation
    validatePasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const score = Object.values(requirements).filter(Boolean).length;
        const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';

        return {
            score,
            strength,
            requirements,
            isValid: score >= 4
        };
    }

    // Multi-factor authentication placeholder
    async setupMFA() {
        // Placeholder for MFA setup
        console.log('MFA setup - would integrate with authenticator app');
    }

    async verifyMFA(code) {
        // Placeholder for MFA verification
        console.log('MFA verification - would validate code');
        return true;
    }
}

// Create global auth instance
window.auth = new AuthManager();

// React hook for authentication
function useAuth() {
    const [user, setUser] = React.useState(window.auth.getCurrentUser());
    const [permissions, setPermissions] = React.useState(window.auth.permissions);

    React.useEffect(() => {
        const checkAuth = () => {
            setUser(window.auth.getCurrentUser());
            setPermissions(window.auth.permissions);
        };

        // Check auth status every minute
        const interval = setInterval(checkAuth, 60000);
        return () => clearInterval(interval);
    }, []);

    return {
        user,
        permissions,
        isAuthenticated: !!user,
        hasPermission: (module, action) => window.auth.hasPermission(module, action),
        login: (email, password) => window.auth.login(email, password),
        logout: () => window.auth.logout(),
        isOwner: () => window.auth.isOwner(),
        isAdmin: () => window.auth.isAdmin(),
        isContributor: () => window.auth.isContributor()
    };
}

window.useAuth = useAuth;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
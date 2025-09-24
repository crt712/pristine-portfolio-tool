// Notification and Toast management system

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.toasts = [];
        this.maxToasts = 5;
        this.defaultDuration = 5000; // 5 seconds
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed bottom-4 right-4 z-50 space-y-2';
            document.body.appendChild(this.container);
        }
    }

    // Show different types of notifications
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', { ...options, duration: 8000 });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    // Main show method
    show(message, type = 'info', options = {}) {
        const toast = {
            id: `toast_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            message,
            type,
            timestamp: new Date(),
            duration: options.duration || this.defaultDuration,
            persistent: options.persistent || false,
            actions: options.actions || [],
            onClick: options.onClick,
            onClose: options.onClose
        };

        this.toasts.unshift(toast);
        
        // Remove excess toasts
        while (this.toasts.length > this.maxToasts) {
            const removedToast = this.toasts.pop();
            this.removeToastElement(removedToast.id);
        }

        this.renderToast(toast);

        // Auto-remove after duration (unless persistent)
        if (!toast.persistent) {
            setTimeout(() => {
                this.remove(toast.id);
            }, toast.duration);
        }

        return toast.id;
    }

    // Remove specific toast
    remove(toastId) {
        const toastIndex = this.toasts.findIndex(t => t.id === toastId);
        if (toastIndex > -1) {
            const toast = this.toasts[toastIndex];
            this.toasts.splice(toastIndex, 1);
            this.removeToastElement(toastId);
            
            if (toast.onClose) {
                toast.onClose();
            }
        }
    }

    // Clear all toasts
    clear() {
        this.toasts.forEach(toast => {
            this.removeToastElement(toast.id);
        });
        this.toasts = [];
    }

    // Render toast element
    renderToast(toast) {
        const element = document.createElement('div');
        element.id = `toast-${toast.id}`;
        element.className = `toast toast-${toast.type} transform translate-x-full`;
        
        const iconMap = {
            success: 'fas fa-check-circle text-green-500',
            error: 'fas fa-exclamation-circle text-red-500',
            warning: 'fas fa-exclamation-triangle text-yellow-500',
            info: 'fas fa-info-circle text-blue-500'
        };

        let actionsHtml = '';
        if (toast.actions && toast.actions.length > 0) {
            actionsHtml = `
                <div class="flex space-x-2 mt-2">
                    ${toast.actions.map((action, index) => `
                        <button 
                            class="btn btn-sm ${action.style || 'btn-outline'}"
                            onclick="window.notifications.handleToastAction('${toast.id}', ${index})"
                        >
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        element.innerHTML = `
            <div class="flex items-start p-4">
                <div class="flex-shrink-0">
                    <i class="${iconMap[toast.type]} w-5 h-5"></i>
                </div>
                <div class="ml-3 w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">${toast.message}</p>
                    ${actionsHtml}
                </div>
                ${!toast.persistent ? `
                    <div class="ml-4 flex-shrink-0 flex">
                        <button 
                            class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                            onclick="window.notifications.remove('${toast.id}')"
                        >
                            <i class="fas fa-times w-4 h-4"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        // Add click handler if provided
        if (toast.onClick) {
            element.addEventListener('click', toast.onClick);
            element.style.cursor = 'pointer';
        }

        this.container.appendChild(element);

        // Animate in
        setTimeout(() => {
            element.classList.remove('translate-x-full');
            element.classList.add('translate-x-0');
        }, 10);

        // Show progress bar for non-persistent toasts
        if (!toast.persistent && toast.duration > 0) {
            this.addProgressBar(element, toast.duration);
        }
    }

    // Remove toast element with animation
    removeToastElement(toastId) {
        const element = document.getElementById(`toast-${toastId}`);
        if (element) {
            element.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }
    }

    // Add progress bar to toast
    addProgressBar(element, duration) {
        const progressBar = document.createElement('div');
        progressBar.className = 'h-1 bg-gray-200 w-full';
        progressBar.innerHTML = `
            <div class="h-full bg-current opacity-50 transition-all linear" style="width: 100%; transition-duration: ${duration}ms;"></div>
        `;
        
        element.appendChild(progressBar);
        
        // Start animation
        setTimeout(() => {
            const bar = progressBar.querySelector('div');
            if (bar) {
                bar.style.width = '0%';
            }
        }, 10);
    }

    // Handle toast action clicks
    handleToastAction(toastId, actionIndex) {
        const toast = this.toasts.find(t => t.id === toastId);
        if (toast && toast.actions && toast.actions[actionIndex]) {
            const action = toast.actions[actionIndex];
            if (action.handler) {
                action.handler();
            }
            
            // Auto-remove toast after action unless specified otherwise
            if (action.autoClose !== false) {
                this.remove(toastId);
            }
        }
    }

    // Specialized notification methods
    saveSuccess(entity = 'Item') {
        return this.success(`${entity} saved successfully`);
    }

    saveError(entity = 'Item', error = '') {
        const message = error 
            ? `Failed to save ${entity.toLowerCase()}: ${error}`
            : `Failed to save ${entity.toLowerCase()}`;
        return this.error(message);
    }

    deleteSuccess(entity = 'Item') {
        return this.success(`${entity} deleted successfully`);
    }

    deleteConfirm(entity, onConfirm) {
        return this.warning(
            `Are you sure you want to delete this ${entity.toLowerCase()}?`,
            {
                persistent: true,
                actions: [
                    {
                        label: 'Delete',
                        style: 'btn-danger',
                        handler: () => {
                            onConfirm();
                            this.deleteSuccess(entity);
                        }
                    },
                    {
                        label: 'Cancel',
                        style: 'btn-outline',
                        handler: () => {}
                    }
                ]
            }
        );
    }

    validationError(fields) {
        const fieldList = Array.isArray(fields) ? fields.join(', ') : fields;
        return this.error(`Please check the following fields: ${fieldList}`);
    }

    networkError() {
        return this.error('Network error. Please check your connection and try again.');
    }

    permissionDenied() {
        return this.error('You do not have permission to perform this action.');
    }

    // AI-specific notifications
    aiInsightGenerated(count = 1) {
        return this.info(
            `${count} new AI insight${count > 1 ? 's' : ''} generated`,
            {
                actions: [
                    {
                        label: 'View',
                        handler: () => {
                            // Navigate to AI insights
                            window.app?.navigate('ai-insights');
                        }
                    }
                ]
            }
        );
    }

    formulaValidationWarning(issues) {
        return this.warning(
            `Formula validation warnings: ${issues.join(', ')}`,
            {
                duration: 8000,
                actions: [
                    {
                        label: 'Review',
                        handler: () => {
                            // Show formula validation modal
                            console.log('Show formula validation');
                        }
                    }
                ]
            }
        );
    }

    costingAlert(productName, issue) {
        return this.warning(
            `Costing alert for ${productName}: ${issue}`,
            {
                actions: [
                    {
                        label: 'Review Costs',
                        handler: () => {
                            // Navigate to cost modeling
                            window.app?.navigate('financial');
                        }
                    }
                ]
            }
        );
    }

    complianceAlert(productName, issues) {
        return this.error(
            `Compliance issues found for ${productName}`,
            {
                persistent: true,
                actions: [
                    {
                        label: 'View Details',
                        handler: () => {
                            // Show compliance details
                            console.log('Show compliance details', issues);
                        }
                    }
                ]
            }
        );
    }

    // Batch operations
    batchOperationStart(operation, count) {
        return this.info(
            `Starting ${operation} for ${count} items...`,
            { persistent: true }
        );
    }

    batchOperationComplete(operation, successful, failed) {
        if (failed === 0) {
            return this.success(`${operation} completed successfully for ${successful} items`);
        } else {
            return this.warning(
                `${operation} completed: ${successful} successful, ${failed} failed`,
                {
                    actions: [
                        {
                            label: 'View Details',
                            handler: () => {
                                // Show batch operation results
                                console.log('Show batch results');
                            }
                        }
                    ]
                }
            );
        }
    }

    // System notifications
    systemMaintenance(message, scheduledTime) {
        return this.info(
            `System maintenance scheduled: ${message}`,
            {
                persistent: true,
                actions: [
                    {
                        label: 'Learn More',
                        handler: () => {
                            // Show maintenance details
                            console.log('Show maintenance details');
                        }
                    }
                ]
            }
        );
    }

    newFeature(featureName, description) {
        return this.info(
            `New feature available: ${featureName}`,
            {
                duration: 10000,
                actions: [
                    {
                        label: 'Try It',
                        handler: () => {
                            // Navigate to new feature
                            console.log('Navigate to new feature');
                        }
                    }
                ]
            }
        );
    }

    // Get notification history
    getHistory() {
        return this.toasts.slice();
    }

    // Notification preferences
    setPreferences(preferences) {
        window.storage.setUserPreference('notifications', preferences);
    }

    getPreferences() {
        return window.storage.getUserPreference('notifications', {
            enabled: true,
            types: ['success', 'error', 'warning', 'info'],
            duration: this.defaultDuration,
            sound: false
        });
    }

    // Check if notifications should be shown
    shouldShow(type) {
        const prefs = this.getPreferences();
        return prefs.enabled && prefs.types.includes(type);
    }
}

// Create global notification instance
window.notifications = new NotificationManager();

// React hook for notifications
function useNotifications() {
    return {
        success: window.notifications.success.bind(window.notifications),
        error: window.notifications.error.bind(window.notifications),
        warning: window.notifications.warning.bind(window.notifications),
        info: window.notifications.info.bind(window.notifications),
        remove: window.notifications.remove.bind(window.notifications),
        clear: window.notifications.clear.bind(window.notifications),
        saveSuccess: window.notifications.saveSuccess.bind(window.notifications),
        saveError: window.notifications.saveError.bind(window.notifications),
        deleteSuccess: window.notifications.deleteSuccess.bind(window.notifications),
        deleteConfirm: window.notifications.deleteConfirm.bind(window.notifications),
        validationError: window.notifications.validationError.bind(window.notifications),
        networkError: window.notifications.networkError.bind(window.notifications),
        permissionDenied: window.notifications.permissionDenied.bind(window.notifications)
    };
}

window.useNotifications = useNotifications;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
// Main Application Component - Pristine Portfolio Tool

const { useState, useEffect } = React;

function App() {
    const [currentModule, setCurrentModule] = useState('dashboard');
    const [currentSubModule, setCurrentSubModule] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
    const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
    const [appReady, setAppReady] = useState(false);

    const auth = useAuth();
    const storage = useStorage();
    const notifications = useNotifications();

    // Initialize app
    useEffect(() => {
        initializeApp();
        setupKeyboardShortcuts();
        
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, []);

    const initializeApp = async () => {
        try {
            // Clear any stored module preference to ensure dashboard is always the landing page
            storage.setUserPreference('lastModule', 'dashboard');
            
            // Perform initial data loads if needed
            await Promise.all([
                // Add any initial data loading here
            ]);

            setCurrentModule('dashboard');
            setAppReady(true);
            
            // Show welcome notification for first-time users
            if (!storage.getUserPreference('welcomeShown')) {
                setTimeout(() => {
                    notifications.info(
                        'Welcome to Pristine Portfolio Tool! Use Ctrl+K to search across all data.',
                        {
                            duration: 8000,
                            actions: [
                                {
                                    label: 'Take Tour',
                                    handler: () => startAppTour()
                                }
                            ]
                        }
                    );
                    storage.setUserPreference('welcomeShown', true);
                }, 2000);
            }
        } catch (error) {
            console.error('App initialization failed:', error);
            notifications.error('Application initialization failed');
            setAppReady(true); // Still show app even if some features fail
        }
    };

    const setupKeyboardShortcuts = () => {
        document.addEventListener('keydown', handleGlobalKeyDown);
    };

    const handleGlobalKeyDown = (event) => {
        // Global keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'k':
                    event.preventDefault();
                    setGlobalSearchOpen(true);
                    break;
                case 'n':
                    event.preventDefault();
                    if (event.shiftKey) {
                        showModal('product-form');
                    }
                    break;
                case '/':
                    event.preventDefault();
                    setGlobalSearchOpen(true);
                    break;
            }
        }

        // Escape key handling
        if (event.key === 'Escape') {
            if (globalSearchOpen) {
                setGlobalSearchOpen(false);
            } else if (modalState.isOpen) {
                closeModal();
            }
        }
    };

    const navigate = (module, subModule = null, data = null) => {
        setCurrentModule(module);
        setCurrentSubModule(subModule);
        
        // Save last visited module (commented out to always start with dashboard)
        // storage.setUserPreference('lastModule', module);
        
        // Add to recent items
        storage.addRecentItem('navigation', {
            id: module + (subModule ? `_${subModule}` : ''),
            name: getModuleTitle(module, subModule),
            module,
            subModule
        });
    };

    const showModal = (type, data = null) => {
        setModalState({
            isOpen: true,
            type,
            data
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: null,
            data: null
        });
    };

    const getModuleTitle = (module, subModule = null) => {
        const titles = {
            'dashboard': 'Dashboard',
            'portfolio': 'Product Portfolio',
            'concept-builder': 'AI Concept Builder',
            'concept-forward': 'Concept Builder - Forward Mode',
            'concept-reverse': 'Concept Builder - Reverse Mode',
            'formulas': 'Formula Development',
            'vendors': 'Vendor Management',
            'vendor-evaluation': 'Vendor Evaluation',
            'packaging': 'Packaging Specifications',
            'finance': 'Financial Modeling',
            'cost-modeling': 'Cost Modeling',
            'projections': 'Financial Projections',
            'fulfillment': 'Fulfillment Management',
            'fulfillment-partners': 'Fulfillment Partners',
            'fulfillment-rules': 'Fulfillment Rules',
            'marketing': 'Marketing Dashboard',
            'compliance': 'Regulatory Compliance',
            'testing': 'Consumer Testing',
            'ai-insights': 'AI Insights',
            'users': 'User Management',
            'settings': 'System Settings'
        };
        
        return titles[subModule] || titles[module] || 'Pristine Portfolio Tool';
    };

    const renderCurrentModule = () => {
        // Show loading state until app is ready
        if (!appReady) {
            return React.createElement('div', {
                className: 'flex items-center justify-center h-screen'
            },
                React.createElement('div', {
                    className: 'text-center'
                }, [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'animate-spin rounded-full h-16 w-16 border-b-2 border-pristine-500 mx-auto mb-4'
                    }),
                    React.createElement('h2', {
                        key: 'title',
                        className: 'text-xl font-semibold text-gray-700'
                    }, 'Initializing Pristine Portfolio Tool'),
                    React.createElement('p', {
                        key: 'subtitle',
                        className: 'text-gray-500 mt-2'
                    }, 'Setting up your command center...')
                ])
            );
        }

        // Route to appropriate component based on current module
        switch (currentModule) {
            case 'dashboard':
                return React.createElement(Dashboard);
                
            case 'portfolio':
                return React.createElement(ProductPortfolio);
                
            case 'concept-builder':
            case 'concept-forward':
            case 'concept-reverse':
                const mode = currentModule === 'concept-forward' ? 'forward' : 
                            currentModule === 'concept-reverse' ? 'reverse' : 'forward';
                return React.createElement(PristineInnovationScanner, { mode });
                
            case 'formulas':
                return React.createElement(FormulaManager);
                
            case 'vendors':
            case 'vendor-evaluation':
                return React.createElement(VendorManager, { 
                    mode: currentModule === 'vendor-evaluation' ? 'evaluation' : 'list' 
                });
                
            case 'packaging':
                return React.createElement(PackagingManager);
                
            case 'finance':
            case 'cost-modeling':
            case 'projections':
                return React.createElement(FinancialModeling, { 
                    mode: currentModule === 'cost-modeling' ? 'costs' : 
                          currentModule === 'projections' ? 'projections' : 'overview' 
                });
                
            case 'fulfillment':
            case 'fulfillment-partners':
            case 'fulfillment-rules':
                return React.createElement(FulfillmentManager, { 
                    mode: currentModule === 'fulfillment-partners' ? 'partners' : 
                          currentModule === 'fulfillment-rules' ? 'rules' : 'overview' 
                });
                
            case 'marketing':
                return React.createElement(MarketingDashboard);
                
            case 'compliance':
                return React.createElement(ComplianceManager);
                
            case 'testing':
                return React.createElement(ConsumerValidation);
                
            case 'ai-insights':
                return React.createElement(AIInsights);
                
            case 'users':
                return React.createElement(UserManagement);
                
            case 'settings':
                return React.createElement(AppSettings);
                
            default:
                return React.createElement('div', {
                    className: 'flex items-center justify-center h-64'
                }, [
                    React.createElement('div', {
                        key: 'content',
                        className: 'text-center'
                    }, [
                        React.createElement('i', {
                            key: 'icon',
                            className: 'fas fa-exclamation-triangle text-4xl text-gray-400 mb-4'
                        }),
                        React.createElement('h3', {
                            key: 'title',
                            className: 'text-lg font-medium text-gray-900'
                        }, 'Module Not Found'),
                        React.createElement('p', {
                            key: 'description',
                            className: 'text-gray-600 mt-2'
                        }, `The module "${currentModule}" is not available.`),
                        React.createElement('button', {
                            key: 'home',
                            onClick: () => navigate('dashboard'),
                            className: 'btn btn-primary mt-4'
                        }, 'Go to Dashboard')
                    ])
                ]);
        }
    };

    const startAppTour = () => {
        notifications.info('App tour feature coming soon!');
    };

    // Make app navigation available globally
    useEffect(() => {
        window.app = {
            navigate,
            showModal,
            closeModal,
            getCurrentModule: () => currentModule,
            getCurrentSubModule: () => currentSubModule
        };
    }, [currentModule, currentSubModule]);

    return React.createElement('div', {
        className: 'min-h-screen bg-gray-50'
    }, [
        // Main Layout
        React.createElement(Layout, {
            key: 'layout',
            currentModule,
            onModuleChange: navigate
        },
            renderCurrentModule()
        ),

        // Global Search Modal
        React.createElement(GlobalSearch, {
            key: 'global-search',
            isOpen: globalSearchOpen,
            onClose: () => setGlobalSearchOpen(false)
        }),

        // Modal System
        modalState.isOpen && React.createElement(ModalSystem, {
            key: 'modal',
            type: modalState.type,
            data: modalState.data,
            onClose: closeModal
        }),

        // Floating Action Button
        React.createElement(FloatingActionButton, {
            key: 'fab'
        }),

        // PWA Install Prompt (if applicable)
        React.createElement(PWAInstallPrompt, {
            key: 'pwa-prompt'
        })
    ]);
}

// Modal System Component
function ModalSystem({ type, data, onClose }) {
    const renderModal = () => {
        switch (type) {
            case 'product-form':
                return React.createElement(ProductFormModal, {
                    data,
                    onClose,
                    onSave: (product) => {
                        // Handle product save
                        console.log('Product saved:', product);
                        onClose();
                    }
                });
                
            case 'formula-form':
                return React.createElement(FormulaFormModal, {
                    data,
                    onClose,
                    onSave: (formula) => {
                        // Handle formula save
                        console.log('Formula saved:', formula);
                        onClose();
                    }
                });
                
            case 'vendor-form':
                return React.createElement(VendorFormModal, {
                    data,
                    onClose,
                    onSave: (vendor) => {
                        // Handle vendor save
                        console.log('Vendor saved:', vendor);
                        onClose();
                    }
                });
                
            case 'user-profile':
                return React.createElement(UserProfileModal, {
                    onClose
                });
                
            case 'user-preferences':
                return React.createElement(UserPreferencesModal, {
                    onClose
                });
                
            default:
                return React.createElement('div', {
                    className: 'modal-overlay',
                    onClick: onClose
                },
                    React.createElement('div', {
                        className: 'modal'
                    }, [
                        React.createElement('div', {
                            key: 'header',
                            className: 'modal-header'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-medium'
                            }, 'Unknown Modal')
                        ),
                        React.createElement('div', {
                            key: 'body',
                            className: 'modal-body'
                        },
                            React.createElement('p', null, `Modal type "${type}" not found.`)
                        ),
                        React.createElement('div', {
                            key: 'footer',
                            className: 'modal-footer'
                        },
                            React.createElement('button', {
                                onClick: onClose,
                                className: 'btn btn-secondary'
                            }, 'Close')
                        )
                    ])
                );
        }
    };

    return renderModal();
}

// PWA Install Prompt Component
function PWAInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            
            // Only show prompt if user hasn't dismissed it before
            const dismissed = storage.getUserPreference('pwaPromptDismissed', false);
            if (!dismissed) {
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
            notifications.success('App installed successfully!');
        }
        
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        storage.setUserPreference('pwaPromptDismissed', true);
    };

    if (!showPrompt) return null;

    return React.createElement('div', {
        className: 'fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-40'
    }, [
        React.createElement('div', {
            key: 'content',
            className: 'flex items-start space-x-3'
        }, [
            React.createElement('div', {
                key: 'icon',
                className: 'w-8 h-8 bg-pristine-500 rounded-lg flex items-center justify-center'
            },
                React.createElement('i', {
                    className: 'fas fa-mobile-alt text-white text-sm'
                })
            ),
            React.createElement('div', {
                key: 'text',
                className: 'flex-1'
            }, [
                React.createElement('h4', {
                    key: 'title',
                    className: 'font-medium text-gray-900'
                }, 'Install Pristine Portfolio Tool'),
                React.createElement('p', {
                    key: 'description',
                    className: 'text-sm text-gray-600 mt-1'
                }, 'Install our app for a better experience and offline access.')
            ])
        ]),
        React.createElement('div', {
            key: 'actions',
            className: 'flex space-x-2 mt-3'
        }, [
            React.createElement('button', {
                key: 'install',
                onClick: handleInstall,
                className: 'btn btn-primary btn-sm flex-1'
            }, 'Install'),
            React.createElement('button', {
                key: 'dismiss',
                onClick: handleDismiss,
                className: 'btn btn-outline btn-sm'
            }, 'Not Now')
        ])
    ]);
}

// Placeholder components for modules that aren't fully implemented yet
function ProductPortfolio() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-box-open text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Product Portfolio'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Product management interface coming soon...')
    ]);
}

function FormulaManager() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-flask text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Formula Development'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Formula management interface coming soon...')
    ]);
}

function VendorManager({ mode }) {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-handshake text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, mode === 'evaluation' ? 'Vendor Evaluation' : 'Vendor Management'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Vendor management interface coming soon...')
    ]);
}

function PackagingManager() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-cube text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Packaging Management'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Packaging interface coming soon...')
    ]);
}

function FinancialModeling({ mode }) {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-chart-line text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Financial Modeling'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Financial modeling interface coming soon...')
    ]);
}

function FulfillmentManager({ mode }) {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-truck text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Fulfillment Management'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Fulfillment interface coming soon...')
    ]);
}

function MarketingDashboard() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-bullhorn text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Marketing Dashboard'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Marketing interface coming soon...')
    ]);
}

function ComplianceManager() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-shield-alt text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Compliance Management'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Compliance interface coming soon...')
    ]);
}

function ConsumerValidation() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-vial text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Consumer Validation'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Testing interface coming soon...')
    ]);
}

function AIInsights() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-brain text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'AI Insights'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'AI insights interface coming soon...')
    ]);
}

function UserManagement() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-users text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'User Management'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'User management interface coming soon...')
    ]);
}

function AppSettings() {
    return React.createElement('div', {
        className: 'p-8 text-center'
    }, [
        React.createElement('i', {
            key: 'icon',
            className: 'fas fa-cog text-6xl text-gray-300 mb-4'
        }),
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-700'
        }, 'Application Settings'),
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-500 mt-2'
        }, 'Settings interface coming soon...')
    ]);
}

// Basic modal components (placeholder)
function ProductFormModal({ data, onClose, onSave }) {
    return React.createElement('div', {
        className: 'modal-overlay',
        onClick: onClose
    },
        React.createElement('div', {
            className: 'modal modal-lg',
            onClick: (e) => e.stopPropagation()
        }, [
            React.createElement('div', {
                key: 'header',
                className: 'modal-header'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-medium'
                }, data ? 'Edit Product' : 'New Product'),
                React.createElement('button', {
                    key: 'close',
                    onClick: onClose,
                    className: 'text-gray-400 hover:text-gray-600'
                },
                    React.createElement('i', { className: 'fas fa-times' })
                )
            ]),
            React.createElement('div', {
                key: 'body',
                className: 'modal-body'
            },
                React.createElement('p', null, 'Product form coming soon...')
            ),
            React.createElement('div', {
                key: 'footer',
                className: 'modal-footer'
            }, [
                React.createElement('button', {
                    key: 'cancel',
                    onClick: onClose,
                    className: 'btn btn-outline'
                }, 'Cancel'),
                React.createElement('button', {
                    key: 'save',
                    onClick: () => onSave({}),
                    className: 'btn btn-primary'
                }, 'Save')
            ])
        ])
    );
}

function FormulaFormModal({ data, onClose, onSave }) {
    return React.createElement('div', {
        className: 'modal-overlay',
        onClick: onClose
    },
        React.createElement('div', {
            className: 'modal modal-lg',
            onClick: (e) => e.stopPropagation()
        }, [
            React.createElement('div', {
                key: 'header',
                className: 'modal-header'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-medium'
                }, data ? 'Edit Formula' : 'New Formula'),
                React.createElement('button', {
                    key: 'close',
                    onClick: onClose,
                    className: 'text-gray-400 hover:text-gray-600'
                },
                    React.createElement('i', { className: 'fas fa-times' })
                )
            ]),
            React.createElement('div', {
                key: 'body',
                className: 'modal-body'
            },
                React.createElement('p', null, 'Formula form coming soon...')
            ),
            React.createElement('div', {
                key: 'footer',
                className: 'modal-footer'
            }, [
                React.createElement('button', {
                    key: 'cancel',
                    onClick: onClose,
                    className: 'btn btn-outline'
                }, 'Cancel'),
                React.createElement('button', {
                    key: 'save',
                    onClick: () => onSave({}),
                    className: 'btn btn-primary'
                }, 'Save')
            ])
        ])
    );
}

function VendorFormModal({ data, onClose, onSave }) {
    return React.createElement('div', {
        className: 'modal-overlay',
        onClick: onClose
    },
        React.createElement('div', {
            className: 'modal modal-lg',
            onClick: (e) => e.stopPropagation()
        }, [
            React.createElement('div', {
                key: 'header',
                className: 'modal-header'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-medium'
                }, data ? 'Edit Vendor' : 'New Vendor'),
                React.createElement('button', {
                    key: 'close',
                    onClick: onClose,
                    className: 'text-gray-400 hover:text-gray-600'
                },
                    React.createElement('i', { className: 'fas fa-times' })
                )
            ]),
            React.createElement('div', {
                key: 'body',
                className: 'modal-body'
            },
                React.createElement('p', null, 'Vendor form coming soon...')
            ),
            React.createElement('div', {
                key: 'footer',
                className: 'modal-footer'
            }, [
                React.createElement('button', {
                    key: 'cancel',
                    onClick: onClose,
                    className: 'btn btn-outline'
                }, 'Cancel'),
                React.createElement('button', {
                    key: 'save',
                    onClick: () => onSave({}),
                    className: 'btn btn-primary'
                }, 'Save')
            ])
        ])
    );
}

function UserProfileModal({ onClose }) {
    return React.createElement('div', {
        className: 'modal-overlay',
        onClick: onClose
    },
        React.createElement('div', {
            className: 'modal',
            onClick: (e) => e.stopPropagation()
        }, [
            React.createElement('div', {
                key: 'header',
                className: 'modal-header'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-medium'
                }, 'User Profile'),
                React.createElement('button', {
                    key: 'close',
                    onClick: onClose,
                    className: 'text-gray-400 hover:text-gray-600'
                },
                    React.createElement('i', { className: 'fas fa-times' })
                )
            ]),
            React.createElement('div', {
                key: 'body',
                className: 'modal-body'
            },
                React.createElement('p', null, 'User profile interface coming soon...')
            ),
            React.createElement('div', {
                key: 'footer',
                className: 'modal-footer'
            },
                React.createElement('button', {
                    onClick: onClose,
                    className: 'btn btn-primary'
                }, 'Close')
            )
        ])
    );
}

function UserPreferencesModal({ onClose }) {
    return React.createElement('div', {
        className: 'modal-overlay',
        onClick: onClose
    },
        React.createElement('div', {
            className: 'modal',
            onClick: (e) => e.stopPropagation()
        }, [
            React.createElement('div', {
                key: 'header',
                className: 'modal-header'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-medium'
                }, 'Preferences'),
                React.createElement('button', {
                    key: 'close',
                    onClick: onClose,
                    className: 'text-gray-400 hover:text-gray-600'
                },
                    React.createElement('i', { className: 'fas fa-times' })
                )
            ]),
            React.createElement('div', {
                key: 'body',
                className: 'modal-body'
            },
                React.createElement('p', null, 'User preferences interface coming soon...')
            ),
            React.createElement('div', {
                key: 'footer',
                className: 'modal-footer'
            },
                React.createElement('button', {
                    onClick: onClose,
                    className: 'btn btn-primary'
                }, 'Close')
            )
        ])
    );
}

// Render the App
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
}
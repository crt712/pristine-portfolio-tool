// Main Layout Component for Pristine Portfolio Tool

const { useState, useEffect } = React;

function Layout({ children, currentModule, onModuleChange }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const auth = useAuth();
    const storage = useStorage();

    useEffect(() => {
        // Load sidebar state from storage
        const collapsed = storage.getUserPreference('sidebarCollapsed', false);
        setSidebarCollapsed(collapsed);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSidebarCollapse = () => {
        const newCollapsed = !sidebarCollapsed;
        setSidebarCollapsed(newCollapsed);
        storage.setUserPreference('sidebarCollapsed', newCollapsed);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    if (!auth.isAuthenticated) {
        return React.createElement(LoginScreen, null);
    }

    return React.createElement('div', {
        className: 'app-layout bg-gray-50 min-h-screen'
    }, [
        // Mobile overlay
        sidebarOpen && React.createElement('div', {
            key: 'overlay',
            className: 'fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden',
            onClick: closeSidebar
        }),

        // Sidebar
        React.createElement(Sidebar, {
            key: 'sidebar',
            open: sidebarOpen,
            collapsed: sidebarCollapsed,
            currentModule,
            onModuleChange,
            onClose: closeSidebar,
            onToggleCollapse: toggleSidebarCollapse
        }),

        // Main content area
        React.createElement('div', {
            key: 'main',
            className: `main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''} transition-all duration-300`
        }, [
            // Top bar
            React.createElement(TopBar, {
                key: 'topbar',
                onToggleSidebar: toggleSidebar,
                sidebarCollapsed,
                currentModule
            }),

            // Content area
            React.createElement('div', {
                key: 'content',
                className: 'content-area p-6 lg:p-8'
            }, children)
        ])
    ]);
}

function LoginScreen() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const notifications = useNotifications();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await auth.login(credentials.email, credentials.password);
            if (result.success) {
                notifications.success('Login successful');
                window.location.reload();
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setCredentials(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return React.createElement('div', {
        className: 'min-h-screen bg-gradient-to-br from-pristine-50 to-pristine-100 flex items-center justify-center p-4'
    }, 
        React.createElement('div', {
            className: 'max-w-md w-full bg-white rounded-xl shadow-lg p-8'
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'text-center mb-8'
            }, [
                React.createElement('div', {
                    key: 'logo',
                    className: 'mx-auto w-16 h-16 bg-pristine-500 rounded-full flex items-center justify-center mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-flask text-white text-2xl'
                    })
                ),
                React.createElement('h1', {
                    key: 'title',
                    className: 'text-2xl font-bold text-gray-900'
                }, 'Pristine Portfolio Tool'),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-gray-600 mt-2'
                }, 'Product Development Command Center')
            ]),

            // Login form
            React.createElement('form', {
                key: 'form',
                onSubmit: handleSubmit,
                className: 'space-y-6'
            }, [
                // Email field
                React.createElement('div', { key: 'email-field' }, [
                    React.createElement('label', {
                        key: 'email-label',
                        className: 'form-label'
                    }, 'Email Address'),
                    React.createElement('input', {
                        key: 'email-input',
                        type: 'email',
                        value: credentials.email,
                        onChange: (e) => handleChange('email', e.target.value),
                        className: 'form-input',
                        placeholder: 'Enter your email',
                        required: true
                    })
                ]),

                // Password field
                React.createElement('div', { key: 'password-field' }, [
                    React.createElement('label', {
                        key: 'password-label',
                        className: 'form-label'
                    }, 'Password'),
                    React.createElement('input', {
                        key: 'password-input',
                        type: 'password',
                        value: credentials.password,
                        onChange: (e) => handleChange('password', e.target.value),
                        className: 'form-input',
                        placeholder: 'Enter your password',
                        required: true
                    })
                ]),

                // Error message
                error && React.createElement('div', {
                    key: 'error',
                    className: 'bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm'
                }, error),

                // Submit button
                React.createElement('button', {
                    key: 'submit',
                    type: 'submit',
                    disabled: loading,
                    className: 'w-full btn btn-primary btn-lg'
                }, loading ? [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'loading-spinner mr-2'
                    }),
                    'Signing in...'
                ] : 'Sign In')
            ]),

            // Demo credentials
            React.createElement('div', {
                key: 'demo',
                className: 'mt-8 p-4 bg-gray-50 rounded-lg'
            }, [
                React.createElement('h3', {
                    key: 'demo-title',
                    className: 'text-sm font-medium text-gray-700 mb-2'
                }, 'Demo Credentials:'),
                React.createElement('div', {
                    key: 'demo-list',
                    className: 'text-xs text-gray-600 space-y-1'
                }, [
                    React.createElement('div', { key: 'admin' }, 'Admin: admin@pristine.com'),
                    React.createElement('div', { key: 'product' }, 'Product Manager: product@pristine.com'),
                    React.createElement('div', { key: 'formulator' }, 'Formulator: formulator@pristine.com'),
                    React.createElement('div', { key: 'password' }, 'Password: (any)')
                ])
            ])
        ])
    );
}

// Quick access floating action button
function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const auth = useAuth();

    const actions = [
        {
            icon: 'fas fa-plus',
            label: 'New Product',
            action: () => window.app?.showModal('product-form'),
            permission: ['products', 'create']
        },
        {
            icon: 'fas fa-flask',
            label: 'New Formula',
            action: () => window.app?.showModal('formula-form'),
            permission: ['formulas', 'create']
        },
        {
            icon: 'fas fa-lightbulb',
            label: 'AI Concept',
            action: () => window.app?.navigate('concept-builder'),
            permission: ['products', 'create']
        },
        {
            icon: 'fas fa-truck',
            label: 'New Vendor',
            action: () => window.app?.showModal('vendor-form'),
            permission: ['vendors', 'create']
        }
    ];

    const availableActions = actions.filter(action => 
        auth.hasPermission(action.permission[0], action.permission[1])
    );

    if (availableActions.length === 0) return null;

    return React.createElement('div', {
        className: 'fixed bottom-6 right-6 z-40'
    }, [
        // Action items
        isOpen && React.createElement('div', {
            key: 'actions',
            className: 'absolute bottom-16 right-0 space-y-2'
        }, 
            availableActions.map((action, index) =>
                React.createElement('div', {
                    key: index,
                    className: 'flex items-center'
                }, [
                    React.createElement('span', {
                        key: 'label',
                        className: 'bg-gray-900 text-white px-3 py-2 rounded-lg text-sm mr-3 opacity-90'
                    }, action.label),
                    React.createElement('button', {
                        key: 'button',
                        onClick: action.action,
                        className: 'w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center border border-gray-200'
                    },
                        React.createElement('i', {
                            className: `${action.icon} text-pristine-600`
                        })
                    )
                ])
            )
        ),

        // Main FAB button
        React.createElement('button', {
            key: 'main',
            onClick: () => setIsOpen(!isOpen),
            className: `w-14 h-14 bg-pristine-600 hover:bg-pristine-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${isOpen ? 'rotate-45' : ''}`
        },
            React.createElement('i', {
                className: 'fas fa-plus text-xl'
            })
        )
    ]);
}

// Global search modal
function GlobalSearch({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const storage = useStorage();

    useEffect(() => {
        if (isOpen) {
            setRecentSearches(storage.getSearchHistory().slice(0, 5));
            // Focus search input
            setTimeout(() => {
                document.getElementById('global-search-input')?.focus();
            }, 100);
        }
    }, [isOpen]);

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            // Search across multiple tables
            const searchResults = await Promise.all([
                api.getTableData('products', { search: searchQuery, limit: 10 }),
                api.getTableData('formulas', { search: searchQuery, limit: 10 }),
                api.getTableData('vendors', { search: searchQuery, limit: 10 }),
                api.getTableData('ingredients', { search: searchQuery, limit: 10 })
            ]);

            const combined = [];
            searchResults.forEach((result, index) => {
                const types = ['products', 'formulas', 'vendors', 'ingredients'];
                result.data.forEach(item => {
                    combined.push({
                        ...item,
                        _type: types[index]
                    });
                });
            });

            setResults(combined);
            storage.addSearchHistory(searchQuery, combined.length);
        } catch (error) {
            console.error('Search failed:', error);
            notifications.error('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch(query);
    };

    const selectResult = (result) => {
        // Navigate to the relevant module and select the item
        const moduleMap = {
            products: 'portfolio',
            formulas: 'formulas',
            vendors: 'vendors',
            ingredients: 'formulas'
        };

        const module = moduleMap[result._type];
        if (module) {
            window.app?.navigate(module, result.id);
        }
        onClose();
    };

    if (!isOpen) return null;

    return React.createElement('div', {
        className: 'modal-overlay',
        onClick: onClose
    },
        React.createElement('div', {
            className: 'modal modal-lg',
            onClick: (e) => e.stopPropagation()
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'modal-header'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-medium'
                }, 'Search'),
                React.createElement('button', {
                    key: 'close',
                    onClick: onClose,
                    className: 'text-gray-400 hover:text-gray-600'
                },
                    React.createElement('i', { className: 'fas fa-times' })
                )
            ]),

            // Search form
            React.createElement('div', {
                key: 'search',
                className: 'p-6 border-b'
            },
                React.createElement('form', {
                    onSubmit: handleSearch,
                    className: 'flex space-x-2'
                }, [
                    React.createElement('input', {
                        key: 'input',
                        id: 'global-search-input',
                        type: 'text',
                        value: query,
                        onChange: (e) => setQuery(e.target.value),
                        placeholder: 'Search products, formulas, vendors, ingredients...',
                        className: 'form-input flex-1'
                    }),
                    React.createElement('button', {
                        key: 'submit',
                        type: 'submit',
                        disabled: loading,
                        className: 'btn btn-primary'
                    }, loading ? 
                        React.createElement('div', { className: 'loading-spinner' }) :
                        React.createElement('i', { className: 'fas fa-search' })
                    )
                ])
            ),

            // Results
            React.createElement('div', {
                key: 'results',
                className: 'modal-body max-h-96 overflow-y-auto'
            }, [
                // Recent searches (when no query)
                !query && recentSearches.length > 0 && React.createElement('div', {
                    key: 'recent',
                    className: 'mb-4'
                }, [
                    React.createElement('h4', {
                        key: 'recent-title',
                        className: 'text-sm font-medium text-gray-700 mb-2'
                    }, 'Recent Searches'),
                    React.createElement('div', {
                        key: 'recent-list',
                        className: 'space-y-1'
                    },
                        recentSearches.map((search, index) =>
                            React.createElement('button', {
                                key: index,
                                onClick: () => setQuery(search.query),
                                className: 'block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm'
                            }, [
                                React.createElement('span', {
                                    key: 'query',
                                    className: 'text-gray-900'
                                }, search.query),
                                React.createElement('span', {
                                    key: 'count',
                                    className: 'text-gray-500 ml-2'
                                }, `${search.results} results`)
                            ])
                        )
                    )
                ]),

                // Search results
                results.length > 0 && React.createElement('div', {
                    key: 'results-list',
                    className: 'space-y-2'
                },
                    results.map((result, index) =>
                        React.createElement('div', {
                            key: index,
                            onClick: () => selectResult(result),
                            className: 'p-3 hover:bg-gray-50 rounded-md cursor-pointer border border-gray-200'
                        }, [
                            React.createElement('div', {
                                key: 'header',
                                className: 'flex items-center justify-between'
                            }, [
                                React.createElement('h5', {
                                    key: 'name',
                                    className: 'font-medium text-gray-900'
                                }, result.name || result.title || result.id),
                                React.createElement('span', {
                                    key: 'type',
                                    className: `status-badge status-${result._type === 'products' ? 'active' : 'pending'}`
                                }, result._type)
                            ]),
                            React.createElement('p', {
                                key: 'description',
                                className: 'text-sm text-gray-600 mt-1'
                            }, result.description || result.notes || 'No description available')
                        ])
                    )
                ),

                // No results
                query && results.length === 0 && !loading && React.createElement('div', {
                    key: 'no-results',
                    className: 'text-center text-gray-500 py-8'
                }, [
                    React.createElement('i', {
                        key: 'icon',
                        className: 'fas fa-search text-4xl mb-4'
                    }),
                    React.createElement('p', {
                        key: 'message'
                    }, 'No results found. Try a different search term.')
                ])
            ])
        ])
    );
}

window.Layout = Layout;
window.FloatingActionButton = FloatingActionButton;
window.GlobalSearch = GlobalSearch;
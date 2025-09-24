// TopBar Component with search, notifications, and user actions

const { useState, useEffect, useRef } = React;

function TopBar({ onToggleSidebar, sidebarCollapsed, currentModule }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    
    const auth = useAuth();
    const notificationSystem = useNotifications();
    const searchRef = useRef(null);
    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);
    const quickAddRef = useRef(null);

    // Module titles mapping
    const moduleTitles = {
        'dashboard': 'Dashboard',
        'portfolio': 'Product Portfolio',
        'concept-builder': 'Concept Builder',
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

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
            if (quickAddRef.current && !quickAddRef.current.contains(event.target)) {
                setQuickAddOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load notifications
    useEffect(() => {
        loadNotifications();
        // Refresh notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            // Mock notifications - in production this would fetch from API
            const mockNotifications = [
                {
                    id: 'notif_1',
                    type: 'ai_insight',
                    title: 'New AI Insight Available',
                    message: 'Formula optimization suggestions for Zinc Deodorant v2.1',
                    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                    read: false,
                    actionUrl: '/ai-insights'
                },
                {
                    id: 'notif_2',
                    type: 'compliance',
                    title: 'Compliance Review Required',
                    message: 'New FDA guidelines affect 3 products in your portfolio',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                    read: false,
                    actionUrl: '/compliance'
                },
                {
                    id: 'notif_3',
                    type: 'cost_alert',
                    title: 'Cost Variance Alert',
                    message: 'Zinc ricinoleate price increased by 15%',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                    read: true,
                    actionUrl: '/finance/cost-modeling'
                },
                {
                    id: 'notif_4',
                    type: 'testing',
                    title: 'Test Results Ready',
                    message: '8-hour efficacy test completed for Natural Deodorant Pro',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                    read: true,
                    actionUrl: '/testing'
                }
            ];
            
            setNotifications(mockNotifications);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const handleSearch = () => {
        setSearchOpen(true);
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId ? { ...notif, read: true } : notif
                )
            );
            // In production, this would call API to mark as read
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, read: true }))
            );
            // In production, this would call API to mark all as read
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        const iconMap = {
            ai_insight: 'fas fa-brain text-blue-500',
            compliance: 'fas fa-shield-alt text-red-500',
            cost_alert: 'fas fa-dollar-sign text-yellow-500',
            testing: 'fas fa-vial text-green-500',
            formula: 'fas fa-flask text-purple-500',
            vendor: 'fas fa-handshake text-indigo-500'
        };
        return iconMap[type] || 'fas fa-bell text-gray-500';
    };

    const formatRelativeTime = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const quickAddItems = [
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
            icon: 'fas fa-handshake',
            label: 'New Vendor',
            action: () => window.app?.showModal('vendor-form'),
            permission: ['vendors', 'create']
        },
        {
            icon: 'fas fa-cube',
            label: 'Packaging Spec',
            action: () => window.app?.showModal('packaging-form'),
            permission: ['packaging', 'create']
        }
    ];

    const availableQuickActions = quickAddItems.filter(item => 
        auth.hasPermission(item.permission[0], item.permission[1])
    );

    return React.createElement('header', {
        className: 'topbar bg-white border-b border-gray-200 shadow-sm'
    },
        React.createElement('div', {
            className: 'flex items-center justify-between px-4 lg:px-6 h-16'
        }, [
            // Left side - Mobile menu button and breadcrumb
            React.createElement('div', {
                key: 'left',
                className: 'flex items-center space-x-4'
            }, [
                // Mobile menu button
                React.createElement('button', {
                    key: 'mobile-menu',
                    onClick: onToggleSidebar,
                    className: 'lg:hidden p-2 hover:bg-gray-100 rounded-md'
                },
                    React.createElement('i', {
                        className: 'fas fa-bars text-gray-600'
                    })
                ),

                // Breadcrumb
                React.createElement('div', {
                    key: 'breadcrumb',
                    className: 'flex items-center space-x-2'
                }, [
                    React.createElement('h1', {
                        key: 'title',
                        className: 'text-lg font-semibold text-gray-900'
                    }, moduleTitles[currentModule] || 'Pristine Portfolio Tool'),
                    
                    // Environment indicator (staging/production)
                    window.location.hostname.includes('staging') && React.createElement('span', {
                        key: 'env',
                        className: 'px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'
                    }, 'Staging')
                ])
            ]),

            // Right side - Search, notifications, quick add, user menu
            React.createElement('div', {
                key: 'right',
                className: 'flex items-center space-x-2'
            }, [
                // Global search
                React.createElement('div', {
                    key: 'search',
                    ref: searchRef,
                    className: 'relative'
                }, [
                    React.createElement('button', {
                        key: 'search-btn',
                        onClick: handleSearch,
                        className: 'p-2 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-900',
                        title: 'Search (Ctrl+K)'
                    },
                        React.createElement('i', {
                            className: 'fas fa-search'
                        })
                    ),

                    // Search shortcut hint
                    React.createElement('div', {
                        key: 'search-hint',
                        className: 'hidden md:flex absolute top-1/2 left-full ml-2 transform -translate-y-1/2 text-xs text-gray-400'
                    }, 'Ctrl+K')
                ]),

                // Quick add dropdown
                availableQuickActions.length > 0 && React.createElement('div', {
                    key: 'quick-add',
                    ref: quickAddRef,
                    className: 'relative'
                }, [
                    React.createElement('button', {
                        key: 'quick-add-btn',
                        onClick: () => setQuickAddOpen(!quickAddOpen),
                        className: 'p-2 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-900',
                        title: 'Quick Add'
                    },
                        React.createElement('i', {
                            className: 'fas fa-plus'
                        })
                    ),

                    // Quick add dropdown
                    quickAddOpen && React.createElement('div', {
                        key: 'quick-add-menu',
                        className: 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50'
                    },
                        availableQuickActions.map((item, index) =>
                            React.createElement('button', {
                                key: index,
                                onClick: () => {
                                    item.action();
                                    setQuickAddOpen(false);
                                },
                                className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center'
                            }, [
                                React.createElement('i', {
                                    key: 'icon',
                                    className: `${item.icon} w-4 text-center mr-3 text-gray-400`
                                }),
                                React.createElement('span', {
                                    key: 'label'
                                }, item.label)
                            ])
                        )
                    )
                ]),

                // Notifications
                React.createElement('div', {
                    key: 'notifications',
                    ref: notificationRef,
                    className: 'relative'
                }, [
                    React.createElement('button', {
                        key: 'notif-btn',
                        onClick: () => setNotificationsOpen(!notificationsOpen),
                        className: 'p-2 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-900 relative',
                        title: 'Notifications'
                    }, [
                        React.createElement('i', {
                            key: 'icon',
                            className: 'fas fa-bell'
                        }),
                        unreadCount > 0 && React.createElement('span', {
                            key: 'badge',
                            className: 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'
                        }, unreadCount > 9 ? '9+' : unreadCount)
                    ]),

                    // Notifications dropdown
                    notificationsOpen && React.createElement('div', {
                        key: 'notif-menu',
                        className: 'absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50'
                    }, [
                        // Header
                        React.createElement('div', {
                            key: 'header',
                            className: 'px-4 py-3 border-b border-gray-200 flex items-center justify-between'
                        }, [
                            React.createElement('h3', {
                                key: 'title',
                                className: 'font-medium text-gray-900'
                            }, 'Notifications'),
                            unreadCount > 0 && React.createElement('button', {
                                key: 'mark-all',
                                onClick: markAllAsRead,
                                className: 'text-xs text-pristine-600 hover:text-pristine-700'
                            }, 'Mark all as read')
                        ]),

                        // Notifications list
                        React.createElement('div', {
                            key: 'list',
                            className: 'max-h-96 overflow-y-auto'
                        },
                            notifications.length === 0 ? 
                                React.createElement('div', {
                                    className: 'px-4 py-8 text-center text-gray-500'
                                }, 'No notifications') :
                                notifications.map(notification =>
                                    React.createElement('div', {
                                        key: notification.id,
                                        onClick: () => {
                                            if (!notification.read) {
                                                markNotificationAsRead(notification.id);
                                            }
                                            if (notification.actionUrl) {
                                                window.app?.navigate(notification.actionUrl);
                                            }
                                            setNotificationsOpen(false);
                                        },
                                        className: `px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${!notification.read ? 'bg-pristine-50' : ''}`
                                    }, [
                                        React.createElement('div', {
                                            key: 'content',
                                            className: 'flex items-start space-x-3'
                                        }, [
                                            React.createElement('i', {
                                                key: 'icon',
                                                className: `${getNotificationIcon(notification.type)} text-sm mt-1`
                                            }),
                                            React.createElement('div', {
                                                key: 'text',
                                                className: 'flex-1 min-w-0'
                                            }, [
                                                React.createElement('p', {
                                                    key: 'title',
                                                    className: `text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`
                                                }, notification.title),
                                                React.createElement('p', {
                                                    key: 'message',
                                                    className: 'text-sm text-gray-600 mt-1'
                                                }, notification.message),
                                                React.createElement('p', {
                                                    key: 'time',
                                                    className: 'text-xs text-gray-400 mt-1'
                                                }, formatRelativeTime(notification.timestamp))
                                            ]),
                                            !notification.read && React.createElement('div', {
                                                key: 'unread',
                                                className: 'w-2 h-2 bg-pristine-500 rounded-full mt-2'
                                            })
                                        ])
                                    ])
                                )
                        ),

                        // Footer
                        notifications.length > 0 && React.createElement('div', {
                            key: 'footer',
                            className: 'px-4 py-3 border-t border-gray-200 text-center'
                        },
                            React.createElement('button', {
                                onClick: () => {
                                    window.app?.navigate('notifications');
                                    setNotificationsOpen(false);
                                },
                                className: 'text-sm text-pristine-600 hover:text-pristine-700'
                            }, 'View all notifications')
                        )
                    ])
                ]),

                // User menu
                React.createElement('div', {
                    key: 'user-menu',
                    ref: userMenuRef,
                    className: 'relative'
                }, [
                    React.createElement('button', {
                        key: 'user-btn',
                        onClick: () => setUserMenuOpen(!userMenuOpen),
                        className: 'flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-md'
                    }, [
                        React.createElement('div', {
                            key: 'avatar',
                            className: 'w-8 h-8 bg-pristine-500 rounded-full flex items-center justify-center'
                        },
                            React.createElement('span', {
                                className: 'text-white text-sm font-medium'
                            }, auth.user?.name?.charAt(0) || 'U')
                        ),
                        React.createElement('i', {
                            key: 'chevron',
                            className: 'fas fa-chevron-down text-xs text-gray-400 hidden md:block'
                        })
                    ]),

                    // User dropdown menu
                    userMenuOpen && React.createElement('div', {
                        key: 'user-dropdown',
                        className: 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50'
                    }, [
                        // User info
                        React.createElement('div', {
                            key: 'user-info',
                            className: 'px-4 py-2 border-b border-gray-200'
                        }, [
                            React.createElement('p', {
                                key: 'name',
                                className: 'text-sm font-medium text-gray-900'
                            }, auth.user?.name || 'User'),
                            React.createElement('p', {
                                key: 'email',
                                className: 'text-xs text-gray-500'
                            }, auth.user?.email || ''),
                            React.createElement('p', {
                                key: 'role',
                                className: 'text-xs text-gray-400 capitalize mt-1'
                            }, `Role: ${auth.user?.role || 'viewer'}`)
                        ]),

                        // Menu items
                        React.createElement('button', {
                            key: 'profile',
                            onClick: () => {
                                window.app?.showModal('user-profile');
                                setUserMenuOpen(false);
                            },
                            className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center'
                        }, [
                            React.createElement('i', {
                                key: 'icon',
                                className: 'fas fa-user w-4 text-center mr-3 text-gray-400'
                            }),
                            React.createElement('span', {
                                key: 'label'
                            }, 'Profile')
                        ]),

                        React.createElement('button', {
                            key: 'preferences',
                            onClick: () => {
                                window.app?.showModal('user-preferences');
                                setUserMenuOpen(false);
                            },
                            className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center'
                        }, [
                            React.createElement('i', {
                                key: 'icon',
                                className: 'fas fa-cog w-4 text-center mr-3 text-gray-400'
                            }),
                            React.createElement('span', {
                                key: 'label'
                            }, 'Preferences')
                        ]),

                        React.createElement('div', {
                            key: 'divider',
                            className: 'border-t border-gray-200 my-1'
                        }),

                        React.createElement('button', {
                            key: 'logout',
                            onClick: () => {
                                auth.logout();
                                setUserMenuOpen(false);
                            },
                            className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center'
                        }, [
                            React.createElement('i', {
                                key: 'icon',
                                className: 'fas fa-sign-out-alt w-4 text-center mr-3 text-gray-400'
                            }),
                            React.createElement('span', {
                                key: 'label'
                            }, 'Sign Out')
                        ])
                    ])
                ])
            ])
        ])
    );
}

window.TopBar = TopBar;
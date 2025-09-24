// Sidebar Navigation Component

const { useState, useEffect } = React;

function Sidebar({ open, collapsed, currentModule, onModuleChange, onClose, onToggleCollapse }) {
    const auth = useAuth();
    const [expandedGroups, setExpandedGroups] = useState({});

    // Navigation structure with permissions
    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'fas fa-tachometer-alt',
            module: 'dashboard',
            permission: null // Available to all authenticated users
        },
        {
            id: 'portfolio',
            label: 'Portfolio',
            icon: 'fas fa-box-open',
            module: 'portfolio',
            permission: ['products', 'view'],
            badge: () => getProductCount()
        },
        {
            id: 'concept-builder',
            label: 'Concept Builder',
            icon: 'fas fa-lightbulb',
            module: 'concept-builder',
            permission: ['products', 'create'],
            subItems: [
                {
                    id: 'concept-forward',
                    label: 'Forward Mode',
                    icon: 'fas fa-arrow-right',
                    module: 'concept-forward'
                },
                {
                    id: 'concept-reverse',
                    label: 'Reverse Mode',
                    icon: 'fas fa-arrow-left',
                    module: 'concept-reverse'
                }
            ]
        },
        {
            id: 'formulas',
            label: 'Formulas',
            icon: 'fas fa-flask',
            module: 'formulas',
            permission: ['formulas', 'view'],
            badge: () => getFormulaCount()
        },
        {
            id: 'vendors',
            label: 'Vendors',
            icon: 'fas fa-handshake',
            module: 'vendors',
            permission: ['vendors', 'view'],
            subItems: [
                {
                    id: 'vendor-list',
                    label: 'All Vendors',
                    icon: 'fas fa-list',
                    module: 'vendors'
                },
                {
                    id: 'vendor-evaluation',
                    label: 'Evaluation',
                    icon: 'fas fa-star',
                    module: 'vendor-evaluation'
                }
            ]
        },
        {
            id: 'packaging',
            label: 'Packaging',
            icon: 'fas fa-cube',
            module: 'packaging',
            permission: ['packaging', 'view']
        },
        {
            id: 'finance',
            label: 'Finance',
            icon: 'fas fa-chart-line',
            module: 'finance',
            permission: ['costs', 'view'],
            subItems: [
                {
                    id: 'cost-modeling',
                    label: 'Cost Modeling',
                    icon: 'fas fa-calculator',
                    module: 'cost-modeling'
                },
                {
                    id: 'projections',
                    label: 'Projections',
                    icon: 'fas fa-chart-area',
                    module: 'projections'
                }
            ]
        },
        {
            id: 'fulfillment',
            label: 'Fulfillment',
            icon: 'fas fa-truck',
            module: 'fulfillment',
            permission: ['fulfillment', 'view'],
            subItems: [
                {
                    id: 'fulfillment-partners',
                    label: 'Partners',
                    icon: 'fas fa-warehouse',
                    module: 'fulfillment-partners'
                },
                {
                    id: 'fulfillment-rules',
                    label: 'Routing Rules',
                    icon: 'fas fa-route',
                    module: 'fulfillment-rules'
                }
            ]
        },
        {
            id: 'marketing',
            label: 'Marketing',
            icon: 'fas fa-bullhorn',
            module: 'marketing',
            permission: ['marketing', 'view'],
            badge: () => getActiveCampaignCount()
        },
        {
            id: 'compliance',
            label: 'Compliance',
            icon: 'fas fa-shield-alt',
            module: 'compliance',
            permission: ['compliance', 'view'],
            alert: () => getComplianceAlerts()
        },
        {
            id: 'testing',
            label: 'Testing',
            icon: 'fas fa-vial',
            module: 'testing',
            permission: ['testing', 'view']
        },
        {
            id: 'ai-insights',
            label: 'AI Insights',
            icon: 'fas fa-brain',
            module: 'ai-insights',
            permission: ['ai_insights', 'view'],
            badge: () => getPendingInsightsCount()
        }
    ];

    const adminItems = [
        {
            id: 'users',
            label: 'Users',
            icon: 'fas fa-users',
            module: 'users',
            permission: ['users', 'view']
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'fas fa-cog',
            module: 'settings',
            permission: ['settings', 'view']
        }
    ];

    // Filter navigation items based on permissions
    const getVisibleItems = (items) => {
        return items.filter(item => {
            if (!item.permission) return true;
            return auth.hasPermission(item.permission[0], item.permission[1]);
        });
    };

    const visibleNavItems = getVisibleItems(navigationItems);
    const visibleAdminItems = getVisibleItems(adminItems);

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const handleItemClick = (module, subModule = null) => {
        onModuleChange(module, subModule);
        onClose(); // Close sidebar on mobile
    };

    // Helper functions for badges and alerts
    function getProductCount() {
        // This would be connected to actual data
        return 12;
    }

    function getFormulaCount() {
        return 8;
    }

    function getActiveCampaignCount() {
        return 3;
    }

    function getComplianceAlerts() {
        return 2; // Number of compliance issues
    }

    function getPendingInsightsCount() {
        return 5;
    }

    const renderNavItem = (item) => {
        const isActive = currentModule === item.module;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedGroups[item.id];
        const badge = item.badge ? item.badge() : null;
        const alert = item.alert ? item.alert() : null;

        return React.createElement('div', {
            key: item.id,
            className: 'nav-group'
        }, [
            // Main nav item
            React.createElement('div', {
                key: 'main',
                className: `nav-item ${isActive && !hasSubItems ? 'active' : ''}`,
                onClick: hasSubItems ? 
                    () => toggleGroup(item.id) : 
                    () => handleItemClick(item.module)
            }, [
                React.createElement('div', {
                    key: 'content',
                    className: 'flex items-center flex-1'
                }, [
                    React.createElement('i', {
                        key: 'icon',
                        className: `${item.icon} w-5 text-center mr-3 ${collapsed ? '' : 'lg:mr-3'}`
                    }),
                    !collapsed && React.createElement('span', {
                        key: 'label',
                        className: 'font-medium'
                    }, item.label)
                ]),

                // Badges and alerts
                !collapsed && React.createElement('div', {
                    key: 'indicators',
                    className: 'flex items-center space-x-1'
                }, [
                    badge && React.createElement('span', {
                        key: 'badge',
                        className: 'bg-pristine-100 text-pristine-700 text-xs px-2 py-0.5 rounded-full'
                    }, badge),
                    alert && React.createElement('span', {
                        key: 'alert',
                        className: 'bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full'
                    }, alert),
                    hasSubItems && React.createElement('i', {
                        key: 'expand',
                        className: `fas fa-chevron-${isExpanded ? 'down' : 'right'} text-xs text-gray-400 transition-transform`
                    })
                ])
            ]),

            // Sub items
            hasSubItems && isExpanded && !collapsed && React.createElement('div', {
                key: 'subitems',
                className: 'ml-8 mt-1 space-y-1'
            },
                item.subItems.map(subItem => {
                    const isSubActive = currentModule === subItem.module;
                    return React.createElement('div', {
                        key: subItem.id,
                        className: `nav-item text-sm ${isSubActive ? 'active' : ''}`,
                        onClick: () => handleItemClick(subItem.module)
                    }, [
                        React.createElement('i', {
                            key: 'icon',
                            className: `${subItem.icon} w-4 text-center mr-3`
                        }),
                        React.createElement('span', {
                            key: 'label'
                        }, subItem.label)
                    ]);
                })
            )
        ]);
    };

    return React.createElement('div', {
        className: `sidebar ${open ? 'mobile-open' : 'mobile-hidden'} ${collapsed ? 'collapsed' : ''} bg-white border-r border-gray-200 shadow-sm`
    }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'p-4 border-b border-gray-200'
        }, [
            React.createElement('div', {
                key: 'logo',
                className: 'flex items-center justify-between'
            }, [
                React.createElement('div', {
                    key: 'brand',
                    className: 'flex items-center'
                }, [
                    React.createElement('div', {
                        key: 'icon',
                        className: 'w-8 h-8 bg-pristine-500 rounded-lg flex items-center justify-center mr-3'
                    },
                        React.createElement('i', {
                            className: 'fas fa-flask text-white text-sm'
                        })
                    ),
                    !collapsed && React.createElement('div', {
                        key: 'text',
                        className: 'hidden lg:block'
                    }, [
                        React.createElement('h1', {
                            key: 'title',
                            className: 'font-bold text-gray-900 text-sm'
                        }, 'Pristine'),
                        React.createElement('p', {
                            key: 'subtitle',
                            className: 'text-xs text-gray-500'
                        }, 'Portfolio Tool')
                    ])
                ]),
                
                // Collapse toggle (desktop only)
                React.createElement('button', {
                    key: 'collapse',
                    onClick: onToggleCollapse,
                    className: 'hidden lg:block p-1 hover:bg-gray-100 rounded'
                },
                    React.createElement('i', {
                        className: `fas fa-chevron-${collapsed ? 'right' : 'left'} text-gray-400 text-sm`
                    })
                )
            ])
        ]),

        // Navigation
        React.createElement('div', {
            key: 'navigation',
            className: 'flex-1 overflow-y-auto p-4'
        }, [
            // Main navigation
            React.createElement('nav', {
                key: 'main-nav',
                className: 'space-y-1'
            },
                visibleNavItems.map(renderNavItem)
            ),

            // Admin section (if user has admin permissions)
            visibleAdminItems.length > 0 && React.createElement('div', {
                key: 'admin-section',
                className: 'mt-8 pt-4 border-t border-gray-200'
            }, [
                !collapsed && React.createElement('h3', {
                    key: 'admin-title',
                    className: 'text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'
                }, 'Administration'),
                React.createElement('nav', {
                    key: 'admin-nav',
                    className: 'space-y-1'
                },
                    visibleAdminItems.map(renderNavItem)
                )
            ])
        ]),

        // User info and logout
        React.createElement('div', {
            key: 'user-section',
            className: 'p-4 border-t border-gray-200'
        }, [
            React.createElement('div', {
                key: 'user-info',
                className: 'flex items-center'
            }, [
                React.createElement('div', {
                    key: 'avatar',
                    className: 'w-8 h-8 bg-pristine-500 rounded-full flex items-center justify-center mr-3'
                },
                    React.createElement('span', {
                        className: 'text-white text-sm font-medium'
                    }, auth.user?.name?.charAt(0) || 'U')
                ),
                !collapsed && React.createElement('div', {
                    key: 'details',
                    className: 'flex-1 min-w-0'
                }, [
                    React.createElement('p', {
                        key: 'name',
                        className: 'text-sm font-medium text-gray-900 truncate'
                    }, auth.user?.name || 'User'),
                    React.createElement('p', {
                        key: 'role',
                        className: 'text-xs text-gray-500 capitalize'
                    }, auth.user?.role || 'viewer')
                ]),
                React.createElement('button', {
                    key: 'logout',
                    onClick: auth.logout,
                    className: 'p-1 text-gray-400 hover:text-gray-600',
                    title: 'Logout'
                },
                    React.createElement('i', {
                        className: 'fas fa-sign-out-alt'
                    })
                )
            ])
        ])
    ]);
}

window.Sidebar = Sidebar;
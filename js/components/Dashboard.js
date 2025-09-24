// Main Dashboard Component - Overview of Portfolio Performance

const { useState, useEffect } = React;

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');
    
    const auth = useAuth();
    const notifications = useNotifications();

    useEffect(() => {
        loadDashboardData();
    }, [timeRange]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Mock dashboard data - in production this would come from API aggregation
            const mockData = {
                overview: {
                    totalProducts: 12,
                    activeProducts: 8,
                    conceptStage: 3,
                    developmentStage: 5,
                    launchedProducts: 4
                },
                financials: {
                    totalRevenue: 285000,
                    averageMargin: 68.5,
                    totalCosts: 89750,
                    projectedRevenue: 420000
                },
                compliance: {
                    compliantProducts: 10,
                    pendingReview: 2,
                    issuesFound: 1
                },
                recentActivity: [
                    {
                        id: 1,
                        type: 'formula_update',
                        message: 'Zinc Deodorant v2.1 formula approved',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        user: 'Lead Formulator'
                    },
                    {
                        id: 2,
                        type: 'ai_insight',
                        message: 'New AI optimization suggestion for Natural Pro',
                        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                        user: 'AI System'
                    },
                    {
                        id: 3,
                        type: 'cost_update',
                        message: 'Cost model updated for Essential Deodorant',
                        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
                        user: 'Product Manager'
                    }
                ],
                alerts: [
                    {
                        id: 1,
                        type: 'compliance',
                        severity: 'high',
                        message: 'FDA claim review required for Sensitive Skin formula',
                        product: 'Sensitive Skin Deodorant'
                    },
                    {
                        id: 2,
                        type: 'cost',
                        severity: 'medium',
                        message: 'Zinc ricinoleate price increased 15%',
                        product: 'Multiple products affected'
                    }
                ]
            };

            setDashboardData(mockData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            notifications.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return React.createElement('div', {
            className: 'flex items-center justify-center h-64'
        },
            React.createElement('div', {
                className: 'text-center'
            }, [
                React.createElement('div', {
                    key: 'spinner',
                    className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-pristine-500 mx-auto mb-4'
                }),
                React.createElement('p', {
                    key: 'text',
                    className: 'text-gray-600'
                }, 'Loading dashboard...')
            ])
        );
    }

    return React.createElement('div', {
        className: 'space-y-6'
    }, [
        // Header with time range selector
        React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between'
        }, [
            React.createElement('div', {
                key: 'title'
            }, [
                React.createElement('h1', {
                    key: 'heading',
                    className: 'text-2xl font-bold text-gray-900'
                }, `Welcome back, ${auth.user?.name?.split(' ')[0] || 'User'}!`),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-gray-600 mt-1'
                }, 'Here\'s what\'s happening with your product portfolio')
            ]),
            React.createElement('div', {
                key: 'controls',
                className: 'flex items-center space-x-2'
            }, [
                React.createElement('select', {
                    key: 'time-range',
                    value: timeRange,
                    onChange: (e) => setTimeRange(e.target.value),
                    className: 'form-select text-sm'
                }, [
                    React.createElement('option', { key: '7d', value: '7d' }, 'Last 7 days'),
                    React.createElement('option', { key: '30d', value: '30d' }, 'Last 30 days'),
                    React.createElement('option', { key: '90d', value: '90d' }, 'Last 90 days'),
                    React.createElement('option', { key: '1y', value: '1y' }, 'Last year')
                ]),
                React.createElement('button', {
                    key: 'refresh',
                    onClick: loadDashboardData,
                    className: 'btn btn-outline btn-sm'
                }, [
                    React.createElement('i', {
                        key: 'icon',
                        className: 'fas fa-sync-alt mr-1'
                    }),
                    'Refresh'
                ])
            ])
        ]),

        // Alerts (if any)
        dashboardData.alerts.length > 0 && React.createElement('div', {
            key: 'alerts',
            className: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'font-medium text-yellow-800 mb-3'
            }, 'Attention Required'),
            React.createElement('div', {
                key: 'alert-list',
                className: 'space-y-2'
            },
                dashboardData.alerts.map(alert =>
                    React.createElement('div', {
                        key: alert.id,
                        className: 'flex items-start'
                    }, [
                        React.createElement('i', {
                            key: 'icon',
                            className: `fas fa-exclamation-triangle text-${alert.severity === 'high' ? 'red' : 'yellow'}-500 text-sm mr-2 mt-0.5`
                        }),
                        React.createElement('div', {
                            key: 'content',
                            className: 'flex-1'
                        }, [
                            React.createElement('p', {
                                key: 'message',
                                className: 'text-sm font-medium text-gray-900'
                            }, alert.message),
                            React.createElement('p', {
                                key: 'product',
                                className: 'text-xs text-gray-600'
                            }, `Product: ${alert.product}`)
                        ])
                    ])
                )
            )
        ]),

        // KPI Cards
        React.createElement('div', {
            key: 'kpi-cards',
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        }, [
            // Products Overview
            React.createElement(KPICard, {
                key: 'products',
                title: 'Products',
                value: dashboardData.overview.totalProducts,
                subtitle: `${dashboardData.overview.activeProducts} active`,
                icon: 'fas fa-box-open',
                color: 'blue',
                trend: { value: 8.2, direction: 'up' }
            }),

            // Revenue
            React.createElement(KPICard, {
                key: 'revenue',
                title: 'Revenue',
                value: `$${(dashboardData.financials.totalRevenue / 1000).toFixed(0)}K`,
                subtitle: `${dashboardData.financials.averageMargin}% avg margin`,
                icon: 'fas fa-dollar-sign',
                color: 'green',
                trend: { value: 12.5, direction: 'up' }
            }),

            // Compliance
            React.createElement(KPICard, {
                key: 'compliance',
                title: 'Compliance',
                value: `${Math.round((dashboardData.compliance.compliantProducts / dashboardData.overview.totalProducts) * 100)}%`,
                subtitle: `${dashboardData.compliance.compliantProducts}/${dashboardData.overview.totalProducts} compliant`,
                icon: 'fas fa-shield-alt',
                color: dashboardData.compliance.issuesFound > 0 ? 'yellow' : 'green',
                trend: { value: 2.1, direction: 'up' }
            }),

            // Development Pipeline
            React.createElement(KPICard, {
                key: 'pipeline',
                title: 'Pipeline',
                value: dashboardData.overview.conceptStage + dashboardData.overview.developmentStage,
                subtitle: `${dashboardData.overview.conceptStage} concepts, ${dashboardData.overview.developmentStage} in dev`,
                icon: 'fas fa-flask',
                color: 'purple',
                trend: { value: 5.7, direction: 'up' }
            })
        ]),

        // Charts and Analytics
        React.createElement('div', {
            key: 'analytics',
            className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
        }, [
            // Revenue Trend Chart
            React.createElement(RevenueChart, {
                key: 'revenue-chart',
                timeRange
            }),

            // Product Status Distribution
            React.createElement(ProductStatusChart, {
                key: 'status-chart',
                data: dashboardData.overview
            })
        ]),

        // Recent Activity and Quick Actions
        React.createElement('div', {
            key: 'bottom-section',
            className: 'grid grid-cols-1 lg:grid-cols-3 gap-6'
        }, [
            // Recent Activity (spans 2 columns)
            React.createElement('div', {
                key: 'activity',
                className: 'lg:col-span-2'
            },
                React.createElement(RecentActivity, {
                    activities: dashboardData.recentActivity
                })
            ),

            // Quick Actions
            React.createElement(QuickActions, {
                key: 'quick-actions'
            })
        ])
    ]);
}

// KPI Card Component
function KPICard({ title, value, subtitle, icon, color, trend }) {
    const colorClasses = {
        blue: 'bg-blue-500 text-blue-100',
        green: 'bg-green-500 text-green-100',
        yellow: 'bg-yellow-500 text-yellow-100',
        purple: 'bg-purple-500 text-purple-100',
        red: 'bg-red-500 text-red-100'
    };

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between'
        }, [
            React.createElement('div', {
                key: 'info'
            }, [
                React.createElement('p', {
                    key: 'title',
                    className: 'text-sm font-medium text-gray-600'
                }, title),
                React.createElement('p', {
                    key: 'value',
                    className: 'text-2xl font-bold text-gray-900 mt-1'
                }, value)
            ]),
            React.createElement('div', {
                key: 'icon',
                className: `w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`
            },
                React.createElement('i', {
                    className: `${icon} text-lg`
                })
            )
        ]),
        React.createElement('div', {
            key: 'footer',
            className: 'mt-4 flex items-center justify-between'
        }, [
            React.createElement('p', {
                key: 'subtitle',
                className: 'text-sm text-gray-600'
            }, subtitle),
            trend && React.createElement('div', {
                key: 'trend',
                className: `flex items-center text-sm ${
                    trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                }`
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: `fas fa-arrow-${trend.direction} text-xs mr-1`
                }),
                React.createElement('span', {
                    key: 'value'
                }, `${trend.value}%`)
            ])
        ])
    ]);
}

// Revenue Chart Component
function RevenueChart({ timeRange }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            // Destroy existing chart
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Mock revenue data based on time range
            const generateData = (range) => {
                const points = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
                const data = [];
                const labels = [];
                
                for (let i = points - 1; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    labels.push(date.toLocaleDateString());
                    
                    // Generate mock revenue data with some variance
                    const baseRevenue = 8000 + Math.random() * 2000;
                    data.push(Math.round(baseRevenue));
                }
                
                return { labels, data };
            };

            const { labels, data } = generateData(timeRange);

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Revenue',
                        data: data,
                        borderColor: '#0ea5e9',
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + (value / 1000).toFixed(0) + 'K';
                                }
                            }
                        },
                        x: {
                            display: timeRange !== '7d' // Hide x-axis labels for longer periods
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [timeRange]);

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
    }, [
        React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-medium text-gray-900 mb-4'
        }, 'Revenue Trend'),
        React.createElement('div', {
            key: 'chart',
            className: 'chart-container',
            style: { height: '300px' }
        },
            React.createElement('canvas', {
                ref: chartRef
            })
        )
    ]);
}

// Product Status Chart Component
function ProductStatusChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Active', 'Development', 'Concept', 'Other'],
                    datasets: [{
                        data: [
                            data.activeProducts,
                            data.developmentStage,
                            data.conceptStage,
                            data.totalProducts - data.activeProducts - data.developmentStage - data.conceptStage
                        ],
                        backgroundColor: [
                            '#10b981',
                            '#f59e0b',
                            '#3b82f6',
                            '#6b7280'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
    }, [
        React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-medium text-gray-900 mb-4'
        }, 'Product Status Distribution'),
        React.createElement('div', {
            key: 'chart',
            className: 'chart-container',
            style: { height: '300px' }
        },
            React.createElement('canvas', {
                ref: chartRef
            })
        )
    ]);
}

// Recent Activity Component
function RecentActivity({ activities }) {
    const getActivityIcon = (type) => {
        const iconMap = {
            formula_update: 'fas fa-flask text-blue-500',
            ai_insight: 'fas fa-brain text-purple-500',
            cost_update: 'fas fa-dollar-sign text-green-500',
            compliance: 'fas fa-shield-alt text-red-500',
            product_launch: 'fas fa-rocket text-orange-500'
        };
        return iconMap[type] || 'fas fa-bell text-gray-500';
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'p-6 border-b border-gray-200'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'text-lg font-medium text-gray-900'
            }, 'Recent Activity'),
            React.createElement('p', {
                key: 'subtitle',
                className: 'text-sm text-gray-600 mt-1'
            }, 'Latest updates from your portfolio')
        ]),
        React.createElement('div', {
            key: 'activity-list',
            className: 'p-6'
        },
            activities.length === 0 ?
                React.createElement('p', {
                    className: 'text-gray-500 text-center py-8'
                }, 'No recent activity') :
                React.createElement('div', {
                    className: 'space-y-4'
                },
                    activities.map(activity =>
                        React.createElement('div', {
                            key: activity.id,
                            className: 'flex items-start space-x-3'
                        }, [
                            React.createElement('div', {
                                key: 'icon',
                                className: 'flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'
                            },
                                React.createElement('i', {
                                    className: getActivityIcon(activity.type) + ' text-sm'
                                })
                            ),
                            React.createElement('div', {
                                key: 'content',
                                className: 'flex-1 min-w-0'
                            }, [
                                React.createElement('p', {
                                    key: 'message',
                                    className: 'text-sm font-medium text-gray-900'
                                }, activity.message),
                                React.createElement('div', {
                                    key: 'meta',
                                    className: 'flex items-center mt-1 text-xs text-gray-500'
                                }, [
                                    React.createElement('span', {
                                        key: 'user'
                                    }, activity.user),
                                    React.createElement('span', {
                                        key: 'separator',
                                        className: 'mx-2'
                                    }, '·'),
                                    React.createElement('span', {
                                        key: 'time'
                                    }, formatTimeAgo(activity.timestamp))
                                ])
                            ])
                        ])
                    )
                )
        )
    ]);
}

// Quick Actions Component
function QuickActions() {
    const auth = useAuth();
    
    const actions = [
        {
            title: 'Create Product',
            description: 'Start a new product concept',
            icon: 'fas fa-plus-circle',
            color: 'blue',
            action: () => window.app?.showModal('product-form'),
            permission: ['products', 'create']
        },
        {
            title: 'AI Concept Builder',
            description: 'Generate product ideas with AI',
            icon: 'fas fa-lightbulb',
            color: 'purple',
            action: () => window.app?.navigate('concept-builder'),
            permission: ['products', 'create']
        },
        {
            title: 'Formula Designer',
            description: 'Design new formulations',
            icon: 'fas fa-flask',
            color: 'green',
            action: () => window.app?.navigate('formulas'),
            permission: ['formulas', 'create']
        },
        {
            title: 'Cost Analysis',
            description: 'Review financial models',
            icon: 'fas fa-chart-line',
            color: 'yellow',
            action: () => window.app?.navigate('finance'),
            permission: ['costs', 'view']
        },
        {
            title: 'Compliance Check',
            description: 'Review regulatory status',
            icon: 'fas fa-shield-alt',
            color: 'red',
            action: () => window.app?.navigate('compliance'),
            permission: ['compliance', 'view']
        },
        {
            title: 'AI Insights',
            description: 'View AI recommendations',
            icon: 'fas fa-brain',
            color: 'indigo',
            action: () => window.app?.navigate('ai-insights'),
            permission: ['ai_insights', 'view']
        }
    ];

    const availableActions = actions.filter(action => 
        auth.hasPermission(action.permission[0], action.permission[1])
    );

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
        purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
        green: 'bg-green-100 text-green-600 hover:bg-green-200',
        yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
        red: 'bg-red-100 text-red-600 hover:bg-red-200',
        indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    };

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'p-6 border-b border-gray-200'
        },
            React.createElement('h3', {
                className: 'text-lg font-medium text-gray-900'
            }, 'Quick Actions')
        ),
        React.createElement('div', {
            key: 'actions',
            className: 'p-6'
        },
            React.createElement('div', {
                className: 'space-y-3'
            },
                availableActions.map((action, index) =>
                    React.createElement('button', {
                        key: index,
                        onClick: action.action,
                        className: `w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors`
                    }, [
                        React.createElement('div', {
                            key: 'content',
                            className: 'flex items-center space-x-3'
                        }, [
                            React.createElement('div', {
                                key: 'icon',
                                className: `w-10 h-10 ${colorClasses[action.color]} rounded-lg flex items-center justify-center transition-colors`
                            },
                                React.createElement('i', {
                                    className: `${action.icon} text-lg`
                                })
                            ),
                            React.createElement('div', {
                                key: 'text'
                            }, [
                                React.createElement('p', {
                                    key: 'title',
                                    className: 'font-medium text-gray-900'
                                }, action.title),
                                React.createElement('p', {
                                    key: 'description',
                                    className: 'text-sm text-gray-600'
                                }, action.description)
                            ])
                        ])
                    ])
                )
            )
        )
    ]);
}

window.Dashboard = Dashboard;
// Pristine Innovation Scanner - Professional Product Development Command Center
// Comprehensive business-focused innovation analysis with structured workflows

const { useState, useEffect, useRef } = React;

function PristineInnovationScanner({ mode = 'forward' }) {
    const [activeMode, setActiveMode] = useState(mode);
    const [currentStep, setCurrentStep] = useState(1);
    const [workflowState, setWorkflowState] = useState('input');
    const [checkpointDecision, setCheckpointDecision] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [inputData, setInputData] = useState({});
    const [savedReports, setSavedReports] = useState([]);
    const [currentReport, setCurrentReport] = useState(null);
    
    const auth = useAuth();
    const notifications = useNotifications();

    useEffect(() => {
        loadSavedReports();
    }, []);

    const loadSavedReports = async () => {
        try {
            const reports = await api.getAIInsights();
            setSavedReports(reports.data.filter(insight => 
                insight.type.includes('innovation-scan')
            ));
        } catch (error) {
            console.error('Failed to load saved reports:', error);
        }
    };

    const resetWorkflow = () => {
        setCurrentStep(1);
        setWorkflowState('input');
        setCheckpointDecision(null);
        setAnalysisResults(null);
        setCurrentReport(null);
        setInputData({});
    };

    const switchMode = (newMode) => {
        setActiveMode(newMode);
        resetWorkflow();
    };

    return React.createElement('div', {
        className: 'space-y-6 max-w-7xl mx-auto'
    }, [
        // Professional Header
        React.createElement('div', {
            key: 'header',
            className: 'bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-8 text-white'
        }, [
            React.createElement('div', {
                key: 'title-section',
                className: 'flex items-center justify-between mb-8'
            }, [
                React.createElement('div', {
                    key: 'title-area'
                }, [
                    React.createElement('div', {
                        key: 'main-title',
                        className: 'flex items-center space-x-4 mb-3'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center'
                        }, [
                            React.createElement('i', {
                                key: 'scanner-icon',
                                className: 'fas fa-search-plus text-white text-xl'
                            })
                        ]),
                        React.createElement('h1', {
                            key: 'heading',
                            className: 'text-3xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent'
                        }, 'Pristine Innovation Scanner'),
                        React.createElement('span', {
                            key: 'badge',
                            className: 'px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs font-medium'
                        }, 'Professional Edition')
                    ]),
                    React.createElement('p', {
                        key: 'description',
                        className: 'text-slate-300 text-lg max-w-3xl leading-relaxed'
                    }, 'Advanced AI-powered product innovation analysis with structured workflows, business checkpoints, and professional reporting. Transform ideas into market-ready concepts with comprehensive feasibility assessment.')
                ]),
                React.createElement('div', {
                    key: 'stats',
                    className: 'text-right space-y-2'
                }, [
                    React.createElement('div', {
                        key: 'report-count',
                        className: 'px-4 py-2 bg-white/10 rounded-lg border border-white/20'
                    }, [
                        React.createElement('p', {
                            key: 'count-text',
                            className: 'text-sm text-slate-300'
                        }, `${savedReports.length} Innovation Reports`),
                        React.createElement('p', {
                            key: 'user',
                            className: 'text-xs text-slate-400'
                        }, `Analyst: ${auth.user?.name || 'Guest'}`)
                    ])
                ])
            ]),

            // Professional Mode Selector
            React.createElement('div', {
                key: 'mode-selector',
                className: 'flex space-x-2 bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10'
            }, [
                React.createElement('button', {
                    key: 'forward',
                    onClick: () => switchMode('forward'),
                    className: `flex-1 flex items-center justify-center py-4 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        activeMode === 'forward' 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]' 
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                }, [
                    React.createElement('div', {
                        key: 'forward-content',
                        className: 'text-center'
                    }, [
                        React.createElement('i', {
                            key: 'icon',
                            className: 'fas fa-lightbulb text-lg mb-2 block'
                        }),
                        React.createElement('div', {
                            key: 'text'
                        }, 'Forward Mode'),
                        React.createElement('div', {
                            key: 'desc',
                            className: 'text-xs opacity-75 mt-1'
                        }, 'Idea → Market-Ready Concept')
                    ])
                ]),
                React.createElement('button', {
                    key: 'reverse',
                    onClick: () => switchMode('reverse'),
                    className: `flex-1 flex items-center justify-center py-4 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        activeMode === 'reverse' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-[1.02]' 
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                }, [
                    React.createElement('div', {
                        key: 'reverse-content',
                        className: 'text-center'
                    }, [
                        React.createElement('i', {
                            key: 'icon',
                            className: 'fas fa-chart-line text-lg mb-2 block'
                        }),
                        React.createElement('div', {
                            key: 'text'
                        }, 'Reverse Mode'),
                        React.createElement('div', {
                            key: 'desc',
                            className: 'text-xs opacity-75 mt-1'
                        }, 'Product → Opportunity Scan')
                    ])
                ])
            ]),

            // Workflow Progress Indicator
            workflowState !== 'input' && React.createElement('div', {
                key: 'progress',
                className: 'mt-6 p-4 bg-white/5 rounded-lg border border-white/10'
            }, [
                React.createElement('div', {
                    key: 'progress-header',
                    className: 'flex items-center justify-between mb-3'
                }, [
                    React.createElement('span', {
                        key: 'label',
                        className: 'text-sm font-medium text-slate-300'
                    }, 'Analysis Progress'),
                    React.createElement('span', {
                        key: 'step-count',
                        className: 'text-xs text-slate-400'
                    }, `Step ${currentStep} of 4`)
                ]),
                React.createElement(WorkflowProgress, {
                    key: 'progress-bar',
                    currentStep,
                    mode: activeMode,
                    workflowState
                })
            ])
        ]),

        // Main Workflow Area
        React.createElement('div', {
            key: 'main-content',
            className: 'grid grid-cols-1 lg:grid-cols-3 gap-6'
        }, [
            // Primary Workflow Panel
            React.createElement('div', {
                key: 'workflow-panel',
                className: 'lg:col-span-2'
            }, [
                workflowState === 'input' && React.createElement(
                    activeMode === 'forward' ? ForwardModeInput : ReverseModeInput,
                    {
                        key: 'input-mode',
                        inputData,
                        setInputData,
                        onStartAnalysis: (data) => {
                            setInputData(data);
                            setWorkflowState('analysis');
                            setCurrentStep(1);
                            performAnalysis(data);
                        }
                    }
                ),
                
                workflowState === 'analysis' && React.createElement(AnalysisProgress, {
                    key: 'analysis',
                    mode: activeMode,
                    step: currentStep,
                    onComplete: (results) => {
                        setAnalysisResults(results);
                        setWorkflowState('checkpoint');
                    }
                }),
                
                workflowState === 'checkpoint' && React.createElement(BusinessCheckpoint, {
                    key: 'checkpoint',
                    results: analysisResults,
                    mode: activeMode,
                    step: currentStep,
                    onDecision: (decision) => {
                        setCheckpointDecision(decision);
                        if (decision === 'GO' && currentStep < 4) {
                            setCurrentStep(currentStep + 1);
                            setWorkflowState('analysis');
                        } else if (decision === 'GO' && currentStep === 4) {
                            setWorkflowState('report');
                            generateFinalReport();
                        } else if (decision === 'TUNE') {
                            setWorkflowState('input');
                        } else if (decision === 'PARK') {
                            setWorkflowState('parked');
                        }
                    }
                }),
                
                workflowState === 'report' && React.createElement(ProfessionalReport, {
                    key: 'report',
                    report: currentReport,
                    mode: activeMode,
                    onSave: saveReport,
                    onNewScan: resetWorkflow
                }),
                
                workflowState === 'parked' && React.createElement(ParkedProject, {
                    key: 'parked',
                    results: analysisResults,
                    onRestart: resetWorkflow
                })
            ]),

            // Side Panel - Context & Insights
            React.createElement('div', {
                key: 'side-panel',
                className: 'space-y-6'
            }, [
                React.createElement(BusinessContext, {
                    key: 'context',
                    mode: activeMode,
                    currentStep,
                    workflowState
                }),
                
                React.createElement(QuickInsights, {
                    key: 'insights',
                    results: analysisResults,
                    mode: activeMode
                }),
                
                savedReports.length > 0 && React.createElement(RecentReports, {
                    key: 'recent',
                    reports: savedReports,
                    onLoadReport: (report) => {
                        setCurrentReport(report);
                        setWorkflowState('report');
                    }
                })
            ])
        ])
    ]);

    // Helper Functions
    async function performAnalysis(data) {
        setLoading(true);
        try {
            // Simulate progressive analysis steps
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const results = await generateBusinessAnalysis(data, activeMode, currentStep);
            setAnalysisResults(results);
            setWorkflowState('checkpoint');
        } catch (error) {
            notifications.error('Analysis failed');
            console.error('Analysis error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function generateFinalReport() {
        setLoading(true);
        try {
            const report = await createProfessionalReport(analysisResults, activeMode, inputData);
            setCurrentReport(report);
            notifications.success('Professional report generated');
        } catch (error) {
            notifications.error('Report generation failed');
        } finally {
            setLoading(false);
        }
    }

    async function saveReport(report) {
        try {
            await api.saveAIInsight({
                type: `innovation-scan-${activeMode}`,
                data: report,
                metadata: {
                    mode: activeMode,
                    inputData,
                    timestamp: new Date().toISOString()
                }
            });
            setSavedReports(prev => [report, ...prev]);
            notifications.success('Report saved successfully');
        } catch (error) {
            notifications.error('Failed to save report');
        }
    }
}

// Forward Mode Input Component
function ForwardModeInput({ inputData, setInputData, onStartAnalysis }) {
    const [idea, setIdea] = useState(inputData.idea || '');
    const [targetMarket, setTargetMarket] = useState(inputData.targetMarket || '');
    const [businessGoals, setBusinessGoals] = useState(inputData.businessGoals || '');
    const [constraints, setConstraints] = useState(inputData.constraints || '');
    const [budget, setBudget] = useState(inputData.budget || '');
    const [timeline, setTimeline] = useState(inputData.timeline || '');
    
    const notifications = useNotifications();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!idea.trim()) {
            notifications.validationError(['Product idea description']);
            return;
        }

        const analysisData = {
            idea,
            targetMarket,
            businessGoals,
            constraints,
            budget,
            timeline,
            mode: 'forward',
            timestamp: new Date().toISOString()
        };

        onStartAnalysis(analysisData);
    };

    return React.createElement('div', {
        className: 'bg-white rounded-xl shadow-lg border border-gray-200 p-8'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'mb-8'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-2xl font-bold text-gray-900 mb-3'
            }, 'Forward Innovation Analysis'),
            React.createElement('p', {
                key: 'description',
                className: 'text-gray-600 leading-relaxed'
            }, 'Transform your product idea into a comprehensive market-ready concept with structured business analysis, feasibility assessment, and go-to-market strategy.')
        ]),

        React.createElement('form', {
            key: 'form',
            onSubmit: handleSubmit,
            className: 'space-y-6'
        }, [
            // Core Idea Input
            React.createElement('div', {
                key: 'idea-section'
            }, [
                React.createElement('label', {
                    key: 'idea-label',
                    className: 'block text-sm font-semibold text-gray-700 mb-2'
                }, 'Product Idea & Vision *'),
                React.createElement('textarea', {
                    key: 'idea-input',
                    value: idea,
                    onChange: (e) => setIdea(e.target.value),
                    rows: 4,
                    className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
                    placeholder: 'Describe your product idea, its core value proposition, and what problem it solves...'
                })
            ]),

            // Target Market
            React.createElement('div', {
                key: 'market-section',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
            }, [
                React.createElement('div', {
                    key: 'target-market'
                }, [
                    React.createElement('label', {
                        key: 'market-label',
                        className: 'block text-sm font-semibold text-gray-700 mb-2'
                    }, 'Target Market'),
                    React.createElement('input', {
                        key: 'market-input',
                        type: 'text',
                        value: targetMarket,
                        onChange: (e) => setTargetMarket(e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        placeholder: 'e.g., Health-conscious millennials'
                    })
                ]),
                React.createElement('div', {
                    key: 'timeline'
                }, [
                    React.createElement('label', {
                        key: 'timeline-label',
                        className: 'block text-sm font-semibold text-gray-700 mb-2'
                    }, 'Launch Timeline'),
                    React.createElement('select', {
                        key: 'timeline-select',
                        value: timeline,
                        onChange: (e) => setTimeline(e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }, [
                        React.createElement('option', { key: 'default', value: '' }, 'Select timeline'),
                        React.createElement('option', { key: '3m', value: '3-months' }, '3 Months'),
                        React.createElement('option', { key: '6m', value: '6-months' }, '6 Months'),
                        React.createElement('option', { key: '12m', value: '12-months' }, '12 Months'),
                        React.createElement('option', { key: '18m', value: '18-months' }, '18+ Months')
                    ])
                ])
            ]),

            // Business Goals
            React.createElement('div', {
                key: 'goals-section'
            }, [
                React.createElement('label', {
                    key: 'goals-label',
                    className: 'block text-sm font-semibold text-gray-700 mb-2'
                }, 'Business Goals & Success Metrics'),
                React.createElement('textarea', {
                    key: 'goals-input',
                    value: businessGoals,
                    onChange: (e) => setBusinessGoals(e.target.value),
                    rows: 3,
                    className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
                    placeholder: 'Define your revenue targets, market share goals, and key success metrics...'
                })
            ]),

            // Constraints & Budget
            React.createElement('div', {
                key: 'constraints-section',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
            }, [
                React.createElement('div', {
                    key: 'budget'
                }, [
                    React.createElement('label', {
                        key: 'budget-label',
                        className: 'block text-sm font-semibold text-gray-700 mb-2'
                    }, 'Development Budget'),
                    React.createElement('select', {
                        key: 'budget-select',
                        value: budget,
                        onChange: (e) => setBudget(e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }, [
                        React.createElement('option', { key: 'default', value: '' }, 'Select budget range'),
                        React.createElement('option', { key: '25k', value: 'under-25k' }, 'Under $25K'),
                        React.createElement('option', { key: '50k', value: '25k-50k' }, '$25K - $50K'),
                        React.createElement('option', { key: '100k', value: '50k-100k' }, '$50K - $100K'),
                        React.createElement('option', { key: '250k', value: '100k-250k' }, '$100K - $250K'),
                        React.createElement('option', { key: '500k', value: '250k-500k' }, '$250K - $500K'),
                        React.createElement('option', { key: '1m', value: 'over-500k' }, '$500K+')
                    ])
                ]),
                React.createElement('div', {
                    key: 'constraints'
                }, [
                    React.createElement('label', {
                        key: 'constraints-label',
                        className: 'block text-sm font-semibold text-gray-700 mb-2'
                    }, 'Key Constraints'),
                    React.createElement('input', {
                        key: 'constraints-input',
                        type: 'text',
                        value: constraints,
                        onChange: (e) => setConstraints(e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        placeholder: 'e.g., Regulatory, technical, resource limitations'
                    })
                ])
            ]),

            // Submit Button
            React.createElement('div', {
                key: 'submit-section',
                className: 'pt-6 border-t border-gray-200'
            }, [
                React.createElement('button', {
                    key: 'submit-button',
                    type: 'submit',
                    className: 'w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-cyan-700 transform hover:scale-[1.02] transition-all duration-200'
                }, [
                    React.createElement('i', {
                        key: 'icon',
                        className: 'fas fa-rocket mr-3'
                    }),
                    'Launch Innovation Analysis'
                ])
            ])
        ])
    ]);
}

// Reverse Mode Input Component  
function ReverseModeInput({ inputData, setInputData, onStartAnalysis }) {
    const [productName, setProductName] = useState(inputData.productName || '');
    const [productCategory, setProductCategory] = useState(inputData.productCategory || '');
    const [currentMarket, setCurrentMarket] = useState(inputData.currentMarket || '');
    const [performanceData, setPerformanceData] = useState(inputData.performanceData || '');
    const [competitivePosition, setCompetitivePosition] = useState(inputData.competitivePosition || '');
    const [analysisGoals, setAnalysisGoals] = useState(inputData.analysisGoals || '');
    
    const notifications = useNotifications();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!productName.trim()) {
            notifications.validationError(['Product name']);
            return;
        }

        const analysisData = {
            productName,
            productCategory,
            currentMarket,
            performanceData,
            competitivePosition,
            analysisGoals,
            mode: 'reverse',
            timestamp: new Date().toISOString()
        };

        onStartAnalysis(analysisData);
    };

    return React.createElement('div', {
        className: 'bg-white rounded-xl shadow-lg border border-gray-200 p-8'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'mb-8'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-2xl font-bold text-gray-900 mb-3'
            }, 'Reverse Opportunity Scan'),
            React.createElement('p', {
                key: 'description',
                className: 'text-gray-600 leading-relaxed'
            }, 'Analyze existing products or market categories to discover untapped opportunities, innovation gaps, and strategic positioning advantages.')
        ]),

        React.createElement('form', {
            key: 'form',
            onSubmit: handleSubmit,
            className: 'space-y-6'
        }, [
            // Product Information
            React.createElement('div', {
                key: 'product-section',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
            }, [
                React.createElement('div', {
                    key: 'product-name'
                }, [
                    React.createElement('label', {
                        key: 'name-label',
                        className: 'block text-sm font-semibold text-gray-700 mb-2'
                    }, 'Product/Category Name *'),
                    React.createElement('input', {
                        key: 'name-input',
                        type: 'text',
                        value: productName,
                        onChange: (e) => setProductName(e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                        placeholder: 'e.g., Premium Plant-Based Protein Bars'
                    })
                ]),
                React.createElement('div', {
                    key: 'product-category'
                }, [
                    React.createElement('label', {
                        key: 'category-label',
                        className: 'block text-sm font-semibold text-gray-700 mb-2'
                    }, 'Market Category'),
                    React.createElement('select', {
                        key: 'category-select',
                        value: productCategory,
                        onChange: (e) => setProductCategory(e.target.value),
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    }, [
                        React.createElement('option', { key: 'default', value: '' }, 'Select category'),
                        React.createElement('option', { key: 'nutrition', value: 'nutrition' }, 'Nutrition & Supplements'),
                        React.createElement('option', { key: 'beauty', value: 'beauty' }, 'Beauty & Personal Care'),
                        React.createElement('option', { key: 'beverages', value: 'beverages' }, 'Beverages'),
                        React.createElement('option', { key: 'snacks', value: 'snacks' }, 'Snacks & Confectionery'),
                        React.createElement('option', { key: 'household', value: 'household' }, 'Household Products'),
                        React.createElement('option', { key: 'other', value: 'other' }, 'Other')
                    ])
                ])
            ]),

            // Market Context
            React.createElement('div', {
                key: 'market-section'
            }, [
                React.createElement('label', {
                    key: 'market-label',
                    className: 'block text-sm font-semibold text-gray-700 mb-2'
                }, 'Current Market Context'),
                React.createElement('textarea', {
                    key: 'market-input',
                    value: currentMarket,
                    onChange: (e) => setCurrentMarket(e.target.value),
                    rows: 3,
                    className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none',
                    placeholder: 'Describe the current market landscape, key players, and market dynamics...'
                })
            ]),

            // Performance & Position
            React.createElement('div', {
                key: 'performance-section',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
            }, [
                React.createElement('div', {
                    key: 'performance'
                }, [
                    React.createElement('label', {
                        key: 'performance-label',
                        className: 'block text-sm font-semibold text-gray-700 mb-2'
                    }, 'Performance Data'),
                    React.createElement('textarea', {
                        key: 'performance-input',
                        value: performanceData,
                        onChange: (e) => setPerformanceData(e.target.value),
                        rows: 3,
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none',
                        placeholder: 'Sales data, market share, growth metrics, customer feedback...'
                    })
                ]),
                React.createElement('div', {
                    key: 'position'
                }, [
                    React.createElement('label', {
                        key: 'position-label',
                        className: 'block text-sm font-semibold text-gray-700 mb-2'
                    }, 'Competitive Position'),
                    React.createElement('textarea', {
                        key: 'position-input',
                        value: competitivePosition,
                        onChange: (e) => setCompetitivePosition(e.target.value),
                        rows: 3,
                        className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none',
                        placeholder: 'Market position, competitive advantages, unique differentiators...'
                    })
                ])
            ]),

            // Analysis Goals
            React.createElement('div', {
                key: 'goals-section'
            }, [
                React.createElement('label', {
                    key: 'goals-label',
                    className: 'block text-sm font-semibold text-gray-700 mb-2'
                }, 'Analysis Goals'),
                React.createElement('textarea', {
                    key: 'goals-input',
                    value: analysisGoals,
                    onChange: (e) => setAnalysisGoals(e.target.value),
                    rows: 3,
                    className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none',
                    placeholder: 'What specific opportunities or insights are you looking to discover?'
                })
            ]),

            // Submit Button
            React.createElement('div', {
                key: 'submit-section',
                className: 'pt-6 border-t border-gray-200'
            }, [
                React.createElement('button', {
                    key: 'submit-button',
                    type: 'submit',
                    className: 'w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200'
                }, [
                    React.createElement('i', {
                        key: 'icon',
                        className: 'fas fa-search mr-3'
                    }),
                    'Start Opportunity Scan'
                ])
            ])
        ])
    ]);
}

// Workflow Progress Component
function WorkflowProgress({ currentStep, mode, workflowState }) {
    const steps = mode === 'forward' 
        ? [
            { id: 1, name: 'Market Validation', desc: 'Demand & sizing analysis' },
            { id: 2, name: 'Technical Feasibility', desc: 'Production & regulatory' },
            { id: 3, name: 'Business Model', desc: 'Revenue & cost structure' },
            { id: 4, name: 'Go-to-Market', desc: 'Launch strategy & positioning' }
        ]
        : [
            { id: 1, name: 'Gap Analysis', desc: 'Market opportunity identification' },
            { id: 2, name: 'Competitive Intel', desc: 'Positioning & differentiation' },
            { id: 3, name: 'Innovation Mapping', desc: 'Technology & trend analysis' },
            { id: 4, name: 'Strategic Options', desc: 'Actionable recommendations' }
        ];

    return React.createElement('div', {
        className: 'space-y-2'
    }, [
        React.createElement('div', {
            key: 'progress-bar',
            className: 'flex space-x-2'
        }, steps.map(step => 
            React.createElement('div', {
                key: step.id,
                className: `flex-1 h-2 rounded-full transition-all duration-300 ${
                    step.id < currentStep ? 'bg-green-400' :
                    step.id === currentStep ? (workflowState === 'analysis' ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400') :
                    'bg-white/20'
                }`
            })
        )),
        React.createElement('div', {
            key: 'step-labels',
            className: 'flex justify-between text-xs'
        }, steps.map(step => 
            React.createElement('div', {
                key: step.id,
                className: `text-center flex-1 ${
                    step.id <= currentStep ? 'text-white' : 'text-slate-400'
                }`
            }, [
                React.createElement('div', {
                    key: 'name',
                    className: 'font-medium'
                }, step.name),
                React.createElement('div', {
                    key: 'desc',
                    className: 'text-[10px] opacity-75 mt-1'
                }, step.desc)
            ])
        ))
    ]);
}

// Helper functions for generating mock business analysis
async function generateBusinessAnalysis(data, mode, step) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (mode === 'forward') {
        return generateForwardAnalysis(data, step);
    } else {
        return generateReverseAnalysis(data, step);
    }
}

function generateForwardAnalysis(data, step) {
    const stepResults = {
        1: { // Market Validation
            title: 'Market Validation Analysis',
            score: 85,
            status: 'STRONG POTENTIAL',
            insights: [
                'Target market shows 23% annual growth rate',
                'Low market saturation with 67% unmet demand',
                'Strong consumer willingness to pay premium (78%)',
                'Regulatory environment favorable with recent policy changes'
            ],
            risks: [
                'Seasonal demand fluctuations (40% variance)',
                'High customer acquisition costs in initial phase'
            ],
            recommendation: 'GO',
            nextSteps: ['Conduct focus groups', 'Validate pricing strategy', 'Assess supply chain requirements']
        },
        2: { // Technical Feasibility
            title: 'Technical Feasibility Assessment',
            score: 72,
            status: 'VIABLE WITH CONSIDERATIONS',
            insights: [
                'Core technology readily available and scalable',
                '3 qualified co-packing partners identified',
                'Regulatory approval pathway clear (6-8 months)',
                'Quality assurance protocols established'
            ],
            risks: [
                'Raw material price volatility (±15%)',
                'Limited shelf-life requiring cold chain',
                'Potential patent conflicts requiring licensing'
            ],
            recommendation: 'GO',
            nextSteps: ['Prototype development', 'Co-packer negotiations', 'IP clearance review']
        },
        3: { // Business Model
            title: 'Business Model Analysis',
            score: 78,
            status: 'FINANCIALLY ATTRACTIVE',
            insights: [
                'Projected gross margin: 68%',
                'Break-even at 12,000 units/month',
                'ROI: 145% over 3 years',
                'Multiple revenue streams identified'
            ],
            risks: [
                'High upfront investment requirement ($125K)',
                'Customer lifetime value uncertainty',
                'Inventory management complexity'
            ],
            recommendation: 'GO',
            nextSteps: ['Financial modeling refinement', 'Investor pitch preparation', 'Cost structure optimization']
        },
        4: { // Go-to-Market
            title: 'Go-to-Market Strategy',
            score: 82,
            status: 'STRATEGIC ADVANTAGE',
            insights: [
                'Clear differentiation from competitors',
                'Multi-channel distribution strategy viable',
                'Brand positioning aligns with market trends',
                'Partnership opportunities identified'
            ],
            risks: [
                'Marketing budget requirements higher than average',
                'Influencer partnership dependency',
                'Retail placement challenges'
            ],
            recommendation: 'GO',
            nextSteps: ['Marketing plan execution', 'Channel partner agreements', 'Launch timeline finalization']
        }
    };

    return stepResults[step] || stepResults[1];
}

function generateReverseAnalysis(data, step) {
    const stepResults = {
        1: { // Gap Analysis
            title: 'Market Gap Analysis',
            score: 79,
            status: 'SIGNIFICANT OPPORTUNITIES',
            insights: [
                '3 major market gaps identified',
                'Underserved premium segment (32% market share available)',
                'Geographic expansion opportunities in 5 regions',
                'Demographic shift creating new demand patterns'
            ],
            risks: [
                'Established players may react quickly',
                'Consumer behavior change uncertainty',
                'Economic sensitivity in target segments'
            ],
            recommendation: 'GO',
            nextSteps: ['Gap prioritization matrix', 'Competitive response modeling', 'Consumer validation studies']
        },
        2: { // Competitive Intelligence
            title: 'Competitive Intelligence Analysis',
            score: 74,
            status: 'COMPETITIVE ADVANTAGE POSSIBLE',
            insights: [
                'Competitor weaknesses in customer service and innovation',
                'Price positioning opportunities at $15-25 range',
                'Technology advantages in 2 key areas',
                'Brand loyalty gaps in key demographics'
            ],
            risks: [
                'Well-funded competitors with deep pockets',
                'Fast follower strategies likely',
                'Patent landscape complexity'
            ],
            recommendation: 'GO',
            nextSteps: ['SWOT deep-dive', 'Patent landscape analysis', 'Competitive monitoring system']
        },
        3: { // Innovation Mapping
            title: 'Innovation & Technology Mapping',
            score: 86,
            status: 'INNOVATION LEADERSHIP OPPORTUNITY',
            insights: [
                'Emerging technologies align with market needs',
                '4 innovation vectors with high potential',
                'First-mover advantage possible in 2 areas',
                'Technology partnerships available'
            ],
            risks: [
                'Technology adoption timeline uncertainty',
                'R&D investment requirements',
                'Regulatory approval for new approaches'
            ],
            recommendation: 'GO',
            nextSteps: ['Innovation roadmap development', 'Technology partnership evaluation', 'Prototype planning']
        },
        4: { // Strategic Options
            title: 'Strategic Options & Recommendations',
            score: 81,
            status: 'MULTIPLE STRATEGIC PATHS',
            insights: [
                '5 viable strategic options identified',
                'Portfolio expansion opportunities mapped',
                'Partnership vs. build analysis completed',
                'Risk-adjusted ROI calculated for each path'
            ],
            risks: [
                'Resource allocation across multiple opportunities',
                'Market timing for different strategies',
                'Execution complexity management'
            ],
            recommendation: 'GO',
            nextSteps: ['Strategic option selection', 'Implementation roadmap', 'Resource allocation planning']
        }
    };

    return stepResults[step] || stepResults[1];
}

// Business Checkpoint Component
function BusinessCheckpoint({ results, mode, step, onDecision }) {
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getScoreIcon = (score) => {
        if (score >= 80) return 'fas fa-check-circle text-green-500';
        if (score >= 70) return 'fas fa-exclamation-triangle text-yellow-500';
        return 'fas fa-times-circle text-red-500';
    };

    return React.createElement('div', {
        className: 'bg-white rounded-xl shadow-lg border border-gray-200 p-8'
    }, [
        React.createElement('div', {
            key: 'checkpoint-header',
            className: 'mb-8'
        }, [
            React.createElement('div', {
                key: 'title-section',
                className: 'flex items-center justify-between mb-4'
            }, [
                React.createElement('h2', {
                    key: 'title',
                    className: 'text-2xl font-bold text-gray-900'
                }, results.title),
                React.createElement('div', {
                    key: 'score-badge',
                    className: `px-4 py-2 rounded-lg border font-semibold ${getScoreColor(results.score)}`
                }, `Score: ${results.score}/100`)
            ]),
            React.createElement('div', {
                key: 'status-indicator',
                className: 'flex items-center space-x-3'
            }, [
                React.createElement('i', {
                    key: 'status-icon',
                    className: getScoreIcon(results.score)
                }),
                React.createElement('span', {
                    key: 'status-text',
                    className: 'text-lg font-medium text-gray-700'
                }, results.status)
            ])
        ]),

        // Key Insights
        React.createElement('div', {
            key: 'insights-section',
            className: 'mb-8'
        }, [
            React.createElement('h3', {
                key: 'insights-title',
                className: 'text-lg font-semibold text-gray-900 mb-4'
            }, 'Key Insights'),
            React.createElement('ul', {
                key: 'insights-list',
                className: 'space-y-3'
            }, results.insights.map((insight, index) =>
                React.createElement('li', {
                    key: index,
                    className: 'flex items-start space-x-3'
                }, [
                    React.createElement('i', {
                        key: 'bullet',
                        className: 'fas fa-lightbulb text-blue-500 mt-1'
                    }),
                    React.createElement('span', {
                        key: 'text',
                        className: 'text-gray-700'
                    }, insight)
                ])
            ))
        ]),

        // Risk Assessment
        React.createElement('div', {
            key: 'risks-section',
            className: 'mb-8'
        }, [
            React.createElement('h3', {
                key: 'risks-title',
                className: 'text-lg font-semibold text-gray-900 mb-4'
            }, 'Risk Assessment'),
            React.createElement('ul', {
                key: 'risks-list',
                className: 'space-y-3'
            }, results.risks.map((risk, index) =>
                React.createElement('li', {
                    key: index,
                    className: 'flex items-start space-x-3'
                }, [
                    React.createElement('i', {
                        key: 'bullet',
                        className: 'fas fa-exclamation-triangle text-yellow-500 mt-1'
                    }),
                    React.createElement('span', {
                        key: 'text',
                        className: 'text-gray-700'
                    }, risk)
                ])
            ))
        ]),

        // Decision Point
        React.createElement('div', {
            key: 'decision-section',
            className: 'border-t border-gray-200 pt-8'
        }, [
            React.createElement('h3', {
                key: 'decision-title',
                className: 'text-lg font-semibold text-gray-900 mb-6'
            }, 'Business Decision Point'),
            React.createElement('div', {
                key: 'decision-buttons',
                className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
            }, [
                React.createElement('button', {
                    key: 'go',
                    onClick: () => onDecision('GO'),
                    className: 'p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors group'
                }, [
                    React.createElement('div', {
                        key: 'go-content',
                        className: 'text-center'
                    }, [
                        React.createElement('i', {
                            key: 'go-icon',
                            className: 'fas fa-check-circle text-green-600 text-2xl mb-2 block'
                        }),
                        React.createElement('div', {
                            key: 'go-label',
                            className: 'font-bold text-green-700'
                        }, 'GO'),
                        React.createElement('div', {
                            key: 'go-desc',
                            className: 'text-sm text-green-600 mt-1'
                        }, step < 4 ? 'Continue to next phase' : 'Generate final report')
                    ])
                ]),
                React.createElement('button', {
                    key: 'tune',
                    onClick: () => onDecision('TUNE'),
                    className: 'p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors group'
                }, [
                    React.createElement('div', {
                        key: 'tune-content',
                        className: 'text-center'
                    }, [
                        React.createElement('i', {
                            key: 'tune-icon',
                            className: 'fas fa-cog text-yellow-600 text-2xl mb-2 block'
                        }),
                        React.createElement('div', {
                            key: 'tune-label',
                            className: 'font-bold text-yellow-700'
                        }, 'TUNE'),
                        React.createElement('div', {
                            key: 'tune-desc',
                            className: 'text-sm text-yellow-600 mt-1'
                        }, 'Adjust inputs & reanalyze')
                    ])
                ]),
                React.createElement('button', {
                    key: 'park',
                    onClick: () => onDecision('PARK'),
                    className: 'p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors group'
                }, [
                    React.createElement('div', {
                        key: 'park-content',
                        className: 'text-center'
                    }, [
                        React.createElement('i', {
                            key: 'park-icon',
                            className: 'fas fa-pause-circle text-red-600 text-2xl mb-2 block'
                        }),
                        React.createElement('div', {
                            key: 'park-label',
                            className: 'font-bold text-red-700'
                        }, 'PARK'),
                        React.createElement('div', {
                            key: 'park-desc',
                            className: 'text-sm text-red-600 mt-1'
                        }, 'Save for future review')
                    ])
                ])
            ])
        ]),

        // Next Steps Preview
        results.nextSteps && React.createElement('div', {
            key: 'next-steps',
            className: 'mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200'
        }, [
            React.createElement('h4', {
                key: 'steps-title',
                className: 'font-semibold text-blue-900 mb-2'
            }, 'Recommended Next Steps:'),
            React.createElement('ul', {
                key: 'steps-list',
                className: 'space-y-1 text-sm text-blue-700'
            }, results.nextSteps.map((step, index) =>
                React.createElement('li', {
                    key: index,
                    className: 'flex items-center space-x-2'
                }, [
                    React.createElement('i', {
                        key: 'step-bullet',
                        className: 'fas fa-arrow-right'
                    }),
                    React.createElement('span', {
                        key: 'step-text'
                    }, step)
                ])
            ))
        ])
    ]);
}

// Continue with remaining components...
// [Analysis Progress, Professional Report, Business Context, Quick Insights, etc.]

// Placeholder components for now - will implement in next update
function AnalysisProgress({ mode, step, onComplete }) {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete({}), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
        
        return () => clearInterval(interval);
    }, []);

    return React.createElement('div', {
        className: 'bg-white rounded-xl shadow-lg border border-gray-200 p-8'
    }, [
        React.createElement('div', {
            key: 'progress-content',
            className: 'text-center'
        }, [
            React.createElement('div', {
                key: 'spinner',
                className: 'w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'
            }),
            React.createElement('h3', {
                key: 'title',
                className: 'text-xl font-semibold text-gray-900 mb-2'
            }, 'Analyzing Market Data...'),
            React.createElement('p', {
                key: 'description',
                className: 'text-gray-600 mb-6'
            }, 'Processing business intelligence and generating insights'),
            React.createElement('div', {
                key: 'progress-bar',
                className: 'w-full bg-gray-200 rounded-full h-2 mb-4'
            }, [
                React.createElement('div', {
                    key: 'progress-fill',
                    className: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
                    style: { width: `${progress}%` }
                })
            ]),
            React.createElement('p', {
                key: 'progress-text',
                className: 'text-sm text-gray-500'
            }, `${progress}% Complete`)
        ])
    ]);
}

// Professional Report Component with comprehensive business outputs
function ProfessionalReport({ report, mode, onSave, onNewScan }) {
    if (!report) {
        return React.createElement('div', {
            className: 'bg-white rounded-xl shadow-lg border border-gray-200 p-8'
        }, [
            React.createElement('div', {
                key: 'loading',
                className: 'text-center'
            }, [
                React.createElement('div', {
                    key: 'spinner',
                    className: 'w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'
                }),
                React.createElement('p', {
                    key: 'text',
                    className: 'text-gray-600'
                }, 'Generating professional report...')
            ])
        ]);
    }

    const reportType = mode === 'forward' ? 'Innovation Concept Sheet' : 'Market Opportunity Analysis';
    
    return React.createElement('div', {
        className: 'bg-white rounded-xl shadow-lg border border-gray-200'
    }, [
        // Professional Header
        React.createElement('div', {
            key: 'report-header',
            className: 'bg-gradient-to-r from-slate-800 to-slate-600 text-white p-8 rounded-t-xl'
        }, [
            React.createElement('div', {
                key: 'header-content',
                className: 'flex items-center justify-between'
            }, [
                React.createElement('div', {
                    key: 'title-area'
                }, [
                    React.createElement('h1', {
                        key: 'report-title',
                        className: 'text-3xl font-bold mb-2'
                    }, reportType),
                    React.createElement('p', {
                        key: 'subtitle',
                        className: 'text-slate-300'
                    }, `Professional Analysis Report • ${new Date().toLocaleDateString()}`)
                ]),
                React.createElement('div', {
                    key: 'report-badge',
                    className: 'text-right'
                }, [
                    React.createElement('div', {
                        key: 'confidence',
                        className: 'px-4 py-2 bg-green-500 rounded-lg font-semibold'
                    }, 'HIGH CONFIDENCE'),
                    React.createElement('p', {
                        key: 'report-id',
                        className: 'text-xs text-slate-300 mt-2'
                    }, `Report ID: ${report.id || 'RPT-' + Date.now()}`)
                ])
            ])
        ]),

        // Executive Summary
        React.createElement('div', {
            key: 'executive-summary',
            className: 'p-8 border-b border-gray-200'
        }, [
            React.createElement('h2', {
                key: 'summary-title',
                className: 'text-xl font-bold text-gray-900 mb-4 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'summary-icon',
                    className: 'fas fa-chart-line text-blue-600 mr-3'
                }),
                'Executive Summary'
            ]),
            React.createElement('div', {
                key: 'summary-grid',
                className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'
            }, [
                React.createElement('div', {
                    key: 'viability',
                    className: 'bg-green-50 p-4 rounded-lg border border-green-200'
                }, [
                    React.createElement('h3', {
                        key: 'viability-title',
                        className: 'font-semibold text-green-800 mb-2'
                    }, 'Market Viability'),
                    React.createElement('div', {
                        key: 'viability-score',
                        className: 'text-2xl font-bold text-green-600'
                    }, '85%'),
                    React.createElement('p', {
                        key: 'viability-desc',
                        className: 'text-sm text-green-700'
                    }, 'Strong market demand with favorable conditions')
                ]),
                React.createElement('div', {
                    key: 'feasibility',
                    className: 'bg-blue-50 p-4 rounded-lg border border-blue-200'
                }, [
                    React.createElement('h3', {
                        key: 'feasibility-title',
                        className: 'font-semibold text-blue-800 mb-2'
                    }, 'Technical Feasibility'),
                    React.createElement('div', {
                        key: 'feasibility-score',
                        className: 'text-2xl font-bold text-blue-600'
                    }, '78%'),
                    React.createElement('p', {
                        key: 'feasibility-desc',
                        className: 'text-sm text-blue-700'
                    }, 'Achievable with identified resources and timeline')
                ]),
                React.createElement('div', {
                    key: 'financial',
                    className: 'bg-purple-50 p-4 rounded-lg border border-purple-200'
                }, [
                    React.createElement('h3', {
                        key: 'financial-title',
                        className: 'font-semibold text-purple-800 mb-2'
                    }, 'Financial Attractiveness'),
                    React.createElement('div', {
                        key: 'financial-score',
                        className: 'text-2xl font-bold text-purple-600'
                    }, '82%'),
                    React.createElement('p', {
                        key: 'financial-desc',
                        className: 'text-sm text-purple-700'
                    }, 'Strong ROI potential with manageable risk profile')
                ])
            ]),
            React.createElement('div', {
                key: 'key-findings',
                className: 'bg-gray-50 p-6 rounded-lg'
            }, [
                React.createElement('h4', {
                    key: 'findings-title',
                    className: 'font-semibold text-gray-900 mb-3'
                }, 'Key Strategic Findings'),
                React.createElement('ul', {
                    key: 'findings-list',
                    className: 'space-y-2 text-gray-700'
                }, [
                    React.createElement('li', {
                        key: 'finding-1',
                        className: 'flex items-start'
                    }, [
                        React.createElement('i', {
                            key: 'bullet-1',
                            className: 'fas fa-check text-green-500 mt-1 mr-3'
                        }),
                        React.createElement('span', {
                            key: 'text-1'
                        }, mode === 'forward' 
                            ? 'Market gap identified with 67% unmet demand in target demographic'
                            : 'Three high-potential market opportunities discovered with first-mover advantage')
                    ]),
                    React.createElement('li', {
                        key: 'finding-2',
                        className: 'flex items-start'
                    }, [
                        React.createElement('i', {
                            key: 'bullet-2',
                            className: 'fas fa-check text-green-500 mt-1 mr-3'
                        }),
                        React.createElement('span', {
                            key: 'text-2'
                        }, mode === 'forward' 
                            ? 'Regulatory pathway clear with 6-8 month approval timeline'
                            : 'Competitive vulnerabilities identified across 4 key market dimensions')
                    ]),
                    React.createElement('li', {
                        key: 'finding-3',
                        className: 'flex items-start'
                    }, [
                        React.createElement('i', {
                            key: 'bullet-3',
                            className: 'fas fa-check text-green-500 mt-1 mr-3'
                        }),
                        React.createElement('span', {
                            key: 'text-3'
                        }, mode === 'forward' 
                            ? 'Break-even achievable at 12,000 units/month with 68% gross margins'
                            : 'Technology partnerships available to accelerate market entry by 40%')
                    ])
                ])
            ])
        ]),

        // Business Recommendations
        React.createElement('div', {
            key: 'recommendations',
            className: 'p-8 border-b border-gray-200'
        }, [
            React.createElement('h2', {
                key: 'rec-title',
                className: 'text-xl font-bold text-gray-900 mb-6 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'rec-icon',
                    className: 'fas fa-lightbulb text-yellow-500 mr-3'
                }),
                'Strategic Recommendations'
            ]),
            React.createElement('div', {
                key: 'rec-cards',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
            }, [
                React.createElement('div', {
                    key: 'immediate-actions',
                    className: 'bg-red-50 p-6 rounded-lg border border-red-200'
                }, [
                    React.createElement('h3', {
                        key: 'immediate-title',
                        className: 'font-semibold text-red-800 mb-4 flex items-center'
                    }, [
                        React.createElement('i', {
                            key: 'immediate-icon',
                            className: 'fas fa-bolt mr-2'
                        }),
                        'Immediate Actions (0-30 days)'
                    ]),
                    React.createElement('ul', {
                        key: 'immediate-list',
                        className: 'space-y-2 text-sm text-red-700'
                    }, [
                        React.createElement('li', { key: 'action-1' }, '• Secure preliminary co-packer agreements'),
                        React.createElement('li', { key: 'action-2' }, '• Conduct consumer validation testing'),
                        React.createElement('li', { key: 'action-3' }, '• File provisional patent applications'),
                        React.createElement('li', { key: 'action-4' }, '• Establish regulatory compliance framework')
                    ])
                ]),
                React.createElement('div', {
                    key: 'strategic-moves',
                    className: 'bg-blue-50 p-6 rounded-lg border border-blue-200'
                }, [
                    React.createElement('h3', {
                        key: 'strategic-title',
                        className: 'font-semibold text-blue-800 mb-4 flex items-center'
                    }, [
                        React.createElement('i', {
                            key: 'strategic-icon',
                            className: 'fas fa-chess-queen mr-2'
                        }),
                        'Strategic Moves (30-90 days)'
                    ]),
                    React.createElement('ul', {
                        key: 'strategic-list',
                        className: 'space-y-2 text-sm text-blue-700'
                    }, [
                        React.createElement('li', { key: 'strategy-1' }, '• Finalize go-to-market strategy'),
                        React.createElement('li', { key: 'strategy-2' }, '• Establish key retail partnerships'),
                        React.createElement('li', { key: 'strategy-3' }, '• Launch brand development initiatives'),
                        React.createElement('li', { key: 'strategy-4' }, '• Secure Series A funding if required')
                    ])
                ])
            ])
        ]),

        // Financial Projections
        React.createElement('div', {
            key: 'financial-projections',
            className: 'p-8 border-b border-gray-200'
        }, [
            React.createElement('h2', {
                key: 'financial-title',
                className: 'text-xl font-bold text-gray-900 mb-6 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'financial-icon',
                    className: 'fas fa-chart-bar text-green-600 mr-3'
                }),
                'Financial Projections & Business Model'
            ]),
            React.createElement('div', {
                key: 'financial-metrics',
                className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'
            }, [
                React.createElement('div', {
                    key: 'revenue',
                    className: 'text-center p-4 bg-green-50 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'revenue-value',
                        className: 'text-2xl font-bold text-green-600'
                    }, '$2.4M'),
                    React.createElement('div', {
                        key: 'revenue-label',
                        className: 'text-sm text-green-700'
                    }, 'Year 1 Revenue')
                ]),
                React.createElement('div', {
                    key: 'margin',
                    className: 'text-center p-4 bg-blue-50 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'margin-value',
                        className: 'text-2xl font-bold text-blue-600'
                    }, '68%'),
                    React.createElement('div', {
                        key: 'margin-label',
                        className: 'text-sm text-blue-700'
                    }, 'Gross Margin')
                ]),
                React.createElement('div', {
                    key: 'breakeven',
                    className: 'text-center p-4 bg-purple-50 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'breakeven-value',
                        className: 'text-2xl font-bold text-purple-600'
                    }, '8 mo'),
                    React.createElement('div', {
                        key: 'breakeven-label',
                        className: 'text-sm text-purple-700'
                    }, 'Break-even')
                ]),
                React.createElement('div', {
                    key: 'roi',
                    className: 'text-center p-4 bg-yellow-50 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'roi-value',
                        className: 'text-2xl font-bold text-yellow-600'
                    }, '145%'),
                    React.createElement('div', {
                        key: 'roi-label',
                        className: 'text-sm text-yellow-700'
                    }, '3-Year ROI')
                ])
            ]),
            React.createElement('div', {
                key: 'investment-summary',
                className: 'bg-gray-50 p-6 rounded-lg'
            }, [
                React.createElement('h4', {
                    key: 'investment-title',
                    className: 'font-semibold text-gray-900 mb-4'
                }, 'Investment Summary'),
                React.createElement('div', {
                    key: 'investment-details',
                    className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'
                }, [
                    React.createElement('div', {
                        key: 'initial-investment'
                    }, [
                        React.createElement('div', {
                            key: 'investment-label',
                            className: 'text-gray-600'
                        }, 'Initial Investment Required'),
                        React.createElement('div', {
                            key: 'investment-amount',
                            className: 'font-bold text-lg text-gray-900'
                        }, '$125,000')
                    ]),
                    React.createElement('div', {
                        key: 'working-capital'
                    }, [
                        React.createElement('div', {
                            key: 'capital-label',
                            className: 'text-gray-600'
                        }, 'Working Capital'),
                        React.createElement('div', {
                            key: 'capital-amount',
                            className: 'font-bold text-lg text-gray-900'
                        }, '$75,000')
                    ]),
                    React.createElement('div', {
                        key: 'marketing-budget'
                    }, [
                        React.createElement('div', {
                            key: 'marketing-label',
                            className: 'text-gray-600'
                        }, 'Year 1 Marketing'),
                        React.createElement('div', {
                            key: 'marketing-amount',
                            className: 'font-bold text-lg text-gray-900'
                        }, '$180,000')
                    ])
                ])
            ])
        ]),

        // Risk Assessment
        React.createElement('div', {
            key: 'risk-assessment',
            className: 'p-8 border-b border-gray-200'
        }, [
            React.createElement('h2', {
                key: 'risk-title',
                className: 'text-xl font-bold text-gray-900 mb-6 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'risk-icon',
                    className: 'fas fa-shield-alt text-orange-500 mr-3'
                }),
                'Risk Assessment & Mitigation'
            ]),
            React.createElement('div', {
                key: 'risk-matrix',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
            }, [
                React.createElement('div', {
                    key: 'high-risks',
                    className: 'bg-red-50 p-6 rounded-lg border border-red-200'
                }, [
                    React.createElement('h3', {
                        key: 'high-risk-title',
                        className: 'font-semibold text-red-800 mb-4'
                    }, 'High Priority Risks'),
                    React.createElement('ul', {
                        key: 'high-risk-list',
                        className: 'space-y-3'
                    }, [
                        React.createElement('li', {
                            key: 'risk-1',
                            className: 'flex items-start'
                        }, [
                            React.createElement('i', {
                                key: 'risk-1-icon',
                                className: 'fas fa-exclamation-triangle text-red-500 mt-1 mr-3'
                            }),
                            React.createElement('div', {
                                key: 'risk-1-content'
                            }, [
                                React.createElement('div', {
                                    key: 'risk-1-title',
                                    className: 'font-medium text-red-800'
                                }, 'Supply Chain Disruption'),
                                React.createElement('div', {
                                    key: 'risk-1-desc',
                                    className: 'text-sm text-red-700'
                                }, 'Raw material price volatility (±15%)')
                            ])
                        ]),
                        React.createElement('li', {
                            key: 'risk-2',
                            className: 'flex items-start'
                        }, [
                            React.createElement('i', {
                                key: 'risk-2-icon',
                                className: 'fas fa-exclamation-triangle text-red-500 mt-1 mr-3'
                            }),
                            React.createElement('div', {
                                key: 'risk-2-content'
                            }, [
                                React.createElement('div', {
                                    key: 'risk-2-title',
                                    className: 'font-medium text-red-800'
                                }, 'Competitive Response'),
                                React.createElement('div', {
                                    key: 'risk-2-desc',
                                    className: 'text-sm text-red-700'
                                }, 'Fast follower market entry risk')
                            ])
                        ])
                    ])
                ]),
                React.createElement('div', {
                    key: 'mitigation',
                    className: 'bg-green-50 p-6 rounded-lg border border-green-200'
                }, [
                    React.createElement('h3', {
                        key: 'mitigation-title',
                        className: 'font-semibold text-green-800 mb-4'
                    }, 'Mitigation Strategies'),
                    React.createElement('ul', {
                        key: 'mitigation-list',
                        className: 'space-y-3'
                    }, [
                        React.createElement('li', {
                            key: 'mitigation-1',
                            className: 'flex items-start'
                        }, [
                            React.createElement('i', {
                                key: 'mitigation-1-icon',
                                className: 'fas fa-check-circle text-green-500 mt-1 mr-3'
                            }),
                            React.createElement('div', {
                                key: 'mitigation-1-content'
                            }, [
                                React.createElement('div', {
                                    key: 'mitigation-1-title',
                                    className: 'font-medium text-green-800'
                                }, 'Diversified Supplier Network'),
                                React.createElement('div', {
                                    key: 'mitigation-1-desc',
                                    className: 'text-sm text-green-700'
                                }, 'Establish 3+ supplier relationships with 90-day buffer stock')
                            ])
                        ]),
                        React.createElement('li', {
                            key: 'mitigation-2',
                            className: 'flex items-start'
                        }, [
                            React.createElement('i', {
                                key: 'mitigation-2-icon',
                                className: 'fas fa-check-circle text-green-500 mt-1 mr-3'
                            }),
                            React.createElement('div', {
                                key: 'mitigation-2-content'
                            }, [
                                React.createElement('div', {
                                    key: 'mitigation-2-title',
                                    className: 'font-medium text-green-800'
                                }, 'IP Protection & Speed'),
                                React.createElement('div', {
                                    key: 'mitigation-2-desc',
                                    className: 'text-sm text-green-700'
                                }, 'Fast patent filing and first-mover advantage execution')
                            ])
                        ])
                    ])
                ])
            ])
        ]),

        // Action Items & Next Steps
        React.createElement('div', {
            key: 'action-items',
            className: 'p-8'
        }, [
            React.createElement('h2', {
                key: 'action-title',
                className: 'text-xl font-bold text-gray-900 mb-6 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'action-icon',
                    className: 'fas fa-tasks text-blue-600 mr-3'
                }),
                'Action Items & Implementation Roadmap'
            ]),
            React.createElement('div', {
                key: 'timeline',
                className: 'space-y-6'
            }, [
                React.createElement('div', {
                    key: 'week-1-2',
                    className: 'flex items-start space-x-4'
                }, [
                    React.createElement('div', {
                        key: 'timeline-marker-1',
                        className: 'flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold'
                    }, '1-2'),
                    React.createElement('div', {
                        key: 'timeline-content-1',
                        className: 'flex-grow'
                    }, [
                        React.createElement('h3', {
                            key: 'timeline-title-1',
                            className: 'font-semibold text-gray-900'
                        }, 'Weeks 1-2: Foundation & Validation'),
                        React.createElement('ul', {
                            key: 'timeline-tasks-1',
                            className: 'text-sm text-gray-600 mt-2 space-y-1'
                        }, [
                            React.createElement('li', { key: 'task-1-1' }, '• Complete comprehensive market research validation'),
                            React.createElement('li', { key: 'task-1-2' }, '• Secure 3 co-packer evaluation agreements'),
                            React.createElement('li', { key: 'task-1-3' }, '• File provisional patents for core innovations'),
                            React.createElement('li', { key: 'task-1-4' }, '• Conduct consumer testing with 100+ participants')
                        ])
                    ])
                ]),
                React.createElement('div', {
                    key: 'week-3-6',
                    className: 'flex items-start space-x-4'
                }, [
                    React.createElement('div', {
                        key: 'timeline-marker-2',
                        className: 'flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold'
                    }, '3-6'),
                    React.createElement('div', {
                        key: 'timeline-content-2',
                        className: 'flex-grow'
                    }, [
                        React.createElement('h3', {
                            key: 'timeline-title-2',
                            className: 'font-semibold text-gray-900'
                        }, 'Weeks 3-6: Development & Partnerships'),
                        React.createElement('ul', {
                            key: 'timeline-tasks-2',
                            className: 'text-sm text-gray-600 mt-2 space-y-1'
                        }, [
                            React.createElement('li', { key: 'task-2-1' }, '• Finalize co-packer selection and agreements'),
                            React.createElement('li', { key: 'task-2-2' }, '• Complete product formulation and testing'),
                            React.createElement('li', { key: 'task-2-3' }, '• Establish key retail partnership discussions'),
                            React.createElement('li', { key: 'task-2-4' }, '• Launch brand development and trademark registration')
                        ])
                    ])
                ]),
                React.createElement('div', {
                    key: 'week-7-12',
                    className: 'flex items-start space-x-4'
                }, [
                    React.createElement('div', {
                        key: 'timeline-marker-3',
                        className: 'flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold'
                    }, '7-12'),
                    React.createElement('div', {
                        key: 'timeline-content-3',
                        className: 'flex-grow'
                    }, [
                        React.createElement('h3', {
                            key: 'timeline-title-3',
                            className: 'font-semibold text-gray-900'
                        }, 'Weeks 7-12: Launch Preparation'),
                        React.createElement('ul', {
                            key: 'timeline-tasks-3',
                            className: 'text-sm text-gray-600 mt-2 space-y-1'
                        }, [
                            React.createElement('li', { key: 'task-3-1' }, '• Execute go-to-market strategy and marketing campaigns'),
                            React.createElement('li', { key: 'task-3-2' }, '• Secure retail placement and distribution agreements'),
                            React.createElement('li', { key: 'task-3-3' }, '• Complete regulatory approvals and compliance verification'),
                            React.createElement('li', { key: 'task-3-4' }, '• Launch product with initial production run')
                        ])
                    ])
                ])
            ])
        ]),

        // Report Actions
        React.createElement('div', {
            key: 'report-actions',
            className: 'bg-gray-50 px-8 py-6 rounded-b-xl flex items-center justify-between'
        }, [
            React.createElement('div', {
                key: 'report-metadata',
                className: 'text-sm text-gray-600'
            }, [
                React.createElement('p', {
                    key: 'generated',
                    className: 'mb-1'
                }, 'Report generated by Pristine Innovation Scanner'),
                React.createElement('p', {
                    key: 'timestamp'
                }, `Analysis completed: ${new Date().toLocaleString()}`)
            ]),
            React.createElement('div', {
                key: 'action-buttons',
                className: 'flex space-x-4'
            }, [
                React.createElement('button', {
                    key: 'save-button',
                    onClick: () => onSave(report),
                    className: 'px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center'
                }, [
                    React.createElement('i', {
                        key: 'save-icon',
                        className: 'fas fa-save mr-2'
                    }),
                    'Save Report'
                ]),
                React.createElement('button', {
                    key: 'new-scan-button',
                    onClick: onNewScan,
                    className: 'px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center'
                }, [
                    React.createElement('i', {
                        key: 'new-icon',
                        className: 'fas fa-plus mr-2'
                    }),
                    'New Analysis'
                ])
            ])
        ])
    ]);
}

function BusinessContext({ mode, currentStep, workflowState }) {
    const getContextForStep = () => {
        if (mode === 'forward') {
            switch (currentStep) {
                case 1:
                    return {
                        title: 'Market Validation Focus',
                        insights: [
                            'Consumer demand analysis and market sizing',
                            'Competitive landscape assessment',
                            'Regulatory environment evaluation',
                            'Price sensitivity and willingness to pay'
                        ],
                        tip: 'Strong market validation is critical for reducing launch risk and securing investor confidence.'
                    };
                case 2:
                    return {
                        title: 'Technical Feasibility',
                        insights: [
                            'Manufacturing scalability assessment',
                            'Co-packer capability evaluation',
                            'Supply chain risk analysis',
                            'Quality assurance requirements'
                        ],
                        tip: 'Technical feasibility determines your ability to deliver on market promises consistently.'
                    };
                case 3:
                    return {
                        title: 'Business Model Optimization',
                        insights: [
                            'Revenue stream diversification',
                            'Cost structure optimization',
                            'Margin enhancement strategies',
                            'Cash flow management'
                        ],
                        tip: 'A strong business model ensures sustainable profitability and growth scalability.'
                    };
                case 4:
                    return {
                        title: 'Go-to-Market Strategy',
                        insights: [
                            'Channel partner selection',
                            'Brand positioning and messaging',
                            'Customer acquisition strategy',
                            'Launch sequence optimization'
                        ],
                        tip: 'Effective go-to-market execution differentiates winners from competitors.'
                    };
                default:
                    return {
                        title: 'Innovation Analysis',
                        insights: [
                            'Market opportunity assessment',
                            'Competitive positioning',
                            'Risk-reward evaluation',
                            'Strategic decision support'
                        ],
                        tip: 'Data-driven decisions reduce uncertainty and improve success probability.'
                    };
            }
        } else {
            switch (currentStep) {
                case 1:
                    return {
                        title: 'Market Gap Analysis',
                        insights: [
                            'Unmet consumer needs identification',
                            'Market segment opportunities',
                            'White space mapping',
                            'Demand pattern analysis'
                        ],
                        tip: 'Gap analysis reveals hidden opportunities that competitors may have missed.'
                    };
                case 2:
                    return {
                        title: 'Competitive Intelligence',
                        insights: [
                            'Competitor weakness identification',
                            'Market positioning opportunities',
                            'Brand differentiation potential',
                            'Pricing strategy optimization'
                        ],
                        tip: 'Understanding competitor vulnerabilities enables strategic positioning advantages.'
                    };
                case 3:
                    return {
                        title: 'Innovation Mapping',
                        insights: [
                            'Technology trend analysis',
                            'Innovation vector assessment',
                            'First-mover opportunities',
                            'Partnership potential evaluation'
                        ],
                        tip: 'Innovation mapping identifies breakthrough opportunities before they become obvious.'
                    };
                case 4:
                    return {
                        title: 'Strategic Options',
                        insights: [
                            'Portfolio expansion opportunities',
                            'Partnership vs build analysis',
                            'Resource allocation optimization',
                            'Risk-adjusted returns'
                        ],
                        tip: 'Multiple strategic paths provide flexibility and reduce execution risk.'
                    };
                default:
                    return {
                        title: 'Opportunity Scanning',
                        insights: [
                            'Market intelligence gathering',
                            'Competitive landscape analysis',
                            'Innovation opportunity mapping',
                            'Strategic positioning assessment'
                        ],
                        tip: 'Comprehensive scanning reveals opportunities hidden in market complexity.'
                    };
            }
        }
    };

    const context = getContextForStep();
    
    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow border border-gray-200 p-6'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'flex items-center mb-4'
        }, [
            React.createElement('i', {
                key: 'icon',
                className: `fas ${mode === 'forward' ? 'fa-lightbulb' : 'fa-search'} text-blue-500 mr-3`
            }),
            React.createElement('h3', {
                key: 'title',
                className: 'font-semibold text-gray-900'
            }, context.title)
        ]),
        React.createElement('ul', {
            key: 'insights-list',
            className: 'space-y-2 mb-4'
        }, context.insights.map((insight, index) => 
            React.createElement('li', {
                key: index,
                className: 'flex items-start text-sm text-gray-600'
            }, [
                React.createElement('i', {
                    key: 'bullet',
                    className: 'fas fa-chevron-right text-gray-400 mt-1 mr-2 text-xs'
                }),
                React.createElement('span', {
                    key: 'text'
                }, insight)
            ])
        )),
        React.createElement('div', {
            key: 'tip',
            className: 'bg-blue-50 p-3 rounded-lg border border-blue-200'
        }, [
            React.createElement('div', {
                key: 'tip-content',
                className: 'flex items-start'
            }, [
                React.createElement('i', {
                    key: 'tip-icon',
                    className: 'fas fa-info-circle text-blue-500 mt-0.5 mr-2'
                }),
                React.createElement('p', {
                    key: 'tip-text',
                    className: 'text-sm text-blue-700'
                }, context.tip)
            ])
        ])
    ]);
}

function QuickInsights({ results, mode }) {
    if (!results) {
        return React.createElement('div', {
            className: 'bg-white rounded-lg shadow border border-gray-200 p-6'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'font-semibold text-gray-900 mb-3 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: 'fas fa-chart-pulse text-green-500 mr-2'
                }),
                'Quick Insights'
            ]),
            React.createElement('div', {
                key: 'no-data',
                className: 'text-center py-4'
            }, [
                React.createElement('i', {
                    key: 'empty-icon',
                    className: 'fas fa-chart-line text-gray-300 text-2xl mb-2'
                }),
                React.createElement('p', {
                    key: 'empty-text',
                    className: 'text-sm text-gray-500'
                }, 'Insights will appear during analysis')
            ])
        ]);
    }

    const getInsightColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50';
        if (score >= 70) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getInsightIcon = (score) => {
        if (score >= 80) return 'fas fa-thumbs-up text-green-500';
        if (score >= 70) return 'fas fa-exclamation-triangle text-yellow-500';
        return 'fas fa-flag text-red-500';
    };

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow border border-gray-200 p-6'
    }, [
        React.createElement('h3', {
            key: 'title',
            className: 'font-semibold text-gray-900 mb-4 flex items-center'
        }, [
            React.createElement('i', {
                key: 'icon',
                className: 'fas fa-chart-pulse text-green-500 mr-2'
            }),
            'Quick Insights'
        ]),
        
        // Overall Score
        React.createElement('div', {
            key: 'overall-score',
            className: `p-4 rounded-lg mb-4 ${getInsightColor(results.score)}`
        }, [
            React.createElement('div', {
                key: 'score-content',
                className: 'flex items-center justify-between'
            }, [
                React.createElement('div', {
                    key: 'score-info'
                }, [
                    React.createElement('div', {
                        key: 'score-label',
                        className: 'text-sm font-medium'
                    }, results.title),
                    React.createElement('div', {
                        key: 'status',
                        className: 'text-xs opacity-80 mt-1'
                    }, results.status)
                ]),
                React.createElement('div', {
                    key: 'score-value',
                    className: 'text-2xl font-bold'
                }, `${results.score}/100`)
            ])
        ]),

        // Key Metrics
        React.createElement('div', {
            key: 'metrics',
            className: 'space-y-3 mb-4'
        }, [
            React.createElement('div', {
                key: 'metric-1',
                className: 'flex items-center justify-between text-sm'
            }, [
                React.createElement('span', {
                    key: 'label-1',
                    className: 'text-gray-600 flex items-center'
                }, [
                    React.createElement('i', {
                        key: 'icon-1',
                        className: 'fas fa-chart-line text-blue-500 mr-2 w-4'
                    }),
                    'Market Potential'
                ]),
                React.createElement('span', {
                    key: 'value-1',
                    className: 'font-semibold text-gray-900'
                }, mode === 'forward' ? 'High Growth' : 'Multiple Gaps')
            ]),
            React.createElement('div', {
                key: 'metric-2',
                className: 'flex items-center justify-between text-sm'
            }, [
                React.createElement('span', {
                    key: 'label-2',
                    className: 'text-gray-600 flex items-center'
                }, [
                    React.createElement('i', {
                        key: 'icon-2',
                        className: 'fas fa-cog text-purple-500 mr-2 w-4'
                    }),
                    'Feasibility'
                ]),
                React.createElement('span', {
                    key: 'value-2',
                    className: 'font-semibold text-gray-900'
                }, mode === 'forward' ? 'Viable Path' : 'Strategic Options')
            ]),
            React.createElement('div', {
                key: 'metric-3',
                className: 'flex items-center justify-between text-sm'
            }, [
                React.createElement('span', {
                    key: 'label-3',
                    className: 'text-gray-600 flex items-center'
                }, [
                    React.createElement('i', {
                        key: 'icon-3',
                        className: 'fas fa-dollar-sign text-green-500 mr-2 w-4'
                    }),
                    'Financial'
                ]),
                React.createElement('span', {
                    key: 'value-3',
                    className: 'font-semibold text-gray-900'
                }, mode === 'forward' ? 'Strong ROI' : 'Value Creation')
            ])
        ]),

        // Risk Level
        React.createElement('div', {
            key: 'risk-assessment',
            className: 'border-t border-gray-200 pt-4'
        }, [
            React.createElement('div', {
                key: 'risk-header',
                className: 'flex items-center justify-between mb-3'
            }, [
                React.createElement('span', {
                    key: 'risk-label',
                    className: 'text-sm font-medium text-gray-700'
                }, 'Risk Assessment'),
                React.createElement('span', {
                    key: 'risk-level',
                    className: 'px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium'
                }, 'Moderate')
            ]),
            React.createElement('div', {
                key: 'risk-indicators',
                className: 'space-y-2'
            }, results.risks?.slice(0, 2).map((risk, index) => 
                React.createElement('div', {
                    key: index,
                    className: 'flex items-start text-xs text-gray-600'
                }, [
                    React.createElement('i', {
                        key: 'risk-icon',
                        className: 'fas fa-exclamation-triangle text-yellow-500 mt-0.5 mr-2'
                    }),
                    React.createElement('span', {
                        key: 'risk-text'
                    }, risk.substring(0, 50) + (risk.length > 50 ? '...' : ''))
                ])
            ) || [])
        ]),

        // Recommendation Badge
        React.createElement('div', {
            key: 'recommendation',
            className: 'mt-4 pt-4 border-t border-gray-200'
        }, [
            React.createElement('div', {
                key: 'rec-content',
                className: 'flex items-center justify-center'
            }, [
                React.createElement('i', {
                    key: 'rec-icon',
                    className: getInsightIcon(results.score) + ' mr-2'
                }),
                React.createElement('span', {
                    key: 'rec-text',
                    className: 'font-semibold text-gray-900'
                }, results.recommendation || 'ANALYZING')
            ])
        ])
    ]);
}

function RecentReports({ reports, onLoadReport }) {
    if (!reports || reports.length === 0) {
        return React.createElement('div', {
            className: 'bg-white rounded-lg shadow border border-gray-200 p-6'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'font-semibold text-gray-900 mb-3 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: 'fas fa-history text-blue-500 mr-2'
                }),
                'Recent Reports'
            ]),
            React.createElement('div', {
                key: 'empty',
                className: 'text-center py-4'
            }, [
                React.createElement('i', {
                    key: 'empty-icon',
                    className: 'fas fa-folder-open text-gray-300 text-2xl mb-2'
                }),
                React.createElement('p', {
                    key: 'empty-text',
                    className: 'text-sm text-gray-500'
                }, 'No reports yet')
            ])
        ]);
    }

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow border border-gray-200 p-6'
    }, [
        React.createElement('h3', {
            key: 'title',
            className: 'font-semibold text-gray-900 mb-4 flex items-center'
        }, [
            React.createElement('i', {
                key: 'icon',
                className: 'fas fa-history text-blue-500 mr-2'
            }),
            'Recent Reports',
            React.createElement('span', {
                key: 'count',
                className: 'ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full'
            }, reports.length)
        ]),
        React.createElement('div', {
            key: 'reports-list',
            className: 'space-y-3 max-h-64 overflow-y-auto'
        }, reports.slice(0, 5).map((report, index) => 
            React.createElement('div', {
                key: index,
                onClick: () => onLoadReport(report),
                className: 'p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
            }, [
                React.createElement('div', {
                    key: 'report-header',
                    className: 'flex items-center justify-between mb-2'
                }, [
                    React.createElement('div', {
                        key: 'report-type',
                        className: 'flex items-center'
                    }, [
                        React.createElement('i', {
                            key: 'type-icon',
                            className: `fas ${report.metadata?.mode === 'forward' ? 'fa-lightbulb' : 'fa-search'} text-xs mr-2 ${
                                report.metadata?.mode === 'forward' ? 'text-blue-500' : 'text-purple-500'
                            }`
                        }),
                        React.createElement('span', {
                            key: 'type-label',
                            className: 'text-xs font-medium text-gray-700'
                        }, report.metadata?.mode === 'forward' ? 'Forward' : 'Reverse')
                    ]),
                    React.createElement('span', {
                        key: 'timestamp',
                        className: 'text-xs text-gray-500'
                    }, new Date(report.metadata?.timestamp || report.created_at).toLocaleDateString())
                ]),
                React.createElement('div', {
                    key: 'report-title',
                    className: 'text-sm font-medium text-gray-900 mb-1 truncate'
                }, report.data?.title || report.title || 'Innovation Analysis'),
                React.createElement('div', {
                    key: 'report-summary',
                    className: 'text-xs text-gray-600 line-clamp-2'
                }, report.data?.executiveSummary || 'Professional innovation analysis report with strategic recommendations and business insights.')
            ])
        ))
    ]);
}

function ParkedProject({ results, onRestart }) {
    return React.createElement('div', {
        className: 'bg-white rounded-xl shadow-lg border border-gray-200 p-8'
    }, [
        React.createElement('div', {
            key: 'parked-content',
            className: 'text-center'
        }, [
            React.createElement('i', {
                key: 'park-icon',
                className: 'fas fa-pause-circle text-red-500 text-4xl mb-4'
            }),
            React.createElement('h2', {
                key: 'title',
                className: 'text-2xl font-bold text-gray-900 mb-2'
            }, 'Project Parked'),
            React.createElement('p', {
                key: 'description',
                className: 'text-gray-600 mb-6'
            }, 'This analysis has been saved for future review and development.'),
            React.createElement('button', {
                key: 'restart',
                onClick: onRestart,
                className: 'px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
            }, 'Start New Analysis')
        ])
    ]);
}

// Helper functions for comprehensive report generation
async function createProfessionalReport(analysisResults, mode, inputData) {
    // Simulate comprehensive report compilation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportId = `RPT-${mode.toUpperCase()}-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    if (mode === 'forward') {
        return {
            id: reportId,
            title: 'Forward Innovation Concept Sheet',
            mode: 'forward',
            timestamp,
            inputData,
            executiveSummary: generateForwardSummary(inputData),
            recommendations: generateForwardRecommendations(),
            riskAssessment: generateRiskAssessment(mode),
            financialProjections: generateFinancialProjections(),
            strategicOptions: generateStrategicOptions(mode),
            nextSteps: generateNextSteps(mode),
            confidence: 85,
            overallScore: 82
        };
    } else {
        return {
            id: reportId,
            title: 'Market Opportunity Analysis Report',
            mode: 'reverse',
            timestamp,
            inputData,
            executiveSummary: generateReverseSummary(inputData),
            recommendations: generateReverseRecommendations(),
            riskAssessment: generateRiskAssessment(mode),
            opportunityMapping: generateOpportunityMapping(),
            competitiveIntel: generateCompetitiveIntel(),
            nextSteps: generateNextSteps(mode),
            confidence: 79,
            overallScore: 78
        };
    }
}

function generateForwardSummary(inputData) {
    return `Based on comprehensive analysis of "${inputData.idea || 'your product concept'}", this innovation demonstrates strong market potential with ${inputData.targetMarket ? `clear positioning in the ${inputData.targetMarket} segment` : 'identified target demographic'}. 

Key findings indicate viable technical execution path with estimated ${inputData.timeline || '6-12 month'} development timeline and ${inputData.budget ? `budget alignment within ${inputData.budget} range` : 'reasonable investment requirements'}. Market validation shows 67% unmet demand in target category with favorable regulatory environment.

The business model projects 68% gross margins with break-even at 12,000 units monthly. Strategic advantages include first-mover positioning and scalable distribution channels. Risk factors primarily center on supply chain management and competitive response timing.

Recommendation: PROCEED with immediate prototype development and market validation studies.`;
}

function generateReverseSummary(inputData) {
    return `Analysis of "${inputData.productName || 'the target product category'}" reveals significant market opportunities across multiple dimensions. ${inputData.currentMarket ? `Current market dynamics in ${inputData.currentMarket} show` : 'Market research indicates'} three primary opportunity vectors with high commercial potential.

Competitive intelligence identifies key vulnerability points in existing player strategies, particularly in ${inputData.productCategory || 'product innovation'} and customer experience optimization. Technology trend analysis suggests 18-month window for first-mover advantage in identified opportunity areas.

Market gap analysis reveals underserved premium segment representing 32% available market share with $240M total addressable market. Innovation mapping highlights convergence of emerging technologies with unmet consumer needs.

Recommendation: EXECUTE on highest-priority opportunity with strategic partnership approach to accelerate market entry.`;
}

function generateForwardRecommendations() {
    return [
        {
            category: 'Immediate Actions',
            priority: 'High',
            timeline: '0-30 days',
            items: [
                'Conduct 500-person consumer validation survey',
                'Secure 3 co-packer evaluation agreements',
                'File provisional patents for core innovations',
                'Establish regulatory compliance framework'
            ]
        },
        {
            category: 'Development Phase',
            priority: 'High',
            timeline: '30-90 days',
            items: [
                'Complete product formulation optimization',
                'Finalize manufacturing partner selection',
                'Launch brand development initiatives',
                'Establish key retail partnership discussions'
            ]
        },
        {
            category: 'Market Entry',
            priority: 'Medium',
            timeline: '90-180 days',
            items: [
                'Execute go-to-market strategy',
                'Launch marketing campaigns and PR',
                'Secure Series A funding if required',
                'Scale production and distribution'
            ]
        }
    ];
}

function generateReverseRecommendations() {
    return [
        {
            category: 'Strategic Positioning',
            priority: 'High',
            timeline: '0-30 days',
            items: [
                'Map competitive vulnerability matrix',
                'Identify technology partnership opportunities',
                'Develop innovation roadmap priorities',
                'Establish market intelligence system'
            ]
        },
        {
            category: 'Opportunity Development',
            priority: 'High',
            timeline: '30-90 days',
            items: [
                'Launch opportunity validation studies',
                'Negotiate strategic partnerships',
                'Develop competitive differentiation strategy',
                'Establish innovation development pipeline'
            ]
        },
        {
            category: 'Market Execution',
            priority: 'Medium',
            timeline: '90-180 days',
            items: [
                'Execute market entry strategy',
                'Launch competitive positioning campaigns',
                'Scale innovation development capabilities',
                'Establish market leadership position'
            ]
        }
    ];
}

function generateRiskAssessment(mode) {
    if (mode === 'forward') {
        return {
            high: [
                { risk: 'Supply Chain Disruption', impact: 'High', probability: 'Medium', mitigation: 'Diversified supplier network with 90-day buffer inventory' },
                { risk: 'Competitive Fast-Follow', impact: 'High', probability: 'High', mitigation: 'Patent protection and speed-to-market execution' }
            ],
            medium: [
                { risk: 'Regulatory Delays', impact: 'Medium', probability: 'Low', mitigation: 'Early engagement with regulatory consultants' },
                { risk: 'Market Adoption Rate', impact: 'Medium', probability: 'Medium', mitigation: 'Phased launch with customer education' }
            ],
            low: [
                { risk: 'Technology Obsolescence', impact: 'Low', probability: 'Low', mitigation: 'Continuous innovation pipeline' }
            ]
        };
    } else {
        return {
            high: [
                { risk: 'Market Timing Misalignment', impact: 'High', probability: 'Medium', mitigation: 'Flexible launch strategy with multiple entry points' },
                { risk: 'Competitive Response Speed', impact: 'High', probability: 'High', mitigation: 'First-mover advantage and patent barriers' }
            ],
            medium: [
                { risk: 'Technology Partnership Dependency', impact: 'Medium', probability: 'Medium', mitigation: 'Multiple partnership options and backup strategies' },
                { risk: 'Consumer Behavior Shifts', impact: 'Medium', probability: 'Low', mitigation: 'Continuous market research and adaptation' }
            ],
            low: [
                { risk: 'Economic Sensitivity', impact: 'Low', probability: 'Medium', mitigation: 'Diversified market segments and pricing flexibility' }
            ]
        };
    }
}

function generateFinancialProjections() {
    return {
        year1: { revenue: 2400000, costs: 1536000, grossMargin: 0.68, netIncome: 384000 },
        year2: { revenue: 4800000, costs: 2880000, grossMargin: 0.70, netIncome: 1152000 },
        year3: { revenue: 8400000, costs: 4704000, grossMargin: 0.72, netIncome: 2352000 },
        breakeven: '8 months',
        roi3year: 1.45,
        initialInvestment: 125000,
        workingCapital: 75000
    };
}

function generateOpportunityMapping() {
    return [
        { 
            opportunity: 'Premium Market Entry',
            size: '$240M TAM',
            timeline: '6 months',
            confidence: 'High',
            requirements: 'Brand development, quality positioning'
        },
        { 
            opportunity: 'Technology Integration',
            size: '$150M TAM',
            timeline: '12 months',
            confidence: 'Medium',
            requirements: 'R&D partnership, regulatory approval'
        },
        { 
            opportunity: 'Geographic Expansion',
            size: '$320M TAM',
            timeline: '18 months',
            confidence: 'High',
            requirements: 'Distribution partnerships, localization'
        }
    ];
}

function generateCompetitiveIntel() {
    return [
        { 
            competitor: 'Market Leader A',
            weakness: 'Limited innovation pipeline',
            opportunity: 'Technology differentiation',
            threat: 'Deep pockets for M&A'
        },
        { 
            competitor: 'Market Leader B',
            weakness: 'Poor customer experience',
            opportunity: 'Service excellence positioning',
            threat: 'Strong distribution network'
        },
        { 
            competitor: 'Emerging Player C',
            weakness: 'Narrow product range',
            opportunity: 'Comprehensive solution approach',
            threat: 'Agile market response'
        }
    ];
}

function generateStrategicOptions(mode) {
    if (mode === 'forward') {
        return [
            { 
                option: 'Direct-to-Consumer Launch',
                pros: ['Higher margins', 'Brand control', 'Customer data'],
                cons: ['Marketing costs', 'Fulfillment complexity'],
                score: 85
            },
            { 
                option: 'Retail Partnership Model',
                pros: ['Established distribution', 'Lower marketing costs'],
                cons: ['Margin pressure', 'Less brand control'],
                score: 78
            },
            { 
                option: 'Co-development Partnership',
                pros: ['Shared risk', 'Faster market entry'],
                cons: ['Shared profits', 'Less control'],
                score: 72
            }
        ];
    }
    return [];
}

function generateNextSteps(mode) {
    if (mode === 'forward') {
        return [
            { week: '1-2', focus: 'Market Validation', tasks: ['Consumer surveys', 'Competitive analysis', 'Regulatory review'] },
            { week: '3-6', focus: 'Product Development', tasks: ['Formulation', 'Co-packer selection', 'Patent filing'] },
            { week: '7-10', focus: 'Business Setup', tasks: ['Legal structure', 'Funding secured', 'Team building'] },
            { week: '11-16', focus: 'Market Launch', tasks: ['Marketing campaigns', 'Sales channels', 'Production scaling'] }
        ];
    } else {
        return [
            { week: '1-2', focus: 'Opportunity Prioritization', tasks: ['Gap analysis', 'Market sizing', 'Competitive mapping'] },
            { week: '3-6', focus: 'Strategic Planning', tasks: ['Partnership evaluation', 'Technology assessment', 'Business model'] },
            { week: '7-10', focus: 'Capability Building', tasks: ['Team assembly', 'Resource allocation', 'Infrastructure'] },
            { week: '11-16', focus: 'Market Execution', tasks: ['Launch strategy', 'Partnership activation', 'Market penetration'] }
        ];
    }
}

// Export component
window.PristineInnovationScanner = PristineInnovationScanner;
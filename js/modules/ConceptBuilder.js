// Concept Builder Module - Forward and Reverse Mode AI Product Innovation

const { useState, useEffect, useRef } = React;

function ConceptBuilder({ mode = 'forward' }) {
    const [activeMode, setActiveMode] = useState(mode);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [inputData, setInputData] = useState({});
    const [savedConcepts, setSavedConcepts] = useState([]);
    
    const auth = useAuth();
    const notifications = useNotifications();

    useEffect(() => {
        loadSavedConcepts();
    }, []);

    const loadSavedConcepts = async () => {
        try {
            const concepts = await api.getAIInsights();
            setSavedConcepts(concepts.data.filter(insight => 
                insight.type.includes('concept')
            ));
        } catch (error) {
            console.error('Failed to load saved concepts:', error);
        }
    };

    const switchMode = (newMode) => {
        setActiveMode(newMode);
        setResults(null);
        setInputData({});
    };

    return React.createElement('div', {
        className: 'space-y-6'
    }, [
        // Header with mode selector
        React.createElement('div', {
            key: 'header',
            className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
        }, [
            React.createElement('div', {
                key: 'title-section',
                className: 'flex items-center justify-between mb-6'
            }, [
                React.createElement('div', {
                    key: 'title'
                }, [
                    React.createElement('h1', {
                        key: 'heading',
                        className: 'text-2xl font-bold text-gray-900'
                    }, 'AI Concept Builder'),
                    React.createElement('p', {
                        key: 'description',
                        className: 'text-gray-600 mt-2'
                    }, 'Generate innovative product concepts using AI-powered analysis')
                ]),
                React.createElement('div', {
                    key: 'stats',
                    className: 'text-right'
                }, [
                    React.createElement('p', {
                        key: 'count',
                        className: 'text-sm text-gray-500'
                    }, `${savedConcepts.length} saved concepts`),
                    React.createElement('p', {
                        key: 'user',
                        className: 'text-xs text-gray-400'
                    }, `User: ${auth.user?.name}`)
                ])
            ]),

            // Mode selector
            React.createElement('div', {
                key: 'mode-selector',
                className: 'flex space-x-1 bg-gray-100 rounded-lg p-1'
            }, [
                React.createElement('button', {
                    key: 'forward',
                    onClick: () => switchMode('forward'),
                    className: `flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                        activeMode === 'forward' 
                            ? 'bg-white text-pristine-700 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                    }`
                }, [
                    React.createElement('i', {
                        key: 'icon',
                        className: 'fas fa-arrow-right mr-2'
                    }),
                    'Forward Mode',
                    React.createElement('span', {
                        key: 'desc',
                        className: 'ml-2 text-xs opacity-75'
                    }, 'Idea → Product')
                ]),
                React.createElement('button', {
                    key: 'reverse',
                    onClick: () => switchMode('reverse'),
                    className: `flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                        activeMode === 'reverse' 
                            ? 'bg-white text-pristine-700 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                    }`
                }, [
                    React.createElement('i', {
                        key: 'icon',
                        className: 'fas fa-arrow-left mr-2'
                    }),
                    'Reverse Mode',
                    React.createElement('span', {
                        key: 'desc',
                        className: 'ml-2 text-xs opacity-75'
                    }, 'Product → Insights')
                ])
            ])
        ]),

        // Main content area
        activeMode === 'forward' 
            ? React.createElement(ForwardMode, {
                key: 'forward-mode',
                inputData,
                setInputData,
                results,
                setResults,
                loading,
                setLoading
            })
            : React.createElement(ReverseMode, {
                key: 'reverse-mode',
                inputData,
                setInputData,
                results,
                setResults,
                loading,
                setLoading
            }),

        // Results display
        results && React.createElement(ConceptResults, {
            key: 'results',
            results,
            mode: activeMode,
            onSave: (concept) => {
                setSavedConcepts(prev => [concept, ...prev]);
                notifications.success('Concept saved successfully');
            }
        }),

        // Saved concepts
        savedConcepts.length > 0 && React.createElement(SavedConcepts, {
            key: 'saved',
            concepts: savedConcepts,
            onLoad: (concept) => {
                setInputData(concept.inputData || {});
                setResults(concept.results);
            }
        })
    ]);
}

// Forward Mode: Idea → Product Concept
function ForwardMode({ inputData, setInputData, results, setResults, loading, setLoading }) {
    const [ideaText, setIdeaText] = useState(inputData.ideaText || '');
    const [targetMarket, setTargetMarket] = useState(inputData.targetMarket || '');
    const [constraints, setConstraints] = useState(inputData.constraints || {});
    const [preferences, setPreferences] = useState(inputData.preferences || {});

    const notifications = useNotifications();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ideaText.trim()) {
            notifications.validationError(['Idea description']);
            return;
        }

        setLoading(true);
        try {
            const request = {
                ideaText,
                targetMarket,
                constraints,
                preferences,
                mode: 'forward'
            };

            // Mock AI response - in production this would call actual AI service
            const mockResponse = await generateMockForwardConcept(request);
            
            setResults(mockResponse);
            setInputData(request);
            notifications.success('AI concept generated successfully');
        } catch (error) {
            notifications.error('Failed to generate concept');
            console.error('Concept generation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'mb-6'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-xl font-semibold text-gray-900 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: 'fas fa-lightbulb text-yellow-500 mr-3'
                }),
                'Forward Mode: Transform Your Idea'
            ]),
            React.createElement('p', {
                key: 'description',
                className: 'text-gray-600 mt-2'
            }, 'Describe your product idea and let AI generate comprehensive concepts, formulations, and market positioning.')
        ]),

        React.createElement('form', {
            key: 'form',
            onSubmit: handleSubmit,
            className: 'space-y-6'
        }, [
            // Idea input
            React.createElement('div', {
                key: 'idea-section',
                className: 'space-y-4'
            }, [
                React.createElement('div', { key: 'idea-field' }, [
                    React.createElement('label', {
                        key: 'label',
                        className: 'form-label'
                    }, 'Product Idea Description *'),
                    React.createElement('textarea', {
                        key: 'textarea',
                        value: ideaText,
                        onChange: (e) => setIdeaText(e.target.value),
                        className: 'form-textarea h-32',
                        placeholder: 'Example: "A natural deodorant that provides 24-hour protection for active professionals, using zinc and plant-based ingredients, with a subtle citrus scent and eco-friendly packaging..."',
                        required: true
                    }),
                    React.createElement('p', {
                        key: 'hint',
                        className: 'text-sm text-gray-500 mt-1'
                    }, 'Be as detailed as possible. Include target benefits, ingredients preferences, scent notes, and any specific requirements.')
                ]),

                React.createElement('div', { key: 'market-field' }, [
                    React.createElement('label', {
                        key: 'label',
                        className: 'form-label'
                    }, 'Target Market'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: targetMarket,
                        onChange: (e) => setTargetMarket(e.target.value),
                        className: 'form-input',
                        placeholder: 'e.g., Active millennials, Eco-conscious consumers, Professional athletes'
                    })
                ])
            ]),

            // Constraints section
            React.createElement('div', {
                key: 'constraints-section',
                className: 'border-t pt-6'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'font-medium text-gray-900 mb-4'
                }, 'Product Constraints & Requirements'),
                
                React.createElement('div', {
                    key: 'constraints-grid',
                    className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
                }, [
                    React.createElement('div', { key: 'price-range' }, [
                        React.createElement('label', {
                            key: 'label',
                            className: 'form-label'
                        }, 'Target Price Range'),
                        React.createElement('select', {
                            key: 'select',
                            value: constraints.priceRange || '',
                            onChange: (e) => setConstraints(prev => ({...prev, priceRange: e.target.value})),
                            className: 'form-select'
                        }, [
                            React.createElement('option', { key: 'empty', value: '' }, 'Select price range'),
                            React.createElement('option', { key: 'budget', value: 'budget' }, 'Budget ($5-10)'),
                            React.createElement('option', { key: 'mid', value: 'mid' }, 'Mid-range ($10-20)'),
                            React.createElement('option', { key: 'premium', value: 'premium' }, 'Premium ($20-35)'),
                            React.createElement('option', { key: 'luxury', value: 'luxury' }, 'Luxury ($35+)')
                        ])
                    ]),

                    React.createElement('div', { key: 'size' }, [
                        React.createElement('label', {
                            key: 'label',
                            className: 'form-label'
                        }, 'Product Size'),
                        React.createElement('select', {
                            key: 'select',
                            value: constraints.size || '',
                            onChange: (e) => setConstraints(prev => ({...prev, size: e.target.value})),
                            className: 'form-select'
                        }, [
                            React.createElement('option', { key: 'empty', value: '' }, 'Select size'),
                            React.createElement('option', { key: 'travel', value: 'travel' }, 'Travel (1.0-1.5 oz)'),
                            React.createElement('option', { key: 'standard', value: 'standard' }, 'Standard (2.0-2.5 oz)'),
                            React.createElement('option', { key: 'large', value: 'large' }, 'Large (3.0+ oz)')
                        ])
                    ]),

                    React.createElement('div', { key: 'certifications' }, [
                        React.createElement('label', {
                            key: 'label',
                            className: 'form-label'
                        }, 'Required Certifications'),
                        React.createElement('div', {
                            key: 'checkboxes',
                            className: 'space-y-2 mt-2'
                        }, [
                            ['organic', 'Organic'],
                            ['natural', 'Natural'],
                            ['vegan', 'Vegan'],
                            ['cruelty_free', 'Cruelty-Free'],
                            ['made_safe', 'Made Safe']
                        ].map(([value, label]) =>
                            React.createElement('label', {
                                key: value,
                                className: 'flex items-center'
                            }, [
                                React.createElement('input', {
                                    key: 'checkbox',
                                    type: 'checkbox',
                                    checked: constraints.certifications?.[value] || false,
                                    onChange: (e) => setConstraints(prev => ({
                                        ...prev,
                                        certifications: {
                                            ...prev.certifications,
                                            [value]: e.target.checked
                                        }
                                    })),
                                    className: 'form-checkbox mr-2'
                                }),
                                React.createElement('span', {
                                    key: 'label',
                                    className: 'text-sm text-gray-700'
                                }, label)
                            ])
                        ))
                    ]),

                    React.createElement('div', { key: 'packaging' }, [
                        React.createElement('label', {
                            key: 'label',
                            className: 'form-label'
                        }, 'Packaging Preferences'),
                        React.createElement('div', {
                            key: 'checkboxes',
                            className: 'space-y-2 mt-2'
                        }, [
                            ['compostable', 'Compostable'],
                            ['recyclable', 'Recyclable'],
                            ['minimal', 'Minimal Packaging'],
                            ['refillable', 'Refillable']
                        ].map(([value, label]) =>
                            React.createElement('label', {
                                key: value,
                                className: 'flex items-center'
                            }, [
                                React.createElement('input', {
                                    key: 'checkbox',
                                    type: 'checkbox',
                                    checked: constraints.packaging?.[value] || false,
                                    onChange: (e) => setConstraints(prev => ({
                                        ...prev,
                                        packaging: {
                                            ...prev.packaging,
                                            [value]: e.target.checked
                                        }
                                    })),
                                    className: 'form-checkbox mr-2'
                                }),
                                React.createElement('span', {
                                    key: 'label',
                                    className: 'text-sm text-gray-700'
                                }, label)
                            ])
                        ))
                    ])
                ])
            ]),

            // Ingredient preferences
            React.createElement('div', {
                key: 'preferences-section',
                className: 'border-t pt-6'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'font-medium text-gray-900 mb-4'
                }, 'Ingredient Preferences'),
                
                React.createElement('div', {
                    key: 'preferences-grid',
                    className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
                }, [
                    React.createElement('div', { key: 'avoid' }, [
                        React.createElement('label', {
                            key: 'label',
                            className: 'form-label'
                        }, 'Ingredients to Avoid'),
                        React.createElement('textarea', {
                            key: 'textarea',
                            value: preferences.avoid || '',
                            onChange: (e) => setPreferences(prev => ({...prev, avoid: e.target.value})),
                            className: 'form-textarea h-20',
                            placeholder: 'e.g., Aluminum, Parabens, Phthalates, Artificial fragrances'
                        })
                    ]),

                    React.createElement('div', { key: 'required' }, [
                        React.createElement('label', {
                            key: 'label',
                            className: 'form-label'
                        }, 'Must-Have Ingredients'),
                        React.createElement('textarea', {
                            key: 'textarea',
                            value: preferences.required || '',
                            onChange: (e) => setPreferences(prev => ({...prev, required: e.target.value})),
                            className: 'form-textarea h-20',
                            placeholder: 'e.g., Zinc ricinoleate, Coconut oil, Shea butter, Probiotics'
                        })
                    ])
                ])
            ]),

            // Submit button
            React.createElement('div', {
                key: 'submit-section',
                className: 'border-t pt-6'
            },
                React.createElement('button', {
                    key: 'submit',
                    type: 'submit',
                    disabled: loading || !ideaText.trim(),
                    className: 'btn btn-primary btn-lg'
                }, loading ? [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'loading-spinner mr-2'
                    }),
                    'Generating Concept...'
                ] : [
                    React.createElement('i', {
                        key: 'icon',
                        className: 'fas fa-magic mr-2'
                    }),
                    'Generate AI Concept'
                ])
            )
        ])
    ]);
}

// Reverse Mode: Product → Analysis & Improvements
function ReverseMode({ inputData, setInputData, results, setResults, loading, setLoading }) {
    const [selectedProduct, setSelectedProduct] = useState(inputData.selectedProduct || null);
    const [products, setProducts] = useState([]);
    const [analysisType, setAnalysisType] = useState(inputData.analysisType || 'comprehensive');

    const notifications = useNotifications();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await api.getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) {
            notifications.validationError(['Product selection']);
            return;
        }

        setLoading(true);
        try {
            const request = {
                selectedProduct,
                analysisType,
                mode: 'reverse'
            };

            // Mock AI response - in production this would call actual AI service
            const mockResponse = await generateMockReverseConcept(request);
            
            setResults(mockResponse);
            setInputData(request);
            notifications.success('AI analysis completed successfully');
        } catch (error) {
            notifications.error('Failed to analyze product');
            console.error('Product analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'mb-6'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-xl font-semibold text-gray-900 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: 'fas fa-search text-blue-500 mr-3'
                }),
                'Reverse Mode: Analyze & Optimize'
            ]),
            React.createElement('p', {
                key: 'description',
                className: 'text-gray-600 mt-2'
            }, 'Select an existing product to identify weaknesses, missed opportunities, and innovation potential.')
        ]),

        React.createElement('form', {
            key: 'form',
            onSubmit: handleSubmit,
            className: 'space-y-6'
        }, [
            // Product selection
            React.createElement('div', {
                key: 'product-section'
            }, [
                React.createElement('label', {
                    key: 'label',
                    className: 'form-label'
                }, 'Select Product to Analyze *'),
                
                products.length === 0 ? 
                    React.createElement('div', {
                        key: 'loading',
                        className: 'p-4 text-center text-gray-500'
                    }, 'Loading products...') :
                    React.createElement('div', {
                        key: 'product-grid',
                        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2'
                    },
                        products.map(product =>
                            React.createElement('div', {
                                key: product.id,
                                onClick: () => setSelectedProduct(product),
                                className: `p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                                    selectedProduct?.id === product.id 
                                        ? 'border-pristine-500 bg-pristine-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`
                            }, [
                                React.createElement('h4', {
                                    key: 'name',
                                    className: 'font-medium text-gray-900'
                                }, product.name),
                                React.createElement('p', {
                                    key: 'description',
                                    className: 'text-sm text-gray-600 mt-1'
                                }, product.description || 'No description available'),
                                React.createElement('div', {
                                    key: 'meta',
                                    className: 'flex items-center justify-between mt-3'
                                }, [
                                    React.createElement('span', {
                                        key: 'status',
                                        className: `status-badge status-${product.status === 'active' ? 'active' : 'pending'}`
                                    }, product.status),
                                    React.createElement('span', {
                                        key: 'category',
                                        className: 'text-xs text-gray-500'
                                    }, product.category)
                                ])
                            ])
                        )
                    )
            ]),

            // Analysis type
            selectedProduct && React.createElement('div', {
                key: 'analysis-section',
                className: 'border-t pt-6'
            }, [
                React.createElement('label', {
                    key: 'label',
                    className: 'form-label'
                }, 'Analysis Type'),
                React.createElement('div', {
                    key: 'options',
                    className: 'space-y-3 mt-2'
                }, [
                    {
                        value: 'comprehensive',
                        title: 'Comprehensive Analysis',
                        description: 'Full analysis including formula, market positioning, cost optimization, and innovation opportunities'
                    },
                    {
                        value: 'formula',
                        title: 'Formula Analysis',
                        description: 'Focus on ingredient optimization, efficacy improvements, and cost reduction'
                    },
                    {
                        value: 'market',
                        title: 'Market Analysis',
                        description: 'Competitive positioning, pricing strategy, and market opportunity assessment'
                    },
                    {
                        value: 'innovation',
                        title: 'Innovation Opportunities',
                        description: 'Identify white spaces, emerging trends, and breakthrough innovation potential'
                    }
                ].map(option =>
                    React.createElement('label', {
                        key: option.value,
                        className: 'flex items-start space-x-3 cursor-pointer'
                    }, [
                        React.createElement('input', {
                            key: 'radio',
                            type: 'radio',
                            name: 'analysisType',
                            value: option.value,
                            checked: analysisType === option.value,
                            onChange: (e) => setAnalysisType(e.target.value),
                            className: 'form-radio mt-1'
                        }),
                        React.createElement('div', {
                            key: 'content'
                        }, [
                            React.createElement('p', {
                                key: 'title',
                                className: 'font-medium text-gray-900'
                            }, option.title),
                            React.createElement('p', {
                                key: 'description',
                                className: 'text-sm text-gray-600'
                            }, option.description)
                        ])
                    ])
                ))
            ]),

            // Submit button
            React.createElement('div', {
                key: 'submit-section',
                className: 'border-t pt-6'
            },
                React.createElement('button', {
                    key: 'submit',
                    type: 'submit',
                    disabled: loading || !selectedProduct,
                    className: 'btn btn-primary btn-lg'
                }, loading ? [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'loading-spinner mr-2'
                    }),
                    'Analyzing Product...'
                ] : [
                    React.createElement('i', {
                        key: 'icon',
                        className: 'fas fa-analytics mr-2'
                    }),
                    'Start AI Analysis'
                ])
            )
        ])
    ]);
}

// Mock AI concept generation functions
async function generateMockForwardConcept(request) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        conceptId: `concept_${Date.now()}`,
        timestamp: new Date().toISOString(),
        mode: 'forward',
        input: request,
        concepts: [
            {
                id: 'concept_1',
                name: 'ZenShield Pro Natural Defense',
                confidence: 92,
                description: 'Premium natural deodorant with advanced zinc ricinoleate complex and probiotic boost',
                positioning: 'Ultra-performance natural protection for demanding lifestyles',
                targetPrice: '$24.99',
                formula: {
                    base: 'Coconut oil & shea butter base',
                    actives: [
                        'Zinc ricinoleate 8%',
                        'Magnesium hydroxide 4%',
                        'Probiotic complex 2%'
                    ],
                    fragrance: 'Citrus bergamot with subtle mint finish',
                    innovations: [
                        'Time-release zinc technology',
                        'Microencapsulated probiotics',
                        'pH-balanced formula (6.8-7.2)'
                    ]
                },
                packaging: {
                    material: 'Compostable paper tube with plant-based coating',
                    size: '2.5 oz (70g)',
                    certifications: ['FSC Certified', 'Home Compostable']
                },
                marketAnalysis: {
                    competitiveAdvantage: 'First natural deodorant with proven 24hr protection',
                    targetSegment: 'Active professionals aged 25-45',
                    marketSize: '$2.1B natural deodorant market',
                    growthPotential: 'High - 23% CAGR expected'
                }
            },
            {
                id: 'concept_2',
                name: 'EcoGuard Essential',
                confidence: 87,
                description: 'Accessible natural deodorant with core protection essentials',
                positioning: 'Everyday natural protection without compromise',
                targetPrice: '$14.99',
                formula: {
                    base: 'Coconut oil & candelilla wax base',
                    actives: [
                        'Zinc ricinoleate 6%',
                        'Baking soda alternative (magnesium) 3%'
                    ],
                    fragrance: 'Light citrus blend',
                    innovations: [
                        'Sensitive skin formulation',
                        'Quick-dry technology'
                    ]
                },
                packaging: {
                    material: 'Recycled cardboard tube',
                    size: '2.2 oz (62g)',
                    certifications: ['FSC Certified', 'Recyclable']
                }
            }
        ],
        recommendations: [
            'Focus on zinc ricinoleate as primary differentiator',
            'Consider probiotic addition for premium positioning',
            'Compostable packaging aligns with eco-conscious values',
            'Test citrus fragrances with target demographic'
        ],
        nextSteps: [
            'Develop prototype formulas for testing',
            'Validate packaging compostability claims',
            'Conduct consumer preference studies',
            'Estimate production costs at scale'
        ]
    };
}

async function generateMockReverseConcept(request) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        analysisId: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString(),
        mode: 'reverse',
        product: request.selectedProduct,
        analysisType: request.analysisType,
        
        currentState: {
            strengths: [
                'Strong natural positioning',
                'Effective zinc-based formula',
                'Loyal customer base'
            ],
            weaknesses: [
                'Limited size options',
                'Higher price point vs competitors',
                'Packaging not fully sustainable'
            ],
            opportunities: [
                'Expand into sensitive skin market',
                'Add refillable packaging option',
                'Develop travel-size variants'
            ],
            threats: [
                'New competitors entering natural space',
                'Ingredient cost inflation',
                'Regulatory changes in natural claims'
            ]
        },
        
        innovations: [
            {
                type: 'Formula Enhancement',
                title: 'Probiotic Boost Technology',
                description: 'Add microencapsulated probiotics for skin health benefits',
                impact: 'High - Creates unique selling proposition',
                feasibility: 'Medium - Requires stability testing',
                investment: 'Moderate - $50K development cost'
            },
            {
                type: 'Packaging Innovation',
                title: 'Zero-Waste Refill System',
                description: 'Reusable applicator with compostable refill cartridges',
                impact: 'High - Appeals to eco-conscious consumers',
                feasibility: 'High - Technology exists',
                investment: 'Significant - $200K tooling and setup'
            }
        ],
        
        optimizations: [
            {
                area: 'Cost Reduction',
                suggestions: [
                    'Optimize zinc ricinoleate concentration (current 8% could be 6%)',
                    'Source coconut oil directly from producers',
                    'Increase production volume for better unit economics'
                ],
                potentialSavings: '$2.50 per unit at 5K volume'
            },
            {
                area: 'Performance Enhancement',
                suggestions: [
                    'Add chitosan for extended protection',
                    'Optimize pH balance for better skin compatibility',
                    'Include moisture-wicking silica'
                ],
                expectedImprovement: '15-20% better consumer testing scores'
            }
        ],
        
        marketInsights: [
            'Natural deodorant market growing at 23% CAGR',
            'Sensitive skin segment underserved (32% of market)',
            'Refillable packaging increasing 45% annually',
            'Premium natural products show price resilience'
        ],
        
        actionPlan: [
            {
                phase: 'Immediate (0-3 months)',
                actions: [
                    'Develop probiotic-enhanced formula prototype',
                    'Test current formula at 6% zinc concentration',
                    'Research refillable packaging suppliers'
                ]
            },
            {
                phase: 'Short-term (3-6 months)',
                actions: [
                    'Consumer test enhanced formulas',
                    'Develop packaging prototypes',
                    'Validate cost optimization opportunities'
                ]
            },
            {
                phase: 'Medium-term (6-12 months)',
                actions: [
                    'Launch optimized formula',
                    'Introduce refillable option',
                    'Expand to travel and sensitive skin variants'
                ]
            }
        ]
    };
}

// Results display component
function ConceptResults({ results, mode, onSave }) {
    const [activeTab, setActiveTab] = useState(0);
    
    if (!results) return null;

    const tabs = mode === 'forward' 
        ? ['Concepts', 'Analysis', 'Next Steps']
        : ['Overview', 'Innovations', 'Optimizations', 'Action Plan'];

    const saveToPortfolio = async (concept) => {
        try {
            // Save concept as new product draft
            const productData = {
                name: concept.name,
                description: concept.description,
                category: 'deodorant',
                status: 'concept',
                target_price: parseFloat(concept.targetPrice?.replace('$', '') || 0),
                tags: ['AI Generated', 'Concept', mode === 'forward' ? 'Forward Mode' : 'Reverse Mode']
            };

            await api.createProduct(productData);
            
            // Save AI insight
            const insightData = {
                type: `concept_${mode}`,
                title: concept.name || 'AI Generated Concept',
                description: `AI-generated concept from ${mode} mode analysis`,
                confidence_score: concept.confidence || 85,
                proposed_changes: JSON.stringify(concept),
                status: 'pending'
            };

            await api.createRecord('ai_insights', insightData);
            
            onSave(concept);
        } catch (error) {
            console.error('Failed to save concept:', error);
            notifications.error('Failed to save concept to portfolio');
        }
    };

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200'
    }, [
        // Header with tabs
        React.createElement('div', {
            key: 'header',
            className: 'border-b border-gray-200 p-6'
        }, [
            React.createElement('div', {
                key: 'title-section',
                className: 'flex items-center justify-between mb-4'
            }, [
                React.createElement('h2', {
                    key: 'title',
                    className: 'text-xl font-semibold text-gray-900'
                }, `AI ${mode === 'forward' ? 'Concept' : 'Analysis'} Results`),
                React.createElement('div', {
                    key: 'meta',
                    className: 'text-sm text-gray-500'
                }, `Generated: ${new Date(results.timestamp).toLocaleString()}`)
            ]),

            // Tabs
            React.createElement('div', {
                key: 'tabs',
                className: 'flex space-x-6 border-b'
            },
                tabs.map((tab, index) =>
                    React.createElement('button', {
                        key: index,
                        onClick: () => setActiveTab(index),
                        className: `pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === index 
                                ? 'border-pristine-500 text-pristine-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`
                    }, tab)
                )
            )
        ]),

        // Tab content
        React.createElement('div', {
            key: 'content',
            className: 'p-6'
        }, 
            mode === 'forward' ? 
                renderForwardResults(results, activeTab, saveToPortfolio) :
                renderReverseResults(results, activeTab, saveToPortfolio)
        )
    ]);
}

function renderForwardResults(results, activeTab, onSave) {
    switch (activeTab) {
        case 0: // Concepts
            return React.createElement('div', {
                className: 'space-y-6'
            },
                results.concepts.map((concept, index) =>
                    React.createElement('div', {
                        key: concept.id,
                        className: 'border border-gray-200 rounded-lg p-6'
                    }, [
                        // Concept header
                        React.createElement('div', {
                            key: 'header',
                            className: 'flex items-start justify-between mb-4'
                        }, [
                            React.createElement('div', {
                                key: 'info'
                            }, [
                                React.createElement('h3', {
                                    key: 'name',
                                    className: 'text-lg font-semibold text-gray-900'
                                }, concept.name),
                                React.createElement('p', {
                                    key: 'description',
                                    className: 'text-gray-600 mt-1'
                                }, concept.description)
                            ]),
                            React.createElement('div', {
                                key: 'actions',
                                className: 'flex items-center space-x-2'
                            }, [
                                React.createElement('div', {
                                    key: 'confidence',
                                    className: 'text-sm text-gray-500'
                                }, `${concept.confidence}% confidence`),
                                React.createElement('button', {
                                    key: 'save',
                                    onClick: () => onSave(concept),
                                    className: 'btn btn-primary btn-sm'
                                }, 'Save to Portfolio')
                            ])
                        ]),

                        // Concept details grid
                        React.createElement('div', {
                            key: 'details',
                            className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                        }, [
                            // Formula details
                            React.createElement('div', {
                                key: 'formula',
                                className: 'space-y-3'
                            }, [
                                React.createElement('h4', {
                                    key: 'title',
                                    className: 'font-medium text-gray-900'
                                }, 'Formula Innovation'),
                                React.createElement('div', {
                                    key: 'base',
                                    className: 'text-sm'
                                }, [
                                    React.createElement('span', {
                                        key: 'label',
                                        className: 'font-medium'
                                    }, 'Base: '),
                                    React.createElement('span', {
                                        key: 'value'
                                    }, concept.formula.base)
                                ]),
                                React.createElement('div', {
                                    key: 'actives'
                                }, [
                                    React.createElement('p', {
                                        key: 'label',
                                        className: 'font-medium text-sm mb-2'
                                    }, 'Active Ingredients:'),
                                    React.createElement('ul', {
                                        key: 'list',
                                        className: 'text-sm text-gray-600 space-y-1'
                                    },
                                        concept.formula.actives.map((active, i) =>
                                            React.createElement('li', {
                                                key: i,
                                                className: 'flex items-center'
                                            }, [
                                                React.createElement('i', {
                                                    key: 'icon',
                                                    className: 'fas fa-check text-green-500 text-xs mr-2'
                                                }),
                                                active
                                            ])
                                        )
                                    )
                                ]),
                                concept.formula.innovations && React.createElement('div', {
                                    key: 'innovations'
                                }, [
                                    React.createElement('p', {
                                        key: 'label',
                                        className: 'font-medium text-sm mb-2'
                                    }, 'Innovations:'),
                                    React.createElement('ul', {
                                        key: 'list',
                                        className: 'text-sm text-gray-600 space-y-1'
                                    },
                                        concept.formula.innovations.map((innovation, i) =>
                                            React.createElement('li', {
                                                key: i,
                                                className: 'flex items-center'
                                            }, [
                                                React.createElement('i', {
                                                    key: 'icon',
                                                    className: 'fas fa-lightbulb text-yellow-500 text-xs mr-2'
                                                }),
                                                innovation
                                            ])
                                        )
                                    )
                                ])
                            ]),

                            // Market positioning
                            React.createElement('div', {
                                key: 'market',
                                className: 'space-y-3'
                            }, [
                                React.createElement('h4', {
                                    key: 'title',
                                    className: 'font-medium text-gray-900'
                                }, 'Market Positioning'),
                                React.createElement('div', {
                                    key: 'positioning',
                                    className: 'text-sm'
                                }, [
                                    React.createElement('span', {
                                        key: 'label',
                                        className: 'font-medium'
                                    }, 'Positioning: '),
                                    React.createElement('span', {
                                        key: 'value'
                                    }, concept.positioning)
                                ]),
                                React.createElement('div', {
                                    key: 'price',
                                    className: 'text-sm'
                                }, [
                                    React.createElement('span', {
                                        key: 'label',
                                        className: 'font-medium'
                                    }, 'Target Price: '),
                                    React.createElement('span', {
                                        key: 'value',
                                        className: 'text-green-600 font-semibold'
                                    }, concept.targetPrice)
                                ]),
                                concept.marketAnalysis && React.createElement('div', {
                                    key: 'analysis'
                                }, [
                                    React.createElement('p', {
                                        key: 'label',
                                        className: 'font-medium text-sm mb-2'
                                    }, 'Market Analysis:'),
                                    Object.entries(concept.marketAnalysis).map(([key, value]) =>
                                        React.createElement('div', {
                                            key,
                                            className: 'text-xs text-gray-600 mb-1'
                                        }, [
                                            React.createElement('span', {
                                                key: 'label',
                                                className: 'font-medium capitalize'
                                            }, key.replace(/([A-Z])/g, ' $1').trim() + ': '),
                                            React.createElement('span', {
                                                key: 'value'
                                            }, value)
                                        ])
                                    )
                                ])
                            ])
                        ])
                    ])
                )
            );

        case 1: // Analysis
            return React.createElement('div', {
                className: 'space-y-6'
            }, [
                React.createElement('div', {
                    key: 'recommendations',
                    className: 'bg-blue-50 border border-blue-200 rounded-lg p-4'
                }, [
                    React.createElement('h4', {
                        key: 'title',
                        className: 'font-medium text-blue-900 mb-3'
                    }, 'AI Recommendations'),
                    React.createElement('ul', {
                        key: 'list',
                        className: 'space-y-2'
                    },
                        results.recommendations.map((rec, index) =>
                            React.createElement('li', {
                                key: index,
                                className: 'flex items-start'
                            }, [
                                React.createElement('i', {
                                    key: 'icon',
                                    className: 'fas fa-lightbulb text-blue-500 text-sm mt-0.5 mr-2'
                                }),
                                React.createElement('span', {
                                    key: 'text',
                                    className: 'text-blue-800'
                                }, rec)
                            ])
                        )
                    )
                ])
            ]);

        case 2: // Next Steps
            return React.createElement('div', {
                className: 'space-y-6'
            }, [
                React.createElement('div', {
                    key: 'next-steps',
                    className: 'bg-green-50 border border-green-200 rounded-lg p-4'
                }, [
                    React.createElement('h4', {
                        key: 'title',
                        className: 'font-medium text-green-900 mb-3'
                    }, 'Recommended Next Steps'),
                    React.createElement('ul', {
                        key: 'list',
                        className: 'space-y-2'
                    },
                        results.nextSteps.map((step, index) =>
                            React.createElement('li', {
                                key: index,
                                className: 'flex items-start'
                            }, [
                                React.createElement('div', {
                                    key: 'number',
                                    className: 'w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center mt-0.5 mr-3'
                                }, index + 1),
                                React.createElement('span', {
                                    key: 'text',
                                    className: 'text-green-800'
                                }, step)
                            ])
                        )
                    )
                ])
            ]);

        default:
            return null;
    }
}

function renderReverseResults(results, activeTab, onSave) {
    switch (activeTab) {
        case 0: // Overview
            return React.createElement('div', {
                className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
            }, [
                // SWOT Analysis
                React.createElement('div', {
                    key: 'swot',
                    className: 'space-y-4'
                }, [
                    React.createElement('h4', {
                        key: 'title',
                        className: 'font-medium text-gray-900'
                    }, 'SWOT Analysis'),
                    
                    ['strengths', 'weaknesses', 'opportunities', 'threats'].map(category => 
                        React.createElement('div', {
                            key: category,
                            className: 'border border-gray-200 rounded-lg p-3'
                        }, [
                            React.createElement('h5', {
                                key: 'category-title',
                                className: 'font-medium text-sm capitalize mb-2'
                            }, category),
                            React.createElement('ul', {
                                key: 'list',
                                className: 'text-sm text-gray-600 space-y-1'
                            },
                                results.currentState[category].map((item, index) =>
                                    React.createElement('li', {
                                        key: index,
                                        className: 'flex items-start'
                                    }, [
                                        React.createElement('i', {
                                            key: 'icon',
                                            className: `fas fa-${category === 'strengths' || category === 'opportunities' ? 'plus' : 'minus'} text-xs mr-2 mt-1 ${
                                                category === 'strengths' ? 'text-green-500' :
                                                category === 'weaknesses' ? 'text-red-500' :
                                                category === 'opportunities' ? 'text-blue-500' : 'text-yellow-500'
                                            }`
                                        }),
                                        React.createElement('span', {
                                            key: 'text'
                                        }, item)
                                    ])
                                )
                            )
                        ])
                    )
                ]),

                // Market Insights
                React.createElement('div', {
                    key: 'insights',
                    className: 'space-y-4'
                }, [
                    React.createElement('h4', {
                        key: 'title',
                        className: 'font-medium text-gray-900'
                    }, 'Market Insights'),
                    React.createElement('div', {
                        key: 'insights-list',
                        className: 'space-y-3'
                    },
                        results.marketInsights.map((insight, index) =>
                            React.createElement('div', {
                                key: index,
                                className: 'bg-gray-50 border border-gray-200 rounded-lg p-3'
                            }, [
                                React.createElement('div', {
                                    key: 'content',
                                    className: 'flex items-start'
                                }, [
                                    React.createElement('i', {
                                        key: 'icon',
                                        className: 'fas fa-chart-line text-pristine-500 text-sm mr-2 mt-0.5'
                                    }),
                                    React.createElement('span', {
                                        key: 'text',
                                        className: 'text-sm text-gray-700'
                                    }, insight)
                                ])
                            ])
                        )
                    )
                ])
            ]);

        case 1: // Innovations
            return React.createElement('div', {
                className: 'space-y-6'
            },
                results.innovations.map((innovation, index) =>
                    React.createElement('div', {
                        key: index,
                        className: 'border border-gray-200 rounded-lg p-6'
                    }, [
                        React.createElement('div', {
                            key: 'header',
                            className: 'flex items-start justify-between mb-4'
                        }, [
                            React.createElement('div', {
                                key: 'info'
                            }, [
                                React.createElement('div', {
                                    key: 'type',
                                    className: 'flex items-center mb-2'
                                }, [
                                    React.createElement('span', {
                                        key: 'badge',
                                        className: 'status-badge status-info'
                                    }, innovation.type),
                                    React.createElement('span', {
                                        key: 'impact',
                                        className: `ml-2 text-xs px-2 py-1 rounded-full ${
                                            innovation.impact.startsWith('High') ? 'bg-green-100 text-green-800' :
                                            innovation.impact.startsWith('Medium') ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`
                                    }, innovation.impact.split(' - ')[0])
                                ]),
                                React.createElement('h4', {
                                    key: 'title',
                                    className: 'text-lg font-medium text-gray-900'
                                }, innovation.title),
                                React.createElement('p', {
                                    key: 'description',
                                    className: 'text-gray-600 mt-2'
                                }, innovation.description)
                            ]),
                            React.createElement('button', {
                                key: 'save',
                                onClick: () => onSave(innovation),
                                className: 'btn btn-outline btn-sm'
                            }, 'Add to Roadmap')
                        ]),

                        React.createElement('div', {
                            key: 'details',
                            className: 'grid grid-cols-3 gap-4 text-sm'
                        }, [
                            React.createElement('div', {
                                key: 'impact'
                            }, [
                                React.createElement('span', {
                                    key: 'label',
                                    className: 'font-medium text-gray-700'
                                }, 'Impact: '),
                                React.createElement('span', {
                                    key: 'value'
                                }, innovation.impact.split(' - ')[1] || innovation.impact)
                            ]),
                            React.createElement('div', {
                                key: 'feasibility'
                            }, [
                                React.createElement('span', {
                                    key: 'label',
                                    className: 'font-medium text-gray-700'
                                }, 'Feasibility: '),
                                React.createElement('span', {
                                    key: 'value'
                                }, innovation.feasibility.split(' - ')[0])
                            ]),
                            React.createElement('div', {
                                key: 'investment'
                            }, [
                                React.createElement('span', {
                                    key: 'label',
                                    className: 'font-medium text-gray-700'
                                }, 'Investment: '),
                                React.createElement('span', {
                                    key: 'value'
                                }, innovation.investment.split(' - ')[0])
                            ])
                        ])
                    ])
                )
            );

        case 2: // Optimizations
            return React.createElement('div', {
                className: 'space-y-6'
            },
                results.optimizations.map((opt, index) =>
                    React.createElement('div', {
                        key: index,
                        className: 'bg-gray-50 border border-gray-200 rounded-lg p-6'
                    }, [
                        React.createElement('h4', {
                            key: 'title',
                            className: 'text-lg font-medium text-gray-900 mb-4'
                        }, opt.area),
                        React.createElement('ul', {
                            key: 'suggestions',
                            className: 'space-y-2 mb-4'
                        },
                            opt.suggestions.map((suggestion, i) =>
                                React.createElement('li', {
                                    key: i,
                                    className: 'flex items-start text-sm text-gray-700'
                                }, [
                                    React.createElement('i', {
                                        key: 'icon',
                                        className: 'fas fa-arrow-right text-pristine-500 text-xs mr-2 mt-1'
                                    }),
                                    suggestion
                                ])
                            )
                        ),
                        (opt.potentialSavings || opt.expectedImprovement) && React.createElement('div', {
                            key: 'impact',
                            className: 'bg-white border border-gray-200 rounded-md p-3'
                        }, [
                            React.createElement('span', {
                                key: 'label',
                                className: 'font-medium text-gray-700'
                            }, opt.potentialSavings ? 'Potential Savings: ' : 'Expected Improvement: '),
                            React.createElement('span', {
                                key: 'value',
                                className: 'text-green-600 font-semibold'
                            }, opt.potentialSavings || opt.expectedImprovement)
                        ])
                    ])
                )
            );

        case 3: // Action Plan
            return React.createElement('div', {
                className: 'space-y-6'
            },
                results.actionPlan.map((phase, index) =>
                    React.createElement('div', {
                        key: index,
                        className: 'border border-gray-200 rounded-lg p-6'
                    }, [
                        React.createElement('h4', {
                            key: 'phase',
                            className: 'text-lg font-medium text-gray-900 mb-4'
                        }, phase.phase),
                        React.createElement('ul', {
                            key: 'actions',
                            className: 'space-y-3'
                        },
                            phase.actions.map((action, i) =>
                                React.createElement('li', {
                                    key: i,
                                    className: 'flex items-start'
                                }, [
                                    React.createElement('div', {
                                        key: 'number',
                                        className: 'w-6 h-6 bg-pristine-500 text-white text-xs rounded-full flex items-center justify-center mt-0.5 mr-3'
                                    }, i + 1),
                                    React.createElement('span', {
                                        key: 'text',
                                        className: 'text-gray-700'
                                    }, action)
                                ])
                            )
                        )
                    ])
                )
            );

        default:
            return null;
    }
}

// Saved Concepts component
function SavedConcepts({ concepts, onLoad }) {
    const [expanded, setExpanded] = useState(false);
    
    if (concepts.length === 0) return null;

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-sm border border-gray-200'
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'p-6 border-b border-gray-200'
        }, [
            React.createElement('button', {
                key: 'toggle',
                onClick: () => setExpanded(!expanded),
                className: 'flex items-center justify-between w-full'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-medium text-gray-900'
                }, `Saved Concepts (${concepts.length})`),
                React.createElement('i', {
                    key: 'icon',
                    className: `fas fa-chevron-${expanded ? 'up' : 'down'} text-gray-400`
                })
            ])
        ]),

        expanded && React.createElement('div', {
            key: 'content',
            className: 'p-6'
        },
            React.createElement('div', {
                key: 'grid',
                className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            },
                concepts.map(concept =>
                    React.createElement('div', {
                        key: concept.id,
                        className: 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer',
                        onClick: () => onLoad(concept)
                    }, [
                        React.createElement('div', {
                            key: 'header',
                            className: 'flex items-start justify-between mb-2'
                        }, [
                            React.createElement('h4', {
                                key: 'title',
                                className: 'font-medium text-gray-900 text-sm'
                            }, concept.title),
                            React.createElement('span', {
                                key: 'type',
                                className: `status-badge ${concept.type.includes('forward') ? 'status-info' : 'status-secondary'}`
                            }, concept.type.includes('forward') ? 'Forward' : 'Reverse')
                        ]),
                        React.createElement('p', {
                            key: 'description',
                            className: 'text-xs text-gray-600 mb-3'
                        }, concept.description),
                        React.createElement('div', {
                            key: 'footer',
                            className: 'flex items-center justify-between text-xs text-gray-500'
                        }, [
                            React.createElement('span', {
                                key: 'date'
                            }, new Date(concept.created_at).toLocaleDateString()),
                            React.createElement('span', {
                                key: 'confidence'
                            }, `${concept.confidence_score}% confidence`)
                        ])
                    ])
                )
            )
        )
    ]);
}

window.ConceptBuilder = ConceptBuilder;
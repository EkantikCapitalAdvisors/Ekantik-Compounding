// ===================================
// Smooth Scroll & Navigation
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Initialize all visualizations
    initCompoundingChart();
    initTieredChart();
    initTaxComparisonChart();
    populateTierTable();

    // Add scroll animations
    observeElements();
});

// ===================================
// Compounding Chart (Hero Section)
// ===================================

function initCompoundingChart() {
    const ctx = document.getElementById('compoundingChart');
    if (!ctx) return;

    const quarters = ['Q0', 'Q4', 'Q8', 'Q12', 'Q16', 'Q20', 'Q24'];
    const values = [10000, 14000, 20000, 50000, 98000, 186000, 501000];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: quarters,
            datasets: [{
                label: 'Portfolio Value',
                data: values,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Value: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// ===================================
// Tiered Risk Scaling Chart
// ===================================

function initTieredChart() {
    const ctx = document.getElementById('tieredChart');
    if (!ctx) return;

    // Data for 7 tiers over 24 quarters
    const tierData = [
        {quarter: 'Start', tier: 1, value: 10000, profit: 0, cumulative: 0, risk: 2.0, baseLock: 10000},
        {quarter: 'Q1', tier: 1, value: 12000, profit: 2000, cumulative: 2000, risk: 2.0, baseLock: 10000},
        {quarter: 'Q2', tier: 1, value: 14000, profit: 2000, cumulative: 4000, risk: 2.0, baseLock: 10000},
        {quarter: 'Q3', tier: 2, value: 17000, profit: 3000, cumulative: 7000, risk: 2.5, baseLock: 14000},
        {quarter: 'Q4', tier: 2, value: 20000, profit: 3000, cumulative: 10000, risk: 2.5, baseLock: 14000},
        {quarter: 'Q5', tier: 3, value: 24500, profit: 4500, cumulative: 14500, risk: 3.0, baseLock: 20000},
        {quarter: 'Q6', tier: 3, value: 29000, profit: 4500, cumulative: 19000, risk: 3.0, baseLock: 20000},
        {quarter: 'Q7', tier: 4, value: 36000, profit: 7000, cumulative: 26000, risk: 3.5, baseLock: 30000},
        {quarter: 'Q8', tier: 4, value: 43000, profit: 7000, cumulative: 33000, risk: 3.5, baseLock: 30000},
        {quarter: 'Q9', tier: 4, value: 50000, profit: 7000, cumulative: 40000, risk: 3.5, baseLock: 30000},
        {quarter: 'Q10', tier: 5, value: 61000, profit: 11000, cumulative: 51000, risk: 4.0, baseLock: 50000},
        {quarter: 'Q11', tier: 5, value: 72000, profit: 11000, cumulative: 62000, risk: 4.0, baseLock: 50000},
        {quarter: 'Q12', tier: 5, value: 83000, profit: 11000, cumulative: 73000, risk: 4.0, baseLock: 50000},
        {quarter: 'Q13', tier: 5, value: 94000, profit: 11000, cumulative: 84000, risk: 4.0, baseLock: 50000},
        {quarter: 'Q14', tier: 6, value: 116000, profit: 22000, cumulative: 106000, risk: 4.5, baseLock: 90000},
        {quarter: 'Q15', tier: 6, value: 138000, profit: 22000, cumulative: 128000, risk: 4.5, baseLock: 90000},
        {quarter: 'Q16', tier: 6, value: 160000, profit: 22000, cumulative: 150000, risk: 4.5, baseLock: 90000},
        {quarter: 'Q17', tier: 6, value: 186000, profit: 26000, cumulative: 176000, risk: 4.5, baseLock: 90000},
        {quarter: 'Q18', tier: 7, value: 231000, profit: 45000, cumulative: 221000, risk: 5.0, baseLock: 180000},
        {quarter: 'Q19', tier: 7, value: 276000, profit: 45000, cumulative: 266000, risk: 5.0, baseLock: 180000},
        {quarter: 'Q20', tier: 7, value: 321000, profit: 45000, cumulative: 311000, risk: 5.0, baseLock: 180000},
        {quarter: 'Q21', tier: 7, value: 366000, profit: 45000, cumulative: 356000, risk: 5.0, baseLock: 180000},
        {quarter: 'Q22', tier: 7, value: 411000, profit: 45000, cumulative: 401000, risk: 5.0, baseLock: 180000},
        {quarter: 'Q23', tier: 7, value: 456000, profit: 45000, cumulative: 446000, risk: 5.0, baseLock: 180000},
        {quarter: 'Q24', tier: 7, value: 501000, profit: 45000, cumulative: 491000, risk: 5.0, baseLock: 180000}
    ];

    const labels = tierData.map(d => d.quarter);
    const portfolioValues = tierData.map(d => d.value);

    // Create gradient colors for different tiers
    const tierColors = [
        '#3b82f6', // Tier 1 - Blue
        '#06b6d4', // Tier 2 - Cyan
        '#10b981', // Tier 3 - Green
        '#f59e0b', // Tier 4 - Amber
        '#f97316', // Tier 5 - Orange
        '#ef4444', // Tier 6 - Red
        '#a855f7'  // Tier 7 - Purple
    ];

    const backgroundColors = tierData.map(d => {
        const alpha = 0.6;
        const color = tierColors[d.tier - 1];
        return color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portfolio Value',
                data: portfolioValues,
                backgroundColor: backgroundColors,
                borderColor: tierData.map(d => tierColors[d.tier - 1]),
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            return tierData[index].quarter + ' - Tier ' + tierData[index].tier;
                        },
                        label: function(context) {
                            const index = context.dataIndex;
                            const data = tierData[index];
                            return [
                                'Portfolio: $' + data.value.toLocaleString(),
                                'Profit/Q: $' + data.profit.toLocaleString(),
                                'Total Profit: $' + data.cumulative.toLocaleString(),
                                'Risk: ' + data.risk + '%'
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false,
                        display: false
                    }
                }
            }
        }
    });
}

// ===================================
// Tax Comparison Chart
// ===================================

function initTaxComparisonChart() {
    const ctx = document.getElementById('taxComparisonChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Roth IRA', 'SPX Options (Section 1256)', 'Equity Options (Short-Term)'],
            datasets: [{
                label: 'After-Tax Amount',
                data: [500000, 369000, 319000],
                backgroundColor: [
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    '#a855f7',
                    '#3b82f6',
                    '#ef4444'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'After-Tax: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 550000,
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false,
                        display: false
                    }
                }
            }
        }
    });
}

// ===================================
// Populate Tier Table
// ===================================

function populateTierTable() {
    const tableBody = document.getElementById('tierTableBody');
    if (!tableBody) return;

    const tierData = [
        {quarter: 'Start', tier: 1, value: '$10,000', profit: '-', cumulative: '$0', risk: '2.0%', baseLock: '$10,000'},
        {quarter: 'Q1', tier: 1, value: '$12,000', profit: '$2,000', cumulative: '$2,000', risk: '2.0%', baseLock: '$10,000'},
        {quarter: 'Q2', tier: 1, value: '$14,000', profit: '$2,000', cumulative: '$4,000', risk: '2.0%', baseLock: '$10,000'},
        {quarter: 'Q3', tier: 2, value: '$17,000', profit: '$3,000', cumulative: '$7,000', risk: '2.5%', baseLock: '$14,000'},
        {quarter: 'Q4', tier: 2, value: '$20,000', profit: '$3,000', cumulative: '$10,000', risk: '2.5%', baseLock: '$14,000'},
        {quarter: 'Q5', tier: 3, value: '$23,000', profit: '$4,500', cumulative: '$14,500', risk: '3.0%', baseLock: '$20,000'},
        {quarter: 'Q6', tier: 3, value: '$29,000', profit: '$4,500', cumulative: '$19,000', risk: '3.0%', baseLock: '$20,000'},
        {quarter: 'Q7', tier: 4, value: '$36,000', profit: '$7,000', cumulative: '$26,000', risk: '3.5%', baseLock: '$30,000'},
        {quarter: 'Q8', tier: 4, value: '$43,000', profit: '$7,000', cumulative: '$33,000', risk: '3.5%', baseLock: '$30,000'},
        {quarter: 'Q9', tier: 4, value: '$50,000', profit: '$7,000', cumulative: '$40,000', risk: '3.5%', baseLock: '$30,000'},
        {quarter: 'Q10', tier: 5, value: '$61,500', profit: '$11,000', cumulative: '$51,000', risk: '4.0%', baseLock: '$50,000'},
        {quarter: 'Q11', tier: 5, value: '$72,500', profit: '$11,000', cumulative: '$62,000', risk: '4.0%', baseLock: '$50,000'},
        {quarter: 'Q12', tier: 5, value: '$83,000', profit: '$11,000', cumulative: '$73,000', risk: '4.0%', baseLock: '$50,000'},
        {quarter: 'Q13', tier: 5, value: '$94,500', profit: '$11,000', cumulative: '$84,000', risk: '4.0%', baseLock: '$50,000'},
        {quarter: 'Q14', tier: 6, value: '$116,000', profit: '$22,000', cumulative: '$106,000', risk: '4.5%', baseLock: '$90,000'},
        {quarter: 'Q15', tier: 6, value: '$138,000', profit: '$22,000', cumulative: '$128,000', risk: '4.5%', baseLock: '$90,000'},
        {quarter: 'Q16', tier: 6, value: '$160,000', profit: '$22,000', cumulative: '$150,000', risk: '4.5%', baseLock: '$90,000'},
        {quarter: 'Q17', tier: 6, value: '$186,000', profit: '$27,000', cumulative: '$176,000', risk: '4.5%', baseLock: '$90,000'},
        {quarter: 'Q18', tier: 7, value: '$231,000', profit: '$45,000', cumulative: '$221,000', risk: '5.0%', baseLock: '$180,000'},
        {quarter: 'Q19', tier: 7, value: '$276,000', profit: '$45,000', cumulative: '$266,000', risk: '5.0%', baseLock: '$180,000'},
        {quarter: 'Q20', tier: 7, value: '$321,000', profit: '$45,000', cumulative: '$311,000', risk: '5.0%', baseLock: '$180,000'},
        {quarter: 'Q21', tier: 7, value: '$366,000', profit: '$45,000', cumulative: '$356,000', risk: '5.0%', baseLock: '$180,000'},
        {quarter: 'Q22', tier: 7, value: '$411,000', profit: '$45,000', cumulative: '$401,000', risk: '5.0%', baseLock: '$180,000'},
        {quarter: 'Q23', tier: 7, value: '$456,000', profit: '$45,000', cumulative: '$446,000', risk: '5.0%', baseLock: '$180,000'},
        {quarter: 'Q24', tier: 7, value: '$501,000', profit: '$45,000', cumulative: '$491,000', risk: '5.0%', baseLock: '$190,000'}
    ];

    const tierBadgeColors = {
        1: 'tier-1',
        2: 'tier-2',
        3: 'tier-3',
        4: 'tier-4',
        5: 'tier-5',
        6: 'tier-6',
        7: 'tier-7'
    };

    tierData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.quarter}</td>
            <td><span class="tier-badge ${tierBadgeColors[data.tier]}">${data.tier}</span></td>
            <td>${data.value}</td>
            <td>${data.profit}</td>
            <td>${data.cumulative}</td>
            <td>${data.risk}</td>
            <td>${data.baseLock}</td>
        `;
        tableBody.appendChild(row);
    });
}

// ===================================
// Scroll Animations
// ===================================

function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe stat cards
    document.querySelectorAll('.stat-card, .principle-card, .management-card, .trade-card, .tax-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===================================
// Navbar Scroll Effect
// ===================================

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.6)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.5)';
    }

    lastScroll = currentScroll;
});

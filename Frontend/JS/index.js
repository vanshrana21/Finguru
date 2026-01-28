
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        function initDemoMode() {
            const demoProfile = {
                user_id: `demo_${Date.now()}`,
                name: 'Demo User',
                income: 50000,
                life_stage: 'Young Professional',
                knowledge_level: 'Intermediate',
                focus_goal: 'Build Wealth',
                balance: 165000,
                xp: 275,
                level: 3,
                demoMode: true,
                budget: {
                    month: 6,
                    allocated: false,
                    needs: 0, wants: 0, savings: 0,
                    needsRemaining: 0, wantsRemaining: 0, savingsRemaining: 0,
                    expensesPaid: [],
                    monthHistory: [
                        { month: 1, needs: 25000, wants: 15000, savings: 10000, totalSaved: 10000, xpEarned: 25 },
                        { month: 2, needs: 25000, wants: 12000, savings: 13000, totalSaved: 13000, xpEarned: 30 },
                        { month: 3, needs: 24000, wants: 14000, savings: 12000, totalSaved: 12000, xpEarned: 25 },
                        { month: 4, needs: 25000, wants: 10000, savings: 15000, totalSaved: 15000, xpEarned: 35 },
                        { month: 5, needs: 25000, wants: 11000, savings: 14000, totalSaved: 14000, xpEarned: 30 }
                    ]
                }
            };

            const demoPortfolio = {
                cash: 45000,
                positions: [
                    { id: 'STK_ALPHA', type: 'stock', name: 'AlphaTech', quantity: 50, avg_price: 240, current_price: 285, buy_month: 2 },
                    { id: 'MF_INDEX', type: 'mutual', name: 'Nifty Index Fund', quantity: 300, avg_price: 100, current_price: 112, buy_month: 1 },
                    { id: 'ETF_BANK', type: 'etf', name: 'Bank ETF', quantity: 80, avg_price: 120, current_price: 128, buy_month: 3 },
                    { id: 'FD_DEMO1', type: 'fd', name: 'FD 1Y @6%', quantity: 1, principal: 25000, rate: 0.06, tenure: 12, maturity_month: 14, current_price: 25000 }
                ],
                transactions: [
                    { tx_id: 'tx_1', date: 'Month 1', type: 'buy', asset_id: 'MF_INDEX', asset_type: 'mutual', quantity: 300, price: 100, cash_change: -30000 },
                    { tx_id: 'tx_2', date: 'Month 2', type: 'buy', asset_id: 'STK_ALPHA', asset_type: 'stock', quantity: 50, price: 240, cash_change: -12024 },
                    { tx_id: 'tx_3', date: 'Month 3', type: 'buy', asset_id: 'ETF_BANK', asset_type: 'etf', quantity: 80, price: 120, cash_change: -9610 },
                    { tx_id: 'tx_4', date: 'Month 3', type: 'fd_open', asset_id: 'FD_DEMO1', asset_type: 'fd', quantity: 1, price: 25000, cash_change: -25000 }
                ],
                market_scenario: 'bull',
                investMonth: 5,
                startMonth: 1,
                achievements: { firstInvestment: true, diversified: true, fdMatured: false, yearHeld: false }
            };

            localStorage.setItem('finplay_profile', JSON.stringify(demoProfile));
            localStorage.setItem('finplay_portfolio', JSON.stringify(demoPortfolio));
            
            window.location.href = '/analytics';
        }

        document.getElementById('navDemoBtn').addEventListener('click', initDemoMode);
        document.getElementById('heroDemoBtn').addEventListener('click', initDemoMode);
        document.getElementById('demoCTABtn').addEventListener('click', initDemoMode);
    

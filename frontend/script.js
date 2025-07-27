// HOME PAGE JAVASCRIPT - script.js with Firebase Integration
class ArthacharjaHome {
    constructor() {
        this.currentWealth = 770;
        this.isRefreshing = false;
        this.firebaseConfig = {
            projectId: 'arthacharya-a1303',
            baseUrl: 'https://firestore.googleapis.com/v1/projects/arthacharya-a1303/databases/(default)/documents'
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserData();
        this.startPeriodicUpdates();
    }

    bindEvents() {
        // Refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshWealth());
        }

        // Talk to AI button
        const talkAIBtn = document.querySelector('.talk-ai-btn');
        if (talkAIBtn) {
            talkAIBtn.addEventListener('click', () => this.openAIAgent());
        }

        // MF Report button
        const mfReportBtn = document.querySelector('.mf-report-btn');
        if (mfReportBtn) {
            mfReportBtn.addEventListener('click', () => this.getMFReport());
        }

        // Special AI Navigation button
        const aiNavBtn = document.querySelector('.ai-special');
        if (aiNavBtn) {
            aiNavBtn.addEventListener('click', () => this.openArthacharya());
        }

        // Bottom navigation
        const navItems = document.querySelectorAll('.nav-item:not(.ai-special)');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Investment cards
        const investmentCards = document.querySelectorAll('.investment-card');
        investmentCards.forEach(card => {
            card.addEventListener('click', () => this.handleInvestmentClick(card));
        });
    }

    async refreshWealth() {
        if (this.isRefreshing) return;

        this.isRefreshing = true;
        const refreshBtn = document.querySelector('.refresh-btn');
        const icon = refreshBtn?.querySelector('i');

        // Add loading animation
        if (icon) {
            icon.style.animation = 'spin 1s linear infinite';
            refreshBtn.style.opacity = '0.7';
        }

        try {
            console.log('🔍 Loading latest financial data from Firebase database...');

            const latestAnalysis = await this.getLatestAnalysisFromFirebase();

            if (latestAnalysis) {
                console.log('✅ Found latest analysis in Firebase:', latestAnalysis);
                this.updateWealthDisplay(latestAnalysis);
                this.showNotification('📊 Financial data updated from database', 'success');
            } else {
                console.log('ℹ️ No recent analysis found in database');
                this.showNotification('ℹ️ No new analysis available - workflow may not have run yet', 'info');
            }

        } catch (error) {
            console.error('❌ Failed to refresh from Firebase:', error);
            this.showNotification('⚠️ Failed to load from database', 'error');
        } finally {
            // Remove loading state
            if (icon) {
                setTimeout(() => {
                    icon.style.animation = '';
                    refreshBtn.style.opacity = '1';
                    this.isRefreshing = false;
                }, 1000);
            }
        }
    }

    async getLatestAnalysisFromFirebase() {
        try {
            const url = `${this.firebaseConfig.baseUrl}/ai_analysis?orderBy="timestamp"&limitToLast=1`;

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.documents && data.documents.length > 0) {
                    return this.parseFirebaseDocument(data.documents[0]);
                }
            }
            return null;
        } catch (error) {
            console.error('Failed to query Firebase:', error);
            return null;
        }
    }

    parseFirebaseDocument(doc) {
        try {
            const fields = doc.fields;

            return {
                emergency_fund: {
                    current_amount: fields.financial_context?.mapValue?.fields?.emergency_fund_amount?.doubleValue || this.currentWealth,
                    current_coverage_months: fields.financial_context?.mapValue?.fields?.coverage_months?.doubleValue || 0.16,
                    recommended_target: fields.financial_context?.mapValue?.fields?.recommended_target?.doubleValue || 300000
                },
                monthly_expenses: {
                    average: fields.financial_context?.mapValue?.fields?.monthly_expenses?.doubleValue || 45000
                },
                ai_insights: {
                    confidence_level: fields.ai_decision?.mapValue?.fields?.confidence_level?.doubleValue || 6,
                    urgency_level: fields.ai_decision?.mapValue?.fields?.urgency_level?.stringValue || 'medium',
                    explanation: fields.ai_decision?.mapValue?.fields?.explanation_for_user?.stringValue || 'Analysis complete - data from database',
                    primary_action: fields.ai_decision?.mapValue?.fields?.primary_action?.stringValue || 'Review financial status'
                },
                analysis_timestamp: fields.timestamp?.timestampValue || new Date().toISOString(),
                document_id: doc.name.split('/').pop(),
                analysis_id: fields.analysis_id?.stringValue || 'unknown'
            };
        } catch (error) {
            console.error('Error parsing Firebase document:', error);
            return null;
        }
    }

    updateWealthDisplay(financialData) {
        const amountElement = document.querySelector('.amount-value');
        const bankAmountElement = document.querySelector('.account-amount');

        if (!amountElement || !bankAmountElement) return;

        const emergencyFund = financialData.emergency_fund.current_amount;
        const formattedAmount = this.formatCurrency(emergencyFund);

        this.animateValue(amountElement, this.currentWealth, emergencyFund);
        bankAmountElement.textContent = `₹${formattedAmount}`;

        this.currentWealth = emergencyFund;
        this.latestAnalysisData = financialData;
    }

    animateValue(element, start, end) {
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.floor(start + (end - start) * progress);
            element.textContent = this.formatCurrency(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    formatCurrency(amount) {
        return amount.toLocaleString('en-IN');
    }

    openAIAgent() {
        console.log('🧠 Opening Arthacharya AI Agent...');

        if (this.latestAnalysisData) {
            this.navigateToAIPage();
        } else {
            this.showAIModal();
        }
    }

    navigateToAIPage() {
        if (this.latestAnalysisData) {
            sessionStorage.setItem('arthacharya_analysis', JSON.stringify(this.latestAnalysisData));
        }
        window.location.href = 'ai-agent.html';
    }

    openArthacharya() {
        console.log('🧠 Opening Arthacharya main interface...');

        const aiButton = document.querySelector('.ai-button');
        if (aiButton) {
            aiButton.style.transform = 'scale(1.1)';
            aiButton.style.boxShadow = '0 8px 20px rgba(0, 212, 170, 0.5)';

            setTimeout(() => {
                aiButton.style.transform = 'scale(1)';
                aiButton.style.boxShadow = '0 4px 12px rgba(0, 212, 170, 0.3)';
                this.navigateToAIPage();
            }, 200);
        } else {
            this.navigateToAIPage();
        }
    }

    navigateToAIPage() {
        // Store latest analysis data for AI page
        if (this.latestAnalysisData) {
            sessionStorage.setItem('arthacharya_analysis', JSON.stringify(this.latestAnalysisData));
        }

        // Navigate to AI agent page
        window.location.href = 'ai-agent.html';
    }


    showAIModal() {
        const modal = document.createElement('div');
        modal.className = 'ai-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🧠 Arthacharya AI Agent</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="ai-status">
                        <div class="status-indicator active"></div>
                        <span>Loading AI analysis from database...</span>
                    </div>
                    <div class="ai-message">
                        <p><strong>AI Analysis:</strong></p>
                        <p>Current emergency fund: ₹${this.formatCurrency(this.currentWealth)}. Click below to view full AI analysis.</p>
                        <button class="view-analysis-btn">View Full Analysis</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.view-analysis-btn').addEventListener('click', () => {
            modal.remove();
            this.navigateToAIPage();
        });
    }

    showNotification(message, type = 'info') {
        // Create notification (same as AI page implementation)
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    handleNavigation(e) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        e.currentTarget.classList.add('active');

        const navText = e.currentTarget.querySelector('span')?.textContent;
        console.log(`Navigating to: ${navText}`);
    }

    handleInvestmentClick(card) {
        const cardTitle = card.querySelector('h4')?.textContent;
        console.log(`Opening ${cardTitle} investment options...`);

        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);
    }

    getMFReport() {
        console.log('📊 Generating MF Report from database...');
    }

    async loadUserData() {
        console.log('📊 Loading initial financial data from Firebase database...');

        try {
            const latestData = await this.getLatestAnalysisFromFirebase();
            if (latestData) {
                this.updateWealthDisplay(latestData);
                console.log('✅ Initial data loaded from Firebase database');
            }
        } catch (error) {
            console.error('⚠️ Failed to load initial data from database:', error);
        }
    }

    startPeriodicUpdates() {
        setInterval(() => {
            if (!this.isRefreshing) {
                console.log('🔄 Periodic check for new analysis in database...');
                this.refreshWealth();
            }
        }, 120000);
    }
}

// Enhanced Navigation Class
class ArthacharjaRouter {
    static navigateToHome(data = null) {
        if (data) {
            sessionStorage.setItem('arthacharya_home_data', JSON.stringify(data));
        }
        window.location.href = 'index.html';
    }

    static navigateToAI(data = null) {
        if (data) {
            sessionStorage.setItem('arthacharya_analysis', JSON.stringify(data));
        }
        window.location.href = 'ai-agent.html';
    }

    static navigateToLogin() {
        window.location.href = 'login.html';
    }

    static goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigateToHome();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Arthacharya Home - Firebase Integration');
    new ArthacharjaHome();

    // Add modal styles
    const modalStyles = `
        .ai-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        
        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 20px;
            margin: 20px;
            max-width: 350px;
            width: 100%;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .modal-header h3 {
            color: #1a1a1a;
            margin: 0;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        
        .ai-status {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #00D4AA;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .ai-message {
            color: #1a1a1a;
            line-height: 1.5;
        }
        
        .view-analysis-btn {
            background: #00D4AA;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 16px;
            width: 100%;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
});

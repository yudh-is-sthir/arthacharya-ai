// AI AGENT PAGE JAVASCRIPT - ai-script.js
class ArthacharjaAI {
    constructor() {
        this.workflowData = null;
        this.notificationVisible = false;
        this.firebaseConfig = {
            projectId: 'arthacharya-a1303',
            baseUrl: 'https://firestore.googleapis.com/v1/projects/arthacharya-a1303/databases/(default)/documents'
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadAnalysisData();
        this.startPeriodicUpdates();
        this.initializeAnimations();
    }

    bindEvents() {
        // Back button
        const backBtn = document.querySelector('.back-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }

        // Refresh analysis - GLOBAL FUNCTION for HTML onclick
        window.refreshAnalysis = () => this.refreshAnalysis();

        // Notification functions - GLOBAL FUNCTIONS for HTML onclick
        window.toggleNotifications = () => this.toggleNotifications();
        window.closeNotifications = () => this.closeNotifications();
        window.viewNotificationDetail = () => this.viewNotificationDetail();

        // Action buttons - GLOBAL FUNCTIONS for HTML onclick  
        window.acceptRecommendation = () => this.acceptRecommendation();
        window.customizeStrategy = () => this.customizeStrategy();
    }

    async loadAnalysisData() {
        try {
            console.log('🔍 Loading AI analysis from Firebase...');

            // Check if data was passed from home page
            const sessionData = sessionStorage.getItem('arthacharya_analysis');
            if (sessionData) {
                const parsedData = JSON.parse(sessionData);
                this.workflowData = this.formatForUI(parsedData);
                this.updateUI(this.workflowData);
                console.log('✅ Loaded analysis from session storage');
                return;
            }

            // Otherwise, load from Firebase
            const latestAnalysis = await this.getLatestAnalysisFromFirebase();
            if (latestAnalysis) {
                this.workflowData = this.formatForUI(latestAnalysis);
                this.updateUI(this.workflowData);
                console.log('✅ Loaded analysis from Firebase');
            } else {
                console.log('ℹ️ No analysis data found');
                this.loadMockData();
            }

        } catch (error) {
            console.error('❌ Failed to load analysis:', error);
            this.loadMockData();
        }
    }

    async getLatestAnalysisFromFirebase() {
        try {
            console.log('📊 Querying Firebase for latest AI analysis...');

            // Get all documents from the collection
            const url = `${this.firebaseConfig.baseUrl}/ai_analysis`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Firebase query failed: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📋 Firebase response:', data);

            if (data.documents && data.documents.length > 0) {
                // Sort documents by timestamp to get the latest one
                const sortedDocs = data.documents.sort((a, b) => {
                    const timeA = a.fields.timestamp?.timestampValue || a.createTime;
                    const timeB = b.fields.timestamp?.timestampValue || b.createTime;
                    return new Date(timeB) - new Date(timeA); // Descending order (latest first)
                });

                console.log('✅ Latest analysis document found');
                return this.parseFirebaseDocument(sortedDocs[0]);
            } else {
                console.log('📝 No analysis documents found in database');
                return null;
            }

        } catch (error) {
            console.error('❌ Failed to query Firebase:', error);
            throw error;
        }
    }


    parseFirebaseDocument(doc) {
        const fields = doc.fields;
        return {
            emergency_fund: {
                current_amount: fields.financial_context?.mapValue?.fields?.emergency_fund_amount?.doubleValue || 195297,
                current_coverage_months: fields.financial_context?.mapValue?.fields?.coverage_months?.doubleValue || 0.16
            },
            ai_insights: {
                confidence_level: fields.ai_decision?.mapValue?.fields?.confidence_level?.doubleValue || 6,
                urgency_level: fields.ai_decision?.mapValue?.fields?.urgency_level?.stringValue || 'medium',
                explanation: fields.ai_decision?.mapValue?.fields?.explanation_for_user?.stringValue || 'Analysis complete - loaded from Firebase database',
                primary_action: fields.ai_decision?.mapValue?.fields?.primary_action?.stringValue || 'Review recommendations'
            },
            analysis_timestamp: fields.timestamp?.timestampValue || new Date().toISOString(),
            document_id: doc.name.split('/').pop()
        };
    }

    formatForUI(analysisData) {
        return {
            notification_timestamp: analysisData.analysis_timestamp,
            user_notification: {
                title: "🤖 Emergency Fund Guardian Analysis",
                message: analysisData.ai_insights.explanation,
                urgency: analysisData.ai_insights.urgency_level,
                confidence: `${analysisData.ai_insights.confidence_level}/10`
            },
            action_summary: {
                primary_action: analysisData.ai_insights.primary_action,
                new_coverage: `${analysisData.emergency_fund.current_coverage_months.toFixed(2)} months`,
                progress: "58.8% toward target",
                next_steps: "Review AI recommendations and take action as needed"
            }
        };
    }

    updateUI(data) {
        try {
            // Update confidence level
            const confidenceValue = data.user_notification?.confidence || '6/10';
            const confidenceNum = parseInt(confidenceValue);
            const confidencePercent = (confidenceNum / 10) * 100;

            const confidenceValueEl = document.getElementById('confidenceValue');
            const confidenceFillEl = document.getElementById('confidenceFill');

            if (confidenceValueEl) confidenceValueEl.textContent = confidenceValue;
            if (confidenceFillEl) confidenceFillEl.style.width = `${confidencePercent}%`;

            // Update stats cards
            const coverageEl = document.getElementById('coverageMonths');
            const progressEl = document.getElementById('progressPercent');
            const urgencyEl = document.getElementById('urgencyLevel');

            if (coverageEl) coverageEl.textContent = data.action_summary?.new_coverage || '4.00';
            if (progressEl) progressEl.textContent = data.action_summary?.progress?.split(' ')[0] || '58.8%';
            if (urgencyEl) urgencyEl.textContent = this.capitalizeFirst(data.user_notification?.urgency || 'medium');

            // Update recommendation text
            const recommendationEl = document.getElementById('recommendationText');
            if (recommendationEl) {
                recommendationEl.textContent = data.user_notification?.message || 'AI analysis complete';
            }

            // Update action summary
            const primaryActionEl = document.getElementById('primaryAction');
            const nextStepsEl = document.getElementById('nextSteps');

            if (primaryActionEl) primaryActionEl.textContent = data.action_summary?.primary_action || 'No action taken';
            if (nextStepsEl) nextStepsEl.textContent = data.action_summary?.next_steps || 'Review analysis';

            // Update notification content
            const notificationTitle = document.getElementById('notificationTitle');
            const notificationPreview = document.getElementById('notificationPreview');

            if (notificationTitle) notificationTitle.textContent = data.user_notification?.title || '🤖 AI Analysis Complete';
            if (notificationPreview) notificationPreview.textContent = (data.user_notification?.message || 'Analysis complete').substring(0, 80) + '...';

            console.log('✅ UI updated successfully');

        } catch (error) {
            console.error('❌ Error updating UI:', error);
        }
    }

    async acceptRecommendation() {
        try {
            console.log('✅ Processing AI recommendation...');

            // Get button reference
            const btn = document.querySelector('.btn-primary');
            if (!btn || btn.disabled) {
                console.log('Button already processing or not found');
                return;
            }

            // Disable button immediately to prevent multiple clicks
            btn.disabled = true;
            const originalHTML = btn.innerHTML;

            // Phase 1: Processing
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.style.background = '#6c757d';
            btn.style.cursor = 'not-allowed';

            // Add visual feedback
            this.showNotification('🔄 Processing your decision...', 'info');

            // Store acceptance in Firebase
            await this.storeUserActionInFirebase('accepted');

            // Phase 2: Success animation
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Successfully Accepted!';
            btn.style.background = '#28a745';
            btn.style.transform = 'scale(1.05)';

            // Add success notification
            this.showNotification('✅ Recommendation accepted and saved to database!', 'success');

            // Phase 3: Update UI state
            this.updateUIAfterAcceptance();

            // Phase 4: Reset button after delay
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Accepted';
                btn.style.background = '#28a745';
                btn.style.transform = 'scale(1)';
                btn.style.cursor = 'default';
                // Keep disabled to prevent re-acceptance

                // Show final status
                this.showNotification('💾 Your decision has been saved', 'success');
            }, 2000);

            // Update acceptance status in data
            if (this.workflowData) {
                this.workflowData.user_accepted = true;
                this.workflowData.acceptance_timestamp = new Date().toISOString();
            }

        } catch (error) {
            console.error('❌ Failed to accept recommendation:', error);

            // Error state
            const btn = document.querySelector('.btn-primary');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed - Try Again';
                btn.style.background = '#dc3545';
                btn.disabled = false;
                btn.style.cursor = 'pointer';
            }

            this.showNotification('⚠️ Failed to save recommendation. Please try again.', 'error');
        }
    }

    // REPLACE THIS FUNCTION
    updateUIAfterAcceptance() {
        // Add acceptance indicator to UI
        const recommendationCard = document.querySelector('.recommendation-card');
        if (recommendationCard) {
            const acceptedBadge = document.createElement('div');
            acceptedBadge.className = 'accepted-badge';
            acceptedBadge.innerHTML = '<i class="fas fa-check-circle"></i> Accepted';

            recommendationCard.insertBefore(acceptedBadge, recommendationCard.firstChild);
        }

        // REMOVED: this.updateNotificationStatus('accepted'); 
        // This line was causing the error - function doesn't exist

        console.log('✅ UI updated after recommendation acceptance');
    }


    // ADD THIS NEW HELPER FUNCTION
    updateNotificationBadge() {
        // Update the notification badge in the header
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            // Get current count and increment
            let currentCount = parseInt(badge.textContent) || 0;
            currentCount++;
            badge.textContent = currentCount;
            badge.style.display = 'flex';
        }
    }

    async storeUserActionInFirebase(decision) {
        const actionData = {
            fields: {
                action_id: { stringValue: `action_${Date.now()}` },
                timestamp: { timestampValue: new Date().toISOString() },
                user_action: {
                    mapValue: {
                        fields: {
                            action_type: { stringValue: 'accept_recommendation' },
                            decision: { stringValue: decision },
                            source: { stringValue: 'ai_agent_page' }
                        }
                    }
                },
                processed: { booleanValue: true }
            }
        };

        const response = await fetch(`${this.firebaseConfig.baseUrl}/user_actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actionData)
        });

        if (!response.ok) {
            throw new Error(`Firebase storage failed: ${response.status}`);
        }

        console.log('✅ User action stored in Firebase');
    }

    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles if not present
        if (!document.querySelector('#ai-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'ai-notification-styles';
            styles.textContent = `
                .notification-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 300px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 3000;
                    animation: slideInRight 0.3s ease;
                }
                .notification-toast.success { border-left: 4px solid #28a745; }
                .notification-toast.error { border-left: 4px solid #dc3545; }
                .notification-toast.info { border-left: 4px solid #17a2b8; }
                .toast-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    gap: 8px;
                }
                .toast-content span {
                    color: #333;
                    font-size: 14px;
                    flex: 1;
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    padding: 2px;
                    font-size: 16px;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 4000);
    }

    customizeStrategy() {
        console.log('🔧 Opening strategy customization...');
        this.showNotification('🔧 Strategy customization feature coming soon!', 'info');
    }

    goBack() {
        window.location.href = 'index.html';
    }

    toggleNotifications() {
        const popup = document.getElementById('notificationPopup');
        if (popup) {
            popup.classList.toggle('active');
            this.notificationVisible = !this.notificationVisible;
        }
    }

    closeNotifications() {
        const popup = document.getElementById('notificationPopup');
        if (popup) {
            popup.classList.remove('active');
            this.notificationVisible = false;
        }
    }

    viewNotificationDetail() {
        console.log('📋 Opening notification detail...');
        this.showNotification('📋 Notification details feature coming soon!', 'info');
    }

    async refreshAnalysis() {
        console.log('🔄 Refreshing analysis...');
        const refreshBtn = document.querySelector('.refresh-btn i');
        if (refreshBtn) {
            refreshBtn.style.animation = 'spin 1s linear infinite';
        }

        await this.loadAnalysisData();

        if (refreshBtn) {
            setTimeout(() => {
                refreshBtn.style.animation = '';
            }, 1000);
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    loadMockData() {
        this.workflowData = {
            notification_timestamp: new Date().toISOString(),
            user_notification: {
                title: "🤖 Emergency Fund Guardian (Demo)",
                message: "Demo mode - Connect to Firebase database for real AI analysis. Your emergency fund analysis will appear here once the workflow runs.",
                urgency: "medium",
                confidence: "6/10"
            },
            action_summary: {
                primary_action: "Demo mode - No real actions available",
                new_coverage: "4.00 months (demo)",
                progress: "58.8% (demo)",
                next_steps: "Connect to database for real analysis and recommendations"
            }
        };

        this.updateUI(this.workflowData);
        this.showNotification('ℹ️ Demo mode - Connect to Firebase for real data', 'info');
    }

    initializeAnimations() {
        console.log('🎨 Initializing AI page animations...');

        // Animate stats cards on load
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 100);
        });

        // Initial stats card positioning for animation
        statCards.forEach(card => {
            card.style.transform = 'translateY(20px)';
            card.style.opacity = '0';
            card.style.transition = 'all 0.5s ease';
        });
    }

    startPeriodicUpdates() {
        // Check for updates every 2 minutes
        setInterval(() => {
            console.log('🔄 Periodic update check...');
            this.loadAnalysisData();
        }, 120000);
    }
}

// Shared Notification Manager
class NotificationManager {
    constructor() {
        this.notifications = this.loadNotifications();
        this.unreadCount = this.calculateUnreadCount();
    }

    loadNotifications() {
        const stored = localStorage.getItem('arthacharya_notifications');
        return stored ? JSON.parse(stored) : [];
    }

    saveNotifications() {
        localStorage.setItem('arthacharya_notifications', JSON.stringify(this.notifications));
        this.updateNotificationBadges();
    }

    addNotification(title, message, type = 'info', data = null) {
        const notification = {
            id: Date.now().toString(),
            title,
            message,
            type,
            data,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.unreadCount++;
        this.saveNotifications();

        return notification;
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount--;
            this.saveNotifications();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.saveNotifications();
    }

    calculateUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    updateNotificationBadges() {
        const badges = document.querySelectorAll('.notification-badge');
        badges.forEach(badge => {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    showNotificationPopup() {
        const popup = this.createNotificationPopup();
        document.body.appendChild(popup);

        // Mark notifications as read when popup is opened
        setTimeout(() => this.markAllAsRead(), 1000);
    }

    createNotificationPopup() {
        const popup = document.createElement('div');
        popup.className = 'notification-popup active';
        popup.innerHTML = `
            <div class="notification-popup-header">
                <h3>📢 Notifications</h3>
                <button class="close-notification-popup">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-popup-content">
                ${this.notifications.length > 0 ?
                this.notifications.map(n => this.renderNotification(n)).join('') :
                '<div class="no-notifications">No notifications yet</div>'
            }
            </div>
        `;

        // Event listeners
        popup.querySelector('.close-notification-popup').onclick = () => popup.remove();

        return popup;
    }

    renderNotification(notification) {
        const timeAgo = this.getTimeAgo(notification.timestamp);
        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }

    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffMinutes < 1) return 'just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
        return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
}

// Initialize notification manager
const notificationManager = new NotificationManager();

// Global notification functions for both pages
window.toggleNotifications = () => {
    notificationManager.showNotificationPopup();
};

window.addNotification = (title, message, type, data) => {
    return notificationManager.addNotification(title, message, type, data);
};


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

// Initialize AI page
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Initializing Arthacharya AI Agent Page');
    new ArthacharjaAI();
});

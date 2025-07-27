// Login Page Functionality
class ArthacharjaLogin {
    constructor() {
        this.currentStep = 'phone';
        this.phoneNumber = '';
        this.otpSent = false;
        this.firebaseConfig = {
            projectId: 'arthacharya-a1303',
            baseUrl: 'https://firestore.googleapis.com/v1/projects/arthacharya-a1303/databases/(default)/documents'
        };
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkExistingSession();
    }
    
    bindEvents() {
        // Phone number input formatting
        const phoneInput = document.getElementById('phoneNumber');
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
        
        // OTP input formatting
        const otpInput = document.getElementById('otpInput');
        otpInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
        });
        
        // Enter key handlers
        phoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendOTP();
        });
        
        otpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.verifyOTP();
        });
    }
    
    checkExistingSession() {
        const session = localStorage.getItem('arthacharya_session');
        if (session) {
            const sessionData = JSON.parse(session);
            if (this.isSessionValid(sessionData)) {
                console.log('Valid session found, redirecting...');
                this.redirectToApp();
                return;
            }
        }
        
        console.log('No valid session, showing login form');
    }
    
    isSessionValid(sessionData) {
        const now = Date.now();
        const sessionTime = new Date(sessionData.timestamp).getTime();
        const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
        
        return hoursDiff < 24 && sessionData.phoneNumber && sessionData.verified;
    }
    
    async sendOTP() {
        const phoneInput = document.getElementById('phoneNumber');
        const phoneNumber = phoneInput.value.trim();
        
        // if (!this.validatePhoneNumber(phoneNumber)) {
        //     this.showError('Please enter a valid 10-digit phone number');
        //     return;
        // }
        
        this.phoneNumber = phoneNumber;
        this.showLoading('Sending OTP...');
        
        try {
            // Simulate OTP sending (In real app, integrate with SMS service)
            await this.simulateOTPSending(phoneNumber);
            
            this.hideLoading();
            this.switchToOTPStep();
            this.showSuccess('OTP sent successfully!');
            
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to send OTP. Please try again.');
            console.error('OTP sending failed:', error);
        }
    }
    
    async simulateOTPSending(phoneNumber) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Store OTP in localStorage for demo (In production, this would be server-side)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('demo_otp', otp);
        
        console.log(`Demo OTP for ${phoneNumber}: ${otp}`);
        
        // Store in Firebase for demo purposes
        await this.storeOTPRequest(phoneNumber, otp);
    }
    
    async storeOTPRequest(phoneNumber, otp) {
        try {
            const otpData = {
                fields: {
                    phone_number: { stringValue: phoneNumber },
                    otp_hash: { stringValue: this.hashOTP(otp) }, // Never store plain OTP
                    timestamp: { timestampValue: new Date().toISOString() },
                    attempts: { doubleValue: 0 },
                    verified: { booleanValue: false }
                }
            };
            
            await fetch(`${this.firebaseConfig.baseUrl}/login_attempts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(otpData)
            });
            
        } catch (error) {
            console.error('Failed to store OTP request:', error);
        }
    }
    
    async verifyOTP() {
        const otpInput = document.getElementById('otpInput');
        const enteredOTP = otpInput.value.trim();
        
        if (enteredOTP.length !== 6) {
            this.showError('Please enter a 6-digit OTP');
            return;
        }
        
        this.showLoading('Verifying OTP...');
        
        try {
            const isValid = true // await this.validateOTP(enteredOTP);
            
            if (isValid) {
                await this.createUserSession();
                this.hideLoading();
                this.showSuccess('Login successful! Redirecting...');
                
                setTimeout(() => {
                    this.redirectToApp();
                }, 1500);
                
            } else {
                this.hideLoading();
                this.showError('Invalid OTP. Please try again.');
                otpInput.value = '';
                otpInput.focus();
            }
            
        } catch (error) {
            this.hideLoading();
            this.showError('Verification failed. Please try again.');
            console.error('OTP verification failed:', error);
        }
    }
    
    async validateOTP(enteredOTP) {
        // Demo validation (In production, validate server-side)
        const storedOTP = localStorage.getItem('demo_otp');
        return enteredOTP === storedOTP;
    }
    
    async createUserSession() {
        const sessionData = {
            phoneNumber: this.phoneNumber,
            verified: true,
            timestamp: new Date().toISOString(),
            loginMethod: 'otp'
        };
        
        // Store session locally
        localStorage.setItem('arthacharya_session', JSON.stringify(sessionData));
        
        // Store successful login in Firebase
        await this.storeSuccessfulLogin(sessionData);
        
        console.log('User session created successfully');
    }
    
    async storeSuccessfulLogin(sessionData) {
        try {
            const loginData = {
                fields: {
                    phone_number: { stringValue: sessionData.phoneNumber },
                    login_timestamp: { timestampValue: sessionData.timestamp },
                    login_method: { stringValue: sessionData.loginMethod },
                    session_id: { stringValue: `session_${Date.now()}` }
                }
            };
            
            await fetch(`${this.firebaseConfig.baseUrl}/user_sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            
        } catch (error) {
            console.error('Failed to store login data:', error);
        }
    }
    
    validatePhoneNumber(phoneNumber) {
        return /^[6-9]\d{9}$/.test(phoneNumber);
    }
    
    switchToOTPStep() {
        document.getElementById('phoneStep').classList.add('hidden');
        document.getElementById('otpStep').classList.remove('hidden');
        document.getElementById('phoneDisplay').textContent = `+91 ${this.phoneNumber}`;
        
        // Focus on OTP input
        setTimeout(() => {
            document.getElementById('otpInput').focus();
        }, 300);
    }
    
    async resendOTP() {
        console.log('Resending OTP...');
        this.showLoading('Resending OTP...');
        
        try {
            await this.simulateOTPSending(this.phoneNumber);
            this.hideLoading();
            this.showSuccess('OTP resent successfully!');
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to resend OTP. Please try again.');
        }
    }
    
    showLoading(message) {
        document.getElementById('loadingText').textContent = message;
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }
    
    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type) {
        // Create notification toast
        const toast = document.createElement('div');
        toast.className = `login-notification ${type}`;
        toast.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .login-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 4000;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            }
            .login-notification.success {
                border-left: 4px solid #28a745;
            }
            .login-notification.error {
                border-left: 4px solid #dc3545;
            }
            .notification-content span {
                color: #333;
                font-size: 14px;
                font-weight: 500;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Auto remove
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 4000);
    }
    
    redirectToApp() {
        window.location.href = 'index.html';
    }
    
    hashOTP(otp) {
        // Simple hash for demo (use proper hashing in production)
        return btoa(otp);
    }
}

// Global functions for HTML onclick events
window.sendOTP = () => {
    arthacharjaLogin.sendOTP();
};

window.verifyOTP = () => {
    arthacharjaLogin.verifyOTP();
};

window.resendOTP = () => {
    arthacharjaLogin.resendOTP();
};

// Initialize login page
let arthacharjaLogin;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Initializing Arthacharya Login');
    arthacharjaLogin = new ArthacharjaLogin();
});

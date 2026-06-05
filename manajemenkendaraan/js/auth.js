document.addEventListener('DOMContentLoaded', () => {
    const Auth = {
        users: [
            { username: 'sopir', password: 'sopir123', role: 'sopir', displayName: 'Sopir' },
            { username: 'user', password: 'user123', role: 'user', displayName: 'User' }
        ],
        sessionKey: 'traffic_user_session',
        loginForm: document.getElementById('loginForm'),
        roleButtons: document.querySelectorAll('.role-btn[data-role]'),
        roleInput: document.getElementById('userRole'),
        messageEl: document.getElementById('authMessage'),

        init() {
            window.auth = this;
            this.setupPage();
            this.renderUserMenu();
        },

        setupPage() {
            const page = document.body.dataset.page;
            if (page === 'login') {
                if (this.getSessionUser()) {
                    this.redirectAfterLogin(this.getSessionUser());
                    return;
                }

                if (this.loginForm) {
                    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
                }

                this.roleButtons.forEach(btn => {
                    btn.addEventListener('click', () => this.selectRole(btn.dataset.role));
                });
            }

            if (page === 'form') {
                this.requireAuth(['sopir']);
            }

            if (page === 'dashboard') {
                this.requireAuth(['user']);
            }
        },

        handleLogin(event) {
            event.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const role = this.roleInput.value;
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                this.showMessage('Lengkapi username dan password.', 'error');
                return;
            }

            const user = this.users.find(u => u.username === username && u.password === password && u.role === role);
            if (!user) {
                this.showMessage('Login gagal. Periksa username, password, atau role.', 'error');
                return;
            }

            this.setSessionUser({ username: user.username, role: user.role, displayName: user.displayName });
            this.showMessage(`Selamat datang, ${user.displayName}! Mengalihkan...`, 'success');
            setTimeout(() => this.redirectAfterLogin(user), 600);
        },

        selectRole(role) {
            this.roleButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.role === role);
            });
            if (this.roleInput) {
                this.roleInput.value = role;
            }
        },

        showMessage(message, type = 'info') {
            if (!this.messageEl) return;
            this.messageEl.textContent = message;
            this.messageEl.className = `auth-message ${type}`;
        },

        getSessionUser() {
            const sessionData = localStorage.getItem(this.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        },

        setSessionUser(user) {
            localStorage.setItem(this.sessionKey, JSON.stringify(user));
        },

        clearSession() {
            localStorage.removeItem(this.sessionKey);
        },

        requireAuth(allowedRoles = []) {
            const user = this.getSessionUser();
            if (!user) {
                window.location.href = 'index.html';
                return;
            }

            if (allowedRoles.length && !allowedRoles.includes(user.role)) {
                window.location.href = 'index.html';
                return;
            }
        },

        renderUserMenu() {
            const menu = document.getElementById('userMenu');
            const user = this.getSessionUser();
            if (!menu) return;

            if (user) {
                menu.innerHTML = `
                    <div class="user-menu">
                        <span>👤 ${user.displayName}</span>
                        <button type="button" id="logoutBtn" class="btn-secondary btn-small">Logout</button>
                    </div>
                `;
                document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
            } else {
                menu.innerHTML = `
                    <a href="index.html" class="btn-secondary btn-small">Login</a>
                `;
            }
        },

        logout() {
            this.clearSession();
            window.location.href = 'index.html';
        },

        redirectAfterLogin(user) {
            if (user.role === 'sopir') {
                window.location.href = 'form.html';
            } else if (user.role === 'user') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    };

    Auth.init();
});
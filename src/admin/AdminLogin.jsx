import React, { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { API } from '../context/ContentContext';
import './Admin.css';
import './AdminLogin.css';

const LoginError = ({ message }) => {
    if (!message) return null;
    return <div className="admin-login-error">{message}</div>;
};

export default function AdminLogin({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const canSubmit = useMemo(() => {
        return String(username).trim().length > 0 && String(password).length > 0 && !isSubmitting;
    }, [username, password, isSubmitting]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username: username.trim(), password }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
                setError(data.error || 'Invalid username or password.');
                setIsSubmitting(false);
                return;
            }

            setIsSubmitting(false);
            onLoginSuccess?.({ username: data.username });
        } catch {
            setError('Login failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-brand">
                    <div className="admin-login-brand__name">Parinay</div>
                    <div className="admin-login-brand__sub">Weddings Admin Console</div>
                </div>

                <form className="admin-login-form" onSubmit={onSubmit}>
                    <div className="admin-form-group">
                        <label className="admin-label">Username</label>
                        <input
                            className="admin-input"
                            type="text"
                            value={username}
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-label">Password</label>
                        <div className="admin-input-wrapper">
                            <input
                                className="admin-input"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                            <button 
                                type="button"
                                className="admin-input-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="admin-login-actions">
                        <button className="admin-btn admin-btn--primary" type="submit" disabled={!canSubmit}>
                            {isSubmitting ? 'Signing in…' : 'Login'}
                        </button>
                    </div>

                    <LoginError message={error} />
                    <div className="admin-login-help">
                        Authorized staff only. If you don&apos;t have access, please contact Parinay team.
                    </div>
                </form>
            </div>
        </div>
    );
}


import React, { useEffect, useState } from 'react';
import { API } from '../context/ContentContext';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

const AdminGateLoading = () => (
    <div className="admin-dashboard" style={{ alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="admin-loading">
            <div className="admin-loading__ring" />
            <span>Checking admin access…</span>
        </div>
    </div>
);

export default function AdminRoute() {
    const [status, setStatus] = useState('checking'); // checking | authed | unauth
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let cancelled = false;

        // "Page Session" check:
        // if sessionStorage is empty, we force re-auth even if the cookie might still be in the browser.
        // This ensures closing and reopening the TAB/PAGE requires a new login.
        const isPageSessionActive = sessionStorage.getItem('parinay_admin_active') === 'true';

        if (!isPageSessionActive) {
            setStatus('unauth');
            return;
        }

        const run = async () => {
            try {
                const res = await fetch(`${API}/api/admin/me`, { method: 'GET', credentials: 'include' });
                const data = await res.json().catch(() => ({}));
                if (cancelled) return;

                if (res.ok && data.authenticated) {
                    setUsername(data.username || null);
                    setStatus('authed');
                } else {
                    setStatus('unauth');
                }
            } catch {
                if (cancelled) return;
                setStatus('unauth');
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleLoginSuccess = ({ username: u }) => {
        sessionStorage.setItem('parinay_admin_active', 'true');
        setUsername(u || null);
        setStatus('authed');
    };

    if (status === 'checking') {
        return <AdminGateLoading />;
    }

    if (status !== 'authed') {
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <>
            {/* username is not used inside the dashboard UI yet, but we keep it for future */}
            <div style={{ display: 'none' }}>{username}</div>
            <AdminDashboard />
        </>
    );
}


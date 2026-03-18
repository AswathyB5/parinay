import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ContentContext } from '../context/ContentContext';
import {
    Save, Plus, Trash2, Eye, LogOut, Image, Film, Type,
    Home, Info, Briefcase, BookOpen, Newspaper, Mail,
    Menu, X, Check, AlertCircle, LayoutGrid
} from 'lucide-react';
import './Admin.css';

/* ── Section Icon Map ──────────────────────────── */
const SECTION_ICONS = {
    home:               <Home size={17} />,
    about:              <Info size={17} />,
    services:           <Briefcase size={17} />,
    storiesDestination: <BookOpen size={17} />,
    storiesThemed:      <BookOpen size={17} />,
    storiesTraditional: <BookOpen size={17} />,
    journals:           <Newspaper size={17} />,
    contact:            <Mail size={17} />,
};

const SECTION_LABELS = {
    home:               'Home',
    about:              'About Us',
    services:           'Services',
    storiesDestination: 'Stories: Destination',
    storiesThemed:      'Stories: Themed',
    storiesTraditional: 'Stories: Traditional',
    journals:           'Journal',
    contact:            'Contact',
};

/* ── Toast Component ───────────────────────────── */
const Toast = ({ message, type = 'success', onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 3000);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div className={`admin-toast ${type === 'error' ? 'is-error' : ''}`}>
            {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{message}</span>
        </div>
    );
};

/* ── Media Preview ─────────────────────────────── */
const MediaPreview = ({ value, isVideo }) => {
    if (!value) {
        return (
            <div className="admin-media-preview">
                <div className="admin-media-preview__empty">
                    {isVideo ? <Film size={24} /> : <Image size={24} />}
                    <span>No {isVideo ? 'video' : 'image'} selected</span>
                </div>
            </div>
        );
    }
    return (
        <div className="admin-media-preview">
            <span className="admin-media-preview__badge">{isVideo ? '▶ Video' : '🖼 Image'}</span>
            {isVideo
                ? <video src={value} muted controls />
                : <img src={value} alt="preview" />
            }
        </div>
    );
};

/* ── Main Dashboard ────────────────────────────── */
const AdminDashboard = () => {
    const { content, updateSection, isLoaded } = useContext(ContentContext);

    const [activeTab, setActiveTab]     = useState('home');
    const [formData, setFormData]       = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast]             = useState(null);
    const [isSaving, setIsSaving]       = useState(false);

    /* Sync formData when tab changes or content loads */
    useEffect(() => {
        if (content && content[activeTab]) {
            setFormData(JSON.parse(JSON.stringify(content[activeTab])));
        }
    }, [activeTab, content]);

    /* ── Handlers ────────────────────────────────── */
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (index, arrayName, field, value) => {
        setFormData(prev => {
            const newArray = [...prev[arrayName]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await response.json();
            if (data.success && data.url) {
                handleChange(field, data.url);
            } else {
                showToast('Upload failed — try again.', 'error');
            }
        } catch {
            showToast('Could not reach the upload server.', 'error');
        }
    };

    const handleArrayFileUpload = async (e, index, arrayName, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await response.json();
            if (data.success && data.url) {
                handleArrayChange(index, arrayName, field, data.url);
            } else {
                showToast('Upload failed — try again.', 'error');
            }
        } catch {
            showToast('Could not reach the upload server.', 'error');
        }
    };

    const addArrayItem = (arrayName) => {
        setFormData(prev => {
            const existing = prev[arrayName] || [];
            const template = existing[0] || {};
            const blank = Object.keys(template).reduce((acc, k) => {
                if (k !== 'id') acc[k] = '';
                return acc;
            }, {});
            return { ...prev, [arrayName]: [...existing, { ...blank, id: Date.now() }] };
        });
    };

    const removeArrayItem = (index, arrayName) => {
        setFormData(prev => {
            const newArr = [...prev[arrayName]];
            newArr.splice(index, 1);
            return { ...prev, [arrayName]: newArr };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const success = await updateSection(activeTab, formData);
        setIsSaving(false);
        if (success) {
            showToast(`${SECTION_LABELS[activeTab]} updated successfully!`);
        } else {
            showToast(`Error saving. Is MongoDB connected?`, 'error');
        }
    };

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    /* ── Field Renderer ──────────────────────────── */
    const renderField = (key, value, onChange, onFileUpload) => {
        if (key === 'id') return null;

        const isMedia = key.toLowerCase().includes('image') || key.toLowerCase().includes('video');
        const isVideo = key.toLowerCase().includes('video');
        const isUrl = key.toLowerCase().includes('url');
        const isLongText = typeof value === 'string' && value.length > 60
            && !value.startsWith('http')
            && !value.startsWith('/');

        return (
            <div className="admin-form-group" key={key}>
                <label>
                    {isVideo ? <Film size={12} /> : isMedia ? <Image size={12} /> : <Type size={12} />}
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {isMedia ? (
                    <>
                        <MediaPreview value={value} isVideo={isVideo} />
                        <input
                            type="file"
                            accept={isVideo ? 'video/*' : 'image/*'}
                            onChange={onFileUpload}
                            className="admin-input"
                        />
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="admin-input"
                            placeholder="…or paste a URL directly"
                            style={{ marginTop: '6px' }}
                        />
                    </>
                ) : isUrl ? (
                    <select
                        value={value || '/'}
                        onChange={(e) => onChange(e.target.value)}
                        className="admin-input"
                        style={{ appearance: 'auto' }}
                    >
                        <option value="/">Home</option>
                        <option value="/about">About Us</option>
                        <option value="/services">Services</option>
                        <option value="/stories">Wedding Stories</option>
                        <option value="/journals">Journals</option>
                        <option value="/contact">Contact</option>
                    </select>
                ) : isLongText ? (
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="admin-input textarea"
                    />
                ) : (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="admin-input"
                    />
                )}
            </div>
        );
    };

    /* ── Form Renderer ───────────────────────────── */
    const renderForm = () => {
        if (!formData) return null;

        return (
            <div className="admin-section">
                {Object.keys(formData).map((key) => {
                    if (Array.isArray(formData[key])) {
                        const arrayName = key;
                        return (
                            <div key={arrayName} className="admin-array-section" style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                                <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize', color: 'var(--primary-color)' }}>{arrayName.replace(/([A-Z])/g, ' $1').trim()}</h3>

                                {formData[arrayName].length === 0 && (
                                    <div className="admin-empty" style={{ margin: '1rem 0' }}>
                                        <div className="admin-empty__icon"><LayoutGrid size={24} /></div>
                                        <p>No items yet. Click "Add New" to get started.</p>
                                    </div>
                                )}

                                {formData[arrayName].map((item, index) => (
                                    <div key={item.id || index} className="admin-array-item" style={{ position: 'relative', background: 'white', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem' }}>
                                        <span className="admin-array-item__index" style={{ position: 'absolute', top: '-10px', left: '15px', background: 'var(--accent-color)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>#{index + 1}</span>
                                        <button
                                            className="admin-array-item__remove"
                                            onClick={() => removeArrayItem(index, arrayName)}
                                            title="Remove this item"
                                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                                        >
                                            <X size={16} />
                                        </button>

                                        <div style={{ marginTop: '1rem' }}>
                                            {Object.keys(item).map((itemKey) =>
                                                renderField(
                                                    itemKey,
                                                    item[itemKey],
                                                    (val) => handleArrayChange(index, arrayName, itemKey, val),
                                                    (e)   => handleArrayFileUpload(e, index, arrayName, itemKey)
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    className="admin-btn admin-btn--outline"
                                    style={{ marginTop: '0.5rem' }}
                                    onClick={() => addArrayItem(arrayName)}
                                >
                                    <Plus size={15} />
                                    Add New {arrayName.replace(/s$/, '')}
                                </button>
                            </div>
                        );
                    } else if (typeof formData[key] !== 'object' || formData[key] === null) {
                        return renderField(
                            key,
                            formData[key],
                            (val) => handleChange(key, val),
                            (e)   => handleFileUpload(e, key)
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    /* ── Stats (derived from content) ────────────── */
    const totalSections = content ? Object.keys(content).length : 0;
    const totalArrayItems = content
        ? Object.values(content).reduce((total, section) => {
            if (!section || typeof section !== 'object') return total;
            return total + Object.values(section).reduce((t, v) =>
                Array.isArray(v) ? t + v.length : t, 0);
        }, 0)
        : 0;

    /* ── Render ──────────────────────────────────── */
    return (
        <div className="admin-dashboard">

            {/* Mobile sidebar toggle */}
            <button
                className="admin-sidebar-toggle"
                onClick={() => setSidebarOpen(o => !o)}
                aria-label="Toggle navigation"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* ── SIDEBAR ── */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
                <div className="admin-sidebar__brand">
                    <span className="admin-sidebar__brand-name">Parinay</span>
                    <span className="admin-sidebar__brand-sub">Admin Console</span>
                </div>

                <p className="admin-sidebar__label">Content Sections</p>

                <ul className="admin-sidebar__nav">
                    {Object.keys(content || {}).map((tab) => (
                        <li key={tab}>
                            <button
                                className={`admin-sidebar__nav-btn ${activeTab === tab ? 'is-active' : ''}`}
                                onClick={() => handleTabSwitch(tab)}
                            >
                                <span className="admin-sidebar__nav-icon">
                                    {SECTION_ICONS[tab] || <LayoutGrid size={17} />}
                                </span>
                                {SECTION_LABELS[tab] || tab}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="admin-sidebar__footer">
                    <button
                        className="admin-sidebar__exit-btn"
                        onClick={() => window.location.href = '/'}
                    >
                        <LogOut size={16} />
                        Exit to Website
                    </button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="admin-main">

                {/* Top bar */}
                <header className="admin-topbar">
                    <div className="admin-topbar__breadcrumb">
                        <span className="admin-topbar__breadcrumb-root">Admin</span>
                        <span className="admin-topbar__breadcrumb-sep">✦</span>
                        <span className="admin-topbar__breadcrumb-current">
                            {SECTION_LABELS[activeTab] || activeTab}
                        </span>
                    </div>
                    <div className="admin-topbar__actions">
                        <button
                            className="admin-btn admin-btn--ghost admin-btn--sm"
                            onClick={() => window.open('/', '_blank')}
                        >
                            <Eye size={14} /> Preview
                        </button>
                        <button
                            className="admin-btn admin-btn--primary admin-btn--sm"
                            onClick={handleSave}
                            disabled={isSaving || !isLoaded}
                        >
                            <Save size={14} />
                            {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="admin-page">

                    {/* Stats bar */}
                    <div className="admin-stats-bar">
                        <div className="admin-stat-card">
                            <Briefcase size={28} className="admin-stat-card__icon" />
                            <div className="admin-stat-card__label">Content Sections</div>
                            <div className="admin-stat-card__value">{totalSections}</div>
                        </div>
                        <div className="admin-stat-card">
                            <LayoutGrid size={28} className="admin-stat-card__icon" />
                            <div className="admin-stat-card__label">Total Items</div>
                            <div className="admin-stat-card__value">{totalArrayItems}</div>
                        </div>
                        <div className="admin-stat-card">
                            <BookOpen size={28} className="admin-stat-card__icon" />
                            <div className="admin-stat-card__label">Journal Posts</div>
                            <div className="admin-stat-card__value">
                                {content?.journals?.journalsList?.length ?? 0}
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <BookOpen size={28} className="admin-stat-card__icon" />
                            <div className="admin-stat-card__label">Wedding Stories</div>
                            <div className="admin-stat-card__value">
                                {(content?.storiesDestination?.storiesList?.length ?? 0) +
                                 (content?.storiesThemed?.storiesList?.length ?? 0) +
                                 (content?.storiesTraditional?.storiesList?.length ?? 0)}
                            </div>
                        </div>
                    </div>

                    {/* Editing header */}
                    <div className="admin-page__header">
                        <div>
                            <h1 className="admin-page__title">
                                Editing &nbsp;<em>{SECTION_LABELS[activeTab] || activeTab}</em>
                            </h1>
                            <p className="admin-page__subtitle">
                                Make your changes below and click "Save Changes" when you're done.
                            </p>
                        </div>
                        <button
                            className="admin-btn admin-btn--primary"
                            onClick={handleSave}
                            disabled={isSaving || !isLoaded}
                        >
                            <Save size={15} />
                            {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Form */}
                    {!isLoaded ? (
                        <div className="admin-loading">
                            <div className="admin-loading__ring" />
                            <span>Loading content from server…</span>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '880px' }}>
                            {renderForm()}
                        </div>
                    )}
                </main>
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDone={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;

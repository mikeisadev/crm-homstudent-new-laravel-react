import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const menuItems = [
        { path: '/dashboard', label: t('menu.home'), icon: 'home' },
        { path: '/calendario', label: t('menu.calendario'), icon: 'people' },
    ];

    const anagraficheItems = [
        { path: '/condomini', label: t('menu.condomini'), icon: 'work' },
        { path: '/immobili', label: t('menu.immobili'), icon: 'work' },
        { path: '/stanze', label: t('menu.stanze'), icon: 'work' },
        { path: '/clienti', label: t('menu.clienti'), icon: 'person' },
    ];

    const flussoItems = [
        { path: '/gestione-immobiliare', label: t('menu.contratti_gestione'), icon: 'people' },
        { path: '/proposte', label: t('menu.proposte'), icon: 'people' },
        { path: '/contratti', label: t('menu.contratti'), icon: 'people' },
    ];

    const generaliItems = [
        { path: '/fornitori', label: t('menu.fornitori'), icon: 'person' },
        { path: '/proprietari', label: t('menu.proprietari'), icon: 'person' },
    ];

    const gestioneItems = [
        { path: '/caparre', label: t('menu.caparre'), icon: 'people' },
        { path: '/disdette', label: t('menu.disdette'), icon: 'people' },
        { path: '/bollette', label: t('menu.bollette'), icon: 'people' },
        { path: '/sanzioni', label: t('menu.sanzioni'), icon: 'people' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const isActive = (path) => location.pathname === path;

    const renderMenuItem = (item) => (
        <div
            key={item.path}
            className="btn_menu"
            onClick={() => handleNavigation(item.path)}
            style={{
                cursor: 'pointer',
                backgroundColor: isActive(item.path) ? '#363a44' : 'transparent',
                borderRadius: isActive(item.path) ? '30px' : '0'
            }}
        >
            <i className="material-icons" style={{ marginLeft: '5px' }}>{item.icon}</i>
            <p>{item.label}</p>
        </div>
    );

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Disconnessione effettuata con successo');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Errore durante il logout:', error);
            toast.error('Errore durante la disconnessione');
        }
    };

    return (
        <div className="menusinistra" style={{ transition: 'width 0.5s', width: isOpen ? '200px' : '60px', minWidth: isOpen ? '200px' : '60px' }}>
            <div className="menu-header" style={{ gridTemplateColumns: '100%', marginTop: '10px', display: isOpen ? 'inline-grid' : 'none', alignItems: 'center', width: '100%' }}>
                <img src="/images/logo.png" style={{ margin: '0 auto', height: '55px', marginTop: '10px' }} alt="Logo" />
            </div>

            <div className="menu-sidebar gridsx" id="gridsx" style={{ height: 'calc(100% - 160px)', overflowX: 'hidden', overflowY: 'auto', display: isOpen ? 'flex' : 'none' }}>
                {menuItems.map(renderMenuItem)}

                <div className="menu-block-heading">
                    <span>{t('menu.anagrafiche')}</span>
                </div>
                {anagraficheItems.map(renderMenuItem)}

                <div className="menu-block-heading">
                    <span>{t('menu.flusso')}</span>
                </div>
                {flussoItems.map(renderMenuItem)}

                <div className="menu-block-heading">
                    <span>{t('menu.generali')}</span>
                </div>
                {generaliItems.map(renderMenuItem)}

                <div className="menu-block-heading">
                    <span>{t('menu.gestione')}</span>
                </div>
                {gestioneItems.map(renderMenuItem)}
            </div>

            <div className="menu-bottom" style={{ flexDirection: isOpen ? 'row' : 'column', height: isOpen ? '55px' : '140px' }}>
                <div className="circle-btn shrink-icon" onClick={() => setIsOpen(!isOpen)}>
                    <span className="material-symbols-outlined">list</span>
                </div>
                <div className="circle-btn logout-icon" onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span>
                </div>
            </div>
        </div>
    );
}

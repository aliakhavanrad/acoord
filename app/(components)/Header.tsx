'use client';

import { useAuth } from '../(hooks)';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    onSetFullExtent?: () => void;
    onGoToUserLocation?: () => void;
    onActivateUpload?: () => void;
    onOpenLoginModal?: () => void;
}

export function Header({ onSetFullExtent, onGoToUserLocation, onActivateUpload, onOpenLoginModal }: HeaderProps) {
    const { isLoggedIn, logout } = useAuth();
    const router = useRouter();

    const openInNewTab = (url: string) => {
        window.open(url, '_blank')?.focus();
    };

    const handleSetFullExtent = () => {
        onSetFullExtent?.();
    };

    const handleGoToUserLocation = () => {
        onGoToUserLocation?.();
    };

    const handleLogout = () => {
        if (isLoggedIn()) {
            logout();
            router.push('/');
        }
    };

    const handleLogin = () => {
        onOpenLoginModal?.();
    };

    const handleHelp = () => {
        router.push('/help');
    };

    const handleAbout = () => {
        router.push('/about');
    };

    const handleActivateUpload = () => {
        onActivateUpload?.();
    };

    return (
        <div className={styles.header}>
            <img
                id={styles.acoordLogo}
                src="/assets/Icons/ACOORD.png"
                alt="ACOORD"
            />

            <div className={styles.headerRightPart}>
                <span></span>
                <img
                    className={styles.headerImage}
                    src="/assets/Icons/insta.png"
                    alt="Instagram"
                    onClick={() =>
                        openInNewTab('https://www.instagram.com/audible_coordinates/?utm_medium=copy_link')
                    }
                />

                <img
                    className={styles.headerImage}
                    src="/assets/Icons/i.png"
                    alt="about"
                    onClick={handleAbout}
                />

                <img
                    className={styles.headerImage}
                    src="/assets/Icons/world.png"
                    alt="full extent"
                    onClick={handleSetFullExtent}
                />

                <img
                    className={styles.headerImage}
                    src="/assets/Icons/loc.png"
                    alt="location"
                    onClick={handleGoToUserLocation}
                />

                <img
                    className={styles.headerImage}
                    src="/assets/Icons/help.png"
                    alt="help"
                    onClick={handleHelp}
                />

                {isLoggedIn() && (
                    <img
                        className={styles.headerImage}
                        src="/assets/Icons/Upload_Active.png"
                        alt="upload"
                        onClick={handleActivateUpload}
                    />
                )}

                {!isLoggedIn() && (
                    <img
                        className={styles.headerImage}
                        src="/assets/Icons/Upload_Inactive.png"
                        alt="upload inactive"
                        onClick={handleLogin}
                    />
                )}

                {!isLoggedIn() && (
                    <img
                        className={styles.headerImage}
                        src="/assets/Icons/Login.png"
                        alt="login"
                        onClick={handleLogin}
                    />
                )}

                {isLoggedIn() && (
                    <img
                        className={styles.headerImage}
                        src="/assets/Icons/Logout.png"
                        alt="logout"
                        onClick={handleLogout}
                    />
                )}
            </div>
        </div>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import styles from './Help.module.css';

export function Help() {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    return (
        <>
            <div className={styles.fullScreenContainer}></div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.close} onClick={handleClose}></div>
                </div>
                <video
                    id={styles.helpVideo}
                    controls
                    src="/assets/Videos/help.mp4"
                ></video>
            </div>
        </>
    );
}

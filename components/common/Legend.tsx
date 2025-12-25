'use client';

import styles from './Legend.module.css';

export function Legend() {
    return (
        <img
            className={styles.legend}
            src="/assets/Icons/legend.png"
            alt="Legend"
        />
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Voice } from "../(models)";
import styles from "./PlayerPanel.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.acoord.ir";

interface PlayerPanelProps {
    sound: Voice | null;
    onClosed: () => void;
    onClearSelection?: () => void;
}

export function PlayerPanel({
    sound,
    onClosed,
    onClearSelection,
}: PlayerPanelProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playButtonRef = useRef<HTMLDivElement>(null);

    // Set up audio when sound changes
    useEffect(() => {
        if (!sound) return;

        // Stop previous audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Create new audio element
        const audioUrl = `${API_URL}/Playlist/GetVoice/${sound.voiceID}`;
        audioRef.current = new Audio(audioUrl);

        // Set volume
        audioRef.current.addEventListener("loadeddata", () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.75;
            }
        });

        // Handle when audio ends
        audioRef.current.addEventListener("ended", () => {
            setIsPlaying(false);
        });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        };
    }, [sound]);

    const handlePlayPause = () => {
        if (!audioRef.current || !sound) return;

        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleToggleMinMax = () => {
        setIsMinimized(!isMinimized);
    };

    const handleClose = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
        onClearSelection?.();
        onClosed();
    };

    if (!sound) return null;

    return (
        <div
            ref={panelRef}
            className={styles.playerPanel}
            style={{
                height: isMinimized ? "190px" : "280px",
            }}
        >
            <div className={styles.header}>
                <div
                    className={`${styles.toggleBtn} ${
                        isMinimized ? styles.maxBtn : styles.minBtn
                    }`}
                    onClick={handleToggleMinMax}
                />
                <div className={styles.close} onClick={handleClose} />
            </div>

            <div className={styles.playBtnContainer}>
                <div className={styles.playBtnProgressCircle}>
                    <div
                        ref={playButtonRef}
                        className={`${styles.playPauseButton} ${
                            isPlaying ? styles.pauseButton : styles.playButton
                        }`}
                        onClick={handlePlayPause}
                    />
                </div>
            </div>

            <p className={styles.musicName}>{sound.name}</p>
            <p className={styles.uploaded}>
                Uploaded By {sound.uploader || "Unknown"}
            </p>

            <p className={styles.description}>
                {sound.description || "No description"}
            </p>
        </div>
    );
}

"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";

import styles from "./UploadForm.module.css";
import { useAuth } from "@/hooks";

interface UploadFormProps {
    clickedLocation: number[] | null;
    onClose?: () => void;
}

// declare const MicRecorder: any;

const UPLOAD_FILE_MAXIMUM_SIZE_MB = 10;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.acoord.ir";

export function UploadForm({ clickedLocation, onClose }: UploadFormProps) {
    const { currentUser } = useAuth();

    // Form state
    const [stepIndex, setStepIndex] = useState(1);
    const [voiceName, setVoiceName] = useState("");
    const [fileOrRecord, setFileOrRecord] = useState("File");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [recordedFile, setRecordedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [progress, setProgress] = useState(0);

    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordedTimeInSecond, setRecordedTimeInSecond] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // const recorderRef = useRef<any>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Voice metadata
    const [voiceType, setVoiceType] = useState("Music");
    const [selectedMoods, setSelectedMoods] = useState<string[]>(["Happy"]);
    const [suggestedTime, setSuggestedTime] = useState("All Time");
    const [yourFeeling, setYourFeeling] = useState("");

    // Form options
    const fileOrRecordOptions = ["File", "Record"];
    const voiceTypeOptions = ["Music", "Podcast", "Recorded Voice", "Other"];
    const moodOfVoiceOptions = [
        "Happy",
        "Calm",
        "Love",
        "Anxious/Sad",
        "Energetic",
        "Hate/Anger",
    ];
    const suggestedTimeOptions = ["All Time", "Day", "Night"];

    // Initialize recorder
    // const initRecorder = () => {
    //     if (!recorderRef.current) {
    //         recorderRef.current = new MicRecorder({
    //             bitRate: 128,
    //         });
    //     }
    // };

    // const startRecord = () => {
    //     initRecorder();
    //     recorderRef.current.start().then(() => {
    //         setIsRecording(true);
    //         setRecordedTimeInSecond(0);
    //         intervalRef.current = setInterval(() => {
    //             setRecordedTimeInSecond((prev) => prev + 1);
    //         }, 1000);
    //     });
    // };

    // const stopRecord = async () => {
    //     if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //     }

    //     try {
    //         const [buffer, blob] = await recorderRef.current.stop().getMp3();
    //         setIsRecording(false);

    //         const file = new File(buffer, "recording.mp3", {
    //             type: blob.type,
    //             lastModified: Date.now(),
    //         });

    //         setRecordedFile(file);
    //         audioRef.current = new Audio(URL.createObjectURL(file));
    //         audioRef.current.addEventListener("ended", () => {
    //             setIsPlaying(false);
    //         });
    //     } catch (error) {
    //         console.error("Recording error:", error);
    //         setIsRecording(false);
    //     }
    // };

    // const handleMicClick = () => {
    //     if (!isRecording) {
    //         startRecord();
    //     } else {
    //         stopRecord();
    //     }
    // };

    const togglePlay = async () => {
        // if (isRecording) {
        //     await stopRecord();
        // }

        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // const rejectVoice = () => {
    //     if (isRecording && intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //         recorderRef.current?.stop();
    //     }
    //     setRecordedTimeInSecond(0);
    //     setAudioRef(null);
    //     setRecordedFile(null);
    // };

    const setAudioRef = (ref: HTMLAudioElement | null) => {
        audioRef.current = ref;
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 0) return;

        const file = e.target.files?.[0];
        if (!file) return;

        const fileSizeMB = file.size / 1024 / 1024;
        if (fileSizeMB > UPLOAD_FILE_MAXIMUM_SIZE_MB) {
            alert(
                `File size must be less than ${UPLOAD_FILE_MAXIMUM_SIZE_MB} MB`
            );
            e.target.value = "";
            setUploadedFile(null);
            setFileName("");
            return;
        }

        setUploadedFile(file);
        setFileName(file.name);
    };

    const convertSecondsToString = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - hours * 3600) / 60);
        const secs = seconds - hours * 3600 - minutes * 60;

        const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const secondsString = secs < 10 ? `0${secs}` : `${secs}`;

        return `${minutesString}:${secondsString}`;
    };

    const isNextDisabled = (): boolean => {
        if (stepIndex === 1) {
            return (
                (uploadedFile === null && recordedFile === null) ||
                voiceName.trim() === ""
            );
        } else if (stepIndex === 2) {
            return selectedMoods.length === 0;
        }
        return false;
    };

    const handleMoodChange = (mood: string) => {
        setSelectedMoods((prev) =>
            prev.includes(mood)
                ? prev.filter((m) => m !== mood)
                : [...prev, mood]
        );
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const file = fileOrRecord === "File" ? uploadedFile : recordedFile;

        if (!file) {
            alert("Please select or record your voice");
            return;
        }

        if (!yourFeeling.trim()) {
            alert("Please complete the form");
            return;
        }

        if (!clickedLocation) {
            alert("No location selected");
            return;
        }

        setSubmitted(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("longitude", clickedLocation[0].toString());
        formData.append("latitude", clickedLocation[1].toString());
        formData.append("name", voiceName);
        formData.append("voiceType", voiceType);
        formData.append("feeling", yourFeeling);
        formData.append("mood", selectedMoods.join(","));
        formData.append("timetolisten", suggestedTime);

        try {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round(
                        (event.loaded / event.total) * 100
                    );
                    setProgress(percentComplete);
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status === 200) {
                    alert("File uploaded successfully!");
                    onClose?.();
                    setProgress(0);
                } else if (xhr.status === 401) {
                    alert("Please login to upload");
                    onClose?.();
                } else {
                    alert("Upload failed");
                    onClose?.();
                }
            });

            xhr.addEventListener("error", () => {
                alert("Upload failed");
                onClose?.();
            });

            xhr.open("POST", `${API_URL}/Playlist/UploadVoice`);
            xhr.setRequestHeader(
                "Authorization",
                `Bearer ${currentUser?.token}`
            );
            xhr.send(formData);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
            onClose?.();
        } finally {
            setSubmitted(false);
        }
    };

    if (!clickedLocation) return null;

    return (
        <div className={styles.uploadForm}>
            <div className={styles.header}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    type="button"
                    aria-label="Close upload form"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Voice Selection */}
                {stepIndex === 1 && (
                    <div className={styles.step}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <b>Voice Name:</b>
                            </label>
                            <input
                                type="text"
                                value={voiceName}
                                onChange={(e) => setVoiceName(e.target.value)}
                                className={styles.input}
                                maxLength={40}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <b>Voice:</b>
                            </label>
                            {/* <div className={styles.radioGroup}>
                                {fileOrRecordOptions.map((option) => (
                                    <div
                                        key={option}
                                        className={styles.radioOption}
                                    >
                                        <input
                                            type="radio"
                                            id={option}
                                            name="fileOrRecord"
                                            value={option}
                                            checked={fileOrRecord === option}
                                            onChange={(e) =>
                                                setFileOrRecord(e.target.value)
                                            }
                                        />
                                        <label htmlFor={option}>{option}</label>
                                    </div>
                                ))}
                            </div> */}
                        </div>

                        {/* File Upload */}
                        {fileOrRecord === "File" && (
                            <div className={styles.formGroup}>
                                <input
                                    type="file"
                                    accept=".mp3"
                                    onChange={handleFileSelect}
                                    className={styles.fileInput}
                                />
                                {fileName && (
                                    <p className={styles.fileName}>
                                        {fileName}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Voice Recorder */}
                        {/* {fileOrRecord === "Record" && (
                            <div className={styles.voiceRecorderContainer}>
                                <div className={styles.playTimeContainer}>
                                    <button
                                        type="button"
                                        className={`${styles.micButton} ${
                                            isRecording ? styles.stopButton : ""
                                        }`}
                                        onClick={handleMicClick}
                                        aria-label={
                                            isRecording
                                                ? "Stop recording"
                                                : "Start recording"
                                        }
                                    />

                                    <div
                                        className={styles.recordedTimeContainer}
                                    >
                                        <button
                                            type="button"
                                            className={
                                                styles.removeRecordButton
                                            }
                                            onClick={rejectVoice}
                                            aria-label="Remove recording"
                                        />
                                        <label>
                                            {convertSecondsToString(
                                                recordedTimeInSecond
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className={`${styles.playButton} ${
                                        isPlaying ? styles.pauseButton : ""
                                    }`}
                                    onClick={togglePlay}
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                />
                            </div>
                        )} */}
                    </div>
                )}

                {/* Step 2: Voice Type and Mood */}
                {stepIndex === 2 && (
                    <div className={styles.step}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <b>Type of Voice:</b>
                            </label>
                            <div className={styles.optionGrid}>
                                {voiceTypeOptions.map((option) => (
                                    <div
                                        key={option}
                                        className={styles.radioOption}
                                    >
                                        <input
                                            type="radio"
                                            id={option}
                                            name="voiceType"
                                            value={option}
                                            checked={voiceType === option}
                                            onChange={(e) =>
                                                setVoiceType(e.target.value)
                                            }
                                        />
                                        <label htmlFor={option}>{option}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <b>Mood of Voice:</b>
                            </label>
                            <div className={styles.optionGrid}>
                                {moodOfVoiceOptions.map((mood) => (
                                    <div
                                        key={mood}
                                        className={styles.checkboxOption}
                                    >
                                        <input
                                            type="checkbox"
                                            id={mood}
                                            checked={selectedMoods.includes(
                                                mood
                                            )}
                                            onChange={() =>
                                                handleMoodChange(mood)
                                            }
                                        />
                                        <label htmlFor={mood}>{mood}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Time and Feeling */}
                {stepIndex === 3 && (
                    <div className={styles.step}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <b>Suggested Time to Listen:</b>
                            </label>
                            <div className={styles.radioGroup}>
                                {suggestedTimeOptions.map((option) => (
                                    <div
                                        key={option}
                                        className={styles.radioOption}
                                    >
                                        <input
                                            type="radio"
                                            id={`time-${option}`}
                                            name="suggestedTime"
                                            value={option}
                                            checked={suggestedTime === option}
                                            onChange={(e) =>
                                                setSuggestedTime(e.target.value)
                                            }
                                        />
                                        <label htmlFor={`time-${option}`}>
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label
                                htmlFor="yourFeeling"
                                className={styles.label}
                            >
                                <b>Your Feeling:</b>
                            </label>
                            <textarea
                                id="yourFeeling"
                                value={yourFeeling}
                                onChange={(e) => setYourFeeling(e.target.value)}
                                className={styles.textarea}
                                maxLength={60}
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {progress > 0 && (
                    <div className={styles.progressContainer}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${progress}%` }}
                        >
                            {progress}%
                        </div>
                    </div>
                )}

                {/* Form Footer */}
                <div className={styles.formFooter}>
                    {stepIndex > 1 && (
                        <button
                            type="button"
                            onClick={() => setStepIndex(stepIndex - 1)}
                            disabled={submitted}
                            className={styles.backButton}
                        >
                            Back
                        </button>
                    )}

                    {stepIndex < 3 && (
                        <button
                            type="button"
                            onClick={() => setStepIndex(stepIndex + 1)}
                            disabled={isNextDisabled()}
                            className={styles.nextButton}
                        >
                            Next
                        </button>
                    )}

                    {stepIndex === 3 && (
                        <button
                            type="submit"
                            disabled={submitted}
                            className={styles.uploadButton}
                        >
                            Upload
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

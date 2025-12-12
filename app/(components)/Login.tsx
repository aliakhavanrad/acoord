"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/app/(hooks)";
import styles from "./Login.module.css";

interface LoginProps {
    onClose?: () => void;
    onOpenRegister?: () => void;
}

export function LoginModal({ onClose, onOpenRegister }: LoginProps) {
    const { login, loading, error: authError } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        setError("");

        // Validation
        if (!username || !password) {
            setError("Username and password are required");
            return;
        }

        try {
            await login(username, password);
            onClose?.();
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    const handleSignUp = () => {
        setUsername("");
        setPassword("");
        setSubmitted(false);
        setError("");
        onOpenRegister?.();
    };

    return (
        <div className={styles.modalForm}>
            <div>
                <div className={styles.textCenter}>
                    <img
                        src="/assets/Icons/Icon.png"
                        width={50}
                        height={50}
                        alt="Icon"
                    />
                    <h4>Welcome to ACoord</h4>
                </div>

                <br />

                <div>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <div className={styles.row}>
                                <div className={styles.colSm4}>
                                    <label
                                        htmlFor="username"
                                        className={styles.formLabel}
                                    >
                                        Username
                                    </label>
                                </div>

                                <div className={styles.colSm8}>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        className={
                                            styles.formControl +
                                            (submitted && !username
                                                ? " " + styles.isInvalid
                                                : "")
                                        }
                                    />
                                    {submitted && !username && (
                                        <div className={styles.invalidFeedback}>
                                            Username is required
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.row}>
                                <div className={styles.colSm4}>
                                    <label
                                        htmlFor="password"
                                        className={styles.formLabel}
                                    >
                                        Password
                                    </label>
                                </div>

                                <div className={styles.colSm8}>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className={
                                            styles.formControl +
                                            (submitted && !password
                                                ? " " + styles.isInvalid
                                                : "")
                                        }
                                    />
                                    {submitted && !password && (
                                        <div className={styles.invalidFeedback}>
                                            Password is required
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.buttonContainer}>
                            <button
                                type="submit"
                                disabled={loading}
                                className={styles.btnPrimary}
                            >
                                {loading && (
                                    <span className={styles.spinner}></span>
                                )}
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={handleSignUp}
                                className={styles.btnDanger}
                            >
                                Sign Up
                            </button>
                        </div>

                        {(error || authError) && (
                            <div className={styles.alertDanger}>
                                {error || authError}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

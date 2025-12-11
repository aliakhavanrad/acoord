'use client';

import { useState, useCallback, useEffect } from 'react';
import { User } from '../(models)';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.acoord.ir';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                try {
                    setCurrentUser(JSON.parse(stored));
                } catch (e) {
                    console.error('Failed to parse stored user', e);
                    localStorage.removeItem('currentUser');
                }
            }
        }
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/Authentication/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`Login failed with status ${response.status}`);
            }

            const token = response.headers.get('tk');
            const data = await response.json();

            const user: User = {
                id: data.id || 0,
                username,
                password: '',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                token: token || undefined,
                loginDate: new Date(),
            };

            if (typeof window !== 'undefined') {
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            setCurrentUser(user);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(
        async (name: string, username: string, password: string, phoneNumber: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/Authentication/RegisterNewUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, username, password, phoneNumber }),
                });

                if (!response.ok) {
                    throw new Error(`Registration failed with status ${response.status}`);
                }

                return await response.json();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Registration failed';
                setError(message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const logout = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('currentUser');
        }
        setCurrentUser(null);
    }, []);

    const isLoggedIn = useCallback(() => {
        try {
            if (!currentUser?.loginDate) {
                return false;
            }

            const now = new Date().valueOf();
            const loginDate = new Date(currentUser.loginDate).valueOf();
            const daysPassedFromLoginTime = (now - loginDate) / (24 * 60 * 60 * 1000);

            if (currentUser && currentUser.token && daysPassedFromLoginTime <= 5) {
                return true;
            }
        } catch (ex) {
            console.log(ex);
        }

        return false;
    }, [currentUser]);

    return {
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        isLoggedIn,
    };
};

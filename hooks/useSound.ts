"use client";

import { Voice } from "@/models";
import { useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.acoord.ir";

export const useSound = () => {
    const [voices, setVoices] = useState<Voice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllAcceptedVoices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${API_URL}/Playlist/GetAllAcceptedVoices`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch voices: ${response.status}`);
            }

            const data: Voice[] = await response.json();
            setVoices(data);
            return data;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to fetch voices";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getNotAcceptedVoices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${API_URL}/Playlist/GetNotAcceptedVoices`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch voices: ${response.status}`);
            }

            const data: Voice[] = await response.json();
            setVoices(data);
            return data;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to fetch voices";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        voices,
        loading,
        error,
        getAllAcceptedVoices,
        getNotAcceptedVoices,
    };
};

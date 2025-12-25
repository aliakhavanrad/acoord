import { VoiceType } from './voice-type';

export interface Voice {
    voiceID: string;
    name: string;
    voiceType: VoiceType;
    longitude: number;
    latitude: number;
    voicePath: string;
    uploader?: string;
    genre?: string;
    description?: string;
    mood?: string;
    timeToListen?: string;
    voiceLength?: string;
    profile?: string;
}
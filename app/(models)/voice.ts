import { VoiceType } from "./voice-type";

export interface Voice {
    VoiceID: string,
    Name: string,
    VoiceType: VoiceType,
    Longitude: number,
    Latitude: number,
    VoicePath: string,
    Uploader: string,
    Genre?: string,
    Description?: string,
    Mood?: string,
    TimeToListen?: string,
    VoiceLength?: string,
}
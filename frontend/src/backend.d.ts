import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MassTiming {
    day: string;
    serviceType: string;
    time: string;
}
export interface Prayer {
    title: string;
    content: string;
    language: string;
}
export interface Announcement {
    active: boolean;
    text: string;
    eventDate: bigint;
}
export interface MediaItem {
    url: string;
    caption: string;
    mediaType: string;
}
export interface SpiritualMessage {
    title: string;
    date: bigint;
    fullText: string;
    author: string;
}
export interface backendInterface {
    addMassTiming(day: string, time: string, serviceType: string): Promise<void>;
    addMediaItem(mediaType: string, url: string, caption: string): Promise<void>;
    addPrayer(title: string, language: string, content: string): Promise<void>;
    countMassSchedule(): Promise<bigint>;
    countMediaGallery(): Promise<bigint>;
    countPrayers(): Promise<bigint>;
    filterPrayers(language: string): Promise<Array<Prayer>>;
    getAnnouncement(): Promise<Announcement | null>;
    getMassSchedule(): Promise<Array<MassTiming>>;
    getMediaGallery(): Promise<Array<MediaItem>>;
    getPrayersByLanguage(language: string): Promise<Array<Prayer>>;
    getSpiritualMessage(): Promise<SpiritualMessage | null>;
    updateAnnouncement(text: string, eventDate: bigint, active: boolean): Promise<void>;
    updateSpiritualMessage(title: string, author: string, fullText: string): Promise<void>;
}

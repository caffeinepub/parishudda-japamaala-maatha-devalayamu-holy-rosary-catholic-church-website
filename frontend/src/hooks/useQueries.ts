import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MassTiming, SpiritualMessage, Prayer, MediaItem, Announcement } from '../backend';

// Mass Schedule
export function useMassSchedule() {
  const { actor, isFetching } = useActor();
  return useQuery<MassTiming[]>({
    queryKey: ['massSchedule'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMassSchedule();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMassTiming() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ day, time, serviceType }: { day: string; time: string; serviceType: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addMassTiming(day, time, serviceType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['massSchedule'] });
    },
  });
}

export function useCountMassSchedule() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['countMassSchedule'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.countMassSchedule();
    },
    enabled: !!actor && !isFetching,
  });
}

// Spiritual Message
export function useSpiritualMessage() {
  const { actor, isFetching } = useActor();
  return useQuery<SpiritualMessage | null>({
    queryKey: ['spiritualMessage'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpiritualMessage();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSpiritualMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, author, fullText }: { title: string; author: string; fullText: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateSpiritualMessage(title, author, fullText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spiritualMessage'] });
    },
  });
}

// Prayers
export function usePrayersByLanguage(language: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Prayer[]>({
    queryKey: ['prayers', language],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPrayersByLanguage(language);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPrayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, language, content }: { title: string; language: string; content: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addPrayer(title, language, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
    },
  });
}

export function useCountPrayers() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['countPrayers'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.countPrayers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Media Gallery
export function useMediaGallery() {
  const { actor, isFetching } = useActor();
  return useQuery<MediaItem[]>({
    queryKey: ['mediaGallery'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMediaGallery();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMediaItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mediaType, url, caption }: { mediaType: string; url: string; caption: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addMediaItem(mediaType, url, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaGallery'] });
    },
  });
}

// Announcement
export function useAnnouncement() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement | null>({
    queryKey: ['announcement'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnnouncement();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ text, eventDate, active }: { text: string; eventDate: bigint; active: boolean }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateAnnouncement(text, eventDate, active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement'] });
    },
  });
}

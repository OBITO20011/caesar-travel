import { useQuery } from "@tanstack/react-query";

import { galleryService, siteSettingsService, tripsService } from "@/services/admin";
import type { TripPageKey } from "@/types/admin";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: siteSettingsService.get,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useGalleryImages() {
  return useQuery({
    queryKey: ["site-gallery"],
    queryFn: galleryService.getAll,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function usePublicTrips(pageKey: TripPageKey) {
  return useQuery({
    queryKey: ["public-trips", pageKey],
    queryFn: () => tripsService.getPublicByPage(pageKey),
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function usePublicTrip(id: string) {
  return useQuery({
    queryKey: ["public-trip", id],
    queryFn: () => tripsService.getPublicById(id),
    staleTime: 60 * 1000,
    retry: false,
  });
}

import { useQuery } from "@tanstack/react-query";

import { galleryService, siteSettingsService, tripsService, visasService } from "@/services/admin";
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

export function useFeaturedTrips() {
  return useQuery({
    queryKey: ["featured-trips"],
    queryFn: tripsService.getFeatured,
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

export function usePublicVisas() {
  return useQuery({
    queryKey: ["public-visas"],
    queryFn: visasService.getPublic,
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function usePublicVisa(slug: string) {
  return useQuery({
    queryKey: ["public-visa", slug],
    queryFn: () => visasService.getPublicBySlug(slug),
    staleTime: 60 * 1000,
    retry: false,
  });
}

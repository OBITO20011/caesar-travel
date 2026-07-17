import { useQuery } from "@tanstack/react-query";

import { galleryService, siteSettingsService } from "@/services/admin";

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

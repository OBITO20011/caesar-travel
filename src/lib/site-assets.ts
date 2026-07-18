export const BUILTIN_LOGO_URL = "/assets/caesar-mark.png";
export const BUILTIN_HERO_URL = "/assets/hero-hajj.jpg";

export function resolveSiteAsset(
  value: string | undefined,
  builtinValue: string,
  importedAsset: string,
) {
  return !value || value === builtinValue ? importedAsset : value;
}

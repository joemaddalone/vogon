import {
  JellyfinLibraryResponse,
  JellyfinMovieResponse,
  JellyfinSeasonResponse,
  JellyfinEpisodeResponse,
  JellyfinResponse,
  JellyfinSystemInfo,
  JellyfinMovieMetadata,
  JellyfinImage,
} from "@/lib/types/jellyfin";
import { getClients } from "./getClients";

export class JellyfinClient {
  constructor() {}

  private async config() {
    return await getClients();
  }

  /**
   * Make authenticated request to Jellyfin API
   */
  private async request<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    const config = await this.config();
    const url = `${config?.serverUrl}${endpoint}`;

    // Build query params (don't add api_key to query string)
    const queryParams = new URLSearchParams(params || {});
    const fullUrl = queryParams.toString()
      ? `${url}?${queryParams.toString()}`
      : url;
    try {
      const response = await fetch(fullUrl, {
        headers: {
          Accept: "application/json",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
        },
      });

      if (!response.ok) {
        return {
          error: `Jellyfin API error: ${response.status} ${response.statusText}`,
        } as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("Jellyfin API request failed:", error);
      return { error: `Jellyfin API request failed: ${error}` } as T;
    }
  }

  /**
   * Get all libraries from Jellyfin server
   */
  async getLibraries(): Promise<JellyfinLibraryResponse[]> {
    const config = await this.config();
    const response = await this.request<
      JellyfinResponse<JellyfinLibraryResponse>
    >(`/Users/${config?.userid}/Views`);
    return response.Items || [];
  }

  /**
   * Get all items from a specific library
   */
  async getLibraryItems(libraryId: string): Promise<JellyfinMovieResponse[]> {
    const config = await this.config();
    const response = await this.request<
      JellyfinResponse<JellyfinMovieResponse>
    >(`/Users/${config?.userid}/Items`, {
      IncludeItemTypes: "Series,Movie",
      ParentId: libraryId,
      Recursive: "true",
      // Fields: "ProviderIds,Overview,ImageTags,BackdropImageTags",
    });
    const items = response.Items || [];

    // Add full URL to thumbnails
    return items.map((item) => ({
      ...item,
      thumbUrl: item.ImageTags?.Primary
        ? `${config?.serverUrl}/Items/${item.Id}/Images/Primary?api_key=${config?.serverToken}`
        : undefined,
      artUrl: item.BackdropImageTags?.[0]
        ? `${config?.serverUrl}/Items/${item.Id}/Images/Backdrop/0?api_key=${config?.serverToken}`
        : undefined,
    }));
  }

  /**
   * Get detailed metadata for a specific movie
   */
  async getMovieDetails(
    itemId: string
  ): Promise<Partial<JellyfinMovieMetadata>> {
    const config = await this.config();
    const response = await this.request<JellyfinMovieMetadata>(
      `/Users/${config?.userid}/Items/${itemId}`,
      {
        Fields:
          "ProviderIds,Overview,Studios,Genres,MediaSources,ImageTags,BackdropImageTags",
      }
    );

    if (!response || !response.Id) {
      throw new Error("Movie not found");
    }

    return {
      ...response,
      thumbUrl: response.ImageTags?.Primary
        ? `${config?.serverUrl}/Items/${itemId}/Images/Primary?api_key=${config?.serverToken}`
        : "",
      artUrl: response.BackdropImageTags?.[0]
        ? `${config?.serverUrl}/Items/${itemId}/Images/Backdrop/0?api_key=${config?.serverToken}`
        : "",
    };
  }

  /**
   * Get seasons for a TV show
   */
  async getShowSeasons(seriesId: string): Promise<JellyfinSeasonResponse[]> {
    const config = await this.config();
    const response = await this.request<
      JellyfinResponse<JellyfinSeasonResponse>
    >(`/Shows/${seriesId}/Seasons`, {
      UserId: config?.userid || "",
      Fields: "ProviderIds,Overview,ImageTags,BackdropImageTags",
    });
    const items = response.Items || [];

    return items.map((season) => ({
      ...season,
      thumbUrl: season.ImageTags?.Primary
        ? `${config?.serverUrl}/Items/${season.Id}/Images/Primary?api_key=${config?.serverToken}`
        : undefined,
      artUrl: season.BackdropImageTags?.[0]
        ? `${config?.serverUrl}/Items/${season.Id}/Images/Backdrop/0?api_key=${config?.serverToken}`
        : season.ParentBackdropImageTags?.[0]
        ? `${config?.serverUrl}/Items/${season.SeriesId}/Images/Backdrop/0?api_key=${config?.serverToken}`
        : undefined,
      parentThumb: season.SeriesPrimaryImageTag
        ? `${config?.serverUrl}/Items/${season.SeriesId}/Images/Primary?api_key=${config?.serverToken}`
        : undefined,
    }));
  }

  /**
   * Get episodes for a season
   */
  async getSeasonEpisodes(
    seasonId: string
  ): Promise<JellyfinEpisodeResponse[]> {
    const config = await this.config();
    const response = await this.request<
      JellyfinResponse<JellyfinEpisodeResponse>
    >(`/Users/${config?.userid}/Items`, {
      ParentId: seasonId,
      Fields: "ProviderIds,Overview,ImageTags",
    });
    const items = response.Items || [];

    return items.map((episode) => ({
      ...episode,
      thumbUrl: episode.ImageTags?.Primary
        ? `${config?.serverUrl}/Items/${episode.Id}/Images/Primary?api_key=${config?.serverToken}`
        : undefined,
    }));
  }

  /**
   * Update movie poster with a new image URL
   */
  async updateMoviePoster(itemId: string, posterUrl: string): Promise<void> {
    const config = await this.config();

    // Download the image
    const imageResponse = await fetch(posterUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download poster image");
    }
    const imageBlob = await imageResponse.blob();
    // convert to base64
    const base64 = Buffer.from(await imageBlob.arrayBuffer()).toString(
      "base64"
    );

    // Upload to Jellyfin
    const url = `${config?.serverUrl}/Items/${itemId}/Images/Primary`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type":
            imageResponse.headers.get("content-type") || "image/jpeg",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
        },
        body: base64,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update poster: ${response.status} ${response.statusText}`
        );
      }

      // Lock the poster field to prevent Jellyfin from overwriting it
      // await this.lockPosterField(itemId);
    } catch (error) {
      console.error("Failed to update movie poster:", error);
      throw error;
    }
  }

  /**
   * Update movie backdrop with a new image URL
   */
  async updateMovieBackdrop(
    itemId: string,
    backdropUrl: string
  ): Promise<void> {
    const config = await this.config();

    // Download the image
    const imageResponse = await fetch(backdropUrl);

    if (!imageResponse.ok) {
      throw new Error("Failed to download backdrop image");
    }
    const imageBlob = await imageResponse.blob();
    const base64 = Buffer.from(await imageBlob.arrayBuffer()).toString(
      "base64"
    );

    // Upload to Jellyfin
    const url = `${config?.serverUrl}/Items/${itemId}/Images/Backdrop`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type":
            imageResponse.headers.get("content-type") || "image/jpeg",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
        },
        body: base64,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update backdrop: ${response.status} ${response.statusText}`
        );
      }

      // we now need to update the index of the new backdrop
      const indexResponse = await fetch(
        `${config?.serverUrl}/Items/${itemId}/Images`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
          },
        }
      );

      const images: JellyfinImage[] = await indexResponse.json();
      if (images.length > 0) {
        const backdrop = images.filter(
          (image) => image.ImageType === "Backdrop"
        )?.sort(
          (a: JellyfinImage, b: JellyfinImage) => a.ImageIndex - b.ImageIndex
        );

        const lastBackdrop = backdrop?.[backdrop.length - 1];
        const updateResponse = await fetch(
          `${config?.serverUrl}/Items/${itemId}/Images/Backdrop/${lastBackdrop.ImageIndex}/Index?newIndex=0`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
            }
          }
        );

        if (!updateResponse.ok) {
          throw new Error(
            `Failed to update backdrop index: ${updateResponse.status} ${updateResponse.statusText}`
          );
        }
      }

      // Lock the backdrop field to prevent Jellyfin from overwriting it
      // await this.lockBackdropField(itemId);
    } catch (error) {
      console.error("Failed to update movie backdrop:", error);
      throw error;
    }
  }

  /**
   * Lock the poster field to prevent Jellyfin from changing it
   */
  private async lockPosterField(itemId: string): Promise<void> {
    const config = await this.config();
    const url = `${config?.serverUrl}/Items/${itemId}`;

    try {
      // Get current item metadata
      const item = await this.getMovieDetails(itemId);

      // Update with locked image field
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
        },
        body: JSON.stringify({
          ...item,
          LockedFields: [...(item.LockedFields || []), "Images"],
        }),
      });

      if (!response.ok) {
        console.warn("Failed to lock poster field");
      }
    } catch (error) {
      console.warn("Failed to lock poster field:", error);
    }
  }

  /**
   * Lock the backdrop field to prevent Jellyfin from changing it
   */
  private async lockBackdropField(itemId: string): Promise<void> {
    const config = await this.config();
    const url = `${config?.serverUrl}/Items/${itemId}`;

    try {
      // Get current item metadata
      const item = await this.getMovieDetails(itemId);

      // Update with locked image field
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
        },
        body: JSON.stringify({
          ...item,
          LockedFields: [...(item.LockedFields || []), "Backdrops"],
        }),
      });

      if (!response.ok) {
        console.warn("Failed to lock backdrop field");
      }
    } catch (error) {
      console.warn("Failed to lock backdrop field:", error);
    }
  }

  /**
   * Refresh metadata for a specific item
   */
  async refreshMetadata(itemId: string): Promise<void> {
    const config = await this.config();
    const url = `${config?.serverUrl}/Items/${itemId}/Refresh`;
    const params = new URLSearchParams({
      MetadataRefreshMode: "FullRefresh",
      ImageRefreshMode: "Default",
      ReplaceAllMetadata: "false",
      ReplaceAllImages: "false",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
        },
      });

      if (!response.ok) {
        console.warn("Failed to refresh metadata");
      }
    } catch (error) {
      console.warn("Failed to refresh metadata:", error);
    }
  }

  /**
   * Refresh library
   */
  async refreshLibrary(libraryId: string): Promise<void> {
    const config = await this.config();
    const url = `${config?.serverUrl}/Items/${libraryId}/Refresh`;
    const params = new URLSearchParams({
      Recursive: "true",
      MetadataRefreshMode: "Default",
      ImageRefreshMode: "Default",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "X-Emby-Authorization": `MediaBrowser Token="${config?.serverToken}"`,
        },
      });

      if (!response.ok) {
        console.warn("Failed to refresh library");
      }
    } catch (error) {
      console.warn("Failed to refresh library:", error);
    }
  }

  /**
   * Test connection to Jellyfin server
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.request<JellyfinSystemInfo>("/System/Info");
      return !!response.Id;
    } catch (error) {
      console.error("Failed to test Jellyfin connection:", error);
      return false;
    }
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<JellyfinSystemInfo | null> {
    try {
      const response = await this.request<JellyfinSystemInfo>("/System/Info");
      return response.Id ? response : null;
    } catch {
      return null;
    }
  }
}

export const jellyfin = new JellyfinClient();

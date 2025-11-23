import {
  PlexLibraryResponse,
  PlexMovieResponse,
  PlexResponse,
  PlexMovieMetadata,
  PlexSeasonResponse,
  PlexEpisodeResponse,
} from "@/lib/types";
import { getClients } from "./getClients";

class PlexClient {
  constructor() {}

  private async config(serverId?: number) {
    return await getClients(serverId);
  }

  /**
   * Make authenticated request to Plex API
   */
  private async request<T>(endpoint: string, serverId?: number): Promise<T> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}${endpoint}`;
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        // throw new Error(`Plex API error: ${response.status} ${response.statusText}`);
        return {
          error: `Plex API error: ${response.status} ${response.statusText}`,
        } as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("Plex API request failed:", error);
      return { error: `Plex API request failed: ${error}` } as T;
    }
  }

  /**
   * Get all libraries from Plex server
   */
  async getLibraries(serverId?: number): Promise<PlexLibraryResponse[]> {
    const response = await this.request<PlexResponse<PlexLibraryResponse>>(
      "/library/sections",
      serverId
    );
    return response.MediaContainer.Directory || [];
  }

  /**
   * Get all items from a specific library
   */
  async getLibraryItems(libraryKey: string, serverId?: number): Promise<PlexMovieResponse[]> {
    const config = await this.config(serverId);
    const response = await this.request<PlexResponse<PlexMovieResponse>>(
      `/library/sections/${libraryKey}/all`,
      serverId
    );
    const items = response.MediaContainer.Metadata || [];
    // Add full URL to thumbnails
    return items.map((movie) => ({
      ...movie,
      thumbUrl: movie.thumb
        ? `${config?.plexServerUrl}${movie.thumb}?X-Plex-Token=${config?.plexToken}`
        : undefined,
      artUrl: movie.art
        ? `${config?.plexServerUrl}${movie.art}?X-Plex-Token=${config?.plexToken}`
        : undefined,
    }));
  }

  /**
   * Get detailed metadata for a specific movie
   */
  async getMovieDetails(
    ratingKey: string,
    serverId?: number
  ): Promise<Partial<PlexMovieMetadata>> {
    const config = await this.config(serverId);
    const response = await this.request<PlexResponse<PlexMovieResponse>>(
      `/library/metadata/${ratingKey}`,
      serverId
    );
    const movie = response.MediaContainer.Metadata?.[0];

    if (!movie) {
      throw new Error("Movie not found");
    }

    return {
      ...movie,
      thumbUrl: movie.thumb
        ? `${config?.plexServerUrl}${movie.thumb}?X-Plex-Token=${config?.plexToken}`
        : "",
      artUrl: movie.art
        ? `${config?.plexServerUrl}${movie.art}?X-Plex-Token=${config?.plexToken}`
        : "",
    };
  }

  async getShowSeasons(ratingKey: string, serverId?: number): Promise<PlexSeasonResponse[]> {
    const config = await this.config(serverId);
    const response = await this.request<PlexResponse<PlexSeasonResponse>>(
      `/library/metadata/${ratingKey}/children`,
      serverId
    );
    const items = response?.MediaContainer?.Metadata || [];

    return items.map((season) => ({
      ...season,
      thumbUrl: season.thumb
        ? `${config?.plexServerUrl}${season.thumb}?X-Plex-Token=${config?.plexToken}`
        : undefined,
      artUrl: season.art
        ? `${config?.plexServerUrl}${season.art}?X-Plex-Token=${config?.plexToken}`
        : undefined,
    }));
  }

  async getSeasonEpisodes(ratingKey: string, serverId?: number): Promise<PlexEpisodeResponse[]> {
    const config = await this.config(serverId);
    const response = await this.request<PlexResponse<PlexEpisodeResponse>>(
      `/library/metadata/${ratingKey}/children`,
      serverId
    );
    const items = response?.MediaContainer?.Metadata || [];
    return items.map((episode) => ({
      ...episode,
      thumbUrl: episode.thumb
        ? `${config?.plexServerUrl}${episode.thumb}?X-Plex-Token=${config?.plexToken}`
        : undefined,
      artUrl: episode.art
        ? `${config?.plexServerUrl}${episode.art}?X-Plex-Token=${config?.plexToken}`
        : undefined,
    }));
  }

  /**
   * Update movie poster with a new image URL
   */
  async updateMoviePoster(ratingKey: string, posterUrl: string, serverId?: number): Promise<void> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}/library/metadata/${ratingKey}/posters`;
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
      url: posterUrl,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update poster: ${response.status} ${response.statusText}`
        );
      }

      // Lock the poster field to prevent Plex from overwriting it
      await this.lockPosterField(ratingKey, serverId);
    } catch (error) {
      console.error("Failed to update movie poster:", error);
      throw error;
    }
  }

  /**
   * Update movie poster with a new image URL
   */
  async updateMovieBackdrop(
    ratingKey: string,
    backdropUrl: string,
    serverId?: number
  ): Promise<void> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}/library/metadata/${ratingKey}/arts`;
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
      url: backdropUrl,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update backdrop: ${response.status} ${response.statusText}`
        );
      }

      // Lock the poster field to prevent Plex from overwriting it
      await this.lockBackdropField(ratingKey, serverId);
    } catch (error) {
      console.error("Failed to update movie backdrop:", error);
      throw error;
    }
  }

  /**
   * Lock the poster field to prevent Plex from changing it
   */
  private async lockPosterField(ratingKey: string, serverId?: number): Promise<void> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}/library/metadata/${ratingKey}`;
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
      "thumb.locked": "1",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "PUT",
      });

      if (!response.ok) {
        console.warn("Failed to lock poster field");
      }
    } catch (error) {
      console.warn("Failed to lock poster field:", error);
    }
  }

  /**
   * Lock the poster field to prevent Plex from changing it
   */
  private async lockBackdropField(ratingKey: string, serverId?: number): Promise<void> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}/library/metadata/${ratingKey}`;
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
      "art.locked": "1",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "PUT",
      });

      if (!response.ok) {
        console.warn("Failed to lock backdrop field");
      }
    } catch (error) {
      console.warn("Failed to lock backdrop field:", error);
    }
  }

  /**
   * Get metadata including labels
   */
  private async getMetadataWithLabels(ratingKey: string, serverId?: number): Promise<{
    librarySectionID: string;
    type: string;
    title: string;
    labels: string[];
  }> {
    const response = await this.request<
      PlexResponse<
        PlexMovieResponse & {
          librarySectionID: string;
          Label?: Array<{ tag: string }>;
        }
      >
    >(`/library/metadata/${ratingKey}`, serverId);

    const metadata = response.MediaContainer.Metadata?.[0];
    if (!metadata) {
      throw new Error("Metadata not found");
    }

    const labels = metadata.Label?.map((label) => label.tag) || [];

    return {
      librarySectionID: metadata.librarySectionID,
      type: metadata.type,
      title: metadata.title,
      labels,
    };
  }

  /**
   * Convert media type to type ID
   */
  private getTypeId(mediaType: string): string {
    const typeMap: Record<string, string> = {
      movie: "1",
      show: "2",
      season: "3",
      episode: "4",
      collection: "18",
    };
    return typeMap[mediaType] || "1"; // Default to movie
  }

  /**
   * Unlock the label field
   */
  private async unlockLabelField(ratingKey: string, serverId?: number): Promise<void> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}/library/metadata/${ratingKey}`;
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
      "label.locked": "0",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to unlock label field: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Failed to unlock label field:", error);
      throw error;
    }
  }

  /**
   * Remove Overlay label while preserving other labels
   */
  private async removeOverlayLabel(
    ratingKey: string,
    librarySectionID: string,
    typeId: string,
    otherLabels: string[],
    serverId?: number
  ): Promise<boolean> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}/library/sections/${librarySectionID}/all`;

    // Build the query parameters
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
      type: typeId,
      id: ratingKey,
      includeExternalMedia: "1",
      "thumb.locked": "1",
      "collection.locked": "1",
      "label.locked": "1",
      "label[].tag.tag-": "Overlay", // Remove Overlay
    });

    // Add other labels to preserve them
    otherLabels.forEach((label, index) => {
      params.append(`label[${index}].tag.tag`, label);
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to remove Overlay label: ${response.status} ${response.statusText}`
        );
      }

      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error("Failed to remove Overlay label:", error);
      throw error;
    }
  }

  /**
   * Refresh metadata for a specific item
   */
  private async refreshMetadata(ratingKey: string, serverId?: number): Promise<void> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}/library/metadata/${ratingKey}/refresh`;
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "PUT",
      });

      if (!response.ok) {
        console.warn("Failed to refresh metadata");
      }
    } catch (error) {
      console.warn("Failed to refresh metadata:", error);
    }
  }

  /**
   * Refresh library section
   */
  private async refreshLibrarySection(librarySectionID: string, serverId?: number): Promise<void> {
    const config = await this.config(serverId);
    const url = `${config?.plexServerUrl}/library/sections/${librarySectionID}/refresh`;
    const params = new URLSearchParams({
      "X-Plex-Token": config?.plexToken || "",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        console.warn("Failed to refresh library section");
      }
    } catch (error) {
      console.warn("Failed to refresh library section:", error);
    }
  }

  /**
   * Verify if Overlay label has been removed
   */
  private async verifyOverlayRemoval(ratingKey: string, serverId?: number): Promise<boolean> {
    const metadata = await this.getMetadataWithLabels(ratingKey, serverId);
    return !metadata.labels.includes("Overlay");
  }

  /**
   * Poll for overlay removal with exponential backoff
   */
  private async pollForOverlayRemoval(
    ratingKey: string,
    maxAttempts: number = 5,
    initialDelay: number = 100,
    serverId?: number
  ): Promise<boolean> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff: 100, 200, 400, 800, 1600ms
      await this.wait(delay);

      const verified = await this.verifyOverlayRemoval(ratingKey, serverId);
      if (verified) {
        return true;
      }
    }
    return false;
  }

  /**
   * Wait for a specified number of milliseconds
   */
  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Remove Overlay label from a media item
   * This logic is more or less translated from
   * https://github.com/jeremehancock/Posteria/blob/main/src/include/remove-overlay-label.sh
   */
  async removeOverlay(ratingKey: string, serverId?: number): Promise<{
    success: boolean;
    message: string;
    title?: string;
  }> {
    try {
      const metadata = await this.getMetadataWithLabels(ratingKey, serverId);

      if (!metadata.labels.includes("Overlay")) {
        return {
          success: true,
          message: "No Overlay label found on this item",
          title: metadata.title,
        };
      }

      const otherLabels = metadata.labels.filter(
        (label) => label !== "Overlay"
      );
      const typeId = this.getTypeId(metadata.type);

      await this.unlockLabelField(ratingKey, serverId);

      const removed = await this.removeOverlayLabel(
        ratingKey,
        metadata.librarySectionID,
        typeId,
        otherLabels,
        serverId
      );

      if (!removed) {
        return {
          success: false,
          message: "Failed to remove Overlay label",
          title: metadata.title,
        };
      }

      await this.refreshMetadata(ratingKey, serverId);
      this.refreshLibrarySection(metadata.librarySectionID, serverId); // Don't await

      const verified = await this.pollForOverlayRemoval(ratingKey, 5, 100, serverId);

      if (verified) {
        return {
          success: true,
          message: "SUCCESS: Overlay label has been successfully removed!",
          title: metadata.title,
        };
      } else {
        return {
          success: false,
          message:
            "WARNING: Overlay label still appears to be present despite successful API calls",
          title: metadata.title,
        };
      }
    } catch (error) {
      console.error("Error removing Overlay:", error);
      return {
        success: false,
        message: `ERROR: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Test connection to Plex server
   */
  async testConnection(serverId?: number): Promise<boolean> {
    try {
      const response = await this.request<{
        MediaContainer: { machineIdentifier: string };
      }>("/", serverId);
      return !!response.MediaContainer.machineIdentifier;
    } catch {
      return false;
    }
  }
}

export const plex = new PlexClient();

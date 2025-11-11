import { FanartMovieResponse, FanartShowResponse } from "@/lib/types";

export class FanartClient {
  private baseUrl: string;
  private token: string;

  constructor(token?: string) {
    this.baseUrl = "http://webservice.fanart.tv/v3/";
    this.token = token || "";
  }

  /**
   * Make authenticated request to Plex API
   */
  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const params = new URLSearchParams({
      api_key: this.token,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Fanart API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Fanart API request failed:", error);
      throw error;
    }
  }

  /**
   * Get all movie posters from Fanart API
   */
  async getMovieArt(id: string): Promise<FanartMovieResponse> {
    const response = await this.request<FanartMovieResponse>(`/movies/${id}`);
    return response;
  }

  async getShowArt(id: string): Promise<FanartShowResponse> {
    const response = await this.request<FanartShowResponse>(`/tv/${id}`);
    return response;
  }
}

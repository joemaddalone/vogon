import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  Insertable,
  JellyfinEpisode,
  JellyfinEpisodeResponse,
  JellyfinMovie,
  JellyfinMovieResponse,
  JellyfinSeason,
  JellyfinSeasonResponse,
  JellyfinShow,
  JellyfinShowResponse,
} from "@/lib/types";
import { jellyfin } from "@/lib/client/jellyfin";
import { dataManager as DM } from "@/lib/client/database";

type MediaType = "movie" | "show" | "season";

type MediaConfig = {
  label: string;
  cachePath: string;
  getAll: () => Promise<unknown[]>;
  reset: () => Promise<void>;
  updateThumb: (ratingKey: string, thumbUrl: string) => Promise<void>;
  updateArt: (ratingKey: string, artUrl: string) => Promise<void>;
  createMany: (
    items: Array<Insertable<JellyfinMovie> | Insertable<JellyfinShow> | Insertable<JellyfinSeason>>
  ) => Promise<void>;
};

const MEDIA_CONFIG: Record<MediaType, MediaConfig> = {
  movie: {
    label: "movies",
    cachePath: "/movie",
    getAll: DM.jellyfin.movie.list,
    reset: DM.plex.movie.reset,
    updateThumb: DM.jellyfin.movie.updateThumb,
    updateArt: DM.jellyfin.movie.updateArt,
    // @ts-expect-error - createManyJellyfinMovies expects an array of Insertable<JellyfinMovie>
    createMany: DM.jellyfin.movie.createMany,
  },
  show: {
    label: "shows",
      cachePath: "/show",
      getAll: DM.jellyfin.show.list,
    reset: DM.jellyfin.show.reset,
    updateThumb: DM.jellyfin.show.updateThumb,
    updateArt: DM.jellyfin.show.updateArt,
    // @ts-expect-error - createManyJellyfinShows expects an array of Insertable<JellyfinShow>
    createMany: DM.jellyfin.show.createMany,
  },
  season: {
    label: "seasons",
    cachePath: "/season",
    getAll: DM.jellyfin.season.list,
    reset: DM.jellyfin.season.reset,
    updateThumb: DM.jellyfin.season.updateThumb,
    updateArt: DM.jellyfin.season.updateArt,
    // @ts-expect-error - createManyJellyfinSeasons expects an array of Insertable<JellyfinSeason>
    createMany: DM.jellyfin.season.createMany,
  },
};

export async function handleMediaList(mediaType: MediaType) {
  try {
    const config = MEDIA_CONFIG[mediaType];
    const items = await config.getAll();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error(`Error fetching imported ${mediaType}s:`, error);
    return NextResponse.json(
      {
        error: `Failed to fetch ${MEDIA_CONFIG[mediaType].label} from database`,
      },
      { status: 500 }
    );
  }
}

export async function handleMediaReset(mediaType: MediaType) {
  try {
    const config = MEDIA_CONFIG[mediaType];
    await config.reset();
    if (mediaType === "show") {
      await DM.jellyfin.season.reset();
    }
    return NextResponse.json({
      data: `${config.label} reset successfully`,
    });
  } catch (error) {
    console.error(`Error resetting ${mediaType} database:`, error);
    return NextResponse.json(
      { error: `Failed to reset ${MEDIA_CONFIG[mediaType].label} database` },
      { status: 500 }
    );
  }
}

export async function handleMediaUpdate(
  mediaType: MediaType,
  request: Request
) {
  try {
    const { ratingKey, thumbUrl, artUrl } = await request.json();

    if (!ratingKey || (!thumbUrl && !artUrl)) {
      return NextResponse.json(
        { error: "ratingKey and either thumbUrl or artUrl are required" },
        { status: 400 }
      );
    }

    const config = MEDIA_CONFIG[mediaType];
    if (thumbUrl) {
      await config.updateThumb(ratingKey, thumbUrl);
    }
    if (artUrl) {
      await config.updateArt(ratingKey, artUrl);
    }

    revalidatePath(thumbUrl ?? artUrl ?? "");
    revalidatePath(config.cachePath, "page");
    revalidatePath(`/api/data/jellyfin/${mediaType}`);

    return NextResponse.json({
      data: `${mediaType} ${
        thumbUrl ? "thumbnail" : "art"
      } updated successfully`,
    });
  } catch (error) {
    console.error(`Error updating ${mediaType}:`, error);
    return NextResponse.json(
      { error: `Failed to update ${mediaType} media.` },
      { status: 500 }
    );
  }
}

export async function handleMediaImport(
  mediaType: MediaType,
  request: Request
) {
  try {
    const body = await request.json();
    const { items, libraryKey }: { items: JellyfinMovieResponse[] | JellyfinShowResponse[], libraryKey: string } = body;

    if (!items || !Array.isArray(items) || !libraryKey) {
      return NextResponse.json(
        {
          error: "Invalid request: items array and libraryKey required",
        },
        { status: 400 }
      );
    }

    console.log(items);
    console.log(libraryKey);
    console.log(mediaType);

    const normalizedItems = items.map(
      (item:  JellyfinMovieResponse | JellyfinShowResponse) => ({
        ratingKey: String(item.Id ?? ""),
        libraryKey: String(libraryKey),
        title: String(item.Name ?? ""),
        year: item.ProductionYear as number | null,
        summary: item.Overview ?? null,
        thumbUrl: item.thumbUrl ?? null,
        artUrl: item.artUrl ?? null,
        duration: item.RunTimeTicks ?? null,
        rating: item.OfficialRating ?? null,
        contentRating: item.CommunityRating ?? null,
      } as Insertable<JellyfinMovie>)
    ) as Insertable<JellyfinMovie>[];

    const config = MEDIA_CONFIG[mediaType];
    await config.createMany(normalizedItems);

    if (mediaType === "show") {
      // purposely not awaiting this for now.
      handleMediaImportSeasons(normalizedItems as Insertable<JellyfinShow>[]);
    }

    return NextResponse.json({
      data: `Successfully imported ${items.length} ${config.label}`,
      count: items.length,
    });
  } catch (error) {
    console.error(`Error importing Plex ${mediaType}s:`, error);
    return NextResponse.json(
      { error: `Failed to import ${mediaType}s into database` },
      { status: 500 }
    );
  }
}

export async function handleMediaImportSeasons(items: Insertable<JellyfinShow>[]) {
  const seasons: Insertable<JellyfinSeason>[] = [];
  const episodes: Insertable<JellyfinEpisode>[] = [];
  // temp fix to dupes in database
  await DM.jellyfin.season.reset();
  await DM.jellyfin.episode.reset();

  for (const item of items) {
    const showSeasons = await jellyfin.getShowSeasons(item.ratingKey);
    showSeasons.forEach((season: JellyfinSeasonResponse) => {
      seasons.push({
        ratingKey: season.Id,
        parentRatingKey: item.ratingKey,
        title: season.Name,
        year: season.ProductionYear,
        type: season.Type,
        parentKey: season.SeriesId,
        parentTitle: season.SeriesName,
        summary: season.Overview,
        index: season.IndexNumber,
        thumbUrl: season.thumbUrl,
        artUrl: season.artUrl,
      });
    });
  }

  if (seasons.length > 0) {
    DM.jellyfin.season.createMany(seasons);
  }

  if (process.env.ENABLE_EPISODES === "true") {
    for (const season of seasons) {
      const seasonEpisodes: JellyfinEpisodeResponse[] =
        await jellyfin.getSeasonEpisodes(season.ratingKey);
      seasonEpisodes.forEach((episode) => {
        episodes.push({
          ratingKey: episode.Id,
          parentRatingKey: season.ratingKey,
          title: episode.Name,
          index: episode.IndexNumber,
          parentIndex: episode.ParentIndexNumber,
          year: episode.ProductionYear,
          summary: episode.Overview,
          thumbUrl: episode.thumbUrl,
          duration: episode.RunTimeTicks,
        });
      });
    }

    if (episodes.length > 0) {
      DM.jellyfin.episode.createMany(episodes);
    }
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  Insertable,
  Media,
  PlexEpisodeResponse,
  PlexSeasonResponse,
  MediaTypeEnum,
} from "@/lib/types";
import { plex } from "@/lib/client/plex";
import { dataManager as DM } from "@/lib/client/database";

type MediaTypeString = "movie" | "show" | "season";

type MediaConfig = {
  label: string;
  cachePath: string;
  getAll: (serverId: number) => Promise<unknown[]>;
  reset: (serverId: number) => Promise<void>;
  updateThumb: (ratingKey: string, thumbUrl: string, serverId: number) => Promise<void>;
  updateArt: (ratingKey: string, artUrl: string, serverId: number) => Promise<void>;
  createMany: (
    items: Array<Insertable<Media>>
  ) => Promise<void>;
};

const MEDIA_CONFIG: Record<MediaTypeString, MediaConfig> = {
  movie: {
    label: "movies",
    cachePath: "/movie",
    getAll: DM.plex.movie.list,
    reset: DM.plex.movie.reset,
    updateThumb: DM.plex.movie.updateThumb,
    updateArt: DM.plex.movie.updateArt,
    createMany: DM.plex.movie.createMany,
  },
  show: {
    label: "shows",
      cachePath: "/show",
      getAll: DM.plex.show.list,
    reset: DM.plex.show.reset,
    updateThumb: DM.plex.show.updateThumb,
    updateArt: DM.plex.show.updateArt,
    createMany: DM.plex.show.createMany,
  },
  season: {
    label: "seasons",
    cachePath: "/season",
    getAll: DM.plex.season.list,
    reset: DM.plex.season.reset,
    updateThumb: DM.plex.season.updateThumb,
    updateArt: DM.plex.season.updateArt,
    createMany: DM.plex.season.createMany,
  },
};

export async function handleMediaList(mediaType: MediaTypeString, serverId: number) {
  try {
    const config = MEDIA_CONFIG[mediaType];
    const items = await config.getAll(serverId);
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

export async function handleMediaReset(mediaType: MediaTypeString, serverId: number) {
  try {
    const config = MEDIA_CONFIG[mediaType];
    await config.reset(serverId);
    if (mediaType === "show") {
      await DM.plex.season.reset(serverId);
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
  mediaType: MediaTypeString,
  request: Request,
  serverId: number
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
      await config.updateThumb(ratingKey, thumbUrl, serverId);
    }
    if (artUrl) {
      await config.updateArt(ratingKey, artUrl, serverId);
    }

    revalidatePath(thumbUrl ?? artUrl ?? "");
    revalidatePath(config.cachePath, "page");
    revalidatePath(`/api/data/${mediaType}`);

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
  mediaType: MediaTypeString,
  body: { items: Insertable<Media>[]; libraryKey: string },
  serverId: number
) {
  try {
    const { items, libraryKey } = body;

    if (!items || !Array.isArray(items) || !libraryKey) {
      return NextResponse.json(
        {
          error: "Invalid request: items array and libraryKey required",
        },
        { status: 400 }
      );
    }

    const normalizedItems = items.map(
      (item) => ({
        ratingKey: String(item.ratingKey ?? ""),
        libraryKey: String(libraryKey),
        title: String(item.title ?? ""),
        year: item.year as number | null,
        summary: item.summary ?? null,
        thumbUrl: item.thumbUrl ?? null,
        artUrl: item.artUrl ?? null,
        duration: item.duration ?? null,
        rating: item.rating ?? null,
        contentRating: item.contentRating ?? null,
        guid: item.guid ?? null,
        type: mediaType === "movie" ? MediaTypeEnum.MOVIE : mediaType === "show" ? MediaTypeEnum.SHOW : MediaTypeEnum.SEASON,
        serverId: serverId,
      })
    );

    const config = MEDIA_CONFIG[mediaType];
    await config.createMany(normalizedItems);

    if (mediaType === "show") {
      // purposely not awaiting this for now.
      handleMediaImportSeasons(normalizedItems as Insertable<Media>[], serverId);
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

export async function handleMediaImportSeasons(items: Insertable<Media>[], serverId: number) {
  const seasons: Insertable<Media>[] = [];
  const episodes: Insertable<Media>[] = [];
  // temp fix to dupes in database
  await DM.plex.season.reset(serverId);
  await DM.plex.episode.reset(serverId);

  for (const item of items) {
    const showSeasons = await plex.getShowSeasons(item.ratingKey, serverId);
    showSeasons.forEach((season: PlexSeasonResponse) => {
      seasons.push({
        ratingKey: season.ratingKey,
        parentRatingKey: item.ratingKey,
        title: season.title,
        year: season.year,
        type: MediaTypeEnum.SEASON,
        parentKey: season.parentKey,
        parentTitle: season.parentTitle,
        summary: season.summary,
        index: season.index,
        thumbUrl: season.thumbUrl,
        artUrl: season.artUrl,
        parentThumb: season.parentThumb,
        parentTheme: season.parentTheme,
        serverId: serverId,
      });
    });
  }

  if (seasons.length > 0) {
    DM.plex.season.createMany(seasons);
  }

  if (process.env.ENABLE_EPISODES === "true") {
    for (const season of seasons) {
      const seasonEpisodes: PlexEpisodeResponse[] =
        await plex.getSeasonEpisodes(season.ratingKey, serverId);
      seasonEpisodes.forEach((episode) => {
        episodes.push({
          ratingKey: episode.ratingKey,
          parentRatingKey: episode.parentRatingKey,
          title: episode.title,
          index: episode.index,
          parentIndex: episode.parentIndex,
          year: episode.year,
          summary: episode.summary,
          thumbUrl: episode.thumbUrl,
          artUrl: episode.artUrl,
          duration: episode.duration,
          guid: episode.guid,
          serverId: serverId,
        });
      });
    }

    if (episodes.length > 0) {
      DM.plex.episode.createMany(episodes);
    }
  }
}

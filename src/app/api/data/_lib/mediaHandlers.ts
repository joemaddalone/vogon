import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  Insertable,
  Media,
  MediaTypeEnum,
  NormalizedSeason,
  NormalizedEpisode,
} from "@/lib/types";
import { MediaServerClient } from "@/lib/client/mediaserver";
import { getClients } from "@/lib/client/getClients";
import { dataManager as DM } from "@/lib/client/database";
import { getSession } from "@/lib/client/database/session";

type MediaTypeString = "movie" | "show" | "season";

type MediaConfig = {
  label: string;
  cachePath: string;
  getAll: () => Promise<unknown[]>;
  reset: () => Promise<void>;
  updateThumb: (ratingKey: string, thumbUrl: string) => Promise<void>;
  updateArt: (ratingKey: string, artUrl: string) => Promise<void>;
  createMany: (items: Array<Insertable<Media>>) => Promise<void>;
};

const session = await getSession();

const serverId = session?.serverId;

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

export async function handleMediaList(mediaType: MediaTypeString) {
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

export async function handleMediaReset(mediaType: MediaTypeString) {
  try {
    const config = MEDIA_CONFIG[mediaType];
    await config.reset();
    if (mediaType === "show") {
      await DM.plex.season.reset();
      await DM.plex.episode.reset();
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

    revalidatePath(`/${mediaType}/${ratingKey}`, "page");
    revalidatePath(thumbUrl ?? artUrl ?? "");
    revalidatePath(`/api/data/${mediaType}`);
    revalidatePath(config.cachePath, "page");

    return NextResponse.json({
      data: `${mediaType} ${thumbUrl ? "thumbnail" : "art"
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
  request: Request
) {
  try {
    const body = await request.json();
    const { items, libraryKey } = body;

    if (!items || !Array.isArray(items) || !libraryKey) {
      return NextResponse.json(
        {
          error: "Invalid request: items array and libraryKey required",
        },
        { status: 400 }
      );
    }

    const normalizedItems = items.map((item: Insertable<Media>) => ({
      ratingKey: String(item.ratingKey ?? ""),
      libraryKey: String(libraryKey),
      title: String(item.title ?? ""),
      year: item.year as number | null,
      summary: item.summary ?? null,
      thumbUrl: item.thumbUrl ?? null,
      artUrl: item.artUrl ?? null,
      duration: item.duration ?? null,
      rating: item.rating ?? null,
      releaseDate: item.releaseDate ?? null,
      contentRating: item.contentRating ?? null,
      guid: item.guid ?? null,
      type:
        mediaType === "movie"
          ? MediaTypeEnum.MOVIE
          : mediaType === "show"
            ? MediaTypeEnum.SHOW
            : MediaTypeEnum.SEASON,
      serverId,
    }));

    const config = MEDIA_CONFIG[mediaType];
    await config.reset();
    try {
      await config.createMany(normalizedItems);
    } catch (error) {
      console.error(`Error creating many ${mediaType}s:`, error);
      return NextResponse.json(
        { error: `Failed to create many ${mediaType}s into database` },
        { status: 500 }
      );
    }

    if (mediaType === "show") {
      // purposely not awaiting this for now.
      await handleMediaImportSeasons(normalizedItems as Insertable<Media>[]);
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

export async function handleMediaImportSeasons(items: Insertable<Media>[]) {
  const seasons: Insertable<Media>[] = [];
  const episodes: Insertable<Media>[] = [];
  // temp fix to dupes in database
  await DM.plex.season.reset();
  await DM.plex.episode.reset();

  const config = await getClients();
  if (!config) {
    return;
  }
  const mediaServer = new MediaServerClient(config.type!);

  for (const item of items) {
    const showSeasons = await mediaServer.getShowSeasons(item.ratingKey);
    showSeasons.forEach((season: NormalizedSeason) => {
      seasons.push({
        ratingKey: season.ratingKey,
        parentRatingKey: item.ratingKey,
        title: season.title,
        year: season.year,
        type: MediaTypeEnum.SEASON,
        parentKey: season.seriesId,
        parentTitle: item.title,
        summary: season.summary,
        index: season.index,
        thumbUrl: season.thumbUrl,
        artUrl: season.artUrl,
        parentThumb: season.parentThumb,
        serverId,
      });
    });
  }

  if (seasons.length > 0) {
    DM.plex.season.createMany(seasons);
  }

  if (config.enableEpisodes) {
    for (const season of seasons) {
      const seasonEpisodes: NormalizedEpisode[] =
        await mediaServer.getSeasonEpisodes(season.ratingKey);
      seasonEpisodes.forEach((episode) => {
        episodes.push({
          ratingKey: episode.ratingKey,
          parentRatingKey: episode.seasonId,
          title: episode.title,
          type: MediaTypeEnum.EPISODE,
          index: episode.index,
          parentIndex: episode.parentIndex,
          summary: episode.summary,
          thumbUrl: episode.thumbUrl,
          duration: episode.duration,
          serverId,
        });
      });
    }

    if (episodes.length > 0) {
      DM.plex.episode.createMany(episodes);
    }
  }
}

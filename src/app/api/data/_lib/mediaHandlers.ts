import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  Insertable,
  PlexMovie,
  PlexSeason,
  PlexSeasonResponse,
  PlexShow,
} from "@/lib/types";
import { plex } from "@/lib/client/plex";
import {
  createManyPlexMovies,
  createManyPlexShows,
  createManyPlexSeasons,
  getPlexMovies,
  getPlexShows,
  resetPlexMovies,
  resetPlexShows,
  updateArtUrl,
  updateShowArtUrl,
  updateShowThumbUrl,
  updateThumbUrl,
  resetPlexSeasons,
} from "@/lib/client/database";

type MediaType = "movie" | "show";

type MediaConfig = {
  label: string;
  cachePath: string;
  getAll: () => Promise<unknown[]>;
  reset: () => Promise<void>;
  updateThumb: (ratingKey: string, thumbUrl: string) => Promise<void>;
  updateArt: (ratingKey: string, artUrl: string) => Promise<void>;
  createMany: (
    items: Array<Insertable<PlexMovie> | Insertable<PlexShow>>
  ) => Promise<void>;
};

const MEDIA_CONFIG: Record<MediaType, MediaConfig> = {
  movie: {
    label: "movies",
    cachePath: "/movie",
    getAll: getPlexMovies,
    reset: resetPlexMovies,
    updateThumb: updateThumbUrl,
    updateArt: updateArtUrl,
    createMany: createManyPlexMovies,
  },
  show: {
    label: "shows",
    cachePath: "/show",
    getAll: getPlexShows,
    reset: resetPlexShows,
    updateThumb: updateShowThumbUrl,
    updateArt: updateShowArtUrl,
    createMany: createManyPlexShows,
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
      await resetPlexSeasons();
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
  mediaType: MediaType,
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

    const normalizedItems = items.map(
      (item: Insertable<PlexMovie> | Insertable<PlexShow>) => ({
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
        addedAt: Number(item.addedAt ?? 0),
        updatedAt: Number(item.updatedAt ?? 0),
        guid: item.guid ?? null,
      })
    );

    const config = MEDIA_CONFIG[mediaType];
    await config.createMany(normalizedItems);

    if (mediaType === "show") {
       // purposely not awaiting this for now.
       handleMediaImportSeasons(normalizedItems as Insertable<PlexShow>[]);
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

export async function handleMediaImportSeasons(items: Insertable<PlexShow>[]) {
  const seasons: Insertable<PlexSeason>[] = [];
  // temp fix to dupes in database
  await resetPlexSeasons();

  for (const item of items) {
    const showSeasons = await plex.getShowSeasons(item.ratingKey);
    showSeasons.forEach((season: PlexSeasonResponse) => {
      seasons.push({
        ratingKey: season.ratingKey,
        parentRatingKey: item.ratingKey,
        title: season.title,
        year: season.year,
        type: season.type,
        parentKey: season.parentKey,
        parentTitle: season.parentTitle,
        summary: season.summary,
        index: season.index,
        thumbUrl: season.thumb,
        artUrl: season.art,
        parentThumb: season.parentThumb,
        parentTheme: season.parentTheme,
      });
    });
  }
  if (seasons.length > 0) {
    await createManyPlexSeasons(seasons);
  }
}

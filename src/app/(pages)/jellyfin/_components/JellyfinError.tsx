import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const JellyfinError = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h2>
          Dang, we can&apos;t find your Jellyfin server.
        </h2>
        <p className="my-4">
          <Link
            className="text-white bg-primary hover:bg-primary font-medium rounded-lg text-sm px-5 py-2.5"
            href="/config"
          >
            Go to Configuration <ArrowRight className="w-4 h-4 inline-block" />
          </Link>
        </p>
      </div>
    </div>
  );
};

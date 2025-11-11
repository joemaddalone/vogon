export const PlexError = () => {
		return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">
            Failed to connect to Plex server.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Please check your connection settings.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Please check your connection settings.
          </p>
        </div>
      </div>
    );
};
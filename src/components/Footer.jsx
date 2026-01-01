import packageJson from "../../package.json";
import Link from "next/link";

export const Footer = () => {
	return (
		<footer className="w-full py-6 border-t border-border/40 shrink-0">
			<div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
				vogon v{packageJson.version}
				<span>&middot;</span>
				<Link target="_blank" href="https://github.com/joemaddalone/vogon">Source code</Link>
				<span>&middot;</span>
				<Link target="_blank" href="https://buymeacoffee.com/joemaddalone">Support this project</Link>
			</div>
		</footer>
	);
};
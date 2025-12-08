import { Suspense } from "react";
import { Spinner } from "./ui/spinner";

export const CommonSuspense = ({ children, spinnerContainerHeight }: { children: React.ReactNode, spinnerContainerHeight?: number }) => {
	const height = spinnerContainerHeight ? `${spinnerContainerHeight}vh` : "60vh";
  return (
		<Suspense
		fallback={
			<div className={`flex items-center justify-center min-h-[${height}]`}>
				<Spinner className="size-16 text-gray-500" />
			</div>
		}
	>
      {children}
    </Suspense>
  );
};
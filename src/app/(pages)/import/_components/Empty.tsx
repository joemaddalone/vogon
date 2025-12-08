import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export const Empty = () => {
  const t = useTranslations();

  return (
	<motion.div
	initial={{ opacity: 0, y: 20 }}
	animate={{ opacity: 1, y: 0 }}
	transition={{ duration: 0.5 }}
	className="text-center py-20"
>
	<p className="text-xl text-muted-foreground font-light">
		{t("import.noLibrariesFound")}
	</p>
</motion.div>
  );
};
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TooltipElement = ({ children, content }: { children: React.ReactNode, content: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent className="capitalize">{content}</TooltipContent>
    </Tooltip>
  );
};
import { Box, IconButton, Typography } from "@mui/material";
import copyIcon from "../assets/copy.svg";
import useNotification from "../lib/useNotification";

interface CopyHashProps {
  value: string;
  maxSize?: number;
  textColor?: string;
}

const shortenValue = (value: string, maxSize: number) => {
  if (value.length <= maxSize) {
    return value;
  }

  const visible = Math.max(Math.floor((maxSize - 3) / 2), 1);
  return `${value.slice(0, visible)}...${value.slice(value.length - visible)}`;
};

export function CopyHash({ value, maxSize = 16, textColor }: CopyHashProps) {
  const { showNotification } = useNotification();

  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      <Typography component="span" sx={{ fontSize: 13, color: textColor ?? "#728A96" }}>
        {shortenValue(value, maxSize)}
      </Typography>
      <IconButton
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          navigator.clipboard.writeText(value);
          showNotification("Copied to clipboard!", "success");
        }}>
        <img src={copyIcon} alt="Copy icon" width={14} height={14} />
      </IconButton>
    </Box>
  );
}

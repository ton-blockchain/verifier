import React from "react";
import { Box, Link, styled } from "@mui/material";

interface IconProps {
  iconUrl: string;
  hoveredIconUrl: string;
  disabled?: boolean;
}

const Icon = styled(Box)((props: IconProps) => ({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: theme.spacing(3),
  height: theme.spacing(3),
  background: `url(${props.iconUrl})`,
  "&:hover": {
    transitionDuration: ".25s",
    background: `url(${props.disabled ? props.iconUrl : props.hoveredIconUrl})`,
    cursor: props.disabled ? "cursor" : "pointer",
  },
}));

interface HoverableIconProps extends IconProps {
  link: string;
}

export const HoverableIcon: React.FC<HoverableIconProps> = ({ iconUrl, hoveredIconUrl, link }) => {
  return !link.length ? (
    <Icon iconUrl={iconUrl} hoveredIconUrl={hoveredIconUrl} disabled />
  ) : (
    <Link target="_blank" href={link}>
      <Icon iconUrl={iconUrl} hoveredIconUrl={hoveredIconUrl} />
    </Link>
  );
};

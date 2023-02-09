import React, { useCallback } from "react";
import { IconButton, Link, useMediaQuery, Tooltip, Box } from "@mui/material";
import { DataBox, IconBox, TitleBox, TitleText } from "./Common.styled";
import copy from "../assets/copy.svg";
import useNotification from "../lib/useNotification";
import {
  DataFlexibleBox,
  DataRow,
  DataRowsBox,
  DataRowTitle,
  DataRowValue,
  IconsWrapper,
} from "./DataBlock.styled";

export interface DataRowItem {
  title: string;
  value?: string;
  showIcon?: boolean;
  color?: string;
  customLink?: string;
  tooltip?: boolean;
  onClick?: () => void;
  subtitle?: string;
}

interface DataBlockProps {
  isFlexibleWrapper?: boolean;
  title: React.ReactNode;
  icon: string;
  dataRows: DataRowItem[];
  isLoading?: boolean;
}

const renderRowValue = (
  value?: string,
  customLink?: string,
  withTooltip?: boolean,
  subtitle?: string,
) => {
  const WrappingLink = ({ children }: { children: any }) =>
    customLink && !!value ? (
      <Link
        target="_blank"
        href={customLink}
        sx={{
          textDecoration: "none",
          cursor: "pointer",
        }}>
        {children}
      </Link>
    ) : (
      <>{children}</>
    );

  const WrappingTooltip = ({ children }: { children: any }) =>
    withTooltip ? (
      <Tooltip placement="top-start" title={value}>
        <span>{children}</span>
      </Tooltip>
    ) : (
      <>{children}</>
    );

  return (
    <WrappingTooltip>
      <WrappingLink>{value ?? "-"}</WrappingLink>
      <Box sx={{ fontSize: 12, opacity: 0.8 }}>{subtitle ?? ""}</Box>
    </WrappingTooltip>
  );
};

export function DataBlock({ isFlexibleWrapper, icon, title, dataRows, isLoading }: DataBlockProps) {
  const Wrapper = isFlexibleWrapper ? DataFlexibleBox : DataBox;
  const { showNotification } = useNotification();
  const isExtraSmallScreen = useMediaQuery("(max-width: 500px)");

  const onCopy = useCallback(async (value: string) => {
    navigator.clipboard.writeText(value);
    showNotification("Copied to clipboard!", "success");
  }, []);

  return (
    <Wrapper pb={isFlexibleWrapper ? 0 : 2}>
      <TitleBox mb={1}>
        <IconBox>
          <img src={icon} alt="Block icon" width={41} height={41} />
        </IconBox>
        <TitleText>{title}</TitleText>
      </TitleBox>
      <DataRowsBox mt={2.5} isShrinked={!isFlexibleWrapper} isExtraSmallScreen={isExtraSmallScreen}>
        {dataRows.map(
          ({ title, value, showIcon, color, customLink, tooltip, onClick, subtitle }) => {
            return (
              <DataRow
                isExtraSmallScreen={isExtraSmallScreen}
                key={title}
                isShrinked={!isFlexibleWrapper}>
                <DataRowTitle>{title}</DataRowTitle>
                <DataRowValue sx={{ cursor: !!onClick ? "pointer" : "initial" }} onClick={onClick}>
                  {renderRowValue(value, customLink, tooltip, subtitle)}
                </DataRowValue>
                {showIcon && (
                  <IconsWrapper>
                    {value && (
                      <IconButton sx={{ padding: 0 }} onClick={() => onCopy(value)}>
                        <img src={copy} alt="Copy icon" width={15} height={15} />
                      </IconButton>
                    )}
                  </IconsWrapper>
                )}
              </DataRow>
            );
          },
        )}
      </DataRowsBox>
    </Wrapper>
  );
}

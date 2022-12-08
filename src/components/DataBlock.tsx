import React, { useCallback } from "react";
import { IconButton, Link, useMediaQuery } from "@mui/material";
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
}

interface DataBlockProps {
  isFlexibleWrapper?: boolean;
  title: React.ReactNode;
  icon: string;
  dataRows: DataRowItem[];
  isLoading?: boolean;
}

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
        {dataRows.map(({ title, value, showIcon, color, customLink }) => {
          return (
            <DataRow
              isExtraSmallScreen={isExtraSmallScreen}
              key={title}
              isShrinked={!isFlexibleWrapper}>
              <DataRowTitle>{title}</DataRowTitle>
              <DataRowValue sx={{ color: color }}>
                {customLink && !!value ? (
                  <Link
                    target="_blank"
                    href={customLink}
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                    }}>
                    {value}
                  </Link>
                ) : (
                  value ?? "-"
                )}
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
        })}
      </DataRowsBox>
    </Wrapper>
  );
}

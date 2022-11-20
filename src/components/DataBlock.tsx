import React, { useCallback } from "react";
import { IconButton } from "@mui/material";
import { DataBox, IconBox, TitleText, TitleBox } from "./common.styled";
import copy from "../assets/copy.svg";
import useNotification from "../lib/useNotification";
import {
  DataFlexibleBox,
  DataRow,
  DataRowsBox,
  DataRowSeparator,
  DataRowTitle,
  DataRowValue,
  IconsWrapper,
} from "./dataBlock.styled";

export interface DataRowItem {
  title: string;
  value: string;
}

interface DataBlockProps {
  isFlexibleWrapper?: boolean;
  title: React.ReactNode;
  icon: string;
  dataRows: DataRowItem[];
  isLoading?: boolean;
  showIcons?: boolean;
}

export function DataBlock({
  isFlexibleWrapper,
  icon,
  title,
  dataRows,
  isLoading,
  showIcons,
}: DataBlockProps) {
  const Wrapper = isFlexibleWrapper ? DataFlexibleBox : DataBox;
  const { showNotification } = useNotification();

  const onCopy = useCallback(async (value: string) => {
    navigator.clipboard.writeText(value);
    showNotification("Copied to clipboard!", "success");
  }, []);
  return (
    <Wrapper>
      <TitleBox mb={1}>
        <IconBox>
          <img src={icon} alt="Block icon" width={41} height={41} />
        </IconBox>
        <TitleText>{title}</TitleText>
      </TitleBox>
      <DataRowsBox isShrinked={!isFlexibleWrapper}>
        {!isFlexibleWrapper && <DataRowSeparator />}
        {dataRows.map(({ title, value }) => {
          return (
            <DataRow key={title} isShrinked={!isFlexibleWrapper}>
              <DataRowTitle>{title}</DataRowTitle>
              <DataRowValue>{!!value ? value : "-"}</DataRowValue>
              {showIcons && (
                <IconsWrapper>
                  {value && (
                    <IconButton onClick={() => onCopy(value)}>
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

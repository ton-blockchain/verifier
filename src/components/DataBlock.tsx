import React from "react";
import { styled } from "@mui/system";
import { Box, IconButton, Typography } from "@mui/material";
import { CenteringBox, DataBox, IconBox, TitleText, TitleBox } from "./common.styled";
import copy from "../assets/copy.svg";
import qr from "../assets/qr.svg";

const DataFlexibleBox = styled(DataBox)({
  maxWidth: "50%",
  flex: 1,
});

const DataRowsBox = styled(Box)({
  "&>*:not(:last-child)": {
    borderBottom: "1px solid rgba(114, 138, 150, 0.2)",
  },
  "&:last-child": {
    marginBottom: 20,
  },
});

const DataRow = styled(CenteringBox)({
  height: 38,
  padding: "15px 20px",
  transition: "background .15s",
  "&:hover": {
    background: "rgba(114, 138, 150, 0.1)",
  },
});

const DataRowTitle = styled(Typography)({
  fontWeight: 16,
  color: "#000",
  minWidth: 120,
});

const DataRowValue = styled(Typography)({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 16,
  color: "#728A96",
});

const IconsWrapper = styled(CenteringBox)({
  minWidth: 100,
  justifyContent: "flex-end",
});

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

  return (
    <Wrapper>
      <TitleBox mb={1}>
        <IconBox>
          <img src={icon} alt="Block icon" width={41} height={41} />
        </IconBox>
        <TitleText>{title}</TitleText>
      </TitleBox>
      <DataRowsBox>
        {dataRows.map(({ title, value }) => {
          return (
            <DataRow>
              <DataRowTitle>{title}</DataRowTitle>
              <DataRowValue>{value}</DataRowValue>
              {showIcons && (
                <IconsWrapper>
                  <IconButton>
                    <img src={copy} alt="Copy icon" width={15} height={15} />
                  </IconButton>
                  <IconButton disabled>
                    <img src={qr} alt="Qr code icon" width={15} height={15} />
                  </IconButton>
                </IconsWrapper>
              )}
            </DataRow>
          );
        })}
      </DataRowsBox>
    </Wrapper>
  );
}

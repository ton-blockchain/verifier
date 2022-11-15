import React from "react";
import "./AddSources.css";
import { DataBox, IconBox, TitleText, TitleBox } from "./common.styled";
import sources from "../assets/sources.svg";
import { useFileStore } from "../lib/useFileStore";
import { useSubmitSources } from "../lib/useSubmitSources";
import { FileUploaderArea } from "./FileUploaderArea";
import Spacer from "./Spacer";
import { FileTable } from "./FileTable";
import CompilerSettings from "./CompilerSettings";
import Button from "./Button";
import { CompileOutput } from "./CompileOutput";
import { Box, styled } from "@mui/system";

const ContentBox = styled(Box)({
  padding: "15px 20px",
});

export function AddSourcesBlock() {
  const { hasFiles } = useFileStore();
  const { mutate, data, error, isLoading } = useSubmitSources();

  return (
    <DataBox>
      <Box>
        <TitleBox mb={1}>
          <IconBox>
            <img src={sources} alt="Block icon" width={41} height={41} />
          </IconBox>
          <TitleText>Add sources</TitleText>
        </TitleBox>
        <ContentBox>
          <>
            <FileUploaderArea />
            <Spacer space={20} />
            {hasFiles() && <FileTable />}
            {hasFiles() && <CompilerSettings />}
            <Spacer space={20} />
            <Button
              disabled={!hasFiles() || !!data?.result?.msgCell}
              onClick={() => {
                mutate(null);
              }}
              text={isLoading ? "Submitting..." : `Submit`}
            />
            <Spacer space={15} />
            {(data || error) && <CompileOutput />}
          </>
        </ContentBox>
      </Box>
    </DataBox>
  );
}

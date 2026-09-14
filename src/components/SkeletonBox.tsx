import { Skeleton } from "@mui/material";
import { CenteringBox } from "./Common.styled";
import React from "react";
import { OverflowingBox } from "./Layout";

type SkeletonBoxProps = {
  title?: boolean;
  content?: boolean;
  mb?: number;
};

export function SkeletonBox({ title = true, content = true, mb = 3 }: SkeletonBoxProps) {
  return (
    <OverflowingBox sx={{ padding: "30px 24px 24px 24px" }} mb={mb}>
      {title && (
        <CenteringBox mb={3}>
          <Skeleton variant="circular" width={41} height={41} sx={{ marginRight: 2 }} />
          <Skeleton variant="text" sx={{ fontSize: "20px", width: 200 }} />
        </CenteringBox>
      )}
      {content && <Skeleton variant="rectangular" width="100%" height={250} />}
    </OverflowingBox>
  );
}

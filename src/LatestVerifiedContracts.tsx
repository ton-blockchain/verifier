import { Box, Skeleton, styled, Typography } from "@mui/material";
import { useLoadLatestVerified } from "./lib/useLoadLatestVerified";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Contract = styled(Box)({
  background: "white",
  padding: "16px 20px",
  borderRadius: 10,
  boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  cursor: "pointer",
});

export function LatestVerifiedContracts() {
  const { data: latestVerifiedContracts, isLoading } = useLoadLatestVerified();
  const navigate = useNavigate();
  const skeletons = useRef(new Array(30).fill(null).map((_) => Math.random() * 100));

  return (
    <div
      style={{
        maxWidth: 1160,
        width: "calc(100% - 50px)",
        paddingTop: 20,
        margin: "0 auto",
      }}>
      <Typography variant="h6">
        <b>Latest verified contracts</b>
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 3,
          margin: "0 auto",
          justifyContent: "left",
          overflow: "auto",
          maxHeight: 600,
          marginTop: 3,
        }}>
        {isLoading &&
          skeletons.current.map((width: number) => (
            <Skeleton
              sx={{ borderRadius: 4 }}
              variant="rectangular"
              width={300 + width}
              height={50}></Skeleton>
          ))}
        {latestVerifiedContracts?.map((contract) => (
          <Contract
            style={{
              background: "white",
              padding: "16px 20px",
              borderRadius: 10,
              boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
              border: "0.5px solid rgba(114, 138, 150, 0.24)",
              cursor: "pointer",
            }}>
            <Typography
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 16,
                color: "#728A96",
              }}
              onClick={(e) => {
                navigate(`/${contract}`);
              }}>
              {contract}
            </Typography>
          </Contract>
        ))}
      </Box>
    </div>
  );
}

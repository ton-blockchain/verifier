import React from "react";
import {
  PopupLink,
  PopupTableBodyCell,
  PopupTableHead,
  PopupTableHeadCell,
  PopupTableHeadPaddingCell,
  PopupTableHeadRow,
  PopupTableTypography,
  VerifiedTag,
} from "./VerificationProofPopup.styled";
import TableRow from "@mui/material/TableRow";
import { BorderLessCell, HR } from "./FileTable.styled";
import { IconButton, Skeleton } from "@mui/material";
import verified from "../assets/verified.svg";
import copy from "../assets/copy.svg";
import { CenteringBox } from "./Common.styled";

const VerificationProofPopupTableSkeleton = () => {
  return <Skeleton width="85%" variant="text" sx={{ transform: "none", background: "#e6e8eb" }} />;
};

const VerificationProofPopupTableHead = () => {
  return (
    <PopupTableHead>
      <PopupTableHeadRow>
        <PopupTableHeadCell sx={{ width: 80, paddingLeft: 3 }}>Status</PopupTableHeadCell>
        <PopupTableHeadCell sx={{ width: 370 }}>Public Key</PopupTableHeadCell>
        <PopupTableHeadCell sx={{ width: 35 }}></PopupTableHeadCell>
        <PopupTableHeadCell sx={{ width: 105 }}>IP</PopupTableHeadCell>
        <PopupTableHeadCell sx={{ width: 150 }}>Verification date</PopupTableHeadCell>
        <PopupTableHeadCell sx={{ width: 100 }}>Verifier</PopupTableHeadCell>
      </PopupTableHeadRow>
      <TableRow>
        <PopupTableHeadPaddingCell>
          <HR />
        </PopupTableHeadPaddingCell>
        <PopupTableHeadPaddingCell>
          <HR />
        </PopupTableHeadPaddingCell>
        <PopupTableHeadPaddingCell>
          <HR />
        </PopupTableHeadPaddingCell>
        <PopupTableHeadPaddingCell>
          <HR />
        </PopupTableHeadPaddingCell>
        <PopupTableHeadPaddingCell>
          <HR />
        </PopupTableHeadPaddingCell>
        <PopupTableHeadPaddingCell>
          <HR />
        </PopupTableHeadPaddingCell>
      </TableRow>
    </PopupTableHead>
  );
};

const VerificationProofPopupTableSkeletonRow = () => {
  return (
    <TableRow>
      <BorderLessCell sx={{ paddingLeft: 3, paddingBottom: 2 }}>
        <VerificationProofPopupTableSkeleton />
      </BorderLessCell>
      <PopupTableBodyCell>
        <VerificationProofPopupTableSkeleton />
      </PopupTableBodyCell>
      <PopupTableBodyCell>
        <Skeleton width={25} variant="text" sx={{ transform: "none", background: "#e6e8eb" }} />
      </PopupTableBodyCell>
      <PopupTableBodyCell>
        <VerificationProofPopupTableSkeleton />
      </PopupTableBodyCell>
      <PopupTableBodyCell>
        <VerificationProofPopupTableSkeleton />
      </PopupTableBodyCell>
      <BorderLessCell sx={{ paddingRight: 3, paddingBottom: 2 }}>
        <VerificationProofPopupTableSkeleton />
      </BorderLessCell>
    </TableRow>
  );
};

interface VerificationProofPopupTableDataRowProps {
  pubKey: string;
  onCopy: (value: string) => Promise<void>;
  endpoint: string;
  date: string;
  name: string;
  url: string;
}

const VerificationProofPopupTableDataRow = ({
  pubKey,
  endpoint,
  name,
  onCopy,
  date,
  url,
}: VerificationProofPopupTableDataRowProps) => {
  return (
    <TableRow>
      <BorderLessCell sx={{ paddingLeft: 3, paddingBottom: 2 }}>
        <VerifiedTag px={1}>
          <img src={verified} alt="Verified icon" width={11} height={11} />
          Verified
        </VerifiedTag>
      </BorderLessCell>
      <PopupTableBodyCell>
        <PopupTableTypography>{pubKey}</PopupTableTypography>
      </PopupTableBodyCell>
      <PopupTableBodyCell>
        <IconButton onClick={() => onCopy(pubKey)} sx={{ padding: 0.5 }}>
          <img src={copy} alt="Copy icon" width={16} height={16} />
        </IconButton>
      </PopupTableBodyCell>
      <PopupTableBodyCell>
        <PopupTableTypography>{endpoint}</PopupTableTypography>
      </PopupTableBodyCell>
      <PopupTableBodyCell>
        <PopupTableTypography>{date}</PopupTableTypography>
      </PopupTableBodyCell>
      <BorderLessCell sx={{ paddingRight: 3, paddingBottom: 2 }}>
        <CenteringBox>
          <PopupLink target="_blank" href={url}>
            {name}
          </PopupLink>
        </CenteringBox>
      </BorderLessCell>
    </TableRow>
  );
};

export {
  VerificationProofPopupTableHead,
  VerificationProofPopupTableSkeletonRow,
  VerificationProofPopupTableDataRow,
};

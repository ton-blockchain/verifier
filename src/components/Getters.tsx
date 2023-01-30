import {
  ContentBox,
  FlexBoxColumn,
  TableCellStyled,
  GetterBox,
  ParameterInput,
  TitleBox,
  TitleSubtext,
  TitleText,
  TypeChip,
  ValueBox,
} from "./Getters.styled";
import { Box, IconButton, Skeleton, Table, TableBody, TableRow } from "@mui/material";
import {
  Getter,
  GetterParameter,
  GetterResponseValue,
  useGetters,
  useQueryGetter,
} from "../lib/getterParser";
import { AppButton } from "./AppButton";
import { AppNotification, NotificationType } from "./AppNotification";
import { useState } from "react";
import copy from "../assets/copy.svg";
import useNotification from "../lib/useNotification";

function Request({ getter }: { getter: Getter }) {
  const { setValue } = useGetters();

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <b>Request</b>
      </Box>
      <FlexBoxColumn sx={{ gap: 2 }}>
        {getter.parameters.map((p: GetterParameter, i) => (
          <FlexBoxColumn sx={{ gap: 1 }}>
            <FlexBoxColumn sx={{ gap: 0.5, flexDirection: "row" }}>
              <Box>{p.name}</Box>
              <TypeChip>{p.type}</TypeChip>
            </FlexBoxColumn>
            <ParameterInput
              onChange={(e) => {
                setValue(getter.name, i, e.target.value);
              }}
            />
          </FlexBoxColumn>
        ))}
        {(getter.parameters.length ?? 0) === 0 && <Box sx={{ color: "#949597" }}>(No params)</Box>}
      </FlexBoxColumn>
    </Box>
  );
}

function ResponseValue({ type, value }: { type: string | null; value: GetterResponseValue[] }) {
  const [currIdx, setIdx] = useState(0);
  const { showNotification } = useNotification();

  return (
    <TableRow
      sx={{ gap: 1, cursor: value.length > 1 ? "pointer" : "initial" }}
      onClick={() => {
        setIdx((currIdx + 1) % value.length);
      }}>
      <TableCellStyled>
        <TypeChip>
          {type === "_" || !type
            ? "unknown"
            : value[currIdx]!.type === "raw"
            ? type
            : value[currIdx]!.type}
        </TypeChip>
      </TableCellStyled>
      <TableCellStyled width="100%">
        <ValueBox>{value[currIdx].value}</ValueBox>
      </TableCellStyled>
      <TableCellStyled>
        <IconButton
          sx={{ padding: 0, opacity: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(value[currIdx].value);
            showNotification("Copied to clipboard!", "success");
          }}>
          <img src={copy} alt="Copy icon" width={15} height={15} />
        </IconButton>
      </TableCellStyled>
    </TableRow>
  );
}

function Response({
  returnTypes,
  values,
  isLoading,
}: {
  returnTypes: string[];
  values: GetterResponseValue[][];
  isLoading: boolean;
}) {
  return (
    <>
      {(values.length > 0 || isLoading) && (
        <Box>
          <b>Response</b>
        </Box>
      )}
      {values.length > 0 && (
        <FlexBoxColumn sx={{ gap: 1.5 }}>
          <Table>
            <TableBody>
              {values.map((value, i) => (
                <ResponseValue type={returnTypes[i]} value={value} />
              ))}
            </TableBody>
          </Table>
        </FlexBoxColumn>
      )}
      {values.length === 0 && isLoading && (
        <FlexBoxColumn sx={{ gap: 1 }}>
          {returnTypes.map((_) => (
            <Skeleton variant="rounded" height={20} />
          ))}
        </FlexBoxColumn>
      )}
    </>
  );
}

function GetterComponent({ getter }: { getter: Getter }) {
  const { data, isLoading, mutate, error } = useQueryGetter(getter.name);

  return (
    <GetterBox>
      <TitleBox>
        <Box sx={{ flexGrow: 1 }}>
          <TitleText>
            {getter.name}({getter.parameters.map((p) => p.type).join(", ")})
          </TitleText>
          <TitleSubtext>
            <b>returns</b> {getter.returnTypes.join(", ")}
          </TitleSubtext>
        </Box>
        <Box>
          <AppButton
            fontSize={12}
            fontWeight={800}
            textColor="#fff"
            height={32}
            width={60}
            background="#1976d2"
            hoverBackground="#156cc2"
            onClick={() => {
              mutate();
            }}>
            Run
          </AppButton>
        </Box>
      </TitleBox>
      <ContentBox sx={{ padding: "10px 20px", gap: 2 }}>
        <Request getter={getter} />
        <Response returnTypes={getter.returnTypes} values={data ?? []} isLoading={isLoading} />
        {!!error && (
          <AppNotification
            noBottomMargin
            noTopMargin
            title={<Box>{error.toString()}</Box>}
            type={NotificationType.ERROR}
            notificationBody={<Box />}
          />
        )}
      </ContentBox>
    </GetterBox>
  );
}

export function Getters() {
  const { getters } = useGetters();
  return (
    <Box sx={{ display: "flex", gap: 4, flexDirection: "column", mt: 2 }}>
      {getters?.map((g) => (
        <GetterComponent getter={g} />
      ))}
    </Box>
  );
}

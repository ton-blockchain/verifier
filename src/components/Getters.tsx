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
  CustomGetterInput,
} from "./Getters.styled";
import { Box, IconButton, Skeleton, Table, TableBody, TableRow } from "@mui/material";
import { useGetters, StateGetter, Parameter } from "../lib/getter/useGetters";
import { CustomStateGetter, useCustomGetter } from "../lib/getter/useCustomGetter";
import { GetterResponseValue, useQueryGetter } from "../lib/getter/useQueryGetter";
import { AppButton } from "./AppButton";
import { AppNotification, NotificationType } from "./AppNotification";
import { useState } from "react";
import copy from "../assets/copy.svg";
import useNotification from "../lib/useNotification";
import DeleteIcon from "@mui/icons-material/Delete";

function GetterParameterComponent({
  parameter,
  removeParameter,
}: {
  parameter: Parameter;
  removeParameter?: (paramId: number) => void;
}) {
  return (
    <FlexBoxColumn sx={{ gap: 1, position: "relative" }}>
      <FlexBoxColumn sx={{ gap: 0.5, flexDirection: "row" }}>
        <Box>{parameter.name}</Box>
        <TypeChip
          sx={{ cursor: parameter.possibleTypes.length > 1 ? "pointer" : "inherit" }}
          onClick={() => {
            parameter.toggleNextType();
          }}>
          {parameter.type()}
        </TypeChip>
      </FlexBoxColumn>
      <ParameterInput
        onChange={(e) => {
          parameter.setValue(e.target.value);
        }}
      />
      {removeParameter && (
        <Box sx={{ position: "absolute", right: 1, top: 26 }}>
          <IconButton
            sx={{ padding: 0.9 }}
            onClick={() => {
              removeParameter(parameter._id);
            }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </FlexBoxColumn>
  );
}

function Request({ getter }: { getter: StateGetter }) {
  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <b>Request</b>
      </Box>
      <FlexBoxColumn sx={{ gap: 2 }}>
        {getter.parameters.map((p) => (
          <GetterParameterComponent
            key={p._id}
            parameter={p}
            removeParameter={getter.removeParameter}
          />
        ))}
        {(getter.parameters.length ?? 0) === 0 && <Box sx={{ color: "#949597" }}>(No params)</Box>}
      </FlexBoxColumn>
    </Box>
  );
}

function useTypeChip({ value }: { value: GetterResponseValue[] }) {
  const [currIdx, setIdx] = useState(0);

  return {
    onClick: () => {
      setIdx((currIdx + 1) % value.length);
    },
    type: value[currIdx]?.type ?? "unknown",
    value: value[currIdx].value,
  };
}

function ResponseValue({ type, value }: { type: string | null; value: GetterResponseValue[] }) {
  const { type: currType, value: currValue, onClick } = useTypeChip({ value });
  const { showNotification } = useNotification();

  return (
    <TableRow sx={{ gap: 1, cursor: value.length > 1 ? "pointer" : "initial" }} onClick={onClick}>
      <TableCellStyled>
        <TypeChip>{currType}</TypeChip>
      </TableCellStyled>
      <TableCellStyled width="100%">
        <ValueBox>{currValue}</ValueBox>
      </TableCellStyled>
      <TableCellStyled>
        <IconButton
          sx={{ padding: 0, opacity: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(currValue);
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

function ParsedGetterComponent({ getter }: { getter: StateGetter }) {
  const { data, isLoading, mutate, error } = useQueryGetter(getter);
  const disabled = !!getter.parameters.find((param) => !param.value);

  return (
    <GetterBox>
      <TitleBox>
        <Box sx={{ flexGrow: 1 }}>
          <TitleText>
            {getter.name}({getter.parameters.map((p) => p.originalType()).join(", ")})
          </TitleText>
          <TitleSubtext>
            <b>returns</b> {getter.returnTypes.join(", ")}
          </TitleSubtext>
        </Box>
        <Box>
          <AppButton
            disabled={disabled}
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

function CustomGetterComponent({ getter }: { getter: CustomStateGetter }) {
  const { data, isLoading, mutate, error } = useQueryGetter(getter);
  const disabled = !!getter.parameters.find((param) => !param.value) || !getter.name;

  return (
    <GetterBox>
      <TitleBox>
        <Box sx={{ flexGrow: 1 }}>
          <CustomGetterInput
            value={getter.name}
            placeholder="Get method name"
            onChange={(e) => getter.setName(e.target.value)}></CustomGetterInput>
        </Box>
        <Box>
          <AppButton
            disabled={disabled}
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
        <Box sx={{ button: { margin: 0 } }}>
          <AppButton
            fontSize={12}
            fontWeight={700}
            height={32}
            textColor="#50A7EA"
            transparent
            onClick={() => {
              getter.addParameter();
            }}>
            Add parameter
          </AppButton>
        </Box>
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
  const customGetter = useCustomGetter();

  return (
    <Box sx={{ display: "flex", gap: 4, flexDirection: "column", mt: 2 }}>
      {getters?.map((g) => (
        <ParsedGetterComponent getter={g} />
      ))}
      <CustomGetterComponent getter={customGetter} />
    </Box>
  );
}

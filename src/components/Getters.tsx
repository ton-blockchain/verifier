import { Box, Chip, CircularProgress, Skeleton, styled, Tooltip, Typography } from "@mui/material";
import { width } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useParseGetters, Getter, GetterParameter } from "../lib/parser/parser";
import { AppButton } from "./AppButton";
import { CompilerLabel, DirectoryInput } from "./CompilerSetting.styled";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getClient } from "../lib/getClient";
import { useContractAddress } from "../lib/useContractAddress";
import { Address, Cell } from "ton";
import { makeGetCall } from "../lib/makeGetCall";
import BN from "bn.js";
import { create } from "zustand";
import { AppNotification, NotificationType } from "./AppNotification";

const TitleText = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
});

const TitleSubtext = styled(Typography)({
  fontSize: 12,
  color: "#949597",
});

const TitleBox = styled(Box)({
  background: "#F7F9FB",
  padding: "14px 20px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const GetterBox = styled(Box)({
  border: "1px solid #D9D9D988",
  overflow: "hidden",
  borderRadius: 14,
  width: "100%",
  paddingBottom: 6,
});

const FlexBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const ContentBox = styled(FlexBox)({
  fontSize: 14,
});

const TypeChip = styled(Box)({
  border: "1px solid #D8D8D8",
  background: "white",
  borderRadius: 6,
  padding: "0px 8px",
  fontSize: 12,
});

const ParameterInput = styled("input")({
  display: "flex",
  alignItems: "center",
  paddingLeft: 10,
  width: "100%",
  boxSizing: "border-box",
  height: 40,
  background: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: "12px",
  fontSize: 14,
  fontFamily: "Mulish",
  outline: "none",
  "&:hover": {
    border: "1px solid #b0b0b0",
  },
  "&:focus": {
    border: "1px solid #807e7e",
  },
});

type FilledGetterParameter = GetterParameter & { value: string };

const _useGetterParameters = create<{
  getterParams: Record<string, FilledGetterParameter[]>;
  setValue: (getterName: string, index: number, value: string) => void;
  setGetters: (getter: Getter[]) => void;
}>((set, get) => ({
  getterParams: {},
  setValue(getterName: string, index: number, value: string) {
    const { getterParams } = get();

    getterParams[getterName][index].value = value;
    set({ getterParams });
  },
  setGetters(getters: Getter[]) {
    const getterParams = Object.fromEntries(
      getters.map((g) => [g.name, g.parameters.map((p) => ({ ...p, value: "" }))]),
    );
    set({ getterParams });
  },
  clear() {
    // TODO
  },
}));

function useGetters() {
  const getters = useParseGetters();
  const { setGetters, setValue, getterParams } = _useGetterParameters();
  useEffect(() => {
    if (!getters) return;
    setGetters(getters);
  }, [getters]);

  return { setValue, getters, getterParams };
}

function useQueryGetter(name: string) {
  const { contractAddress } = useContractAddress();
  const { getters, getterParams } = useGetters();

  return useMutation(["getter", name], async () => {
    const tc = await getClient();
    if (!contractAddress) return;
    if (!getters) return;

    const resp = makeGetCall(
      Address.parse(contractAddress),
      name,
      getterParams[name].map((param, i) => {
        switch (param.type) {
          case "int":
            return new BN(param.value);
          default:
            return Cell.fromBoc(Buffer.from(param.value, "base64"))[0];
        }
      }),
      (s) => {
        return s.map((value) => {
          if (value instanceof Cell) {
            return value.toBoc().toString("base64");
          } else if (value instanceof BN) {
            return value.toString();
          } else {
            return "UNSUPPORTED?";
          }
        });
      },
      tc,
    );

    return resp;
  });
}

function Request({ getter }: { getter: Getter }) {
  const { setValue } = useGetters();

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <b>Request</b>
      </Box>
      <FlexBox sx={{ gap: 2 }}>
        {getter.parameters.map((p: GetterParameter, i) => (
          <FlexBox sx={{ gap: 1 }}>
            <FlexBox sx={{ gap: 0.5, flexDirection: "row" }}>
              <Box>{p.name}</Box>
              <TypeChip>{p.type}</TypeChip>
            </FlexBox>
            <ParameterInput
              onChange={(e) => {
                setValue(getter.name, i, e.target.value);
              }}
            />
          </FlexBox>
        ))}
        {(getter.parameters.length ?? 0) === 0 && <Box sx={{ color: "#949597" }}>(No params)</Box>}
      </FlexBox>
    </Box>
  );
}

function Response({
  returnTypes,
  values,
  isLoading,
}: {
  returnTypes: string[];
  values: string[];
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
        <FlexBox sx={{ gap: 1.5 }}>
          {returnTypes.map((r, i) => (
            <FlexBox sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
              <TypeChip>{r}</TypeChip>
              <Box sx={{ wordBreak: "break-all" }}>{values[i]}</Box>
            </FlexBox>
          ))}
        </FlexBox>
      )}
      {values.length === 0 && isLoading && (
        <FlexBox sx={{ gap: 1 }}>
          {returnTypes.map((_) => (
            <Skeleton variant="rounded" height={20} />
          ))}
        </FlexBox>
      )}
    </>
  );
}

// Problematic examples:
// Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r

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
            <b>Returns</b> {getter.returnTypes.join(", ")}
          </TitleSubtext>
        </Box>
        <Box>
          <Tooltip title={"hello"}>
            <AppButton
              // disabled={!hasFiles()}
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
          </Tooltip>
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

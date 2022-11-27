import React from "react";
import compilerIcon from "../assets/compiler.svg";
import { DataBlock, DataRowItem } from "./DataBlock";
import { useLoadContractProof } from "../lib/useLoadContractProof";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

export function CompilerBlock() {
  const { data } = useLoadContractProof();

  const compilerSettings = data!.compilerSettings;

  const dataRows: DataRowItem[] = [];

  if (data) {
    dataRows.push({
      title: "Compiler",
      value: `${data!.compiler!} ${compilerSettings?.funcVersion}`,
      color: "#0088CC",
      customLink:
        compilerSettings?.funcVersion &&
        `https://github.com/ton-blockchain/ton/releases/tag/${data!.compiler}-${
          compilerSettings.funcVersion
        }`,
    });
    dataRows.push({
      title: "Fift Version",
      value: compilerSettings?.fiftVersion ?? "",
      showIcon: true,
      color: "#0088CC",
      customLink:
        compilerSettings?.fiftVersion &&
        `https://github.com/ton-blockchain/ton/tree/${compilerSettings.fiftVersion}/crypto/fift`,
    });
    dataRows.push({
      title: "Fiftlib Version",
      value: compilerSettings?.fiftlibVersion ?? "",
      showIcon: true,
      customLink:
        compilerSettings?.fiftlibVersion &&
        `https://github.com/ton-blockchain/ton/tree/${compilerSettings.fiftlibVersion}/crypto/fift/lib`,
    });
    dataRows.push({
      title: "Command",
      value: compilerSettings?.commandLine!,
      showIcon: true,
    });
  }

  return <DataBlock title="Compiler" icon={compilerIcon} dataRows={dataRows} isFlexibleWrapper />;
}

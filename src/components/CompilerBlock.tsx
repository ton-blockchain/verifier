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
    dataRows.push({ title: "Compiler", value: data!.compiler! });
    dataRows.push({ title: "Func Version", value: compilerSettings?.funcVersion ?? "" });
    dataRows.push({
      title: "Fift Version",
      value: compilerSettings?.fiftVersion?.slice(0, 8) ?? "",
    });
    dataRows.push({
      title: "Fiftlib Version",
      value: compilerSettings?.fiftlibVersion?.slice(0, 8) ?? "",
    });
    dataRows.push({ title: "Command", value: compilerSettings?.commandLine! });
    dataRows.push({
      title: "Verified",
      value: new TimeAgo("en-US").format(data!.verificationDate!),
    });
  }

  return <DataBlock title="Compiler" icon={compilerIcon} dataRows={dataRows} isFlexibleWrapper />;
}

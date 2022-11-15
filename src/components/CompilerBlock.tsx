import React from "react";
import compilerIcon from "../assets/compiler.svg";
import { DataBlock, DataRowItem } from "./DataBlock";
import { useLoadContractProof } from "../lib/useLoadContractProof";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

export function CompilerBlock() {
  const { data } = useLoadContractProof();
  const dataRows: DataRowItem[] = [];

  if (data) {
    dataRows.push({ title: "FunC Version", value: data!.version! });
    dataRows.push({ title: "Fift Commit", value: data!.fiftCommit?.slice(0, 8) || "-" });
    dataRows.push({ title: "Command", value: data!.commandLine! });
    dataRows.push({
      title: "Verified",
      value: new TimeAgo("en-US").format(data!.verificationDate!),
    });
  }

  return <DataBlock title="Compiler" icon={compilerIcon} dataRows={dataRows} isFlexibleWrapper />;
}

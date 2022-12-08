import compilerIcon from "../assets/compiler.svg";
import { DataBlock, DataRowItem } from "./DataBlock";
import { useLoadContractProof } from "../lib/useLoadContractProof";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { funcVersionToLink, fiftVersionToLink } from "../utils/linkUtils";
import { FiftCliCompileSettings, FuncCompilerSettings } from "@ton-community/contract-verifier-sdk";

TimeAgo.addDefaultLocale(en);

export function CompilerBlock() {
  const { data } = useLoadContractProof();

  const compilerSettings = data!.compilerSettings;

  const dataRows: DataRowItem[] = [];

  if (data) {
    dataRows.push({
      title: "Compiler",
      value: `${data!.compiler!}`,
    });

    if (data.compiler === "func") {
      const funcVersion = (compilerSettings as FuncCompilerSettings).funcVersion;
      dataRows.push({
        title: "Version",
        value: funcVersion,
        color: "#0088CC",
        customLink: funcVersion && funcVersionToLink(funcVersion),
      });
    } else if (data.compiler === "fift") {
      const fiftVersion = (compilerSettings as FiftCliCompileSettings).fiftVersion;
      dataRows.push({
        title: "Version",
        value: fiftVersion,
        color: "#0088CC",
        customLink: fiftVersionToLink(fiftVersion),
      });
    }
    dataRows.push({
      title: "Command",
      value: compilerSettings?.commandLine,
      showIcon: true,
    });
    dataRows.push({
      title: "Verified on",
      value: data.verificationDate?.toLocaleDateString() ?? "",
    });
  }

  return <DataBlock title="Compiler" icon={compilerIcon} dataRows={dataRows} isFlexibleWrapper />;
}

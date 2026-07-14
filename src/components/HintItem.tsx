import { Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CompileResult, Hints, useSubmitSources } from "../lib/useSubmitSources";
import { TELEGRAM_SUPPORT_LINK } from "./Footer";

const _HintItem = styled("li")({
  maxWidth: 650,
  fontSize: 14,
  fontWeight: 400,
  marginBottom: 10,
});

function hintToElem(hint: Hints) {
  switch (hint) {
    case Hints.ENTRYPOINT_MISSING:
      return "There usually should be at least one file containing an entrypoint (recv_internal, main)";
    case Hints.STDLIB_ORDER:
      return "stdlib.fc should usually be the first file in the list (unless it's imported from another file)";
    case Hints.STDLIB_MISSING:
      return "You can try to add stdlib.fc to your sources.";
    case Hints.NOT_SIMILAR:
      return "Source code compiles correctly but does not match the on-chain contract hash. Make sure you are using the correct compiler version, command line and file order.";
    case Hints.FILE_ORDER:
      return "Make sure all files in the command line are in the correct order";
    case Hints.COMPILER_VERSION:
      return "Try to use the same compiler version as the contract was compiled with";
    case Hints.REQUIRED_FILES:
      return "Make sure all required files are included in the command line";
    case Hints.SUPPORT_GROUP:
      return (
        <div>
          If you are still facing issues, you can use the{" "}
          <Link
            target="_blank"
            href={TELEGRAM_SUPPORT_LINK}
            sx={{
              textDecoration: "none",
              cursor: "pointer",
            }}>
            Telegram support group
          </Link>
        </div>
      );
  }
}

export const HintItem = ({ hint }: { hint: Hints }) => {
  return <_HintItem>{hintToElem(hint)}</_HintItem>;
};

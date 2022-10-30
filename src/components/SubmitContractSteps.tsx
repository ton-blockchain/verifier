import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import AddSources from "./AddSources";
import { useSubmitSources } from "../lib/useSubmitSources";
import { useState, useEffect } from "react";
import Button from "./Button";
import PublishProof from "./PublishProof";

function SubmitContractSteps() {
  const { data } = useSubmitSources();

  const [isPublishExpanded, setPublishExpanded] = useState(false);
  const [isAddSourcesExpanded, setAddSourcesExpanded] = useState(true);
  const canPublish = !!data?.msgCell;

  useEffect(() => {
    if (!isPublishExpanded && canPublish) {
      setPublishExpanded(true);
      setAddSourcesExpanded(false);
    }

    if (!canPublish) {
      setPublishExpanded(false);
    }
  }, [data]);

  return (
    <>
      <Accordion
        onChange={() => {
          setAddSourcesExpanded(!isAddSourcesExpanded);
        }}
        expanded={isAddSourcesExpanded}
      >
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Add sources</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddSources />
        </AccordionDetails>
      </Accordion>
      <Accordion
        disabled={!canPublish}
        onChange={() => {
          setPublishExpanded(!isPublishExpanded);
        }}
        expanded={isPublishExpanded}
      >
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Publish</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PublishProof />
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default SubmitContractSteps;

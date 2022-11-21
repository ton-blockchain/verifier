import { IconButton, Switch, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FileToUpload, useFileStore } from "../lib/useFileStore";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useHover } from "../lib/useHover";
import { CenteringBox } from "./common.styled";
import deleteIcon from "../assets/delete.svg";
import dndIcon from "../assets/dnd.svg";
import { BorderLessCell, DirectoryBox, HeaderCell, HR } from "./fileTable.styled";
import { useSubmitSources } from "../lib/useSubmitSources";
import { STEPS, usePublishStore } from "../lib/usePublishSteps";

function Cells({
  file,
  pos,
  isHover,
}: {
  file: FileToUpload;
  pos: number;
  isDragging: boolean;
  isHover: boolean;
}) {
  const fileName = file.fileObj.name;
  const { attributes, listeners } = useSortable({
    id: fileName,
  });

  const { setInclueInCommand, setDirectory, removeFile } = useFileStore();

  const { data } = useSubmitSources();
  const { step } = usePublishStore();

  const canPublish = !!data?.result?.msgCell;

  return (
    <>
      <BorderLessCell sx={{ paddingLeft: 1 }} {...attributes} {...listeners}>
        <CenteringBox sx={{ color: "#D8D8D8" }}>
          {pos}.
          <CenteringBox
            ml={2}
            style={{
              cursor: "pointer",
              visibility: isHover ? "visible" : "hidden",
            }}>
            <img src={dndIcon} alt="Drag n drop icon" width={24} height={24} />
          </CenteringBox>
        </CenteringBox>
      </BorderLessCell>
      <BorderLessCell>
        <DirectoryBox
          disabled={step === STEPS.PUBLISH && canPublish}
          value={file.folder}
          onChange={(e) => {
            setDirectory(fileName, e.target.value);
          }}></DirectoryBox>
      </BorderLessCell>
      <BorderLessCell>
        <CenteringBox
          sx={{ flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
          <Typography sx={{ fontSize: 14 }}>{file.fileObj.name}</Typography>
          <Typography sx={{ fontSize: 12, color: "#C1C1C1" }}>{file.fileObj.size} bytes</Typography>
        </CenteringBox>
      </BorderLessCell>
      <BorderLessCell>
        <Switch
          disabled={step === STEPS.PUBLISH && canPublish}
          checked={file.includeInCommand}
          onChange={(e) => {
            setInclueInCommand(fileName, e.target.checked);
          }}
        />
      </BorderLessCell>
      <BorderLessCell align="right">
        <IconButton
          sx={{
            visibility: isHover ? "visible" : "hidden",
            opacity: 0.5,
            cursor: "pointer",
            marginRight: 1,
          }}
          onClick={() => {
            removeFile(fileName);
          }}>
          <img src={deleteIcon} alt="Delete icon" width={18} height={18} />
        </IconButton>
      </BorderLessCell>
    </>
  );
}

function SortableRow({ file, pos }: { file: FileToUpload; pos: number }) {
  const fileName = file.fileObj.name;
  const { hoverRef, isHover } = useHover();
  const { data } = useSubmitSources();
  const { step } = usePublishStore();

  const canPublish = !!data?.result?.msgCell;

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: fileName,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (step === STEPS.PUBLISH && canPublish) {
    return (
      <TableRow sx={{ height: 60 }}>
        <Cells file={file} pos={pos} isDragging={false} isHover={false} />
      </TableRow>
    );
  }

  return (
    <TableRow
      sx={{
        height: 60,
        transition: ".15s all",
        "&:hover": {
          background: "#FAFAFA",
        },
      }}
      key={fileName}
      ref={(r) => {
        setNodeRef(r);
        hoverRef.current = r;
      }}
      style={style}>
      <Cells file={file} pos={pos} isDragging={isDragging} isHover={isHover} />
    </TableRow>
  );
}

export function FileTable() {
  const { files, reorderFiles } = useFileStore();
  const { data } = useSubmitSources();
  const { step } = usePublishStore();

  const canPublish = !!data?.result?.msgCell;

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      reorderFiles(active.id, over.id);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              "&.MuiTableHead-root th": {
                border: "none",
              },
            }}>
            <TableRow sx={{ fontWeight: 700 }}>
              <HeaderCell sx={{ paddingLeft: 0, width: 70 }}>Order</HeaderCell>
              <HeaderCell>Directory</HeaderCell>
              <HeaderCell sx={{ width: 300 }}>File</HeaderCell>
              <HeaderCell sx={{ width: 150 }}>Include in command</HeaderCell>
              <HeaderCell sx={{ width: 100 }}></HeaderCell>
            </TableRow>
            <TableRow>
              <BorderLessCell sx={{ paddingBottom: 2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 2 }}>
                <HR />
              </BorderLessCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <SortableContext
              disabled={step === STEPS.PUBLISH && canPublish}
              items={files.map((file) => file.fileObj.name)}
              strategy={verticalListSortingStrategy}>
              {files.map((file, i) => {
                return <SortableRow file={file} pos={i + 1} key={file.fileObj.name} />;
              })}
            </SortableContext>
          </TableBody>
        </Table>
      </TableContainer>
    </DndContext>
  );
}

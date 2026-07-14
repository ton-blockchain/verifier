import { IconButton, Switch, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import { CenteringBox } from "./Common.styled";
import deleteIcon from "../assets/delete.svg";
import dndIcon from "../assets/dnd.svg";
import { BorderLessCell, DirectoryBox, HeaderCell, HR } from "./FileTable.styled";
import { useSubmitSources } from "../lib/useSubmitSources";
import { trimDirectory } from "../utils/textUtils";

function Cells({
  file,
  pos,
  isHover,
  canPublish,
}: {
  file: FileToUpload;
  pos: number;
  isDragging: boolean;
  isHover: boolean;
  canPublish: boolean;
}) {
  const fileName = file.fileObj.name;
  const { attributes, listeners } = useSortable({
    id: fileName,
  });
  const theme = useTheme();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));

  const { setInclueInCommand, setDirectory, removeFile } = useFileStore();

  return (
    <>
      <BorderLessCell sx={{ paddingLeft: 1 }} {...attributes} {...listeners}>
        <CenteringBox sx={{ color: "#D8D8D8" }}>
          {pos}.
          <CenteringBox
            ml={5}
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
          disabled={canPublish}
          value={file.folder}
          onBlur={(e) => {
            setDirectory(fileName, trimDirectory(e.target.value));
          }}
          onChange={(e) => {
            setDirectory(fileName, e.target.value);
          }}></DirectoryBox>
      </BorderLessCell>
      <BorderLessCell sx={{ paddingLeft: headerSpacings ? 2 : 0 }}>
        <CenteringBox
          sx={{ flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
          <Typography sx={{ fontSize: 14 }}>{file.fileObj.name}</Typography>
          <Typography sx={{ fontSize: 12, color: "#C1C1C1" }}>{file.fileObj.size} bytes</Typography>
        </CenteringBox>
      </BorderLessCell>
      <BorderLessCell>
        <Switch
          disabled={canPublish}
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

function SortableRow({
  file,
  pos,
  canPublish,
}: {
  file: FileToUpload;
  pos: number;
  canPublish: boolean;
}) {
  const fileName = file.fileObj.name;
  const { hoverRef, isHover } = useHover();

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: fileName,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (canPublish) {
    return (
      <TableRow sx={{ height: 60 }}>
        <Cells file={file} pos={pos} isDragging={false} isHover={false} canPublish={canPublish} />
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
      <Cells
        file={file}
        pos={pos}
        isDragging={isDragging}
        isHover={isHover}
        canPublish={canPublish}
      />
    </TableRow>
  );
}

export function FileTable({ canPublish }: { canPublish: boolean }) {
  const { files, reorderFiles } = useFileStore();

  const theme = useTheme();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));

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
              <HeaderCell
                sx={{ paddingLeft: 0, paddingBottom: headerSpacings ? 0 : 2, width: 100 }}>
                Order
              </HeaderCell>
              <HeaderCell sx={{ paddingLeft: 0, paddingBottom: headerSpacings ? 0 : 2 }}>
                Directory
              </HeaderCell>
              <HeaderCell
                sx={{
                  paddingLeft: headerSpacings ? 2 : 0,
                  width: 300,
                  paddingBottom: headerSpacings ? 0 : 2,
                }}>
                File
              </HeaderCell>
              <HeaderCell
                sx={{ paddingLeft: 0, width: 150, paddingBottom: headerSpacings ? 0 : 2 }}>
                Include in command
              </HeaderCell>
              <HeaderCell
                sx={{
                  paddingLeft: 0,
                  width: 100,
                  paddingBottom: headerSpacings ? 0 : 2,
                }}></HeaderCell>
            </TableRow>
            <TableRow>
              <BorderLessCell sx={{ paddingBottom: headerSpacings ? 0 : 2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: headerSpacings ? 0 : 2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: headerSpacings ? 0 : 2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: headerSpacings ? 0 : 2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: headerSpacings ? 0 : 2 }}>
                <HR />
              </BorderLessCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <SortableContext
              disabled={canPublish}
              items={files.map((file) => file.fileObj.name)}
              strategy={verticalListSortingStrategy}>
              {files.map((file, i) => {
                return (
                  <SortableRow
                    file={file}
                    pos={i + 1}
                    key={file.fileObj.name}
                    canPublish={canPublish}
                  />
                );
              })}
            </SortableContext>
          </TableBody>
        </Table>
      </TableContainer>
    </DndContext>
  );
}

import { Switch } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FileToUpload, useFileStore } from "../lib/useFileStore";
import Button from "./Button";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import { Delete } from "@mui/icons-material";

/*
TODO denis - 
1. add remove file icon on hover
*/

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
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useHover } from "../lib/useHover";

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
  const { attributes, listeners } = useSortable({ id: fileName });
  const { isHover: isRemoveCellHover, hoverRef } = useHover();

  const { setInclueInCommand, setDirectory, removeFile } = useFileStore();

  return (
    <>
      <TableCell {...attributes} {...listeners}>
        <div
          style={{
            cursor: "pointer",
            visibility: isHover ? "visible" : "hidden",
          }}
        >
          <DragHandleIcon sx={{ opacity: 0.5 }} />
        </div>
      </TableCell>
      <TableCell>{pos}</TableCell>
      <TableCell>
        <input
          onChange={(e) => {
            setDirectory(fileName, e.target.value);
          }}
        />
      </TableCell>
      <TableCell>{file.fileObj.name}</TableCell>
      <TableCell>
        <Switch
          checked={file.includeInCommand}
          onChange={(e) => {
            setInclueInCommand(fileName, e.target.checked);
          }}
        />
      </TableCell>
      <TableCell ref={hoverRef}>
        <Delete
          sx={{
            visibility: isRemoveCellHover ? "visible" : "hidden",
            opacity: 0.5,
            cursor: "pointer",
          }}
          onClick={() => {
            removeFile(fileName);
          }}
        />
      </TableCell>
    </>
  );
}

function SortableRow({ file, pos }: { file: FileToUpload; pos: number }) {
  const fileName = file.fileObj.name;
  const { hoverRef, isHover } = useHover();

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: fileName,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      key={fileName}
      ref={(r) => {
        setNodeRef(r);
        hoverRef.current = r;
      }}
      style={style}
    >
      <Cells file={file} pos={pos} isDragging={isDragging} isHover={isHover} />
    </TableRow>
  );
}

export function FileTable() {
  const { files, reorderFiles } = useFileStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Directory</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Include in command</TableCell>
              <TableCell>Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <SortableContext
              items={files.map((file) => file.fileObj.name)}
              strategy={verticalListSortingStrategy}
            >
              {files.map((file, i) => {
                return (
                  <SortableRow
                    file={file}
                    pos={i + 1}
                    key={file.fileObj.name}
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

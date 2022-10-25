import { Switch } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useFileStore } from "../lib/useFileStore";
import Button from "./Button";

/*
TODO denis - 
1. add drag to reorder
2. add remove file icon on hover
*/

export function FileTable() {
  const { files, setInclueInCommand, setDirectory, removeFile } =
    useFileStore();
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>Directory</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Include in command</TableCell>
            <TableCell>Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, i) => {
            const fileName = file.fileObj.name;
            return (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <input
                    onChange={(e) => {
                      setDirectory(fileName, e.target.value);
                    }}
                  />
                </TableCell>
                <TableCell>{fileName}</TableCell>
                <TableCell>
                  <Switch
                    checked={file.includeInCommand}
                    onChange={(e) => {
                      setInclueInCommand(fileName, e.target.checked);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      removeFile(fileName);
                    }}
                    text="remove"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

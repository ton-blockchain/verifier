import { Switch } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useFileStore } from "../lib/useFileStore";

export function FileTable() {
  const { files, setInclueInCommand, setDirectory } = useFileStore();
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>Directory</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Include in command</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, i) => {
            return (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <input
                    onChange={(e) => {
                      setDirectory(file.fileObj.name, e.target.value);
                    }}
                  />
                </TableCell>
                <TableCell>{file.fileObj.name}</TableCell>
                <TableCell>
                  <Switch
                    checked={file.includeInCommand}
                    onChange={(e) => {
                      setInclueInCommand(file.fileObj.name, e.target.checked);
                    }}
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

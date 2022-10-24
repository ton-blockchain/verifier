import { Switch } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useFileStore } from "./AddSources";

export function FileTable() {
  const { files } = useFileStore();
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => {
            return (
              <>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>
                  <Switch />
                </TableCell>
              </>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

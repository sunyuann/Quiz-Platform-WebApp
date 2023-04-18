import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function TableTwoCol ({ col1Head, col2Head, data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{col1Head}</TableCell>
            <TableCell align="right">{col2Head}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((element, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {element.col1}
              </TableCell>
              <TableCell align="right">{element.col2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableTwoCol;

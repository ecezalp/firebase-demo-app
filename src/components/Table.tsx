import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import { visuallyHidden } from "@mui/utils";
import { Order, FlatStringPatient, StringObj } from "@/lib/types";
import { getComparator, stableSort, getPaddedRows } from "@/lib/util";
import Pill from "@/components/Pill";
import Button from "@mui/material/Button";
import { BUTTON_WIDTH } from "@/lib/constants";

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headers: Array<keyof FlatStringPatient>;
  headerDisplayNameMap: StringObj;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, headerDisplayNameMap } = props;
  const createSortHandler = (property: string) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {props.headers.map((header) => (
          <TableCell
            key={header}
            align="left"
            padding="normal"
            sortDirection={orderBy === header ? order : false}
          >
            <TableSortLabel
              active={orderBy === header}
              direction={orderBy === header ? order : "asc"}
              onClick={createSortHandler(`${header}`)}
            >
              {headerDisplayNameMap[header]}
              {orderBy === header ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const renderCells = (
  headers: Array<keyof FlatStringPatient>,
  row: StringObj,
  isLink: boolean
): React.ReactNode =>
  headers.map((header, i) => {
    const value =
      header === "status" ? <Pill status={row[header]} /> : row[header];
    return value ? (
      <TableCell
        key={`cell=${row.id}-${value.toString().split(" ").join("-")}`}
      >
        {isLink ? <Link href={`/patients/${row.id}`}>{value}</Link> : value}
      </TableCell>
    ) : (
      <TableCell>-</TableCell>
    );
  });

const TableComponent: React.FC<{
  headers: Array<keyof FlatStringPatient>;
  headerDisplayNameMap: StringObj;
  isDemoTable?: boolean;
  rowItems: Array<FlatStringPatient>;
}> = ({ rowItems, headers, headerDisplayNameMap, isDemoTable = false }) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("lastName");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [searchTerm, setSearchTerm] = React.useState<string>(""); // Add search term state

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof FlatStringPatient
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(`${property}`);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  // Filter rows based on search term
  const filteredRows = React.useMemo(
    () =>
      rowItems.filter((rowItem) =>
        Object.values(rowItem).join(" ").toLowerCase().includes(searchTerm)
      ),
    [rowItems.toString(), searchTerm]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  // Paginate the filtered rows
  const visibleRows = React.useMemo(
    () =>
      stableSort(
        getPaddedRows(filteredRows, orderBy),
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows.length]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {isDemoTable ? "Sample Patients" : "Patients"}
        </Typography>
        {!isDemoTable && (
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Input
              type="text"
              sx={{ minWidth: BUTTON_WIDTH * 1.5, mr: 3 }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              placeholder="Search Patients"
              onChange={handleSearch}
            />
            <Button
              sx={{ minWidth: BUTTON_WIDTH, mr: 3 }}
              href="/patients/new"
              color="success"
              variant="contained"
            >
              New Patient
            </Button>
            <Button
              sx={{ minWidth: BUTTON_WIDTH, mr: 1 }}
              href="/settings/#patients-table-settings"
            >
              Table Settings
            </Button>
          </Box>
        )}
      </Toolbar>
      <TableContainer>
        <Table
          sx={{
            width: "100%",
            "& a": {
              color: "text.primary",
              textDecoration: "none",
            },
            "& .MuiTableRow-root:hover a": {
              cursor: "pointer",
              color: "primary",
              textDecoration: "underline",
            },
          }}
          aria-labelledby="tableTitle"
          size={"small"}
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={filteredRows.length}
            headers={headers}
            headerDisplayNameMap={headerDisplayNameMap}
          />
          <TableBody>
            {visibleRows.map((row, i, arr) => (
              <TableRow hover tabIndex={-1} key={row.id}>
                {renderCells(headers, row, !isDemoTable)}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default TableComponent;

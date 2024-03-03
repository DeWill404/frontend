import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TableActionMenu from "./table-action-menu";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../../Helper/contant";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import _ from "lodash";

const sx = {
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  noteText: {
    margin: "10px -8px -12px 0px",
    fontWeight: "normal",
    fontStyle: "italic",
    color: "#585858",
  },
  tableRoot: {
    width: "100%",
    border: (theme) => `1px solid ${theme.palette.grey[500]}`,
    borderRadius: "8px",
    boxShadow: (theme) => theme.shadows[1],
    marginTop: "40px",
    marginBottom: "10px",
    overflow: "hidden",
    transition: "all 0.2s linear",
    "& .table-checkbox": {
      color: "black !important",
    },
  },
  headerCell: {
    background: (theme) => theme.palette.grey[100],
    borderBottomColor: (theme) => theme.palette.grey[500],
    whiteSpace: "nowrap",
  },
  tableRow: { cursor: "pointer" },
  tableRowCell: {
    whiteSpace: "nowrap",
    paddingBlock: "24px",
  },
  tableActionCell: {
    width: "1px",
    padding: "6px",
    paddingRight: "12px",
    background: "white",
    cursor: "auto",
  },
  tableFooter: {
    fontSize: "14px",
    color: "#000000DE",
    minHeight: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "16px",
    paddingRight: "2px",
    "& .page-input": {
      width: "50px",
      "& input": { paddingBlock: "4px" },
    },
    "& .action-btn": {
      "&:not(:disabled)": {
        color: "black",
      },
    },
  },
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead({
  rows,
  order,
  orderBy,
  headCells,
  onRequestSort,
  showActions,
  showCheckbox,
  selectedList,
  setSelection,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const isSomeSelected = useCallback(() => {
    const ids = rows.map((row) => row._id);
    const selectedIds = ids.filter((id) => selectedList.includes(id));
    return selectedIds.length > 0 && selectedIds.length < rows.length;
  }, [selectedList, rows]);

  const isAllSelected = useCallback(() => {
    const ids = rows.map((row) => row._id);
    const selectedIds = ids.filter((id) => selectedList.includes(id));
    return selectedIds.length > 0 && selectedIds.length === rows.length;
  }, [selectedList, rows]);

  const onSelectAll = useCallback(
    (e) => {
      const isChecked = e.target.checked;
      if (isChecked) {
        setSelection((prev) =>
          _.union(
            prev,
            rows.map((row) => row._id)
          )
        );
      } else {
        setSelection((prev) => _.without(prev, ...rows.map((row) => row._id)));
      }
    },
    [selectedList, rows]
  );

  return (
    <TableHead>
      <TableRow>
        {showCheckbox && (
          <TableCell sx={sx.headerCell} padding="checkbox">
            <Checkbox
              className="table-checkbox"
              indeterminate={isSomeSelected()}
              checked={isAllSelected()}
              onChange={onSelectAll}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.name}
            sortDirection={orderBy === headCell.name ? order : false}
            sx={sx.headerCell}
          >
            <TableSortLabel
              hideSortIcon={headCell.sortable === false}
              active={orderBy === headCell.name}
              direction={orderBy === headCell.name ? order : "asc"}
              onClick={(e) => {
                if (headCell.sortable === false) {
                  return;
                }
                createSortHandler(headCell.name)(e);
              }}
            >
              {headCell.label}
              {orderBy === headCell.name && headCell.sortable !== false ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {showActions && <TableCell sx={sx.headerCell} />}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableFooter({ rows, rowsPerPage, page, setPage }) {
  const currPageStart = page * rowsPerPage + 1;
  let currPageEnd = (page + 1) * rowsPerPage;
  currPageEnd = currPageEnd > rows.length ? rows.length : currPageEnd;

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const prevClick = () => setPage((p) => (p === 0 ? 0 : p - 1));
  const nextClick = () => setPage((p) => (p === totalPages - 1 ? p : p + 1));

  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = page + 1;
    }
  }, [page]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const value = parseInt(e.target.value.trim());
      let newPage;
      if (isNaN(value)) {
        newPage = page + 1;
      } else if (value <= 0) {
        newPage = 1;
      } else if (value >= totalPages) {
        newPage = totalPages;
      } else {
        newPage = value;
      }

      if (newPage !== page + 1) {
        setPage(newPage - 1);
      } else if (value !== newPage) {
        e.target.value = newPage;
      }
    }
  };

  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <Box sx={sx.tableFooter}>
      <Box display="flex" gap="4px" alignItems="center">
        <span>Page:</span>
        <TextField
          size="small"
          className="page-input"
          inputRef={inputRef}
          onKeyDown={onKeyDown}
        />
      </Box>
      <Box display="flex" gap="4px" alignItems="center">
        <span>
          {currPageStart}-{currPageEnd} of {rows.length}
        </span>
        <Box paddingInline="2px"></Box>
        <IconButton
          disabled={page === 0}
          className="action-btn"
          size="small"
          onClick={prevClick}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          disabled={page === totalPages - 1}
          className="action-btn"
          size="small"
          onClick={nextClick}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function PageTable({
  rows,
  headCells,
  onRowClick,
  tableActions,
  isLoading,
  showCheckbox,
  selectedList,
  setSelection,
}) {
  const navigate = useNavigate();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = parseInt(process.env.REACT_APP_PAGE_LIMIT) || 5;

  useEffect(() => {
    setPage(0);
  }, [rows]);

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const showActions = useMemo(
    () => tableActions && tableActions.length > 0,
    [tableActions]
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleRowClick = (id) => {
    const listener = (e) => {
      let container = document.querySelector(
        ".rc-image-preview-operations-wrapper"
      );
      if (container?.contains(e.target)) {
        return;
      }
      container = document.querySelector(".rc-image-preview-root");
      if (container?.contains(e.target)) {
        return;
      }
      if (Array.from(e.target.classList).includes("rc-image-preview-wrap")) {
        return;
      }
      if (Array.from(e.target.classList).includes("rc-image-preview-img")) {
        return;
      }
      onRowClick(id);
    };
    return listener;
  };

  const isCustomerName = (name) => name === "job_sheet.customer_name";

  const nameCellClick = (name, value) => (e) => {
    if (isCustomerName(name)) {
      e.stopPropagation();
      navigate(ROUTE.CUSTOMER.route, {
        state: { search: value, action: "order_search" },
      });
    }
  };

  const onRowSelect = (_id) => (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelection((prev) => [...prev, _id]);
    } else {
      setSelection((prev) => prev.filter((p) => p !== _id));
    }
  };

  return (
    <>
      {showCheckbox && (
        <Box component="h5" sx={sx.noteText}>
          <strong>Note: </strong>Customer names only in selected orders will be
          updated. The un-selected orders will be unmapped from this customer.
        </Box>
      )}
      <Box sx={sx.tableRoot} className="table-root">
        {isLoading ? (
          <Box height={200} width={1} position="relative">
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height="100%"
            ></Skeleton>
            <Box sx={sx.loaderContainer}>
              <CircularProgress color="inherit" size={32} />
              <span>Loading</span>
            </Box>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table aria-labelledby="tableTitle" size="medium">
                <EnhancedTableHead
                  rows={visibleRows}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                  headCells={headCells}
                  showActions={showActions}
                  showCheckbox={showCheckbox}
                  selectedList={selectedList}
                  setSelection={setSelection}
                />
                <TableBody>
                  {visibleRows.length ? (
                    visibleRows.map((row) => (
                      <TableRow
                        hover
                        onClick={handleRowClick(row._id)}
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                        sx={sx.tableRow}
                      >
                        {showCheckbox && (
                          <TableCell padding="checkbox" sx={sx.tableRowCell}>
                            <Checkbox
                              className="table-checkbox"
                              checked={selectedList.includes(row._id)}
                              onClick={(e) => e.stopPropagation()}
                              onChange={onRowSelect(row._id)}
                            />
                          </TableCell>
                        )}
                        {headCells.map(({ name }) => (
                          <TableCell sx={sx.tableRowCell} key={name}>
                            <Tooltip
                              arrow
                              disableInteractive
                              title={
                                isCustomerName(name)
                                  ? "Click here to view customer details"
                                  : ""
                              }
                            >
                              <span onClick={nameCellClick(name, row[name])}>
                                {row[name]}
                              </span>
                            </Tooltip>
                          </TableCell>
                        ))}
                        {showActions && (
                          <TableCell
                            onClick={(event) => event.stopPropagation()}
                            sx={sx.tableActionCell}
                          >
                            <TableActionMenu
                              id={row._id}
                              actions={tableActions}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      sx={sx.tableRow}
                    >
                      <TableCell
                        sx={sx.tableRowCell}
                        colSpan={
                          headCells.length +
                          Number(!!(tableActions && tableActions.length))
                        }
                      >
                        <span>No Data to display</span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <EnhancedTableFooter
              rows={rows}
              rowsPerPage={rowsPerPage}
              page={page}
              setPage={setPage}
            />
          </>
        )}
      </Box>
    </>
  );
}

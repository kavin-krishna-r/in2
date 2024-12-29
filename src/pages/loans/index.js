import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState, useRef } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import {
  Box,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Grid,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Tooltip,
  Button
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { DeleteTwoTone, EditTwoTone, EyeTwoTone, FileDoneOutlined, InfoCircleOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import InvoiceCard from 'components/cards/loan/InvoiceCard';
import InvoiceChart from 'components/cards/loan/InvoiceChart';
import { CSVExport, HeaderSort, IndeterminateCheckbox, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import AlertColumnDelete from 'sections/apps/kanban/Board/AlertColumnDelete';

import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle, getInvoiceDelete, getInvoiceList } from 'store/reducers/invoice';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';
import { PlusOutlined } from '@ant-design/icons';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| REACT TABLE ||============================== //
const LoanLists = [
  {
    "id": 1,
    "invoice_id": 8795646525451,
    "customer_name": "Tessi Eneas",
    "email": "tass23@gmail.com",
    "avatar": 5,
    "discount": 0.5,
    "tax": 0.2,
    "date": "05/01/2022",
    "due_date": "06/02/2022",
    "quantity": 1000,
    "status": "Pending",
    "notes": "",
    "cashierInfo": {
      "name": "Ian Carpenter",
      "address": "1754 Ureate, RhodSA5 5BO",
      "phone": "+91 1234567890",
      "email": "iacrpt65@gmail.com"
    },
    "customerInfo": {
      "name": "Belle J. Richter",
      "address": "1300 Mine RoadQuemado, NM 87829",
      "phone": "305-829-7809",
      "email": "belljrc23@gmail.com"
    },
    "invoice_detail": [
      {
        "id": 2,
        "name": "Apple Series 4 GPS A38 MM Space",
        "qty": 3,
        "description": "Apple Watch SE Smartwatch",
        "price": 275
      },
      {
        "id": 3,
        "name": "Boat On-Ear Wireless",
        "description": "Mic(Bluetooth 4.2, Rockerz 450R...",
        "qty": 45,
        "price": 81.99
      },
      {
        "id": 4,
        "name": "Fitbit MX30 Smart Watch",
        "description": "(MX30- waterproof) watch",
        "qty": 70,
        "price": 85
      }
    ]
  },
  {
    "id": 2,
    "invoice_id": 8795646525452,
    "customer_name": "Abey Boseley",
    "email": "aabsl32@gmail.com",
    "avatar": 4,
    "date": "7/15/2022",
    "due_date": "2/15/2022",
    "quantity": 2030,
    "discount": 0,
    "tax": 0.8,
    "status": "Pending",
    "notes": "",
    "cashierInfo": {
      "name": "Belle J. Richter",
      "address": "1300 Mine RoadQuemado, NM 87829",
      "phone": "305-829-7809",
      "email": "belljrc23@gmail.com"
    },
    "customerInfo": {
      "name": "Ian Carpenter",
      "address": "1754 Ureate, RhodSA5 5BO",
      "phone": "+91 1234567890",
      "email": "iacrpt65@gmail.com"
    },
    "invoice_detail": [
      {
        "id": 6,
        "name": "Luxury Watches Centrix Gold",
        "description": "7655 Couple (Refurbished)...",
        "qty": 3,
        "price": 29.99
      },
      {
        "id": 7,
        "name": "Canon EOS 1500D 24.1 Digital SLR",
        "description": "SLR Camera (Black) with EF S18-55...",
        "qty": 50,
        "price": 12.99
      }
    ]
  },
  {
    "id": 3,
    "invoice_id": 8795646525453,
    "customer_name": "Shelba Thews",
    "email": "slbt37@gmail.com",
    "avatar": 7,
    "date": "7/6/2022",
    "due_date": "7/8/2022",
    "quantity": 3000,
    "discount": 1,
    "tax": 2,
    "status": "Cancelled",
    "notes": "",
    "cashierInfo": {
      "name": "Ritika Yohannan",
      "address": "3488 Arbutus DriveMiami, FL",
      "phone": "+91 1234567890",
      "email": "rtyhn65@gmail.com"
    },
    "customerInfo": {
      "name": "Thomas D. Johnson",
      "address": "4388 House DriveWestville, OH +91",
      "phone": "1234567890",
      "email": "thomshj56@gmail.com"
    },
    "invoice_detail": [
      {
        "id": 9,
        "name": "Apple iPhone 13 Mini ",
        "description": "13 cm (5.4-inch) Super",
        "qty": 40,
        "price": 86.99
      },
      {
        "id": 10,
        "name": "Apple MacBook Pro with Iphone",
        "description": "11th Generation Intel® Core™ i5-11320H ...",
        "qty": 70,
        "price": 14.59
      },
      {
        "id": 11,
        "name": "Apple iPhone 13 Pro",
        "description": "(512GB ROM, MLLH3HN/A,..",
        "qty": 21,
        "price": 100
      },
      {
        "id": 12,
        "name": "Canon EOS 1500D 24.1 Digital",
        "description": "(512GB ROM, MLLH3HN/A,..",
        "qty": 21,
        "price": 399
      }
    ]
  },
  {
    "id": 4,
    "invoice_id": 8795646525454,
    "customer_name": "Salvatore Boncore",
    "email": "sabf231@gmail.com",
    "avatar": 8,
    "date": "2/8/2022",
    "due_date": "3/30/2022",
    "quantity": 2000,
    "discount": 0.89,
    "tax": 5.2,
    "status": "Cancelled",
    "notes": "",
    "cashierInfo": {
      "name": "Jesse G. Hassen",
      "address": "3488 Arbutus DriveMiami, FL 33012",
      "phone": "+91 1234567890",
      "email": "jessghs78@gmail.com"
    },
    "customerInfo": {
      "name": "Christopher P. Iacovelli",
      "address": "4388 House DriveWesrville, OH",
      "phone": "+91 1234567890",
      "email": "crpthl643@gmail.com"
    },
    "invoice_detail": [
      {
        "id": 14,
        "name": "Luxury Watches Centrix Gold",
        "description": "7655 Couple (Refurbished)...",
        "qty": 3,
        "price": 29.99
      },
      {
        "id": 15,
        "name": "Canon EOS 1500D 24.1 Digital SLR",
        "description": "SLR Camera (Black) with EF S18-55...",
        "qty": 50,
        "price": 12.99
      },
      {
        "id": 16,
        "name": "Apple iPhone 13 Pro",
        "description": "(512GB ROM, MLLH3HN/A,..",
        "qty": 21,
        "price": 100
      },
      {
        "id": 17,
        "name": "Canon EOS 1500D 24.1 Digital",
        "description": "(512GB ROM, MLLH3HN/A,..",
        "qty": 21,
        "price": 399
      }
    ]
  },
  {
    "id": 5,
    "invoice_id": 8795646525455,
    "customer_name": "Mickie Melmoth",
    "email": "mmsht23@gmail.com",
    "avatar": 2,
    "discount": 0.1,
    "tax": 0.52,
    "date": "5/5/2022",
    "due_date": "7/11/2022",
    "quantity": 3000,
    "status": "Approved",
    "notes": "",
    "cashierInfo": {
      "name": "Thomas D. Johnson",
      "address": "4388 House DriveWestville, OH +91",
      "phone": "1234567890",
      "email": "thomshj56@gmail.com"
    },
    "customerInfo": {
      "name": "Ian Carpenter",
      "address": "1754 Ureate, RhodSA5 5BO",
      "phone": "+91 1234567890",
      "email": "iacrpt65@gmail.com"
    },
    "invoice_detail": [
      {
        "id": 19,
        "name": "Luxury Watches Centrix Gold",
        "description": "7655 Couple (Refurbished)...",
        "qty": 3,
        "price": 29.99
      },
      {
        "id": 20,
        "name": "Canon EOS 1500D 24.1 Digital SLR",
        "description": "SLR Camera (Black) with EF S18-55...",
        "qty": 50,
        "price": 12.99
      },
      {
        "id": 21,
        "name": "Luxury Watches sliver",
        "description": "7655 Couple (Refurbished)...",
        "qty": 3,
        "price": 29.99
      },
      {
        "id": 22,
        "name": "Canon EOS 1800D",
        "description": "SLR Camera (Black) with EF S18-55...",
        "qty": 50,
        "price": 12.99
      },
      {
        "id": 23,
        "name": "Apple watch 5 series",
        "qty": 3,
        "description": "Apple Watch SE Smartwatch",
        "price": 275
      }
    ]
  },
]

function ReactTable({ columns, data, navigation }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ['avatar', 'email'],
      pageIndex: 0,
      pageSize: 5
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const componentRef = useRef(null);

  // ================ Tab ================

  const groups = ['All', ...new Set(data.map((item) => item.status))];
  const countGroup = data.map((item) => item.status);
  const counts = countGroup.reduce(
    (acc, value) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('status', activeTab === 'All' ? '' : activeTab);
    // eslint-disable-next-line
  }, [activeTab]);


  return (
    <>
      <Box sx={{ p: 3, pb: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {groups.map((status, index) => (
            <Tab
              key={index}
              label={status}
              value={status}
              icon={
                <Chip
                  label={
                    status === 'All'
                      ? data.length
                      : status === 'Paid'
                        ? counts.Paid
                        : status === 'Unpaid'
                          ? counts.Unpaid
                          : counts.Cancelled
                  }
                  color={status === 'All' ? 'primary' : status === 'Paid' ? 'success' : status === 'Unpaid' ? 'warning' : 'error'}
                  variant="light"
                  size="small"
                />
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={(e) => {
          e.stopPropagation();
          navigation(`/loans/create`);
        }}>
          Add Application
        </Button>
      </Box>
      <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 0}>
          <TableRowSelection selected={Object.keys(selectedRowIds).length} />
          {headerGroups.map((group, index) => (
            <Stack key={index} direction={matchDownSM ? 'column' : 'row'} spacing={1} {...group.getHeaderGroupProps()}>
              {group.headers.map((column, i) => (
                <Box key={i} {...column.getHeaderProps([{ className: column.className }])}>
                  {column.canFilter ? column.render('Filter') : null}
                </Box>
              ))}
            </Stack>
          ))}
          <CSVExport data={data} filename={'invoice-list.csv'} />
        </Stack>
      </Stack>
      <Box ref={componentRef}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column, x) => (
                  <TableCell key={x} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell, i) => (
                      <TableCell key={i} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| INVOICE - LIST ||============================== //

const CustomerCell = ({ row }) => {
  const { values } = row;
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar alt="Avatar" size="sm" src={avatarImage(`./avatar-${!values.avatar ? 1 : values.avatar}.png`)} />
      <Stack spacing={0}>
        <Typography variant="subtitle1">{values.customer_name}</Typography>
        {/* <Typography variant="caption" color="textSecondary">
          {values.email}
        </Typography> */}
      </Stack>
    </Stack>
  );
};

const InstituteCell = ({ row }) => {
  const { values } = row;
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {/* <Avatar alt="Avatar" size="sm" src={avatarImage(`./avatar-${!values.avatar ? 1 : values.avatar}.png`)} /> */}
      <Stack spacing={0}>
        <Typography variant="subtitle1">Vivian Institute</Typography>
        {/* <Typography variant="caption" color="textSecondary">
          {values.email}
        </Typography> */}
      </Stack>
    </Stack>
  );
};

const ParentCell = ({ row }) => {
  const { values } = row;
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {/* <Avatar alt="Avatar" size="sm" src={avatarImage(`./avatar-${!values.avatar ? 1 : values.avatar}.png`)} /> */}
      <Stack spacing={0}>
        <Typography variant="subtitle1">Test Name</Typography>
        {/* <Typography variant="caption" color="textSecondary">
          {values.email}
        </Typography> */}
      </Stack>
    </Stack>
  );
};

const FeeTypeCell = ({ row }) => {
  const { values } = row;
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Stack spacing={0}>
        <Typography variant="subtitle1">Tution Fee</Typography>
        {/* <Typography variant="caption" color="textSecondary">
          {values.email}
        </Typography> */}
      </Stack>
    </Stack>
  );
};

CustomerCell.propTypes = {
  row: PropTypes.object
};

// Status
const StatusCell = ({ value }) => {
  switch (value) {
    case 'approved':
      return <Chip color="success" label="Approved" size="small" variant="light" />;
    case 'pending':
      return <Chip color="warning" label="Pending" size="small" variant="light" />;
    case 'Cancelled':
      return <Chip color="error" label="Cancelled" size="small" variant="light" />;
    default:
      return <Chip color="info" label="Pending" size="small" variant="light" />;
  }
};

StatusCell.propTypes = {
  value: PropTypes.string
};

// Action Cell
const ActionCell = (row, setGetInvoiceId, setInvoiceId, navigation, theme) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      <Tooltip title="View">
        <IconButton
          color="secondary"
          onClick={(e) => {
            e.stopPropagation();
            navigation(`/loans/details/${row.values.id}`);
          }}
        >
          <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            navigation(`/loans/edit/${row.values.id}`);
          }}
        >
          <EditTwoTone twoToneColor={theme.palette.primary.main} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            setInvoiceId(row.values.id);
            setGetInvoiceId(row.original.invoice_id);
            dispatch(
              alertPopupToggle({
                alertToggle: true
              })
            );
          }}
        >
          <DeleteTwoTone twoToneColor={theme.palette.error.main} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

ActionCell.propTypes = {
  row: PropTypes.array,
  setInvoiceId: PropTypes.func,
  setGetInvoiceId: PropTypes.func,
  navigation: PropTypes.func,
  theme: PropTypes.object
};

// Section Cell and Header
const SelectionCell = ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />;
const SelectionHeader = ({ getToggleAllPageRowsSelectedProps }) => (
  <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
);

SelectionCell.propTypes = {
  row: PropTypes.object
};

SelectionHeader.propTypes = {
  getToggleAllPageRowsSelectedProps: PropTypes.func
};

const List = () => {
  const { lists, alertPopup } = useSelector((state) => state.invoice);
  useEffect(() => {
    if (lists.length === 0) {
      dispatch(getInvoiceList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [list, setList] = useState([]);
  const [invoiceId, setInvoiceId] = useState(0);
  const [getInvoiceId, setGetInvoiceId] = useState(0);
  useEffect(() => {
    setList(LoanLists);
  }, [lists]);
  const navigation = useNavigate();
  console.log("lists -", list)

  const handleClose = (status) => {
    if (status) {
      dispatch(getInvoiceDelete(invoiceId));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Column deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
    dispatch(
      alertPopupToggle({
        alertToggle: false
      })
    );
  };
  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: SelectionHeader,
        accessor: 'selection',
        Cell: SelectionCell,
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Invoice Id',
        accessor: 'id',
        className: 'cell-center',
        disableFilters: true
      },
      {
        Header: 'Student Name',
        accessor: 'customer_name',
        disableFilters: true,
        Cell: CustomerCell
      },
      {
        Header: 'Parent Name',
        accessor: 'parent_name',
        disableFilters: true,
        Cell: ParentCell
      },
      {
        Header: 'Institute Name',
        accessor: 'father_name',
        disableFilters: true,
        Cell: InstituteCell
      },
      {
        Header: 'Avatar',
        accessor: 'avatar',
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Email',
        accessor: 'email',
        disableFilters: true
      },
      {
        Header: 'Create Date',
        accessor: 'date'
      },
      {
        Header: 'Due Date',
        accessor: 'due_date'
      },
      {
        Header: 'Loan Amount',
        accessor: 'quantity',
        disableFilters: true
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        filter: 'includes',
        Cell: StatusCell
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => ActionCell(row, setGetInvoiceId, setInvoiceId, navigation, theme)
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const widgetsData = [
    {
      title: 'Pending',
      count: '₹10,825,00',
      percentage: 70.5,
      isLoss: false,
      invoice: '9',
      color: theme.palette.success,
      chartData: [200, 600, 100, 400, 300, 400, 50]
    },
    {
      title: 'Approved',
      count: '₹12,825,00',
      percentage: 70.5,
      isLoss: false,
      invoice: '9',
      color: theme.palette.success,
      chartData: [200, 600, 100, 400, 300, 400, 50]
    },
    {
      title: 'Cancelled',
      count: '₹3,507',
      percentage: 27.4,
      isLoss: true,
      invoice: '4',
      color: theme.palette.error,
      chartData: [100, 550, 200, 300, 100, 200, 300]
    }
  ];

  return (
    <>
      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }} >
        <Grid item md={12}>
          <Grid container direction="row" spacing={2}>
            {widgetsData.map((widget, index) => (
              <Grid item sm={2.4} xs={12} key={index}>
                <MainCard>
                  <InvoiceCard
                    title={widget.title}
                    count={widget.count}
                    percentage={widget.percentage}
                    isLoss={widget.isLoss}
                    invoice={widget.invoice}
                    color={widget.color.main}
                    isLoan={true}
                  >
                    <InvoiceChart color={widget.color} data={widget.chartData} />
                  </InvoiceCard>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={list} navigation={navigation} />
        </ScrollX>
      </MainCard>
      <AlertColumnDelete title={`${getInvoiceId}`} open={alertPopup} handleClose={handleClose} />
    </>
  );
};

function LinearWithLabel({ value, ...others }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="warning" variant="determinate" value={value} {...others} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="white">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearWithLabel.propTypes = {
  value: PropTypes.number,
  others: PropTypes.any
};

export default List;

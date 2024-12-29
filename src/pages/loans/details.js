import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  IconButton,
  Chip,
  FormControl,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider
} from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project import
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import LogoSection from 'components/logo';
import ExportPDFView from 'sections/apps/loan/export-pdf';

import { dispatch, useSelector } from 'store';
import { getInvoiceSingleList } from 'store/reducers/invoice';

// assets
import { DownloadOutlined, EditOutlined, PrinterFilled, ShareAltOutlined } from '@ant-design/icons';

// ==============================|| INVOICE - DETAILS ||============================== //
const InvoiceDetail1 = [{
  "id": 1,
  "loanName": "Shorterm Loan",
  "qty": 1,
  "institute": "Vivian Institue",
  "price": 2750
},
{
  "id": 2,
  "loanName": "Shorterm Loan",
  "qty": 2,
  "institute": "Vivian Institue",
  "price": 2750
},
{
  "id": 3,
  "loanName": "Shorterm Loan",
  "qty": 3,
  "institute": "Vivian Institue",
  "price": 2750
}]

const dummyFiles = [
  { name: 'File1.pdf', size: '2 MB', date: '2024-12-20' },
  { name: 'Image.png', size: '1.5 MB', date: '2024-12-21' },
  { name: 'Document.docx', size: '500 KB', date: '2024-12-22' },
  { name: 'Presentation.pptx', size: '4 MB', date: '2024-12-23' },
];


const Details = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigation = useNavigate();

  const { country, list } = useSelector((state) => state.invoice);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getInvoiceSingleList(Number(id))).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const today = new Date(`${list?.date}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const due_dates = new Date(`${list?.due_date}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const subtotal = list?.invoice_detail?.reduce((prev, curr) => {
    if (curr.name.trim().length > 0) return prev + Number(curr.price * Math.floor(curr.qty));
    else return prev;
  }, 0);

  const taxRate = (Number(list?.tax) * subtotal) / 100;
  const discountRate = (Number(list?.discount) * subtotal) / 100;
  const total = subtotal - discountRate + taxRate;
  const componentRef = useRef(null);

  if (loading) return <Loader />;

  return (
    <MainCard content={false}>
      <Stack spacing={2.5}>
        <Box sx={{ p: 2.5, pb: 0 }}>
          <MainCard content={false} sx={{ p: 1.25, bgcolor: 'primary.lighter', borderColor: theme.palette.primary[100] }}>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <IconButton onClick={() => navigation(`/apps/invoice/edit/${id}`)}>
                <EditOutlined style={{ color: theme.palette.grey[900] }} />
              </IconButton>
              {/* c:\Users\kavin\Downloads\mantis-material-react-2.1.0-eu3ipl\mantis-material-react-2.1.0\full-version\src\pages\apps\invoice\edit.js */}
              {/* <ReactToPrint
                trigger={() => (
                  <IconButton>
                    <PrinterFilled style={{ color: theme.palette.grey[900] }} />
                  </IconButton>
                )}
                content={() => componentRef.current}
              /> */}
              <IconButton>
                <ShareAltOutlined style={{ color: theme.palette.grey[900] }} />
              </IconButton>
            </Stack>
          </MainCard>
        </Box>
        <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                <Box>
                  <Stack direction="row" spacing={2}>
                    <LogoSection />
                    <Chip label="Paid" variant="light" color="success" size="small" />
                  </Stack>
                  <Typography color="secondary">{list?.invoice_id}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Typography variant="subtitle1">Date</Typography>
                    <Typography color="secondary">{today}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Typography sx={{ overflow: 'hidden' }} variant="subtitle1">
                      Due Date
                    </Typography>
                    <Typography color="secondary">{due_dates}</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Stack spacing={1}>
                  <Typography variant="h5">From:</Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <Typography color="secondary">{list?.cashierInfo.name}</Typography>
                    <Typography color="secondary">{list?.cashierInfo.address}</Typography>
                    <Typography color="secondary">{list?.cashierInfo.phone}</Typography>
                    <Typography color="secondary">{list?.cashierInfo.email}</Typography>
                  </FormControl>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Stack spacing={1}>
                  <Typography variant="h5">To:</Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <Typography color="secondary">{list?.customerInfo.name}</Typography>
                    <Typography color="secondary">{list?.customerInfo.address}</Typography>
                    <Typography color="secondary">{list?.customerInfo.phone}</Typography>
                    <Typography color="secondary">{list?.customerInfo.email}</Typography>
                  </FormControl>
                </Stack>
              </MainCard>
            </Grid>

            <Grid item xs={12} sm={12}>
              <MainCard>
                <Stack spacing={1}>
                  <Typography variant="h5">Uploaded Files</Typography>
                  <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center">
                    {dummyFiles.map((file, index) => (
                      <Stack
                        key={index}
                        direction="column"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid #ddd', pb: 1 }}
                      >
                        <Box>
                          <Typography variant="body1">{file.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {file.size} | {file.date}
                          </Typography>
                        </Box>
                        <Button size="small" color="primary" onClick={() => handleDownload(file)}>
                          Download
                        </Button>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>

            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Loan Type</TableCell>
                      <TableCell>Institute Name</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {InvoiceDetail1?.map((row, index) => (
                      <TableRow key={row.loanName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.loanName}</TableCell>
                        <TableCell>{row.institute}</TableCell>
                        <TableCell align="right">{row.qty}</TableCell>
                        <TableCell align="right">{country?.prefix + '' + Number(row.price).toFixed(2)}</TableCell>
                        <TableCell align="right">{country?.prefix + '' + Number(row.price * row.qty).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ borderWidth: 1 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={8}></Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                  <Typography>{country?.prefix + '' + subtotal?.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                  <Typography variant="h6" color={theme.palette.success.main}>
                    {country?.prefix + '' + discountRate?.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.grey[500]}>Tax:</Typography>
                  <Typography>{country?.prefix + '' + taxRate?.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1">Grand Total:</Typography>
                  <Typography variant="subtitle1">
                    {total % 1 === 0 ? country?.prefix + '' + total : country?.prefix + '' + total?.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Typography color="secondary">Notes: </Typography>
                <Typography>
                  If you have any queries, Please contact to Indocampass !
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
          <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.invoice_id}-${list?.customer_name}.pdf`}>
            <Button variant="contained" color="primary">
              Download
            </Button>
          </PDFDownloadLink>
        </Stack>
      </Stack>
    </MainCard>
  );
};

export default Details;

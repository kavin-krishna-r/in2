import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Chip
} from '@mui/material';


// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';
import Dropzone from 'react-dropzone';

const avatarImage = require.context('assets/images/users', true);

// constant
const getInitialValues = (customer) => {
  const newCustomer = {
    name: '',
    email: '',
    location: '',
    Board: ''
  };

  if (customer) {
    newCustomer.name = customer.fatherName;
    newCustomer.location = customer.address;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const allStatus = ['Central', 'State', 'International'];

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const AddCustomer = ({ customer, onCancel }) => {
  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const theme = useTheme();
  const isCreating = !customer;

  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(avatarImage(`./avatar-${isCreating && !customer?.avatar ? 1 : customer.avatar}.png`));
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
  };

  const handleDrop = (acceptedFiles) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const handleDeleteFile = (fileIndex) => {
    setUploadedFiles((prev) => prev.filter((_, index) => index !== fileIndex));
  };

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    state: Yup.string().max(255).required('state is required'),
    city: Yup.string().max(255).required('city is required'),
    board: Yup.string().required('Board is required'),
    about: Yup.string().required('About is required'),
    website: Yup.string().required('Website url is required'),
    ownership: Yup.string().required('Ownership url is required'),
    totalStudents: Yup.number().required('Total Students is required'),
    totalStaffs: Yup.number().required('Total Staffs is required'),
    subscriptionFee: Yup.number().required('Subscription Fee is required'),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    location: Yup.string().max(500)
  });

  const formik = useFormik({
    initialValues: getInitialValues(customer),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        // const newCustomer = {
        //   name: values.name,
        //   email: values.email,
        //   location: values.location,
        //   Board: values.Board
        // };

        if (customer) {
          // dispatch(updateCustomer(customer.id, newCustomer)); - update
          dispatch(
            openSnackbar({
              open: true,
              message: 'Customer update successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          // dispatch(createCustomer(newCustomer)); - add
          dispatch(
            openSnackbar({
              open: true,
              message: 'Customer add successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        }

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  return (
    <>
      <FormikProvider value={formik}>

        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{customer ? 'Edit Customer' : 'New Customer'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={3} md={2}>
                <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                  <FormLabel
                    htmlFor="change-avtar"
                    sx={{
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      '&:hover .MuiBox-root': { opacity: 1 },
                      cursor: 'pointer'
                    }}
                  >
                    <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Stack spacing={0.5} alignItems="center">
                        <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                        <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                      </Stack>
                    </Box>
                  </FormLabel>
                  <TextField
                    type="file"
                    id="change-avtar"
                    placeholder="Outlined"
                    variant="outlined"
                    sx={{ display: 'none' }}
                    onChange={(e) => setSelectedImage(e.target.files?.[0])}
                  />
                </Stack>
              </Grid>
              <Grid item xs={3} md={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="customer-name">Name</InputLabel>
                      <TextField
                        fullWidth
                        id="customer-name"
                        placeholder="Enter Institute Name"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="customer-email">Email</InputLabel>
                      <TextField
                        fullWidth
                        id="customer-email"
                        placeholder="Enter Customer Email"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25} >
                      <InputLabel htmlFor="customer-Board">Board</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          id="column-hiding"
                          displayEmpty
                          {...getFieldProps('board')}
                          onChange={(event) => setFieldValue('board', event.target.value)}
                          input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <Typography variant="subtitle1">Select Board</Typography>;
                            }

                            return <Typography variant="subtitle2">{selected}</Typography>;
                          }}
                        >
                          {allStatus.map((column) => (
                            <MenuItem key={column} value={column}>
                              <ListItemText primary={column} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {touched.board && errors.board && (
                        <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                          {errors.board}
                        </FormHelperText>
                      )}
                    </Stack>

                    <Stack spacing={1.25} sx={{ mt: 3 }}>
                      <InputLabel htmlFor="About">About</InputLabel>
                      <TextField placeholder="Enter Institute description" fullWidth multiline rows={2} />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} md={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="ownership">Ownership</InputLabel>
                      <TextField
                        fullWidth
                        id="ownership"
                        placeholder="Enter Ownership Name"
                        {...getFieldProps('ownership')}
                        error={Boolean(touched.ownership && errors.ownership)}
                        helperText={touched.ownership && errors.ownership}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="total-students">Total Students</InputLabel>
                      <TextField
                        fullWidth
                        id="total-students"
                        placeholder="Enter Total Students"
                        {...getFieldProps('totalStudents')}
                        error={Boolean(touched.totalStudents && errors.totalStudents)}
                        helperText={touched.totalStudents && errors.totalStudents}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="total-staffs">Total Staffs</InputLabel>
                      <TextField
                        fullWidth
                        id="total-staffs"
                        placeholder="Enter Total Staffs"
                        {...getFieldProps('totalStaffs')}
                        error={Boolean(touched.totalStaffs && errors.totalStaffs)}
                        helperText={touched.totalStaffs && errors.totalStaffs}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="customer-location">Location</InputLabel>
                      <TextField
                        fullWidth
                        id="customer-location"
                        multiline
                        rows={2}
                        placeholder="Enter Location"
                        {...getFieldProps('location')}
                        error={Boolean(touched.location && errors.location)}
                        helperText={touched.location && errors.location}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} md={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="subscription-fee">Subscription Fee</InputLabel>
                      <TextField
                        fullWidth
                        id="subscription-fee"
                        placeholder="Enter Subscription Fee"
                        {...getFieldProps('subscriptionFee')}
                        error={Boolean(touched.subscriptionFee && errors.subscriptionFee)}
                        helperText={touched.subscriptionFee && errors.subscriptionFee}
                      />
                    </Stack>
                    <Stack spacing={1.25}  sx={{ mt: 3 }}>
                      <InputLabel htmlFor="state">State</InputLabel>
                      <TextField
                        fullWidth
                        id="state"
                        placeholder="Enter State"
                        {...getFieldProps('state')}
                        error={Boolean(touched.state && errors.state)}
                        helperText={touched.state && errors.state}
                      />
                      </Stack>
                      <Stack spacing={1.25}  sx={{ mt: 3 }}>
                      <InputLabel htmlFor="city">City</InputLabel>
                      <TextField
                        fullWidth
                        id="city"
                        placeholder="Enter City"
                        {...getFieldProps('city')}
                        error={Boolean(touched.city && errors.city)}
                        helperText={touched.city && errors.city}
                      />
                    </Stack>
                    <Stack spacing={1.25}  sx={{ mt: 3 }}>
                      <InputLabel htmlFor="Website-Url">Website</InputLabel>
                      <TextField
                        fullWidth
                        id="Website-Url"
                        rows={2}
                        placeholder="Enter Website Url"
                        {...getFieldProps('website')}
                        error={Boolean(touched.website && errors.website)}
                        helperText={touched.website && errors.website}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <Box mt={3}>
                        <Typography variant="subtitle1" gutterBottom>
                          Upload Documents
                        </Typography>
                        <Dropzone onDrop={handleDrop} multiple>
                          {({ getRootProps, getInputProps }) => (
                            <Box
                              {...getRootProps()}
                              sx={{
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                padding: '16px',
                                textAlign: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <input {...getInputProps()} />
                              <Typography variant="body2" color="textSecondary">
                                Drag & drop files here, or click to select files
                              </Typography>
                            </Box>
                          )}
                        </Dropzone>

                        {uploadedFiles.length > 0 && (
                          <Box mt={2}>
                            <Typography variant="subtitle2" gutterBottom>
                              Uploaded Files:
                            </Typography>
                            <Stack direction="column" spacing={1}>
                              {uploadedFiles.map((file, index) => (
                                <Chip
                                  key={index}
                                  label={file.name}
                                  onDelete={() => handleDeleteFile(index)}
                                  deleteIcon={<DeleteFilled />}
                                  sx={{ justifyContent: 'space-between', paddingRight: 1 }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Box>

                    </Stack>
                  </Grid> */}
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {!isCreating && (
                  <Tooltip title="Delete Customer" placement="top">
                    <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                      <DeleteFilled />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {customer ? 'Edit' : 'Add'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>

      </FormikProvider>
      {!isCreating && <AlertCustomerDelete title={customer.fatherName} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

AddCustomer.propTypes = {
  customer: PropTypes.any,
  onCancel: PropTypes.func
};

export default AddCustomer;

import React, { useEffect, useRef, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Animated } from 'react-animated-css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { KeyboardDatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import SimpleTable from '~/components/Tables/SimpleTable';
import SingleAutoComplete from '~/components/Filters/SingleAutoComplete';
import {
  getCarsInfo,
  setActiveCars,
  setCars,
} from '~/components/MyOffers/OfferForm/actions';
import { getData } from '~/components/MyOffers/actions';

const headRows = [
  // todo добавить колонки станции аренды, возврата; цена; даты от, до
  { id: 'actions', name: 'Действия' },
  { id: 'vagon_number', name: 'Номер вагона' },
  { id: 'model', name: 'Модель вагона' },
  { id: 'date', name: 'Дата от' },
  { id: 'date2', name: 'Дата до' },
  { id: 'station_acceptance', name: 'Станция аренды' },
  { id: 'station_return', name: 'Станция возврата' },
  { id: 'price', name: 'Цена' },
  // { id: 'cargo_types', name: 'Типы перевозимых грузов' },
];

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  space: {
    paddingRight: '50px',
  },
  subMenu: {
    display: 'flex',
    flexDirection: 'row',
    width: '600px',
  },
  officeBody: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  infoFirst: {
    padding: theme.spacing(3),
    fontSize: '22px',
    fontWeight: '100',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '16px',
    padding: '24px',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  infoBody: {
    fontSize: '17px',
    paddingTop: '1px',
    paddingLeft: '5px',
    marginLeft: '10px',
    borderBottom: '1px solid #0000006b',
    width: '100%',
    maxWidth: '600px',
    color: '#0000006b',
    display: 'inline-block',
    overflowX: 'auto',
  },
  stepBody: {
    width: '100%',
  },
  paperBody: {
    margin: theme.spacing(3),
    marginTop: '10px',
    width: '100%',
    maxWidth: '1800px',
    height: '100%',
    marginBottom: '0px',
  },
  paperTableBody: {
    marginTop: '10px',
    width: '100%',
    height: '100%',
    maxWidth: '1800px',
    maxHeight: '300px',
    marginBottom: '15px',
  },
  tableBody: {
    height: '100%',
    maxHeight: '300px',
  },
  nextButton: {
    width: '50px',
    height: '50px',
    marginTop: 'auto',
    marginBottom: 'auto',
    color: 'grey',
  },
  infoHead: {
    fontSize: '18px',
    width: '100px',
    fontWeight: '100',
  },
  price: {
    width: '100%',
    maxWidth: '600px',
  },
  priceBody: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '16px',
    padding: '24px',
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
  },
  dateBody: {
    width: '100%',
    maxWidth: '600px',
    padding: '24px',
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
  },
  stationBody: {
    width: '100%',
    maxWidth: '600px',
    margin: '24px',
    marginLeft: '0px',
  },
  buttons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0px',
    marginLeft: '24px',
    maxWidth: '1800px',
    justifyContent: 'flex-end',
  },
  button: {
    margin: '24px',
    marginLeft: '0px',
  },
  code: {
    margin: '10px',
    marginTop: '0px',
    display: 'inline-block',
  },
  dialogButtons: {
    margin: '10px',
  },
  cargoTypesCheck: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function SecondStep(props) {
  const classes = useStyles();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(100);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);

  const [anchorElError, setAnchorElError] = useState(null);
  const [errMessage, setErrMessage] = useState('');

  // const { cars, activeCars, models, cargoTypes } = props.tableState;
  const [carsInfo, setCarsInfo] = useState([]);
  const [activeCars, setActiveCarsInfo] = useState([]);
  const [models, setModelsInfo] = useState([]);
  const [cargoTypes, setCargoTypes] = useState();
  const [tableStateFlag, setTableStateFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [editInfo, setEditInfo] = useState([]);
  // const [rows, setRows] = useState([]);
  // const [processedRows, setProcessedRows] = useState();
  const [selectedCargoTypes, setSelectedCargoTypes] = useState([]);
  const [disableCargoTypes, setDisableCargoTypes] = useState();
  const [cargoState, setCargoState] = useState(false);

  const options = ['Применить', 'Применить ко всем'];
  const [openButton, setOpenButton] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [date, setDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const [price, setPrice] = useState(0);
  const [stations, setStations] = useState([]);
  const [returnStations, setReturnStations] = useState([]);
  const [currentModel, setCurrentModel] = useState();

  function handleClick() {
    if (selectedIndex === 0) {
      const newCars = carsInfo.map((car) => {
        const newCar = { ...car };
        if (activeCars.includes(newCar.vagon_number)) {
          newCar.date = date && date.local().format('YYYY-MM-DD');
          newCar.date2 = date2 && date2.local().format('YYYY-MM-DD');
          newCar.price = price;
          newCar.station_acceptance = stations[1];
          newCar.station_return = returnStations[1];
          // console.log(cargoTypes); find
          const model = models.find((m) => m.code === currentModel);
          const cargos = model.cargo_types.map((cargoType) => cargoType.code);
          const allowedCargoTypes = selectedCargoTypes.map((cargoType) => {
            if (cargos.includes(cargoType)) {
              return cargoType;
            }
            return null;
          });
          newCar.selected_cargo_types = allowedCargoTypes;
        }
        return newCar;
      });
      setTableStateFlag(true);
      props.setCars(newCars);
    } else {
      const newCars = carsInfo.map((car) => {
        const newCar = { ...car };
        newCar.date = date && date.local().format('YYYY-MM-DD');
        newCar.date2 = date2 && date2.local().format('YYYY-MM-DD');
        newCar.price = price;
        newCar.station_acceptance = stations[1];
        newCar.station_return = returnStations[1];
        return newCar;
      });
      setTableStateFlag(true);
      props.setCars(newCars);
    }
    setSelectedCargoTypes([]);
    setCurrentModel();
    setOpenEdit(false);
  }

  function handleEditCar(vagonNumber, model) {
    setOpenEdit(true);
    setActiveCarsInfo([vagonNumber]);
    props.setActiveCars([vagonNumber]);
    setCurrentModel(model);
    const car = carsInfo.find((с) => с.vagon_number === vagonNumber);
    if (props.offerId) {
      setDate(dayjs(car.date));
      setDate2(dayjs(car.date2));
      setPrice(car.price);
      setStations([car.station_acceptance_name, car.station_acceptance]);
      setReturnStations([car.station_return_name, car.station_return]);
      if (car.selected_cargo_types) {
        setSelectedCargoTypes(car.selected_cargo_types);
      } else {
        const cModel = models.find((m) => m.code === model);
        const cargos = cModel.cargo_types.map((cargoType) => cargoType.code);
        setSelectedCargoTypes(cargos);
      }
    } else {
      setSelectedCargoTypes(car.selected_cargo_types);
    }
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpenButton(false);
  };

  const handleToggle = () => {
    setOpenButton((prevOpen) => !prevOpen);
  };

  const handleCloseButton = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setCurrentModel();
    setOpenButton(false);
  };
  // todo paginate props.cars

  useEffect(() => {
    if (selectedIndex === 0) {
      setDisableCargoTypes(false);
    } else {
      setDisableCargoTypes(true);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (editFlag) {
      const loadCars = editInfo.offer.cars;
      const loadOfferCars = editInfo.offer_cars;
      const newCars = loadCars.map((car) => {
        const newCar = { ...car };
        loadOfferCars.map((offerCar) => {
          if (newCar.vagon_number === offerCar.vagon_number) {
            newCar.date = offerCar.date_from;
            newCar.date2 = offerCar.date_till;
            newCar.price = offerCar.price;
            newCar.station_acceptance = offerCar.station_acceptance;
            newCar.station_acceptance_name = offerCar.station_acceptance_name;
            newCar.station_return = offerCar.station_return;
            newCar.station_return_name = offerCar.station_return_name;
            const cargos = offerCar.cargo_types.map(
              (cargoType) => cargoType.id,
            );
            newCar.selected_cargo_types = cargos;
          }
        });
        return newCar;
      });
      setCarsInfo(newCars);
      const editActiveCars = editInfo.offer.cars.map((car) => car.vagon_number);
      const cars = editActiveCars;
      axios
        .get(`./api/my_offers/get_cars_info`, { params: { cars } })
        .then((response) => {
          const { data } = response;
          setModelsInfo(data.models);
        });

      setActiveCarsInfo(editActiveCars);
      const cargoTypesCodes = editInfo.offer.cargo_types.map(
        (cargoType) => cargoType.name,
      );
      // setCargoTypesInfo(cargoTypesCodes);
    }
  }, [editInfo]);

  useEffect(() => {
    if (tableStateFlag) {
      if (props.offerId) {
        setCarsInfo(props.tableState.cars);
      } else {
        const newCars = props.tableState.cars.map((car) => {
          const newCar = { ...car };
          const cModel = props.tableState.models.find(
            (m) => m.code === car.model,
          );
          const cargos = cModel.cargo_types.map((cargoType) => cargoType.code);
          newCar.selected_cargo_types = cargos;
          return newCar;
        });
        setCarsInfo(newCars);
        setModelsInfo(props.tableState.models);
        setActiveCarsInfo(props.tableState.activeCars);
        // setCargoTypesInfo(props.tableState.cargoTypes);
      }
    }
  }, [props.tableState]);

  const rows = carsInfo;
  const processedRows = rows.map((r) => {
    // eslint-disable-next-line no-param-reassign
    r = { ...r };
    const { vagon_number } = r;
    const { model } = r;

    r.actions = (
      <>
        <Tooltip title="Редактировать">
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => {
              handleEditCar(vagon_number, model);
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </>
    );
    return r;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 36));
    setPage(0);
  };

  //    border-left: 3px solid #1de9b6 !important;
  const messages = {
    invalidDateMessage: 'Неверный формат даты',
    maxDateMessage: 'Дата не должна быть больше максимальной',
    minDateMessage: 'Дата не должна быть меньше минимальной',
  };

  const errDict = {
    'The given data was invalid.': 'Неверные данные.',
  };

  const openError = Boolean(anchorElError);
  const idError = openError ? 'simple-popover' : undefined;

  const handleCloseError = () => {
    setAnchorElError(null);
  };

  const handleStationsChange = (newValue) => {
    setStations(newValue);
  };

  const handleReturnStationsChange = (newValue) => {
    setReturnStations(newValue);
  };

  const today = dayjs().format('YYYY-MM-DD');

  const handlePriceChange = (event) => {
    const newPrice = event.target.value;
    setPrice(newPrice);
    // handleAttributeChange('price', newPrice)
  };

  function handleDateChange(value) {
    let tmp = null;
    if (value && value.isValid()) {
      // tmp = value.local().format('YYYY-MM-DD');
      tmp = value;
    }
    setDate(tmp);
  }

  function handleDateChange2(value) {
    let tmp = null;
    if (value && value.isValid()) {
      // tmp = value.local().format('YYYY-MM-DD');
      tmp = value;
    }
    setDate2(tmp);
  }

  const handleCreate = (event) => {
    const eventTarget = event.currentTarget;

    const offerCars = rows.map((car) => ({
      number: car.vagon_number,
      date: car.date,
      date2: car.date2,
      station_acceptance: car.station_acceptance,
      station_return: car.station_return,
      price: car.price,
      cargo_types: car.selected_cargo_types,
    }));

    if (props.offerId) {
      axios
        .post('/api/my_offers/edit', { id: props.offerId, cars: offerCars })
        .then((response) => {
          window.location.href = '/my_offers';
        })
        .catch((err) => {
          setErrMessage(errDict[err.response.data.message]);
          setAnchorElError(eventTarget);
        });
    } else {
      axios
        .post('/api/my_offers/new', { cars: offerCars })
        .then((response) => {
          props.offerCreatedCallback(response.data.id);
          enqueueSnackbar('Предложение создано', { variant: 'success' });
          props.getData();
          props.handleClose();
        })
        .catch((err) => {
          setErrMessage(errDict[err.response.data.message]);
          setAnchorElError(eventTarget);
        });
    }
    return null;
  };

  const handleCancel = () => {
    setCarsInfo([]);
    setModelsInfo([]);
    setActiveCarsInfo([]);
    props.handleClose();
    props.setStep(0);
  };

  useEffect(() => {
    setCarsInfo([]);
    setModelsInfo([]);
    setActiveCarsInfo([]);
    // setCargoTypesInfo([]);
    if (props.offerId) {
      setEditFlag(true);
      axios
        .get(`/api/my_offer/${props.offerId}`)
        .then((response) => {
          setEditInfo(response.data);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } else {
      setTableStateFlag(true);
      props.getCarsInfo();
    }
  }, [props.offerId]);

  const handleCargoChange = () => {
    setCargoState(!cargoState);
  };

  const handleCargoClick = (event, name) => {
    const selectedCargoIndex = selectedCargoTypes.indexOf(name);
    let newSelected = [];

    if (selectedCargoIndex === -1) {
      newSelected = newSelected.concat(selectedCargoTypes, name);
    } else if (selectedCargoIndex === 0) {
      newSelected = newSelected.concat(selectedCargoTypes.slice(1));
    } else if (selectedCargoIndex === selectedCargoTypes.length - 1) {
      newSelected = newSelected.concat(selectedCargoTypes.slice(0, -1));
    } else if (selectedCargoIndex > 0) {
      newSelected = newSelected.concat(
        selectedCargoTypes.slice(0, selectedCargoIndex),
        selectedCargoTypes.slice(selectedCargoIndex + 1),
      );
    }

    setSelectedCargoTypes(newSelected);
  };
  const isSelected = (name) => selectedCargoTypes.indexOf(name) !== -1;
  const model = models.find((m) => m.code === currentModel);
  return (
    <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible>
      <div className={classes.space}>
        <Typography variant="subtitle1">
          <div className={classes.infoFirst}>
            Введите параметры предложения.
          </div>
        </Typography>
        <div className={classes.stepBody}>
          <Typography className={classes.info} variant="subtitle1">
            <div className={classes.infoHead}>Модели:</div>
            <div className={classes.infoBody}>
              {models &&
                models.map((model) => (
                  <div className={classes.code}>#{model.code}</div>
                ))}
            </div>
          </Typography>
          <Dialog
            open={openEdit}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Данные предложения</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Введите данные предложения для выбранного вагоны или примените
                изменения ко всем.
              </DialogContentText>
              <div className={classes.stationBody}>
                <SingleAutoComplete
                  className={classes.stationBody}
                  url="/api/search/stations"
                  label="Станция аренды"
                  name="stations"
                  value={stations}
                  setValue={handleStationsChange}
                />
              </div>
              <div className={classes.stationBody}>
                <SingleAutoComplete
                  className={classes.stationBody}
                  url="/api/search/stations"
                  label="Станция возврата"
                  name="stations"
                  value={returnStations}
                  setValue={handleReturnStationsChange}
                />
              </div>
              <div className={classes.cargoTypesCheck}>
                <Checkbox
                  checked={cargoState}
                  onChange={() => {
                    handleCargoChange();
                  }}
                  name="cargo"
                  color="primary"
                  disabled={disableCargoTypes}
                />
                <Typography variant="body2">
                  Редактирование разрешенных грузов
                </Typography>
              </div>
              {cargoState === true ? (
                <div className={classes.paperTableBody}>
                  <TableContainer
                    className={classes.tableBody}
                    component={Paper}
                  >
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align="left">Грузы</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {model
                          ? model.cargo_types.map((cargoType, index) => {
                              const isItemSelected = isSelected(cargoType.code);
                              const labelId = `enhanced-table-checkbox-${index}`;
                              return (
                                <TableRow
                                  role="checkbox"
                                  hover
                                  onClick={(event) =>
                                    handleCargoClick(event, cargoType.code)
                                  }
                                  key={cargoType.code}
                                  aria-checked={isItemSelected}
                                  tabIndex={-1}
                                  selected={isItemSelected}
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      defaultChecked
                                      color="primary"
                                      checked={isItemSelected}
                                      inputProps={{
                                        'aria-labelledby': labelId,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      {cargoType.code} {cargoType.name}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ) : (
                <></>
              )}
              <Typography className={classes.priceBody} variant="subtitle1">
                <div className={classes.infoHead}>Цена, ₽:</div>
                <TextField
                  className={classes.price}
                  fullWidth
                  autoComplete="off"
                  onChange={handlePriceChange}
                  value={price}
                />
              </Typography>
              <Grid
                className={classes.dateBody}
                container
                spacing={2}
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography id="date_min" gutterBottom>
                    Дата от
                  </Typography>
                  <KeyboardDatePicker
                    autoOk
                    format="DD.MM.YYYY"
                    variant="inline"
                    initialFocusedDate={today}
                    value={date && date.local().format('YYYY-MM-DD')}
                    onChange={handleDateChange}
                    // minDate={id ? null : today}
                    maxDate={(date2 && date2.subtract(1, 'day')) || undefined}
                    invalidDateMessage={messages.invalidDateMessage}
                    maxDateMessage={messages.maxDateMessage}
                    minDateMessage={messages.minDateMessage}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography id="date_max" gutterBottom>
                    Дата до
                  </Typography>
                  <KeyboardDatePicker
                    autoOk
                    format="DD.MM.YYYY"
                    variant="inline"
                    initialFocusedDate={today}
                    value={date2 && date2.local().format('YYYY-MM-DD')}
                    onChange={handleDateChange2}
                    minDate={(date && date.add(1, 'day')) || undefined}
                    // maxDate={today}
                    invalidDateMessage={messages.invalidDateMessage}
                    maxDateMessage={messages.maxDateMessage}
                    minDateMessage={messages.minDateMessage}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogButtons}>
              <Button onClick={handleClose} color="primary">
                Отмена
              </Button>
              <ButtonGroup
                variant="contained"
                color="primary"
                ref={anchorRef}
                aria-label="split button"
              >
                <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                <Button
                  color="primary"
                  size="small"
                  disabled={cargoState}
                  aria-controls={openButton ? 'split-button-menu' : undefined}
                  aria-expanded={openButton ? 'true' : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
                open={openButton}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleCloseButton}>
                        <MenuList id="split-button-menu">
                          {options.map((option, index) => (
                            <MenuItem
                              key={option}
                              disabled={index === 2}
                              selected={index === selectedIndex}
                              onClick={(event) =>
                                handleMenuItemClick(event, index)
                              }
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </DialogActions>
          </Dialog>
          <div className={classes.paperBody}>
            <SimpleTable
              loading={loading}
              headRows={headRows}
              rows={processedRows}
              page={page}
              perPage={perPage}
              total={total}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </div>
        <div className={classes.buttons}>
          <Button
            className={classes.button}
            onClick={handleCancel}
            color="primary"
            variant="contained"
          >
            Отмена
          </Button>
          <Button
            className={classes.button}
            onClick={handleCreate}
            color="secondary"
            variant="contained"
            aria-describedby={idError}
          >
            Сохранить
          </Button>
          <Popover
            id={idError}
            open={openError}
            anchorEl={anchorElError}
            onClose={handleCloseError}
          >
            <Alert variant="filled" severity="error">
              <AlertTitle>Ошибка</AlertTitle>
              Не получилось создать предложение — <strong>{errMessage}</strong>
            </Alert>
          </Popover>
        </div>
      </div>
    </Animated>
  );
}

SecondStep.propTypes = {
  tableState: PropTypes.object.isRequired,
  getCarsInfo: PropTypes.func.isRequired,
  setCars: PropTypes.func.isRequired,
  setActiveCars: PropTypes.func.isRequired,
  openEdit: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  offerCreatedCallback: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tableState: state.offerForm,
});

const mapDispatchToProps = (dispatch) => ({
  getData: () => dispatch(getData()),
  getCarsInfo: () => dispatch(getCarsInfo()),
  setActiveCars: (cars) => dispatch(setActiveCars(cars)),
  setCars: (cars) => dispatch(setCars(cars)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SecondStep);

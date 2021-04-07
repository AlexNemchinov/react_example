import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {
  getData,
  search,
  setFilters,
  setSelectedData,
} from '~/components/MyOffers/actions';
import SecondStep from '~/components/MyOffers/OfferForm/SecondStep';
import FirstStep from '~/components/MyOffers/OfferForm/FirstStep';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function getStepContent(
  step,
  setStep,
  handleClose,
  offerId,
  openEdit,
  offerCreatedCallback,
) {
  switch (step) {
    case 0:
      return <FirstStep step={step} setStep={setStep} />;
    case 1:
      return (
        <SecondStep
          offerId={offerId}
          handleClose={handleClose}
          setStep={setStep}
          openEdit={openEdit}
          offerCreatedCallback={offerCreatedCallback}
        />
      );
    default:
      throw new Error('Unknown step');
  }
}

function OfferForm(props) {
  const classes = useStyles();

  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [createdOfferId, setCreatedOfferId] = useState();

  const handlePublish = () => {
    setPublishDialogOpen(false);
    props.publish(createdOfferId);
  };

  const handleClose = () => {
    props.handleClose(false);
    props.setStep(0);
  };

  const offerCreatedCallback = (offerId) => {
    setCreatedOfferId(offerId);
    setPublishDialogOpen(true);
  };

  return (
    <>
      <Dialog
        fullScreen
        open={props.open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {getStepContent(
          props.step,
          props.setStep,
          props.handleClose,
          props.offerId,
          props.openEdit,
          offerCreatedCallback,
        )}
      </Dialog>
      <Dialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        aria-labelledby="publish-dialog-title"
      >
        <DialogTitle id="publish-dialog-title">Публикация</DialogTitle>
        <DialogContent className={classes.form}>
          <DialogContentText>
            Черновик предложения сохранен в системе. Хотите опубликовать его
            сейчас?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPublishDialogOpen(false)}
            color="primary"
            variant="contained"
          >
            Нет
          </Button>
          <Button onClick={handlePublish} color="secondary" variant="contained">
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

OfferForm.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  openEdit: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  offerId: PropTypes.number,
  publish: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tableState: state.offerForm,
});

const mapDispatchToProps = (dispatch) => ({
  getData: (page, perPage, orderBy, order) =>
    dispatch(getData(page, perPage, orderBy, order)),
  search: (field, q, selected, callback) =>
    dispatch(search(field, q, selected, callback)),
  setSelectedData: (field, data) => dispatch(setSelectedData(field, data)),
  setFilters: (filters) => dispatch(setFilters(filters)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(OfferForm));

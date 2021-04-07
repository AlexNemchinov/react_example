import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectCars from '~/components/SelectCars';
// SelectCars отдельный компонент, где задаются activeCars

const useStyles = makeStyles(theme => ({
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
  info: {
    padding: theme.spacing(3),
    fontSize: '22px',
    fontWeight: '100',
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
  },
  stepBody: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingRight: '100px',
  },
  paperBody: {
    padding: theme.spacing(2),
    margin: theme.spacing(3),
    marginTop: '10px',
    width: '100%',
    height: '100%',
  },
  nextButton: {
    marginTop: '180px',
    marginBottom: 'auto',
    height: '70px',
    position: 'fixed',
    right: '45px',
  },
  firstStepHead: {
    margin: '24px',
    marginBottom: '0px',
    fontSize: '2rem',
  },
}));

const limit = 100;

function FirstStep(props) {
  const classes = useStyles();

  const handleNext = () => {
    props.setStep(1);
  };

  const count = props.selectCars.cars && props.selectCars.cars.length;

  return (
    <div className={classes.space}>
      <Typography className={classes.firstStepHead} variant="h3">
        Выберите вагоны
      </Typography>
      <Typography variant="subtitle1">
        <div className={classes.info}>
          Одно предложение может содержать максимум {limit} вагонов. Выбрано{' '}
          {count}.
        </div>
      </Typography>
      <div className={classes.stepBody}>
        <Paper className={classes.paperBody}>
          <SelectCars
          // selected={props.selected}
          // setSelected={props.setSelected}
          />
        </Paper>
        <Button
          disabled={count === 0 || count > limit}
          onClick={handleNext}
          variant="outlined"
          color="primary"
          className={classes.nextButton}
        >
          <ArrowForwardIosRoundedIcon />
        </Button>
      </div>
    </div>
  );
}

FirstStep.propTypes = {
  setStep: PropTypes.func.isRequired,
  selectCars: PropTypes.object.isRequired,
  // selected: PropTypes.array.isRequired,
  // setSelected: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectCars: state.selectCars,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep);

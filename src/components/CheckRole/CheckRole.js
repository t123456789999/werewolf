/* eslint-disable jsx-a11y/alt-text */
import React, {
  useState,
} from 'react';
import { useTranslation } from "react-i18next";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import wolf from '../../static/images/wolf.png';
import wolf_king from '../../static/images/wolf_king.png';
import predictor from '../../static/images/seer.png';
import witch from '../../static/images/witch.png';
import hunter from '../../static/images/hunter.png';
import knight from '../../static/images/knight.png';
import idiot from '../../static/images/idiot.png';
import villager from '../../static/images/villager.png';
import guard from '../../static/images/guard.png';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '15px',
    marginTop: '20px',
    color: '#fff',
  },
  title: {
    color: '#ffeb3b',
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    textAlign: 'center',
    textShadow: '0 0 10px rgba(255, 235, 59, 0.5)',
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
    transition: '0.3s',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      borderColor: '#ffeb3b',
      boxShadow: '0 5px 15px rgba(255, 235, 59, 0.3)',
    },
  },
  cardChecked: {
    backgroundColor: '#1a1a1a',
    borderColor: '#4caf50',
    opacity: 0.8,
  },
  icon: {
    fontSize: '40px',
    marginBottom: theme.spacing(1),
  },
  checkedIcon: {
    color: '#4caf50',
  },
  uncheckIcon: {
    color: '#ffeb3b',
  },
  dialogPaper: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: '2px solid #ffeb3b',
    borderRadius: '15px',
  },
  dialogTitle: {
    color: '#ffeb3b',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  roleName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  roleImg: {
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  startBtn: {
    marginTop: '40px',
    padding: '12px 60px',
    fontSize: '1.2rem',
    background: 'linear-gradient(45deg, #f44336 30%, #ffeb3b 90%)',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  }
}));

const RoleCard = (props) => {
  const { sit } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  const [isWatch, setIsWatch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isWatch) {
      setIsOpen(true);
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setIsWatch(true);
  }

  let src = null;
  switch(sit.role.key) {
    case 'wolf': src = wolf; break;
    case 'wolf_king': src = wolf_king; break;
    case 'predictor': src = predictor; break;
    case 'witch': src = witch; break;
    case 'hunter': src = hunter; break;
    case 'knight': src = knight; break;
    case 'idiot': src = idiot; break;
    case 'villager': src = villager; break;
    case 'guard': src = guard; break;
    default: src = villager; break;
  };

  return (
    <>
      <Paper 
        className={`${classes.card} ${isWatch ? classes.cardChecked : ''}`} 
        onClick={handleClick}
      >
        {isWatch ? (
          <CheckCircleIcon className={`${classes.icon} ${classes.checkedIcon}`} />
        ) : (
          <HelpOutlineIcon className={`${classes.icon} ${classes.uncheckIcon}`} />
        )}
        <Typography variant="h6">
          { t('sit_number', { index: sit.index }) }
        </Typography>
        <Typography variant="body2">
          { isWatch ? t('is_checked') : t('check_role') }
        </Typography>
      </Paper>

      <Dialog
        fullWidth
        open={isOpen}
        classes={{ paper: classes.dialogPaper }}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
          {t('your_role')}
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <img src={src} className={classes.roleImg} width="80%" />
          <div className={classes.roleName}>
            { t(sit.role.key) }
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
          <Button onClick={handleClose} color="primary" variant="contained" style={{ backgroundColor: '#ffeb3b', color: '#000', fontWeight: 'bold' }}>
            { t('confirm') }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const CheckRole = (props) => {
  const { t } = useTranslation();
  const { list, handleStartGame } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        { t('check_role_title', '確認身分') }
      </Typography>
      
      <Grid container spacing={3} justify="center">
        {
          list.map((sit, index) => {
            return (
              <Grid item xs={6} sm={4} md={3} key={`role_${index}`}>
                <RoleCard sit={sit} />
              </Grid>
            )
          })
        }
      </Grid>

      <div style={{ textAlign: 'center' }}>
        <Button 
          className={classes.startBtn}
          onClick={handleStartGame} 
          variant="contained"
        >
          {t('start')}
        </Button>
      </div>
    </Paper>
  );
};

export default CheckRole;

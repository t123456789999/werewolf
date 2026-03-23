import React, {
  Fragment
} from 'react';
import { useTranslation } from "react-i18next";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import clsx from 'clsx';

import wolf from '../../static/images/wolf.png';
import wolf_king from '../../static/images/wolf_king.png';
import predictor from '../../static/images/predictor.png';
import witch from '../../static/images/witch.png';
import hunter from '../../static/images/hunter.png';
import knight from '../../static/images/knight.png';
import idiot from '../../static/images/idiot.png';
import villager from '../../static/images/villager.png';
import guard from '../../static/images/guard.png';

import {
  WOLF_KING,
  PREDICTOR,
  WITCH,
  HUNTER,
  KNIGHT,
  idiot as IDIOT_ROLE,
  GUARD,
} from '../../constants/Role';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 3),
    backgroundColor: '#dcb07a', // Kraft paper color
    backgroundImage: 'radial-gradient(#c29a6a 1px, transparent 0)',
    backgroundSize: '20px 20px',
    color: '#3e2723', // Dark brown text
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.3)',
    fontFamily: '"Times New Roman", serif',
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
    color: '#3e2723',
    fontWeight: 'bold',
    borderBottom: '2px solid #8d6e63',
    paddingBottom: theme.spacing(1),
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    '& label': {
      color: '#3e2723',
      fontWeight: 'bold',
      fontSize: '1.1rem',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#8d6e63',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#3e2723',
    },
    '& select': {
      color: '#3e2723',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      marginTop: theme.spacing(3),
      padding: '8px',
      borderRadius: '4px',
      '& option': {
        backgroundColor: '#dcb07a',
        color: '#3e2723',
      },
    },
  },
  card: {
    maxWidth: 160,
    margin: '15px auto',
    backgroundColor: '#f5e6d3', // Light parchment
    color: '#3e2723',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    border: '4px solid #8d6e63',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    position: 'relative',
    overflow: 'visible',
    '&:hover': {
      transform: 'translateY(-10px) rotate(2deg)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
    },
  },
  cardSelected: {
    borderColor: '#b71c1c', // Wax seal red
    boxShadow: '0 0 20px rgba(183, 28, 28, 0.4)',
    transform: 'scale(1.08) !important',
    '&:after': {
      content: '"✓"',
      position: 'absolute',
      top: '-15px',
      right: '-15px',
      width: '40px',
      height: '40px',
      backgroundColor: '#b71c1c',
      color: '#fff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
      zIndex: 10,
    }
  },
  cardMedia: {
    height: 160,
    backgroundSize: 'cover',
    borderBottom: '2px solid #8d6e63',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '12px 4px !important',
    backgroundColor: '#f5e6d3',
  },
  finishedBtn: {
    marginTop: '50px',
    marginBottom: '40px',
    padding: '12px 60px',
    fontSize: '1.4rem',
    background: '#b71c1c', // Crimson red like a wax seal
    color: 'white',
    borderRadius: '50px',
    fontWeight: 'bold',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
    border: '2px solid #8d6e63',
    transition: 'all 0.3s',
    '&:hover': {
      background: '#d32f2f',
      transform: 'scale(1.05)',
      boxShadow: '0 15px 25px rgba(0,0,0,0.4)',
    },
  },
  gridContainer: {
    marginBottom: theme.spacing(6),
  }
}));

const Setting = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    playerNumber,
    setPlayerNumber,
    wolfNumber,
    setWolfNumber,
    isUsePredictor,
    setIsUsePredictor,
    isUseWitch,
    setIsUseWitch,
    isUseHunter,
    setIsUseHunter,
    handleStart,
    isKillKind,
    setIsKillKind,
    isUseKnight,
    setIsUseKnight,
    isUseidiot,
    setIsUseidiot,
    isUseGuard,
    setIsUseGuard,
    isUseWolfKing,
    setIsUseWolfKing,
    isMirror,
    setIsMirror,
  } = props;

  const RoleCard = ({ role, isUsed, toggleFunc }) => {
    let roleImg = null;
    switch(role.key) {
      case 'wolf': roleImg = wolf; break;
      case 'wolf_king': roleImg = wolf_king; break;
      case 'predictor': roleImg = predictor; break;
      case 'witch': roleImg = witch; break;
      case 'hunter': roleImg = hunter; break;
      case 'knight': roleImg = knight; break;
      case 'idiot': roleImg = idiot; break;
      case 'villager': roleImg = villager; break;
      case 'guard': roleImg = guard; break;
      default: roleImg = villager; break;
    }
    return (
      <Card 
        className={clsx(classes.card, isUsed && classes.cardSelected)}
        onClick={() => toggleFunc(!isUsed)}
      >
        <CardActionArea>
          <CardMedia
            className={classes.cardMedia}
            image={roleImg}
            title={t(role.key)}
          />
          <CardContent className={classes.cardTitle}>
            <Typography variant="body2" component="p">
              {t(role.key)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  const handleStartGame = () => {
    // 1. 控管神職數量
    let godCount = 0;
    if (isUsePredictor) godCount++;
    if (isUseWitch) godCount++;
    if (isUseHunter) godCount++;
    if (isUseGuard) godCount++;
    if (isUseKnight) godCount++;
    if (isUseidiot) godCount++;

    const maxGods = playerNumber - wolfNumber;
    if (godCount > maxGods) {
      alert(`神職選取過多！${playerNumber}人局且有${wolfNumber}隻狼時，神職最多只能選 ${maxGods} 個。 (目前選了 ${godCount} 個)`);
      return;
    }

    // 2. 控管特殊狼人數量
    let specialWolfCount = 0;
    if (isUseWolfKing) specialWolfCount++;

    if (specialWolfCount > wolfNumber) {
      alert(`特殊狼人選取過多！狼人總數只有 ${wolfNumber} 隻，特殊狼人不能超過這個數量。`);
      return;
    }

    handleStart();
  };

  return (
    <Fragment>
      <Paper className={classes.root}>
        {/* Section 1: Game Settings */}
        <Typography variant="h5" className={classes.sectionTitle}>
          {t('game_setting', '遊戲設定')}
        </Typography>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={6} sm={3}>
            <FormControl className={classes.formControl}>
              <InputLabel>{t('player_number')}</InputLabel>
              <NativeSelect
                value={playerNumber}
                onChange={(e) => setPlayerNumber(e.target.value * 1)}
              >
                {[6, 7, 8, 9, 10, 11, 12].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl className={classes.formControl}>
              <InputLabel>{t('wolf_number')}</InputLabel>
              <NativeSelect
                value={wolfNumber}
                onChange={(e) => setWolfNumber(e.target.value * 1)}
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl className={classes.formControl}>
              <InputLabel>{t('is_kill_kind')}</InputLabel>
              <NativeSelect
                value={isKillKind}
                onChange={(e) => setIsKillKind(e.target.value === 'true')}
              >
                <option value={true}>{t('yes')}</option>
                <option value={false}>{t('no')}</option>
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl className={classes.formControl}>
              <InputLabel>{t('is_mirror')}</InputLabel>
              <NativeSelect
                value={isMirror}
                onChange={(e) => setIsMirror(e.target.value === 'true')}
              >
                <option value={true}>{t('yes')}</option>
                <option value={false}>{t('no')}</option>
              </NativeSelect>
            </FormControl>
          </Grid>
        </Grid>

        {/* Section 2: Wolf Special Roles */}
        <Typography variant="h5" className={classes.sectionTitle}>
          {t('wolf_roles', '選擇狼人特殊身份')}
        </Typography>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={4} sm={2}>
            <RoleCard 
              role={WOLF_KING} 
              isUsed={isUseWolfKing} 
              toggleFunc={setIsUseWolfKing} 
            />
          </Grid>
        </Grid>

        {/* Section 3: God Roles */}
        <Typography variant="h5" className={classes.sectionTitle}>
          {t('god_roles', '選擇神職特殊身份')}
        </Typography>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={4} sm={2}>
            <RoleCard role={PREDICTOR} isUsed={isUsePredictor} toggleFunc={setIsUsePredictor} />
          </Grid>
          <Grid item xs={4} sm={2}>
            <RoleCard role={WITCH} isUsed={isUseWitch} toggleFunc={setIsUseWitch} />
          </Grid>
          <Grid item xs={4} sm={2}>
            <RoleCard role={HUNTER} isUsed={isUseHunter} toggleFunc={setIsUseHunter} />
          </Grid>
          <Grid item xs={4} sm={2}>
            <RoleCard role={GUARD} isUsed={isUseGuard} toggleFunc={setIsUseGuard} />
          </Grid>
          <Grid item xs={4} sm={2}>
            <RoleCard role={KNIGHT} isUsed={isUseKnight} toggleFunc={setIsUseKnight} />
          </Grid>
          <Grid item xs={4} sm={2}>
            <RoleCard role={IDIOT_ROLE} isUsed={isUseidiot} toggleFunc={setIsUseidiot} />
          </Grid>
        </Grid>

        <Divider style={{ backgroundColor: '#555' }} />
        <div style={{ textAlign: 'center' }}>
          <Button 
            className={classes.finishedBtn}
            onClick={handleStartGame} 
            variant="contained"
          >
            {t('finished')}
          </Button>
        </div>
      </Paper>
    </Fragment>
  );
};

export default Setting;

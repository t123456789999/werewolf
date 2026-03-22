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

import {
  WOLF_KING,
  PREDICTOR,
  WITCH,
  HUNTER,
  KNIGHT,
  idiot,
  GUARD,
} from '../../constants/Role';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    marginTop: '20px',
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    color: '#ffeb3b',
    fontWeight: 'bold',
    borderLeft: '5px solid #ffeb3b',
    paddingLeft: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    '& label': {
      color: '#ffeb3b', // 改為亮黃色，與背景完全區隔
      fontWeight: 'bold',
      fontSize: '1.1rem',
    },
    '& select': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginTop: theme.spacing(3),
      padding: '5px',
      '& option': {
        backgroundColor: '#fff', // 改為白底
        color: '#000', // 黑字
      },
    },
  },
  card: {
    maxWidth: 150,
    margin: '10px auto',
    backgroundColor: '#333',
    color: '#fff',
    transition: '0.3s',
    border: '2px solid transparent',
  },
  cardSelected: {
    borderColor: '#ffeb3b',
    boxShadow: '0 0 15px #ffeb3b',
    transform: 'scale(1.05)',
  },
  cardMedia: {
    height: 140,
    backgroundSize: 'contain',
  },
  cardTitle: {
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '8px 4px !important',
  },
  finishedBtn: {
    marginTop: '40px',
    marginBottom: '40px',
    padding: '10px 50px',
    fontSize: '1.2rem',
    background: 'linear-gradient(45deg, #f44336 30%, #ffeb3b 90%)',
    color: 'white',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  gridContainer: {
    marginBottom: theme.spacing(4),
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
    const roleImg = require(`../../static/images/${role.src}`);
    return (
      <Card 
        className={clsx(classes.card, isUsed && classes.cardSelected)}
        onClick={() => toggleFunc(!isUsed)}
      >
        <CardActionArea>
          <CardMedia
            className={classes.cardMedia}
            image={roleImg.default || roleImg}
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
            <RoleCard role={idiot} isUsed={isUseidiot} toggleFunc={setIsUseidiot} />
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

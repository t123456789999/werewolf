import React, {
  useState,
  useMemo,
  useCallback,
} from 'react';
import Sound from 'react-sound';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import {
  pink,
} from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { useTranslation } from "react-i18next";

import {
  WOLF,
  PREDICTOR,
  WITCH,
  HUNTER,
  KNIGHT,
  idiot,
  VILLAGER,
  GUARD,
  WOLF_KING,
} from '../../constants/Role';

import step1 from '../../static/audio/step_1.mp3'; // 天黑請閉眼
import step2 from '../../static/audio/step_2.mp3'; // 狼人現身請睜眼
import step3 from '../../static/audio/step_3.mp3'; // 狼人確認彼此的身份
import step4 from '../../static/audio/step_4.mp3'; // 狼人請殺人
import step5 from '../../static/audio/step_5.mp3'; // 狼人請閉眼
import step6 from '../../static/audio/step_6.mp3'; // 女巫請睜眼
import step7 from '../../static/audio/step_7.mp3'; // 這位玩家被殺死了
import step8 from '../../static/audio/step_8.mp3'; // 你要使用解藥嗎
import step9 from '../../static/audio/step_9.mp3'; // 你要使用毒藥嗎
import step10 from '../../static/audio/step_10.mp3'; // 你要毒誰呢
import step11 from '../../static/audio/step_11.mp3'; // 女巫請閉眼
import step12 from '../../static/audio/step_12.mp3'; // 預言家請睜眼
import step13 from '../../static/audio/step_13.mp3'; // 你要查驗的對象是
import step14 from '../../static/audio/step_14.mp3'; // 他的身份是
import step15 from '../../static/audio/step_15.mp3'; // 預言家請閉眼
import step16 from '../../static/audio/step_16.mp3'; // 獵人請睜眼
import step17 from '../../static/audio/step_17.mp3'; // 獵人請閉眼
import step18 from '../../static/audio/step_18.mp3'; // 騎士請睜眼
import step19 from '../../static/audio/step_19.mp3'; // 騎士請閉眼
import step20 from '../../static/audio/step_20.mp3'; // 白癡請睜眼
import step21 from '../../static/audio/step_21.mp3'; // 白癡請閉眼
import step22 from '../../static/audio/step_22.mp3'; // 天亮請睜眼

// 新增守衛語音 (請替換為正確的檔案)
const step30 = step1; // 守衛請睜眼
const step31 = step1; // 你要守護的對象是
const step32 = step1; // 守衛請閉眼

/**
 * IS_DEBUG
 * 是否開啟 console.log 資訊
 * 
 */
const IS_DEBUG = true;

/**
 * DAY_TYPE
 * 白天, 晚上
 * 
 */
const DAY_TYPE = {
  DAY: 'DAY',
  NIGHT: 'NIGHT',
}

const AudioSound = React.memo((props) => {
  const {
    url,
    onFinishedPlaying,
  } = props;

  return (
    <Sound
      url={url}
      playStatus={Sound.status.PLAYING}
      // onLoading={this.handleSongLoading}
      // onPlaying={this.handleSongPlaying}
      onFinishedPlaying={onFinishedPlaying}
    />
  );
});

const useStyles = makeStyles({
  avatar: {
    margin: 7,
    color: '#fff',
    backgroundColor: '#4DB6AC',
    width: '40px',
    height: '40px',
  },
  pinkAvatar: {
    margin: 7,
    color: '#fff',
    backgroundColor: pink[500],
    width: '40px',
    height: '40px',
  },
  dead: {
    margin: 7,
    color: '#fff',
    backgroundColor: '#9E9E9E',
    width: '40px',
    height: '40px',
  },
  number: {
    fontSize: '25px',
  },
  good: {
    fontSize: '30px',
  },
  bad: {
    fontSize: '30px',
    color: 'red',
  },
  // greenAvatar: {
  //   margin: 10,
  //   color: '#fff',
  //   backgroundColor: green[500],
  // },
});

const Game = (props) => {
  const classes = useStyles();
  const {
    list,
    isUsePredictor,
    isUseWitch,
    isUseHunter,
    playerNumber,
    wolfNumber,
    isKillKind,
    isUseKnight,
    isUseidiot,
    isMirror,
    isUseGuard, // 假設外部會傳入是否使用守衛
    isUseWolfKing,
  } = props;

  if (IS_DEBUG) {
    // console.log('list', list);
    console.log('===== Role List =====');
    list.forEach(tmp => { console.log(`${tmp.index} - ${tmp.role.key}`); });
    console.log('=====================');
  }

  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isOpenWolfKill, setIsOpenWolfKill] = useState(false);
  const [deadNumber, setDeadNumber] = useState(null); // 狼人晚上殺人的
  const [witchDeadNumber, setWitchDeadNumber] = useState(null); // 女巫毒的角色
  const [isOpenWitchSave, setIsOpenWitchSave] = useState(false); // 解藥詢問 視窗
  const [isOpenWitchPoison, setIsOpenWitchPoison] = useState(false); // 毒藥詢問 視窗
  const [isUse, setIsUse] = useState(false); // 女巫一晚只能使用一種藥
  const [isUseSave, setIsUseSave] = useState(false); // 是否已使用解藥
  const [isUseSaveTonight, setIsUseSaveTonight] = useState(false); // 今晚是否已使用解藥 (用於判斷同守同救)
  const [isUsePoison, setIsUsePoison] = useState(false); // 是否已使用毒藥
  const [isOpenPredictor, setIsOpenPredictor] = useState(false); // 預言家選擇身份 視窗
  const [predictorSelect, setPredictorSelect] = useState(null); // 預言家選擇查驗的身份
  const [isOpenRole, setIsOpenRols] = useState(false); // 預言家查看身份 視窗
  const [isOpenResult, setIsOpenResult] = useState(false); // 晚上結果
  const [day, setDay] = useState(1); // 第幾天
  const [dayType, setDayType] = useState(DAY_TYPE.NIGHT); // 白天晚上
  const [messages, setMessages] = useState([]); // 遊戲訊息
  const [isUseWolfKingSkill, setIsUseWolfKingSkill] = useState(false); // 狼王是否已使用技能
  const [isOpenWolfKingShoot, setIsOpenWolfKingShoot] = useState(false); // 狼王射殺視窗

  const [isOpenVote, setIsOpenVote] = useState(false); // 投票視窗
  const [selectVote, setSelectVote] = useState(null); // 選擇投票的人
  const [dead, setDead] = useState([]); // 死亡的人
  const [isOpenGameResult, setIsOpenGameResult] = useState(false); // 是否開啟遊戲結束畫面
  const [gameResultMessage, setGameResultMessage] = useState(''); // 遊戲結束訊息
  const [isUseHunterSkill, setIsUseHunterSkill] = useState(false); // 獵人是否已使用技能
  const [hunterSelect, setHunterSelect] = useState(null); // 獵人選擇
  const [wolfKingSelect, setWolfKingSelect] = useState(null); // 狼王選擇
  const [isOpenHunter, setIsOpenHunter] = useState(false); // 是否開啟獵人視窗
  const [isKillByWitch, setIsKillByWitch] = useState(false); // 獵人是否被毒殺
  const [isOpenHunterShoot, setIsOpenHunterShoot] = useState(false); // 是否開啟獵人槍殺訊息
  const [isPredictorDead, setIsPredictorDead] = useState(false); // 預言家是否死亡
  const [isWitchDead, setIsWitchDead] = useState(false); // 女巫是否死亡
  const [isHunterDead, setIsHunterDead] = useState(false); // 獵人是否死亡
  const [isOpenLastWords, setIsOpenLastWords] = useState(false); // 遺言視窗
  const [isKnightDead, setIsKnightDead] = useState(false); // 騎士是否死亡
  const [isidiotDead, setIsidiotDead] = useState(false); // 白癡是否死亡
  const [isGuardDead, setIsGuardDead] = useState(false); // 守衛是否死亡

  const [isOpenGuard, setIsOpenGuard] = useState(false); // 守衛視窗
  const [guardProtect, setGuardProtect] = useState(null); // 守衛守護的對象
  const [lastGuardProtect, setLastGuardProtect] = useState(null); // 上一晚守衛守護的對象 (守衛不能連續兩晚守護同一人)

  const [isUseKnightSkill, setIsUseKnightSkill] = useState(false); // 騎士是否已實用技能
  const [isOpenKnight, setIsOpenKnight] = useState(false); // 開啟騎士選擇對象視窗
  const [knightSelect, setKnightSelect] = useState(null); // 騎士選擇
  const [isOpenKnightResult, setIsOpenKnightResult] = useState(false); // 騎士驗人結果
  const [isOpenidiotResult, setIsOpenidiotResult] = useState(false); // 放逐白癡結果
  const [isUseidiotSkill, setIsUseidiotSkill] = useState(false); // 白癡是否使用技能

  const [isShowMessage, setIsShowMessage] = useState(false); // 是否顯示夜晚訊息

  // console.log('isKillByWitch', isKillByWitch);
  // console.log('isUsePoison', isUsePoison);

  const handleSongFinishedPlaying = useCallback(() => {
    // setStep(step + 1);
    switch(step) {
      case 1:
        setStep(2);
        if (isUseGuard) {
            setStep(30); // 進入守衛階段
        } else {
            setStep(2);
        }
        break;
      case 2:
        setStep(3);
        break;
      case 3:
        setStep(4);
        break;
      case 4:
        // setStep(2);
        setIsOpenWolfKill(true);
        break;
      case 5:
        // 是否有使用女巫
        if (isUseWitch) {
          setStep(6);
        } else {
          // 是否使用預言家
          if (isUsePredictor) {
            setStep(12);
          } else {
            if (isUseHunter) {
              // 是否使用獵人
              setStep(16);
            } else {
              if (isUseKnight) {
                setStep(18);
              } else {
                if (isUseidiot) {
                  setStep(20);
                } else {
                  setStep(22);
                }
              }
            }
          }
        }
        break;
      case 6:
        setStep(7);
        break;
      case 7:
        if (!isWitchDead) {
          setIsOpenWitchSave(true);
        }
        setStep(8);
        break;
      case 8:
        if (isWitchDead) {
          setTimeout(() => {
            setStep(9)
          }, 2000);
        }
        break;
      case 9:
        if (!isWitchDead) {
          setIsOpenWitchPoison(true);
        }
        setStep(10);
        break;
      case 10:
        if (isWitchDead) {
          setTimeout(() => {
            setStep(11)
          }, 2000);
        }
        break;
      case 11:
        // 是否使用預言家
        if (isUsePredictor) {
          setStep(12);
        } else {
          if (isUseHunter) {
            // 是否使用獵人
            setStep(16);
          } else {
            if (isUseKnight) {
              setStep(18);
            } else {
              if (isUseidiot) {
                setStep(20);
              } else {
                setStep(22);
              }
            }
          }
        }
        // setStep(12);
        break;
      case 12:
        setStep(13);
        break;
      case 13:
        if (!isPredictorDead) {
          setIsOpenPredictor(true);
        } else {
          setTimeout(() => {
            setStep(14)
          }, 2000);
        }
        break;
      case 14:
        // setStep(15);
        if (isPredictorDead) {
          setTimeout(() => {
            setStep(15)
          }, 2000);
        }
        break;
      case 15:
        if (isUseHunter) {
          // 是否使用獵人
          setStep(16);
        } else {
          if (isUseKnight) {
            setStep(18);
          } else {
            if (isUseidiot) {
              setStep(20);
            } else {
              setStep(22);
            }
          }
        }
        break;
      case 16:
        if (!isHunterDead) {
          setIsOpenHunterShoot(true);
        } else {
          setTimeout(() => {
            setStep(17)
          }, 2000);
        }
        break;
      case 17:
        if (isUseKnight) {
          setStep(18);
        } else {
          if (isUseidiot) {
            setStep(20);
          } else {
            setStep(22);
          }
        }
        break;
      case 18:
        setStep(19);
        break;
      case 19:
        if (isUseidiot) {
          setStep(20);
        } else {
          setStep(22);
        }
        break;
      case 20:
        setStep(21);
        break;
      case 21:
          setStep(22);
        break;
      case 22:
        setIsOpenResult(true);
        break;
      case 30:
        setStep(31);
        break;
      case 31:
        if (!isGuardDead) {
            setIsOpenGuard(true);
        } else {
            setTimeout(() => setStep(32), 2000);
        }
        break;
      case 32:
        setStep(2); // 守衛結束，接狼人
        break;
      default:
    }
  }, [step]);

  /**
   * handleCloseWolfKill
   * 狼人殺人視窗
   * 
   */
  const handleCloseWolfKill = () => {
    setIsOpenWolfKill(false);
    setStep(5);
  }

  /**
   * handleWitchSave
   * 女巫是否使用解藥
   * 
   * @param {bool} isSave - true: 使用, false: 不使用
   */
  const handleWitchSave = (isSave) => {
    setIsOpenWitchSave(false);
    setStep(9);

    if (isSave) {
      // 使用解藥
      setTimeout(() => {
        setIsUse(true);
        setIsUseSave(true);
        setIsUseSaveTonight(true);
      }, 500);
    }
  }

  /**
   * handleWitchPoison
   * 關閉女巫是否使用毒藥
   * 
   * @param {bool} isPoison - true: 使用, false: 不使用
   */
  const handleWitchPoison = (isPoison) => {
    setIsOpenWitchPoison(false);
    setStep(11);

    if (!isUsePoison) {
      setTimeout(() => {
        setIsUsePoison(isPoison);
      }, 500);
    }

    if (!isPoison) {
      setWitchDeadNumber(null);
    } else {
      // 使用毒藥, 判斷是不是毒到獵人或狼王
      if (IS_DEBUG) {
        console.log('witchDeadNumber.role.key', witchDeadNumber.role.key);
      }
      if (witchDeadNumber !== null && (witchDeadNumber.role.key === HUNTER.key || witchDeadNumber.role.key === WOLF_KING.key)) {
        setIsKillByWitch(true);
      }
    }
  }

  /**
   * handlePredictor
   * 關閉預言家詢問視窗
   * 
   */
  const handlePredictor = () => {
    setIsOpenPredictor(false);
    setIsOpenRols(true);
    setStep(14);
  }

  /**
   * handleCloseCheckRole
   * 關閉預言家查驗身份結果
   * 
   */
  const handleCloseCheckRole = () => {
    setIsOpenRols(false);
    setStep(15);
  }

  /**
   * handleGuardProtect
   * 守衛守護
   */
  const handleGuardProtect = () => {
      setIsOpenGuard(false);
      setStep(32);
      
      // 如果有選擇守護對象，更新上一晚的紀錄
      if (guardProtect) {
          setLastGuardProtect(guardProtect);
      } else {
          setLastGuardProtect(null);
      }
  }

  /**
   * audioSrc
   * 取得音效檔
   * 
   */
  const audioSrc = useMemo(() => {
    let returnSrc = null;

    switch(step) {
      case 1:
        returnSrc = step1;
        break;
      case 2:
        returnSrc = step2;
        break;
      case 3:
        returnSrc = step3;
        break;
      case 4:
        returnSrc = step4;
        break;
      case 5:
        returnSrc = step5;
        break;
      case 6:
        returnSrc = step6;
        break;
      case 7:
        returnSrc = step7;
        break;
      case 8:
        returnSrc = step8;
        break;
      case 9:
        returnSrc = step9;
        break;
      case 10:
        returnSrc = step10;
        break;
      case 11:
        returnSrc = step11;
        break;
      case 12:
        returnSrc = step12;
        break;
      case 13:
        returnSrc = step13;
        break;
      case 14:
        returnSrc = step14;
        break;
      case 15:
        returnSrc = step15;
        break;
      case 16:
        returnSrc = step16;
        break;
      case 17:
        returnSrc = step17;
        break;
      case 18:
        returnSrc = step18;
        break;
      case 19:
          returnSrc = step19;
          break;
      case 20:
        returnSrc = step20;
        break;
      case 21:
        returnSrc = step21;
        break;
      case 22:
        returnSrc = step22;
        break;
      case 30:
        returnSrc = step30;
        break;
      case 31:
        returnSrc = step31;
        break;
      case 32:
        returnSrc = step32;
        break;
      default:
        break;
    }

    return returnSrc;
  }, [step]);

  /**
   * generateResultMessage
   * 組出當晚死亡訊息
   * 
   */
  const generateResultMessage = () => {
    let returnMessage = '';
    const nightlyDead = getNightlyDead();

    if (nightlyDead.length === 0) {
      returnMessage = t('christmas_eve');
      return returnMessage;
    } else {
      let tmp = nightlyDead.map(p => p.index);

      // 重新排序
      tmp.sort((a, b) => {
        return a - b;
      });
      
      // 每晚最多只會有兩位玩家死掉
      tmp.forEach((number, index) => {
        returnMessage += number;
        if (tmp.length >= 2 && index !== tmp.length - 1) {
          returnMessage += ', ';
        }
      });
    }

    return t('dead_player', { returnMessage });
  }

  /**
   * getNightlyDead
   * 取得當晚真正死亡的人 (考慮守衛, 女巫)
   */
  const getNightlyDead = () => {
    const nightlyDead = [];

    // 狼人殺的人
    if (deadNumber !== null) {
      const isProtected = guardProtect && guardProtect.index === deadNumber.index;
      const isSaved = isUseSaveTonight;

      if (isProtected && isSaved) {
        // 同守同救 = 死亡
        nightlyDead.push(deadNumber);
      } else if (!isProtected && !isSaved) {
        // 沒守沒救 = 死亡
        nightlyDead.push(deadNumber);
      }
      // isProtected && !isSaved => 平安
      // !isProtected && isSaved => 平安
    }

    // 女巫毒的人
    if (witchDeadNumber !== null) {
      // 毒人無視守衛
      // 檢查是否跟狼人殺的是同一個，避免重複加入
      if (!nightlyDead.some(p => p.index === witchDeadNumber.index)) {
        nightlyDead.push(witchDeadNumber);
      }
    }

    return nightlyDead;
  }

  /**
   * handleCloseResult
   * 關閉晚上結果
   * 判斷是否結束遊戲
   * 判斷是否有獵人
   * 
   */
  const handleCloseResult = () => {
    // 設定成白天
    // setDayType(DAY_TYPE.DAY);

    // 關閉晚上結果
    setIsOpenResult(false);
    
    // 取得當晚真正死亡的人
    const nightlyDead = getNightlyDead();

    // 更新遊戲訊息
    setMessages([
      ...messages,
      `${t('n_night', { day })}${generateResultMessage()}`
    ]);

    // 更新已死亡的人
    const tmpDead = [
      ...dead,
      ...nightlyDead,
    ];
    if (nightlyDead.length > 0) {
      setDead(tmpDead);
    }

    const result = checkGameFinished(tmpDead);
    if (result.isFinished) {
      setIsOpenGameResult(true);
      setGameResultMessage(result.message);
    } else {
      // 檢查獵人或狼王是否死亡
      const isHunter = checkHunter(tmpDead);
      const isWolfKing = checkWolfKing(tmpDead);

      if (isHunter) {
        setIsOpenHunter(true);
      } else if (isWolfKing) {
        setIsOpenWolfKingShoot(true);
      } else {
        setTimeout(() => {
          initSelect(false);
        }, 500);
      }
    }
  }

  /**
   * generateSelectPicker
   * 組出選擇頭像 component
   * 
   * @param {string} role - 角色
   */
  const generateSelectPicker = (role) => {
    let returnComp = null;
    let selectValue = null;
    let selectFunc = null;

    switch(role) {
      // 狼人
      case WOLF.key:
        selectValue = deadNumber;
        selectFunc = setDeadNumber;
        break;
      // 狼王 (技能)
      case WOLF_KING.key:
        selectValue = wolfKingSelect;
        selectFunc = setWolfKingSelect;
        break;
      // 女巫
      case WITCH.key:
        selectValue = witchDeadNumber;
        selectFunc = setWitchDeadNumber;
        break;
      // 預言家
      case PREDICTOR.key:
        selectValue = predictorSelect;
        selectFunc = setPredictorSelect;
        break;
      // 獵人
      case HUNTER.key:
        selectValue = hunterSelect;
        selectFunc = setHunterSelect;
        break;
      // 騎士
      case KNIGHT.key:
        selectValue = knightSelect;
        selectFunc = setKnightSelect;
        break;
      // 守衛
      case GUARD.key:
        selectValue = guardProtect;
        selectFunc = setGuardProtect;
        break;
      // 一般投票
      default:
        selectValue = selectVote;
        selectFunc = setSelectVote;
    }

    returnComp = (
      <Grid container alignItems="center">
        {
          list.map(sit => {
            let className = classes.avatar;

            if (selectValue) {
              if (selectValue.index === sit.index) {
                className = classes.pinkAvatar;
              };
            }

            // 守衛邏輯：不能連續守護同一人
            let isDisabled = false;
            if (role === GUARD.key && lastGuardProtect && lastGuardProtect.index === sit.index) {
                isDisabled = true;
            }


            // 判斷該玩家是否死亡
            const idDead = dead.some(tmp => tmp.index === sit.index);

            return (
              <React.Fragment key={sit.index}>
                {
                  (idDead) ? (
                    <Avatar className={classes.dead}>
                      <span className={classes.number}>
                        { sit.index }
                      </span>
                    </Avatar>
                  ) : (isDisabled) ? ( 
                    <Avatar className={classes.dead}>
                      <span className={classes.number}>
                        { sit.index }
                      </span>
                    </Avatar> 
                  ) : (
                    <Avatar className={className} onClick={() => {selectFunc(sit)}}>
                      <span className={classes.number}>
                        { sit.index }
                      </span>
                    </Avatar>
                  )
                }
              </React.Fragment>
            );
          })
        }
      </Grid>
    );

    return returnComp;
  }

  const checkWolfKing = (dead) => {
    let isWolfKing = false;
    // 狼王被毒殺不能開槍 (依不同規則，這裡假設跟獵人一樣)
    if (isUseWolfKing && !isUseWolfKingSkill && !isKillByWitch) {
      isWolfKing = dead.some(tmp => tmp.role.key === WOLF_KING.key);
    }
    return isWolfKing;
  }

  /**
   * handleVote
   * 投票結果
   * 
   * @param {bool} isVote - 是否有投票, false: 放棄
   */
  const handleVote = (isVote) => {
    // 關閉投票視窗
    setIsOpenVote(false);

    if (isVote) {
      // 判斷被放逐的是不是白癡
      if (selectVote.role.key === idiot.key && isUseidiotSkill === false) {
        setMessages([
          ...messages,
          `${t('n_day', { day })}${t('no_is_idiot', { index: selectVote.index })}, ${t('idiot_result')}`,
        ]);

        setIsUseidiotSkill(true);
        setIsOpenidiotResult(true);
      } else {
        const tmpDead = [
          ...dead,
          selectVote,
        ]
        setDead(tmpDead);

        setMessages([
          ...messages,
          `${t('n_day', { day })}${selectVote.index}`,
        ]);
    
        const result = checkGameFinished(tmpDead);
        if (result.isFinished) {
          setIsOpenGameResult(true);
          setGameResultMessage(result.message);
        } else {
          // 檢查獵人和狼王是否死亡
          const isHunter = checkHunter(tmpDead);
          const isWolfKing = checkWolfKing(tmpDead);

          if (isHunter) {
            setIsOpenHunter(true);
          } else if (isWolfKing) {
            setIsOpenWolfKingShoot(true);
          } else {
            setIsOpenLastWords(true);
          }
        }
      }
    } else {
      setMessages([
        ...messages,
        `${t('n_day', { day })}${t('give_up_vote')}`,
      ]);
      setIsOpenLastWords(true);
    }
  }

  /**
   * checkHunter
   * 檢查獵人是否死亡
   * 
   * @param {array} dead - 死掉的人
   */
  const checkHunter = (dead) => {
    let isHunter = false;

    // 有使用獵人並未發動技能
    // console.log('isUseHunter', isUseHunter);
    // console.log('isUseHunterSkill', isUseHunterSkill);
    // console.log('isKillByWitch', isKillByWitch);
    if (isUseHunter && !isUseHunterSkill && !isKillByWitch && !isHunterDead) {
      isHunter = dead.some(tmp => tmp.role.key === HUNTER.key);
    }
    // console.log('isHunter', isHunter);
    return isHunter;
  }

  /**
   * checkGameFinished
   * 檢查遊戲是否結束
   * 
   * @param {array} dead - 死亡的人
   */
  const checkGameFinished = (dead) => {
    // 1. 更新特殊角色死亡狀態
    if (isUsePredictor) setIsPredictorDead(dead.some(tmp => tmp.role.key === PREDICTOR.key));
    if (isUseWitch) setIsWitchDead(dead.some(tmp => tmp.role.key === WITCH.key));
    if (isUseHunter) setIsHunterDead(dead.some(tmp => tmp.role.key === HUNTER.key));
    if (isUseKnight) setIsKnightDead(dead.some(tmp => tmp.role.key === KNIGHT.key));
    if (isUseidiot) setIsidiotDead(dead.some(tmp => tmp.role.key === idiot.key));
    if (isUseGuard) setIsGuardDead(dead.some(tmp => tmp.role.key === GUARD.key));

    // 2. 統計人數
    let deadWolf = 0;
    dead.forEach((p) => {
      // 狼王與普通狼人皆計入狼人陣營
      if (p.role.key === WOLF.key || p.role.key === WOLF_KING.key) {
        deadWolf += 1;
      }
    });

    const aliveWolves = wolfNumber - deadWolf;
    const totalAlive = playerNumber - dead.length;
    const aliveGoodGuys = totalAlive - aliveWolves;

    if (IS_DEBUG) {
      console.log('--- Win Check ---');
      console.log('Alive Wolves:', aliveWolves);
      console.log('Alive Good Guys:', aliveGoodGuys);
      console.log('Total Alive:', totalAlive);
    }

    // 3. 判斷好人是否獲勝：所有狼人陣營（含狼王）皆死亡
    if (aliveWolves === 0) {
      return {
        isFinished: true,
        message: t('good_win'),
      }
    }

    // 4. 判斷壞人是否獲勝：狼人數量 >= 好人數量
    if (aliveWolves >= aliveGoodGuys) {
      return {
        isFinished: true,
        message: t('bad_win'),
      }
    }

    // 5. 判斷是否有屠邊局 (如果有開啟 isKillKind)
    if (isKillKind) {
      let godsCount = 0;
      let villagersCount = 0;
      let deadGods = 0;
      let deadVillagers = 0;

      list.forEach((p) => {
        if (p.role.isGood) {
          if (p.role.isGod) godsCount++;
          else villagersCount++;
        }
      });

      dead.forEach((p) => {
        if (p.role.isGood) {
          if (p.role.isGod) deadGods++;
          else deadVillagers++;
        }
      });

      // 屠邊成功：神職全滅 或 民眾全滅
      if ((godsCount > 0 && deadGods === godsCount) || (villagersCount > 0 && deadVillagers === villagersCount)) {
        return {
          isFinished: true,
          message: t('bad_win_kind'),
        }
      }
    }

    return {
      isFinished: false,
      message: '',
    }
  }

  /**
   * handleShoot
   * 獵人射殺
   * 
   * @param {bool} isShoot - 是否射殺
   */
  const handleShoot = (isShoot) => {
    setIsOpenHunter(false);
    setIsUseHunterSkill(true);
    
    let currentDead = [...dead];
    if (isShoot) {
      currentDead = [
        ...dead,
        hunterSelect,
      ];

      setDead(currentDead);
      setMessages([
        ...messages,
        t('hunter_shoot_player', { index: hunterSelect.index })
      ]);
    }

    const result = checkGameFinished(currentDead);

    if (result.isFinished) {
      setIsOpenGameResult(true);
      setGameResultMessage(result.message);
    } else {
      // 獵人開完槍後，檢查狼王是否死在名單裡 (可能是之前死的，也可能是剛被獵人打死的)
      const isWolfKing = checkWolfKing(currentDead);
      if (isWolfKing) {
        setIsOpenWolfKingShoot(true);
      } else {
        // 如果沒有狼王要開槍，但 checkGameFinished 說遊戲該結束了（例如獵人開槍打死最後一狼）
        // 這種情況下 result.isFinished 會是 true, 上面已經處理了
        if (dayType === DAY_TYPE.DAY) {
          initSelect(true);
        } else {
          initSelect(false);
        }
      }
    }
  }

  /**
   * handleWolfKingShoot
   * 狼王射殺
   * 
   * @param {bool} isShoot - 是否射殺
   */
  const handleWolfKingShoot = (isShoot) => {
    setIsOpenWolfKingShoot(false);
    setIsUseWolfKingSkill(true);
    
    let currentDead = [...dead];
    if (isShoot) {
      currentDead = [
        ...dead,
        wolfKingSelect,
      ];

      setDead(currentDead);
      setMessages([
        ...messages,
        t('wolf_king_shoot_player', { index: wolfKingSelect.index })
      ]);
    }

    const result = checkGameFinished(currentDead);

    if (result.isFinished) {
      setIsOpenGameResult(true);
      setGameResultMessage(result.message);
    } else {
      // 狼王開完槍後，檢查獵人是否死在名單裡 (可能是之前死的，也可能是剛被狼王打死的)
      const isHunter = checkHunter(currentDead);
      if (isHunter) {
        setIsOpenHunter(true);
      } else {
        if (dayType === DAY_TYPE.DAY) {
          initSelect(true);
        } else {
          initSelect(false);
        }
      }
    }
  }

  /**
   * initSelect
   * 初始化選擇
   * 
   * @param {bool} isNextDay - 是否進入下一天
   */
  const initSelect = (isNextDay) => {
    // 清空全部選擇
    setDeadNumber(null); // 狼人
    setWitchDeadNumber(null); // 女巫毒殺
    setPredictorSelect(null); // 預言家選擇
    setSelectVote(null); // 投票選擇
    setIsUse(false);
    setIsUseSaveTonight(false);
    setHunterSelect(null); // 獵人選擇
    setKnightSelect(null); // 騎士選擇
    setGuardProtect(null); // 守衛選擇歸零 (注意 lastGuardProtect 不歸零)
    setIsShowMessage(false);

    if (isNextDay) {
      // 進入下一天
      setDay(day + 1);

      // 進入晚上
      setDayType(DAY_TYPE.NIGHT);

      // 進入 Step 1 (稍微延遲確保狀態已更新)
      setTimeout(() => {
        setStep(1);
      }, 500);
    } else {
      setDayType(DAY_TYPE.DAY);
    }
  }

  /**
   * handleGameOver
   * 遊戲結束
   * 
   */
  const handleGameOver = () => {
    // window.location.href = '/';
    window.location.reload();
  }

  /**
   * handleCloseHunter
   * 關閉獵人視窗
   * 
   */
  const handleCloseHunter = () => {
    setIsOpenHunterShoot(false);
    setStep(17);
  }

  const getWolfs = () => {
    //list.filter(role => role.role.key === WOLF.key)
    let wolfsInfo = '';
    const wolfs = list.filter(role => role.role.key === WOLF.key);
    wolfs.forEach((tmp, index) => {
      wolfsInfo += tmp.index;
      if (wolfs.length - 1 !== index) {
        wolfsInfo += ', ';
      }
    });
    return wolfsInfo;
  };

  const getVillages = () => {
    let villagesInfo = '';
    const villages = list.filter(role => role.role.key === VILLAGER.key);
    villages.forEach((tmp, index) => {
      villagesInfo += tmp.index;
      if (villages.length - 1 !== index) {
        villagesInfo += ', ';
      }
    });
    return villagesInfo;
  };

  /**
   * handleCloseLastWords
   * 關閉遺言視窗
   * 
   */
  const handleCloseLastWords = () => {
    setIsOpenLastWords(false);
    initSelect(true);
  };

  /**
   * handleFight
   * 決鬥結果
   * 
   */
  const handleFight = () => {
    setIsOpenKnight(false);
    setIsOpenKnightResult(true);
  }

  /**
   * handleCloseFight
   * 關閉決鬥結果
   * 
   */
  const handleCloseFight = () => {
    setIsUseKnightSkill(true);
    setIsOpenKnightResult(false);
    let tmpDead = [];

    if (knightSelect !== null && knightSelect.role.key === WOLF.key) {
      tmpDead = [
        ...dead,
        knightSelect,
      ];

      setMessages([
        ...messages,
        t('no_is_wolf', { index: knightSelect.index })
      ]);
    } else {
      tmpDead = [
        ...dead,
        list.find(tmp => tmp.role.key === KNIGHT.key),
      ];

      setMessages([
        ...messages,
        t('no_is_not_wolf', { index: knightSelect.index })
      ]);
    }

    if (IS_DEBUG) {
      console.log('handleCloseFight tmpDead', tmpDead);
    }

    setDead(tmpDead);
    const result = checkGameFinished(tmpDead);

    if (result.isFinished) {
      setIsOpenGameResult(true);
      setGameResultMessage(result.message);
    } else {
      initSelect(true);
    }
  }

  /**
   * handleCloseidiot
   * 關閉白癡結果
   * 
   */
  const handleCloseidiot =() => {
    setIsOpenidiotResult(false);
    initSelect(true);
  }

  /**
   * React - render
   * 
   */
  return (
    <>
      <div style={{ paddingTop: '20px' }}>
        { t('gaming') }
      </div>

      <div style={{ paddingTop: '20px' }}>
        { t('dead_message') }
      </div>

      <div style={{ textAlign: 'left', marginLeft: '10%' }}>
        <ul>
          {
            messages.map(message => <li>{ message }</li>)
          }
        </ul>
      </div>

      <div>
          {
            (dayType === DAY_TYPE.DAY) && (
              <>
                <Divider style={{ marginBottom: '20px' }} />
                <Button
                  disabled={(!isUseKnight || isUseKnightSkill)}
                  onClick={() => (setIsOpenKnight(true))}
                  variant="contained"
                  color="secondary"
                >
                  { t('knight_fight') }
                </Button>
                <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
                <Button onClick={() => (setIsOpenVote(true))} variant="contained" color="secondary">{ t('start_vote') }</Button>
              </>
            )
          }
      </div>

      <AudioSound
        url={audioSrc}
        onFinishedPlaying={handleSongFinishedPlaying}
      />

      { /* Wolf Kill Start */ }
      <Dialog
        fullWidth
        open={isOpenWolfKill}
        // onClose={handleCloseWolfKill}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('wolf_kill')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  { generateSelectPicker(WOLF.key) }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseWolfKill} color="primary" disabled={deadNumber === null} variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('wolf_kill')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { generateSelectPicker(WOLF.key) }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseWolfKill} color="primary" disabled={deadNumber === null} variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      { /* Wolf Kill End */ }

      { /* Witch Save Start */ }
      <Dialog
        fullWidth
        open={isOpenWitchSave}
        // onClose={handleCloseWolfKill}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('witch_save')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {
                    (isUseSave) ? (
                      <span className={classes.good}>{t('save_used')}</span>
                    ) : (
                      <span className={classes.good}>
                        { t('dead_person', { index: (deadNumber) ? deadNumber.index : null }) }
                      </span>
                    )
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {handleWitchSave(false)}} color="primary" variant="outlined">
                  { t('no') }
                  <CloseIcon />
                </Button>
                <Button onClick={() => {handleWitchSave(true)}} color="primary" variant="contained" disabled={isUseSave}>
                  { t('yes') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('witch_save')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {
                (isUseSave) ? (
                  <span className={classes.good}>{t('save_used')}</span>
                ) : (
                  <span className={classes.good}>
                    { t('dead_person', { index: (deadNumber) ? deadNumber.index : null }) }
                  </span>
                )
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleWitchSave(false)}} color="primary" variant="outlined">
              { t('no') }
              <CloseIcon />
            </Button>
            <Button onClick={() => {handleWitchSave(true)}} color="primary" variant="contained" disabled={isUseSave}>
              { t('yes') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      { /* Witch Save End */ }

      {/* Witch Poison Start */}
      <Dialog
        fullWidth
        open={isOpenWitchPoison}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('witch_poison')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  { 
                    (isUsePoison) ? (
                      // 你已使用毒藥
                      <span className={classes.good}>{t('poison_used')}</span>
                    ) : (
                      (isUse) ? (
                        // 此回合已使用解藥, 不能使用毒藥
                        <span className={classes.good}>{t('is_use_save')}</span>
                      ) : (
                        generateSelectPicker(WITCH.key)
                      )
                    )
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {handleWitchPoison(false)}} color="primary" variant="outlined">
                  { t('no') }
                  <CloseIcon />
                </Button>
                <Button disabled={(isUse || witchDeadNumber === null || isUsePoison)} onClick={() => {handleWitchPoison(true)}} color="primary" variant="contained">
                  { t('yes') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('witch_poison')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { 
                (isUsePoison) ? (
                  // 你已使用毒藥
                  <span className={classes.good}>{t('poison_used')}</span>
                ) : (
                  (isUse) ? (
                    // 此回合已使用解藥, 不能使用毒藥
                    <span className={classes.good}>{t('is_use_save')}</span>
                  ) : (
                    generateSelectPicker(WITCH.key)
                  )
                )
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleWitchPoison(false)}} color="primary" variant="outlined">
              { t('no') }
              <CloseIcon />
            </Button>
            <Button disabled={(isUse || witchDeadNumber === null || isUsePoison)} onClick={() => {handleWitchPoison(true)}} color="primary" variant="contained">
              { t('yes') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Witch Poison End */}

      {/* Predictor Start */}
      <Dialog
        fullWidth
        open={isOpenPredictor}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('predictor_select')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  { generateSelectPicker(PREDICTOR.key) }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button disabled={predictorSelect === null} onClick={() => {handlePredictor()}} color="primary" variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('predictor_select')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { generateSelectPicker(PREDICTOR.key) }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={predictorSelect === null} onClick={() => {handlePredictor()}} color="primary" variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Predictor End */}

      {/* Check Role Start */}
      <Dialog
        fullWidth
        open={isOpenRole}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('role_result')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {
                    (predictorSelect && predictorSelect.role.key === 'wolf') ? (
                      <span className={classes.bad}>{t('is_wolf')}</span>
                    ) : (
                      <span className={classes.good}>{t('not_wolf')}</span>
                    )
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {handleCloseCheckRole()}} color="primary" variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('role_result')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {
                (predictorSelect && predictorSelect.role.key === 'wolf') ? (
                  <span className={classes.bad}>{t('is_wolf')}</span>
                ) : (
                  <span className={classes.good}>{t('not_wolf')}</span>
                )
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleCloseCheckRole()}} color="primary" variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Check Role End */}

      {/* Result Start*/}
      <Dialog
        fullWidth
        open={isOpenResult}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('yesterday_dead')}</DialogTitle>
              <DialogContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isShowMessage} 
                      onChange={(e) => {
                        setIsShowMessage(e.target.checked);
                      }}
                    />
                  }
                  label={t('is_show_message')}
                />
                {
                  (isShowMessage) && (
                    <DialogContentText id="alert-dialog-description">
                      <span className={classes.bad}>
                        { generateResultMessage() }
                      </span>
                    </DialogContentText>
                  )
                }
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseResult} color="primary" variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('yesterday_dead')}</DialogTitle>
          <DialogContent>
            <FormControlLabel
              control={
                <Switch
                  checked={isShowMessage} 
                  onChange={(e) => {
                    setIsShowMessage(e.target.checked);
                  }}
                />
              }
              label={t('is_show_message')}
            />
            {
              (isShowMessage) && (
                <DialogContentText id="alert-dialog-description">
                  <span className={classes.bad}>
                    { generateResultMessage() }
                  </span>
                </DialogContentText>
              )
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResult} color="primary" variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Result End*/}

      { /* Vote Start */ }
      <Dialog
        fullWidth
        open={isOpenVote}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('start_vote')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  { generateSelectPicker('') }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleVote(false); }} color="primary" variant="outlined">
                  { t('give_up') }
                  <CloseIcon />
                </Button>
                <Button disabled={selectVote === null} onClick={() => { handleVote(true); }} color="primary" variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('start_vote')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { generateSelectPicker('') }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleVote(false); }} color="primary" variant="outlined">
              { t('give_up') }
              <CloseIcon />
            </Button>
            <Button disabled={selectVote === null} onClick={() => { handleVote(true); }} color="primary" variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      { /* Vote End */ }

      { /* Game Result Start */ }
      <Dialog
        fullWidth
        open={isOpenGameResult}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('game_over')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  { 
                    <span className={classes.good}>{gameResultMessage}</span>
                  }
                  <div>
                    <strong>{t('all_players')}</strong>
                    <ul>
                      {
                        list.sort((a,b) => a.index - b.index).map((player) => (
                          <li key={player.index}>
                            {`${player.index}號: ${t(player.role.key.toLowerCase())}`}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleGameOver(); }} color="primary" variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('game_over')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { 
                <span className={classes.good}>{gameResultMessage}</span>
              }
              <div>
                <strong>{t('all_players')}</strong>
                <ul>
                  {
                    list.sort((a,b) => a.index - b.index).map((player) => (
                      <li key={player.index}>
                        {`${player.index}號: ${t(player.role.key.toLowerCase())}`}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleGameOver(); }} color="primary" variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      { /* Game Result End */ }

      { /* Hunter Select Start */ }
      <Dialog
        fullWidth
        open={isOpenHunter}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('hunter_shoot')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                { generateSelectPicker(HUNTER.key) }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleShoot(false); }} color="primary" variant="outlined">
                  { t('no') }
                  <CloseIcon />
                </Button>
                <Button onClick={() => { handleShoot(true); }} color="primary" variant="contained" disabled={hunterSelect === null}>
                  { t('yes') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('hunter_shoot')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            { generateSelectPicker(HUNTER.key) }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleShoot(false); }} color="primary" variant="outlined">
              { t('no') }
              <CloseIcon />
            </Button>
            <Button onClick={() => { handleShoot(true); }} color="primary" variant="contained" disabled={hunterSelect === null}>
              { t('yes') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      { /* Hunter Select End */ }

      { /* Wolf King Select Start */ }
      <Dialog
        fullWidth
        open={isOpenWolfKingShoot}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('wolf_king_shoot')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                { generateSelectPicker(WOLF_KING.key) }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleWolfKingShoot(false); }} color="primary" variant="outlined">
                  { t('no') }
                  <CloseIcon />
                </Button>
                <Button onClick={() => { handleWolfKingShoot(true); }} color="primary" variant="contained" disabled={wolfKingSelect === null}>
                  { t('yes') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('wolf_king_shoot')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            { generateSelectPicker(WOLF_KING.key) }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleWolfKingShoot(false); }} color="primary" variant="outlined">
              { t('no') }
              <CloseIcon />
            </Button>
            <Button onClick={() => { handleWolfKingShoot(true); }} color="primary" variant="contained" disabled={wolfKingSelect === null}>
              { t('yes') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      { /* Wolf King Select End */ }

      {/* Hunter Could Shoot Start */}
      <Dialog
        fullWidth
        open={isOpenHunterShoot}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('could_shoot')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {
                    (isKillByWitch) ? (
                      <span className={classes.bad}>{t('cant_shoot')}</span>
                    ) : (
                      <span className={classes.good}>{t('can_shoot')}</span>
                    )
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleCloseHunter(); }} color="primary" variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('could_shoot')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {
                (isKillByWitch) ? (
                  <span className={classes.bad}>{t('cant_shoot')}</span>
                ) : (
                  <span className={classes.good}>{t('can_shoot')}</span>
                )
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleCloseHunter(); }} color="primary" variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Hunter Could Shoot End */}

      {/* Last Words Start */}
      <Dialog
        fullWidth
        open={isOpenLastWords}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('last_words')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  ...
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleCloseLastWords(); }} color="primary" variant="contained">
                  { t('to_night') }
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('last_words')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleCloseLastWords(); }} color="primary" variant="contained">
              { t('to_night') }
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Last Words End */}

      {/* Knight Start */}
      <Dialog
        fullWidth
        open={isOpenKnight}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('knight_fight')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {
                    (isUseKnight) && (<li>{`${t('knight')}: ${list.find(role => role.role.key === KNIGHT.key).index}`}</li>)
                  }
                  { generateSelectPicker(KNIGHT.key) }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button disabled={knightSelect === null} onClick={() => {handleFight()}} color="primary" variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('knight_fight')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {
                (isUseKnight) && (<li>{`${t('knight')}: ${list.find(role => role.role.key === KNIGHT.key).index}`}</li>)
              }
              { generateSelectPicker(KNIGHT.key) }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={knightSelect === null} onClick={() => {handleFight()}} color="primary" variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Knight End */}

      {/* Knight Result Start */}
      <Dialog
        fullWidth
        open={isOpenKnightResult}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('fight_result')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {
                    (knightSelect !== null) ? (
                      (knightSelect.role.key === WOLF.key) ? (
                        <span className={classes.bad}>{t('no_is_wolf', { index: knightSelect.index })}</span>
                      ) : (
                        <span className={classes.good}>{t('no_is_not_wolf', { index: knightSelect.index })}</span>
                      )
                    ) : (
                      null
                    )
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {handleCloseFight()}} color="primary" variant="contained">
                  { t('to_night') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('fight_result')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {
                (knightSelect !== null) ? (
                  (knightSelect.role.key === WOLF.key) ? (
                    <span className={classes.bad}>{t('no_is_wolf', { index: knightSelect.index })}</span>
                  ) : (
                    <span className={classes.good}>{t('no_is_not_wolf', { index: knightSelect.index })}</span>
                  )
                ) : (
                  null
                )
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleCloseFight()}} color="primary" variant="contained">
              { t('to_night') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Knight Result End */}

      {/* Guard Start */}
      <Dialog
        fullWidth
        open={isOpenGuard}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('guard_protect') || '守衛請守護'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  { generateSelectPicker(GUARD.key) }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {handleGuardProtect()}} color="primary" variant="contained">
                  { t('confirm') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('guard_protect') || '守衛請守護'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { generateSelectPicker(GUARD.key) }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleGuardProtect()}} color="primary" variant="contained">
              { t('confirm') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* Guard End */}

      {/* idiot Result Start */}
      <Dialog
        fullWidth
        open={isOpenidiotResult}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (isMirror) && (
            <div style={{ transform: 'rotate(180deg)', borderTop: '1px solid #e0e0e0' }}>
              <DialogTitle id="alert-dialog-title">{t('idiot_result')}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {
                    (selectVote !== null) ? (
                      t('no_is_idiot', { index: selectVote.index })
                    ) : (
                      null
                    )
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {handleCloseidiot()}} color="primary" variant="contained">
                  { t('to_night') }
                  <CheckIcon />
                </Button>
              </DialogActions>
            </div>
          )
        }
        <div>
          <DialogTitle id="alert-dialog-title">{t('idiot_result')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {
                (selectVote !== null) ? (
                  t('no_is_idiot', { index: selectVote.index })
                ) : (
                  null
                )
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleCloseidiot()}} color="primary" variant="contained">
              { t('to_night') }
              <CheckIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* idiot Result End */}
    </>
  );
};

export default Game;

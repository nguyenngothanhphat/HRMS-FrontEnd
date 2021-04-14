import React, { useState, useEffect } from 'react';
import { Link, formatMessage, connect } from 'umi';
import { InputNumber, Button } from 'antd';

import gmail from '@/assets/gmail-icon.png';
import outlook from '@/assets/outlook-icon.png';
import img from '@/assets/sign-up-img.png';

import styles from './index.less';

const SignUp2 = (props) => {
  const { email, dispatch } = props;

  const inputRefs = [];
  const [inputVals, setInputVals] = useState(['', '', '', '', '', '']);
  const checkEmpty = (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i] === '') return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchSecurityCode = async () => {
      const allFilled = !checkEmpty(inputVals);
      if (allFilled) {
        const securityCode = inputVals.join().replace(/,/g, ''); // Join all inputs to get a complete Code string

        if (dispatch) {
          // save to Store
          await dispatch({
            type: 'signup/save',
            payload: {
              codeNumber: securityCode,
            },
          });

          // call API
          await dispatch({
            type: 'signup/fetchSecurityCode',
            payload: {
              codeNumber: securityCode,
            },
          });

          setInputVals(['', '', '', '', '', '']); // Reset to default
        }
      }
    };

    fetchSecurityCode();
  }, [inputVals]);

  const onChange = (value, index) => {
    if (value !== 0) {
      if (!value) {
        return;
      }
    }
    const { length } = value.toString();
    if (index !== inputRefs.length - 1) {
      if (length >= 1) {
        inputRefs[index + 1].focus();
      }
    } else {
      inputRefs[index].blur();
    }
    const newArr = [...inputVals];
    newArr.splice(index, 1, value);
    setInputVals(newArr);
  };

  return (
    <div className={styles.wrapper}>
      <h2>
        {formatMessage({
          id: 'page.signUp.checkForCode',
        })}
      </h2>

      <p className={styles.mail}>
        {formatMessage({
          id: 'page.signUp.weSentCode',
        })}
        <Link to="/">{email}</Link>
      </p>

      <p className={styles.codeDescription}>
        {formatMessage({
          id: 'page.signUp.enterCode',
        })}
      </p>

      <div className={styles.code}>
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputRefs[0]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 0)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputRefs[1]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 1)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputRefs[2]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 2)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputRefs[3]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 3)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputRefs[4]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 4)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputRefs[5]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 5)}
        />
      </div>

      <div className={styles.send}>
        <p>
          {formatMessage({
            id: 'page.signUp.notReceiveCode',
          })}{' '}
          <Link to="/">
            {formatMessage({
              id: 'page.signUp.sendAgain',
            })}
          </Link>
        </p>
      </div>

      <div className={styles.btnContainer}>
        <Button>
          {/* <Link to="http://gmail.com/"> */}
          <div className={styles.btn}>
            <img src={gmail} alt="gmail icon" />
            <span>
              {formatMessage({
                id: 'page.signUp.openGmail',
              })}
            </span>
          </div>
          {/* </Link> */}
        </Button>

        <Button>
          {/* <Link to="https://outlook.office.com/"> */}
          <div className={styles.btn}>
            <img src={outlook} alt="outlook icon" />
            <span>
              {formatMessage({
                id: 'page.signUp.openOutlook',
              })}
            </span>
          </div>
          {/* </Link> */}
        </Button>
      </div>
    </div>
  );
};

// export default SignUp2;
export default connect(({ signup: { codeNumber = '', user: { email = '' } = {} } = {} }) => ({
  codeNumber,
  email,
}))(SignUp2);

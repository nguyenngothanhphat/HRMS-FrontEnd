import React, { useState, useEffect } from 'react';
import { Link, formatMessage, connect } from 'umi';
import { Button } from 'antd';

import gmail from '@/assets/gmail-icon.png';
import outlook from '@/assets/outlook-icon.png';
import img from '@/assets/sign-up-img.png';

import styles from './index.less';

const SignUp2 = (props) => {
  const { email, dispatch } = props;
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

          setInputVals(new Array(6).fill('')); // Reset to default
        }
      }
    };
    fetchSecurityCode();
  }, [inputVals]);

  const onChange = async (e, index) => {
    // if (isNaN(e.target.value)) return;
    const newArr = [...inputVals];
    newArr.splice(index, 1, e.target.value);
    setInputVals(newArr);
    if (e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
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
        <Link to="#">{email}</Link>
      </p>

      <p className={styles.codeDescription}>
        {formatMessage({
          id: 'page.signUp.enterCode',
        })}
      </p>

      <div className={styles.code}>
        {inputVals.map((value, index) => {
          return (
            <input
              key={`Number${index + 1}`}
              className={styles.input2}
              maxLength="1"
              value={value}
              onChange={(e) => onChange(e, index)}
              onFocus={(e) => e.target.select()}
            />
          );
        })}
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

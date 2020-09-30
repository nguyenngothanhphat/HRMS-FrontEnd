import React, { useState, useEffect } from 'react';
import { Link, connect } from 'umi';
import { Layout, Row, Col, InputNumber, Button } from 'antd';

import gmail from '@/assets/gmail-icon.png';
import outlook from '@/assets/outlook-icon.png';
import img from '@/assets/sign-up-img.png';

import styles from './index.less';

const SignUp2 = (props) => {
  const { codeNumber, email, dispatch } = props;

  const inputRefs = [];
  const [inputVals, setInputVals] = useState(['', '', '', '', '', '']);

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

  const checkEmpty = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '') return true;
    }
    return false;
  };

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
    setInputVals((prevState) => {
      const vals = prevState.filter((value, valueIndex) => index !== valueIndex);
      vals.splice(index, 0, value);
      return vals;
    });
  };

  return (
    <div className={styles.wrapper}>
      <h2>Check your mail for the code.</h2>

      <p className={styles.mail}>
        We have sent a 6-digit code to<Link to="/">{email}</Link>
      </p>

      <p className={styles.codeDescription}>Enter the security code</p>

      <div className={styles.code}>
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          className={styles.input}
          min={0}
          max={9}
          value={inputVals[0]}
          onChange={(e) => onChange(e, 0)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          className={styles.input}
          min={0}
          max={9}
          value={inputVals[1]}
          onChange={(e) => onChange(e, 1)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          className={styles.input}
          min={0}
          max={9}
          value={inputVals[2]}
          onChange={(e) => onChange(e, 2)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputVals[3]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 3)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputVals[4]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 4)}
        />
        <InputNumber
          ref={(ref) => {
            inputRefs.push(ref);
          }}
          value={inputVals[5]}
          className={styles.input}
          min={0}
          max={9}
          onChange={(e) => onChange(e, 5)}
        />
      </div>

      <div className={styles.send}>
        <p>
          Did not receive the code? <Link to="/">Send again</Link>{' '}
        </p>
      </div>

      <div className={styles.btnContainer}>
        <Button>
          <Link to="http://gmail.com/">
            <div className={styles.btn}>
              <img src={gmail} />
              <span>open gmail</span>
            </div>
          </Link>
        </Button>

        <Button>
          <Link to="https://outlook.office.com/">
            <div className={styles.btn}>
              <img src={outlook} />
              <span>open outlook</span>
            </div>
          </Link>
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

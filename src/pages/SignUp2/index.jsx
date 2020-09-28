import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { Layout, Row, Col, InputNumber, Button } from 'antd';

import gmail from '@/assets/gmail-icon.png';
import outlook from '@/assets/outlook-icon.png';
import img from '@/assets/sign-up-img.png';

import styles from './index.less';

const SignUp2 = (props) => {
  // const
  let ref1 = null;
  let ref2 = null;
  let ref3 = null;

  let inputRefs = [];
  const [inputVals, setInputVals] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    console.log(inputRefs);
    // if (inputRefs.length !== 0) {
    //   inputRefs[1].focus();
    // }
  }, []);

  const onChange = (value, index) => {
    if (!value) {
      return;
    }
    const length = value.toString().length;
    if (index !== inputRefs.length - 1) {
      if (length >= 1) {
        console.log('NEXT');

        inputRefs[index + 1].focus();
      }
    }
    setInputVals((prevState) => {
      let vals = prevState.filter((value, valueIndex) => index !== valueIndex);
      vals.splice(index, 0, value);
      return vals;
    });
  };

  return (
    <div className={styles.wrapper}>
      <h2>Check your mail for the code.</h2>

      <p className={styles.mail}>
        We have sent a 6-digit code to<Link to="/">siddhartha@lollypop.design.</Link>
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

export default SignUp2;

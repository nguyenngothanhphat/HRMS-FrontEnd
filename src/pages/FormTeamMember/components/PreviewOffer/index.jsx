import React, { useState, useEffect } from 'react';

import { Button, Input, Form } from 'antd';
import { EditOutlined, SendOutlined } from '@ant-design/icons';
import logo from './components/images/brand-logo.png';
// import whiteImg from './components/images/white.png';
// eslint-disable-next-line import/no-unresolved
import whiteImg from './components/images/white.png';

import CancelIcon from './components/CancelIcon';

import styles from './index.less';

const INPUT_WIDTH = [40, 100, 10, 120, 100, 40, 100, 10, 120, 100]; // Width for each input field

const PreviewOffer = () => {
  const inputRefs = [];
  let fileRef = null;
  // const mailRef = null;

  const [file, setFile] = useState(null);

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [place, setPlace] = useState('');
  const [city, setCity] = useState('');

  const [day2, setDay2] = useState('');
  const [month2, setMonth2] = useState('');
  const [year2, setYear2] = useState('');
  const [place2, setPlace2] = useState('');
  const [city2, setCity2] = useState('');

  const [mail, setMail] = useState('');

  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFile(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const resetImg = () => {
    setFile(null);
  };

  const handleSubmit = () => {
    // Insert all value of inputs
    const info = {
      day,
      month,
      year,
      place,
      city,
      day2,
      month2,
      year2,
      place2,
      city2,
      signature: file,
      hrMail: mail,
    };

    console.log(info);

    // Clear all input fields
    setDay('');
    setMonth('');
    setYear('');
    setPlace('');
    setCity('');
    setDay2('');
    setMonth2('');
    setYear2('');
    setPlace2('');
    setCity2('');
    setFile(null);
    setMail('');
  };

  // const validateEmail = (email) => {
  //   const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return re.test(String(email).toLowerCase());
  // };

  const handleMail = (value) => {
    setMail(value);
    // console.log(value);
    // if (validateEmail(value)) {
    //   return;
    // }
    // Mail is not valid
    // if (mailRef) {
    //   console.log(mailRef.props.class);
    //   console.log('wrong');
    // }
  };

  useEffect(() => {
    // Set width for each input
    for (let i = 0; i < inputRefs.length; i += 1) {
      if (inputRefs[i]) {
        inputRefs[i].style.width = `${INPUT_WIDTH[i]}px`;
      }
    }
  }, []);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.left}>
        <div className={styles.leftContainer}>
          <header>
            <img src={logo} alt="terralogic logo" />
            <h1>employee agreement</h1>
          </header>

          <div className={styles.content}>
            <p>
              THE AGREEMENT made as of the{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={day} type="text" onChange={(e) => setDay(e.target.value)} />
              </div>{' '}
              day of
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={month} type="text" onChange={(e) => setMonth(e.target.value)} />
              </div>
              . 20
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={year} type="text" onChange={(e) => setYear(e.target.value)} />
              </div>
              . between [name of employer] a corporation incoporated under the laws of Province on
              Ontario, and having its principal place of business at{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={place} type="text" onChange={(e) => setPlace(e.target.value)} />
              </div>{' '}
              (the &quot;Employer&quot;); and [name of (the &quot;Employee&quot;)], of the City of{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={city} type="text" onChange={(e) => setCity(e.target.value)} />
              </div>{' '}
              in the Province of Ontario (the &quot;Employee&quot;).
            </p>

            <p>
              WHEREAS the Employer desires to obtain the benefit of the services of the Employee,
              and the Employee desires to render such services on the terms and conditions set forth
            </p>
            <p>
              IN CONSIDERATION of the promises and other good and valuable consideration (the
              sufficiency and receipt of which are hereby acknowledged) the parties agree as
              follows:
            </p>
            <p>
              The Employee agrees that he will at all times faithfully, industriously, and to the
              best of his skill, ability, experience and talents, perform all of the duties required
              of his position in carrying out these duties and responsilities, the Employee shall
              comply with all Employer policies, procedures, rules and regulations, both written and
              oral as announced by the Employer from time to time.
            </p>
            <p>
              It is also understood and agreed to by the Employee that his assignment, duties and
              responsilities and reporting arrangement may be changed by the Employer in its sole
              discretion without causing termination of this agreement.
            </p>
            <p>
              THE AGREEMENT made as of the{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={day2} type="text" onChange={(e) => setDay2(e.target.value)} />
              </div>{' '}
              day of
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={month2} type="text" onChange={(e) => setMonth2(e.target.value)} />
              </div>
              . 20
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={year2} type="text" onChange={(e) => setYear2(e.target.value)} />
              </div>
              . between [name of employer] a corporation incoporated under the laws of Province on
              Ontario, and having its principal place of business at{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={place2} type="text" onChange={(e) => setPlace2(e.target.value)} />
              </div>{' '}
              (the &quot;Employer&quot;); and [name of (the &quot;Employee&quot;)], of the City of{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                }}
              >
                <input value={city2} type="text" onChange={(e) => setCity2(e.target.value)} />
              </div>{' '}
              in the Province of Ontario (the &quot;Employee&quot;).
            </p>

            <p>
              WHEREAS the Employer desires to obtain the benefit of the services of the Employee,
              and the Employee desires to render such services on the terms and conditions set forth
            </p>
            <p>
              IN CONSIDERATION of the promises and other good and valuable consideration (the
              sufficiency and receipt of which are hereby acknowledged) the parties agree as
              follows:
            </p>
            <p>
              The Employee agrees that he will at all times faithfully, industriously, and to the
              best of his skill, ability, experience and talents, perform all of the duties required
              of his position in carrying out these duties and responsilities, the Employee shall
              comply with all Employer policies, procedures, rules and regulations, both written and
              oral as announced by the Employer from time to time.
            </p>
            <p>
              It is also understood and agreed to by the Employee that his assignment, duties and
              responsilities and reporting arrangement may be changed by the Employer in its sole
              discretion without causing termination of this agreement.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.signature}>
          <header>
            <div className={styles.icon}>
              <div className={styles.bigGlow}>
                <div className={styles.smallGlow}>
                  <EditOutlined />
                </div>
              </div>
            </div>
            <h2>Signature of the HR</h2>
          </header>

          <p>Undersigned - Ms Riddhima Chaudhary</p>

          <div className={styles.upload}>
            {!file ? (
              // Default image
              <img className={styles.signatureImg} src={whiteImg} alt="" />
            ) : (
              <img className={styles.signatureImg} src={file} alt="" />
            )}

            <button
              type="submit"
              onClick={() => {
                fileRef.click();
              }}
            >
              Upload new
            </button>

            <CancelIcon resetImg={resetImg} />
          </div>

          <input
            className={styles.uploadInput}
            type="file"
            ref={(ref) => {
              fileRef = ref;
            }}
            onChange={(e) => {
              imageHandler(e);
            }}
          />

          <div className={styles.submitContainer}>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <span className={styles.submitMessage}>{file ? 'Signature submitted' : ''}</span>
          </div>
        </div>

        <div className={styles.send}>
          <header>
            <div className={styles.icon}>
              <div className={styles.bigGlow}>
                <div className={styles.smallGlow}>
                  <SendOutlined />
                </div>
              </div>
            </div>
            <h2>Send for approval</h2>
          </header>

          <p>
            By default notifications <span>will be sent to HR</span>, your manager and recursively
            loop to your department head for approval.
          </p>

          <p>
            Also, add e-mail of the new joinee. You can send the offer once all approvals are in
            order.
          </p>

          <div className={styles.mail}>
            <span>HR Email ID</span>
            <Form initialValues={{ mail }}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid email!',
                  },
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input
                  name="mail"
                  required={false}
                  // value={mail}
                  placeholder="address@terraminds.com"
                  onChange={(e) => setMail(e.target.value)}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewOffer;

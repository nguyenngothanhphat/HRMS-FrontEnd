import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';

import { Button, Input, Form } from 'antd';
import { EditOutlined, SendOutlined } from '@ant-design/icons';
import NumericInput from '@/components/NumericInput';
import UploadImage from '@/components/UploadImage';
import logo from './components/images/brand-logo.png';
// eslint-disable-next-line import/no-unresolved
import whiteImg from './components/images/whiteImg.png';

import CancelIcon from './components/CancelIcon';

import styles from './index.less';

const INPUT_WIDTH = [50, 100, 18, 120, 100, 50, 100, 18, 120, 100]; // Width for each input field

const PreviewOffer = (props) => {
  const { dispatch, previewOffer = {} } = props;

  // Get default value from "info" store
  const {
    file: fileProp,
    day: dayProp,
    month: monthProp,
    year: yearProp,
    place: placeProp,
    city: cityProp,
    day2: day2Prop,
    month2: month2Prop,
    year2: year2Prop,
    place2: place2Prop,
    city2: city2Prop,
    mail: mailProp,
  } = previewOffer;

  const inputRefs = [];
  let fileRef = null;

  const [file, setFile] = useState(fileProp || null);

  const [day, setDay] = useState(dayProp || '');
  const [month, setMonth] = useState(monthProp || '');
  const [year, setYear] = useState(yearProp || '');
  const [place, setPlace] = useState(placeProp || '');
  const [city, setCity] = useState(cityProp || '');

  const [day2, setDay2] = useState(day2Prop || '');
  const [month2, setMonth2] = useState(month2Prop || '');
  const [year2, setYear2] = useState(year2Prop || '');
  const [place2, setPlace2] = useState(place2Prop || '');
  const [city2, setCity2] = useState(city2Prop || '');

  const [mail, setMail] = useState(mailProp || '');
  const [mailForm] = Form.useForm();

  const getResponse = (value) => {
    const { statusCode, data = [] } = value;
    if (statusCode === 200) {
      const [first] = data;
      console.log(first.url);
    }
  };

  const resetForm = () => {
    mailForm.resetFields();
  };

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

  const saveChanges = () => {
    // Save changes to redux store
    if (dispatch) {
      dispatch({
        type: 'info/save',
        payload: {
          previewOffer: {
            ...previewOffer,
            file,
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
            mail,
          },
        },
      });
    }
  };

  const handleSubmit = () => {
    // Check if mail address is valid
    const mailError = mailForm.getFieldError('email');
    if (mailError.length > 0 || mail.length === 0) {
      return;
    }

    // Clear all input fields after submitted
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
    resetForm();
  };

  useEffect(() => {
    // Set width for each input
    for (let i = 0; i < inputRefs.length; i += 1) {
      if (inputRefs[i]) {
        inputRefs[i].style.width = `${INPUT_WIDTH[i]}px`;
      }
    }
  }, []);

  useEffect(() => {
    // Save changes to store whenever input fields change
    saveChanges();
  }, [file, day, month, year, place, city, day2, month2, year2, place2, city2, mail]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.left}>
        <div className={styles.leftContainer}>
          <header>
            <img src={logo} alt="terralogic logo" />
            <h1>{formatMessage({ id: 'component.previewOffer.title' })}</h1>
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
                <NumericInput
                  onChange={(value) => setYear(value)}
                  value={year}
                  maxLength={2}
                  min={1}
                />
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
                <NumericInput
                  onChange={(value) => setYear2(value)}
                  value={year2}
                  maxLength={2}
                  min={1}
                />
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
            <h2>{formatMessage({ id: 'component.previewOffer.hrSignature' })}</h2>
          </header>

          <p>{formatMessage({ id: 'component.previewOffer.undersigned' })}</p>

          <div className={styles.upload}>
            {!file ? (
              // Default image
              <img className={styles.signatureImg} src={whiteImg} alt="" />
            ) : (
              <img className={styles.signatureImg} src={file} alt="" />
            )}

            {/* <button
              type="submit"
              onClick={() => {
                fileRef.click();
              }}
            >
              {formatMessage({ id: 'component.previewOffer.uploadNew' })}
            </button> */}
            <UploadImage
              content={<div className={styles.test}>Upload</div>}
              getResponse={getResponse}
            />

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
              {formatMessage({ id: 'component.previewOffer.submit' })}
            </Button>
            <span className={styles.submitMessage}>
              {file ? formatMessage({ id: 'component.previewOffer.submitted' }) : ''}
            </span>
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
            <h2>{formatMessage({ id: 'component.previewOffer.send' })}</h2>
          </header>

          <p>
            {formatMessage({ id: 'component.previewOffer.note1' })}
            <span>{formatMessage({ id: 'component.previewOffer.note2' })}</span>
            {formatMessage({ id: 'component.previewOffer.note3' })}
          </p>

          <p>{formatMessage({ id: 'component.previewOffer.also' })}</p>

          <div className={styles.mail}>
            <span> {formatMessage({ id: 'component.previewOffer.hrMail' })}</span>

            <Form form={mailForm} name="myForm" value={mail}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: formatMessage({ id: 'component.previewOffer.invalidMailErr' }),
                  },
                  {
                    required: true,
                    message: formatMessage({ id: 'component.previewOffer.emptyMailErr' }),
                  },
                ]}
              >
                <Input
                  required={false}
                  value={mail}
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

// export default PreviewOffer;
export default connect(({ info: { previewOffer = {} } = {} }) => ({
  previewOffer,
}))(PreviewOffer);

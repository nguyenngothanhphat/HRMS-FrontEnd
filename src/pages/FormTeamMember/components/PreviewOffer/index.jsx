import React, { useState, useEffect } from 'react';

import logo from './components/images/brand-logo.png';
import whiteImg from './components/images/white.png';
import { EditOutlined } from '@ant-design/icons';

import styles from './index.less';

const INPUT_WIDTH = [50, 150, 20, 200, 200];

const CancleIcon = (props) => {
  const { className, resetImg } = props;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      onClick={() => resetImg()}
    >
      <g fill="none" fill-rule="evenodd">
        <g>
          <g>
            <g>
              <g>
                <g>
                  <path
                    d="M0 0H15.206V15.206H0z"
                    transform="translate(-1343 -374) translate(1047 215) translate(32 32) translate(0 119) translate(264 8)"
                  />
                  <path
                    fill="#FF5252"
                    d="M8.493 7.605l3.352-3.352c.247-.247.247-.646 0-.893s-.646-.247-.893 0L7.6 6.71 4.248 3.353c-.247-.247-.646-.247-.893 0s-.247.647 0 .894l3.352 3.358-3.352 3.352c-.247.247-.247.646 0 .893.12.127.279.19.443.19.165 0 .324-.063.45-.184L7.6 8.498l3.352 3.352c.126.127.285.19.45.19.164 0 .323-.063.45-.184.247-.247.247-.646 0-.893L8.492 7.605z"
                    transform="translate(-1343 -374) translate(1047 215) translate(32 32) translate(0 119) translate(264 8)"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

const PreviewOffer = () => {
  let inputRefs = [];
  let inputRefIndex = 0;
  let fileRef = null;
  const [file, setFile] = useState(null);

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
    console.log('CLICKed');
    setFile(null);
  };

  useEffect(() => {
    for (let i = 0; i < inputRefs.length; i++) {
      if (inputRefs[i]) {
        console.log(inputRefs[i]);
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
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>{' '}
              day of
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>
              . 20
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>
              . between [name of employer] a corporation incoporated under the laws of Province on
              Ontario, and having its principal place of business at{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>{' '}
              (the "Employer"); and [name of (the "Employee")], of the City of ______ in the
              Province of Ontario (the "Employee").
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
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>{' '}
              day of
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>
              . 20
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>
              . between [name of employer] a corporation incoporated under the laws of Province on
              Ontario, and having its principal place of business at{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>{' '}
              (the "Employer"); and [name of (the "Employee")], of the City of{' '}
              <div
                ref={(ref) => {
                  inputRefs.push(ref);
                  inputRefIndex++;
                }}
              >
                <input type="text" />
              </div>{' '}
              in the Province of Ontario (the "Employee").
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
              onClick={() => {
                fileRef.click();
              }}
            >
              Submit
            </button>

            <CancleIcon className={styles.cancleIcon} resetImg={resetImg} />
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
        </div>

        <div className={styles.send}>
          <p>Send</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewOffer;

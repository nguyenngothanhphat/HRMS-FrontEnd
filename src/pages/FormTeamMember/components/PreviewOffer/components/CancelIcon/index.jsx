import React from 'react';
import styles from './index.less';

const CancelIcon = (props) => {
  const { resetImg = () => {} } = props;

  return (
    <svg
      className={styles.cancelIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      onClick={() => resetImg()}
    >
      <g fill="none" fillRule="evenodd">
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

export default CancelIcon;

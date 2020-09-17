import React, { useState, useEffect } from 'react';

import { PlusOutlined } from '@ant-design/icons';

import styles from './index.less';

const Alert = (props) => {
  const { type, display: displayProp, children } = props;

  let alertRef = null;

  const [display, setDisplay] = useState(displayProp || true);

  let classByType;
  let headerByType;

  useEffect(() => {
    setDisplay(displayProp);
  }, [displayProp]);

  useEffect(() => {
    if (alertRef) {
      if (display) {
        alertRef.classList.remove(styles.hide);
      } else {
        alertRef.classList.add(styles.hide);
      }
    }
  }, [display]);

  const displayAlert = () => {
    setDisplay(!display);
  };

  switch (type) {
    case 'remind':
      classByType = styles.remind;
      headerByType = 'Reminder';
      break;
    case 'info':
      classByType = styles.info;
      headerByType = 'Info';
      break;
    case 'caution':
      classByType = styles.caution;
      headerByType = 'Caution';
      break;
    default:
      classByType = styles.remind;
      headerByType = 'Reminder';
      break;
  }

  if (displayProp) {
    return (
      <div
        className={`${styles.alert} ${classByType}`}
        ref={(ref) => {
          alertRef = ref;
        }}
      >
        <div className={styles.alertHeader}>
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            className={styles.exclamationIcon}
            data-icon="exclamation-circle"
            width="1em"
            height="1em"
            aria-hidden="true"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
            <path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" />
          </svg>

          <h4>{headerByType}</h4>
        </div>

        <div className={styles.alertContent}>{children}</div>

        <PlusOutlined
          className={styles.crossIcon}
          onClick={() => {
            displayAlert();
          }}
        />
      </div>
    );
  }
  return null;
};

export default Alert;

import { Input } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
import { DOCUMENT_TYPES } from '@/utils/candidatePortal';
import ResubmitIcon from '@/assets/candidatePortal/resubmitIcon.svg';
import DoneIcon from '@/assets/candidatePortal/doneSign.svg';
import styles from './index.less';

export default function HardCopy(props) {
  const {
    setSelectingFile = () => {},
    onComment = () => {},
    setComment = () => {},
    item: val = {},
    type = '',
    resubmitComment = '',
    status = '',
    onChangeStatusHardCopy = () => {},
  } = props;

  const onFinishDebounce = debounce((values) => {
    onComment(values);
    setComment(values);
  }, 1000);

  const handleChange = (values) => {
    onFinishDebounce(values);
  };

  const renderWaiting = () => {
    return (
      <div className={styles.waiting} onClick={() => onChangeStatusHardCopy(type, val)}>
        <span>Waiting</span>
        <img src={ResubmitIcon} alt="waiting" />
      </div>
    );
  };

  const renderReceived = () => {
    return (
      <div className={styles.received}>
        <span>Received</span>
        <img src={DoneIcon} alt="waiting" />
      </div>
    );
  };

  return (
    <div className={styles.nameDocument}>
      <div className={styles.title}>
        <div>
          {val.alias}
          <span className={styles.starSymbol}>*</span>
        </div>
        {status === DOCUMENT_TYPES.RECEIVED ? renderReceived() : renderWaiting()}
      </div>
      <Input.TextArea
        name="resubmitComment"
        defaultValue={resubmitComment}
        placeholder="Type your note here"
        onClick={() => {
          setSelectingFile({ type, item: val });
        }}
        onBlur={() => setSelectingFile({})}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      />
    </div>
  );
}

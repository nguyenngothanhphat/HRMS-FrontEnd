import React, { useEffect, useState } from 'react';
import { Checkbox, Input } from 'antd';
import { debounce } from 'lodash';
import styles from './index.less';

export default function HardCopy(props) {
  const {
    setIsChecked = () => {},
    setSelectingFile = () => {},
    onComment = () => {},
    setComment = () => {},
    item: val = {},
    type = '',
    value = false,
    resubmitComment = '',
  } = props;

  const onFinishDebounce = debounce((values) => {
    onComment(values);
    setComment(values);
  }, 1000);

  const handleChange = (values) => {
    onFinishDebounce(values);
  };

  return (
    <div className={styles.nameDocument}>
      <Checkbox
        onChange={(e) => {
          setIsChecked(e.target.checked);
          setSelectingFile({ type, item: val });
          //   onCheckVerify(e.target.checked);
        }}
        defaultChecked={value}
        style={{ display: 'flex' }}
      >
        {val.alias}
        <span className={styles.starSymbol}>*</span>
      </Checkbox>
      <Input.TextArea
        name="resubmitComment"
        defaultValue={resubmitComment}
        // style={{ display: 'block', resize: 'none' }}
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

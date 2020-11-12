import React from 'react';
import { Button } from 'antd';

import s from './index.less';

const CloseCandidateModal = (props) => {
  const { closeModal, title } = props;
  return (
    <div className={s.modalContent}>
      <h1>{title}</h1>
      <button onClick={closeModal}>OK</button>
    </div>
  );
};

export default CloseCandidateModal;

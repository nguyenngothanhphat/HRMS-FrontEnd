import React from 'react';
import { Button } from 'antd';
import img2 from '../images/modal_img_2.png';
import s from './index.less';

const CloseCandidateModal = (props) => {
  const { closeModal, title } = props;
  return (
    <div className={s.modalContent}>
      <img src={img2} alt="" />
      <h1>{title}</h1>
      <button onClick={closeModal}>OK</button>
    </div>
  );
};

export default CloseCandidateModal;

import React from 'react';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import styles from './index.less';

const ExportButton = (props) => {
  const { onClick = () => {}, fontSize = 13, title = 'Export' } = props;

  return (
    <div className={styles.ExportButton} onClick={onClick}>
      <img src={DownloadIcon} alt="" />
      <span style={{ fontSize: `${fontSize}px` }}>{title}</span>
    </div>
  );
};
export default ExportButton;

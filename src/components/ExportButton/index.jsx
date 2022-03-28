import React from 'react';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import styles from './index.less';

const ExportButton = (props) => {
  const { onClick = () => {}, fontSize = 13 } = props;

  return (
    <div className={styles.ExportButton} onClick={onClick}>
      <img src={DownloadIcon} alt="" />
      <span style={{ fontSize: `${fontSize}px` }}>Export</span>
    </div>
  );
};
export default ExportButton;

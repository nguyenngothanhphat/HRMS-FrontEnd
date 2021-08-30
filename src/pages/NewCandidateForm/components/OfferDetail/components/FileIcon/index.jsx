import React from 'react';

import WordIcon from '../images/word.png';
import ExcelIcon from '../images/excel.png';
import PdfIcon from '../images/pdf.png';

import styles from './index.less';

const FileIcon = (props) => {
  const { type } = props;
  switch (type) {
    case 'word':
      return <img className={styles.optionIcon} src={WordIcon} alt="word" />;
    case 'excel':
      return <img className={styles.optionIcon} src={ExcelIcon} alt="excel" />;
    case 'pdf':
      return <img className={styles.optionIcon} src={PdfIcon} alt="pdf" />;
    default:
      return null;
  }
};

export default FileIcon;

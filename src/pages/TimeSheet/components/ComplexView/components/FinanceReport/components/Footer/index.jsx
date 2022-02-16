import { Button } from 'antd';
import React from 'react';
import { connect } from 'umi';
import DownloadIcon from '@/assets/timeSheet/solidDownload.svg';
import styles from './index.less';

const Footer = (props) => {
  const { selectedProjects = [] } = props;
  // update type when there are api
  const handleFinish = async () => {
    const { dispatch } = props;

    const getListExport = await dispatch({
      type: 'timeSheet/',
    });
    const downloadLink = document.createElement('a');
    const universalBOM = '\uFEFF';
    downloadLink.href = `data:text/csv; charset=utf-8,${encodeURIComponent(
      universalBOM + getListExport,
    )}`;
    downloadLink.download = 'timesheet.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <div className={styles.Footer}>
      <div className={styles.left}>{selectedProjects.length} Projects selected</div>
      <div className={styles.right}>
        <Button icon={<img src={DownloadIcon} alt="" />} onClick={handleFinish}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default connect(() => ({}))(Footer);

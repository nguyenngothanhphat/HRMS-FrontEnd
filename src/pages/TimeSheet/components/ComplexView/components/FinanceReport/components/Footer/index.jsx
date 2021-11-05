import { Button } from 'antd';
import React from 'react';
import { connect } from 'umi';
import DownloadIcon from '@/assets/timeSheet/solidDownload.svg';
import styles from './index.less';

const Footer = (props) => {
  const { selectedProjects = [] } = props;
  return (
    <div className={styles.Footer}>
      <div className={styles.left}>{selectedProjects.length} Projects selected</div>
      <div className={styles.right}>
        <Button icon={<img src={DownloadIcon} alt="" />}>Download</Button>
      </div>
    </div>
  );
};

export default connect(() => ({}))(Footer);

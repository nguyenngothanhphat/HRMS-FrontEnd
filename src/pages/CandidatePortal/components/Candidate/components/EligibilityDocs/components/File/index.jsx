import React from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col, Tooltip } from 'antd';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import undo from '@/assets/candidatePortal/undo-signs.svg';
import WarningIcon from '@/assets/candidatePortal/warningIcon.svg';
import WarningGrayIcon from '@/assets/candidatePortal/warningGrayIcon.png';
import DoneIcon from '@/assets/candidatePortal/doneSign.svg';
import UploadImage from '../UploadImage';
import styles from './index.less';

const File = (props) => {
  const { item = {}, index = 0 } = props;
  const renderFileStatus = () => {
    // return (
    //   <Row>
    //     <Col span={24}>
    //       <div className={styles.upload}>
    //         <span>Upload</span>
    //         <img src="data:," alt="" />
    //       </div>
    //     </Col>
    //   </Row>
    // );

    // return (
    //   <Row>
    //     <Col span={24}>
    //       <div className={styles.resubmit}>
    //         <span>Resubmit</span>
    //         <img src="data:," alt="" />
    //       </div>
    //     </Col>
    //   </Row>
    // );

    // return (
    //   <Row justify="end">
    //     <Col span={12}>
    //       <div className={styles.notAvailable}>
    //         <span>Not Available</span>
    //       </div>
    //     </Col>
    //     <Col span={12}>
    //       <div className={styles.upload}>
    //         <span>Upload</span>
    //         <img src="data:," alt="" />
    //       </div>
    //     </Col>
    //   </Row>
    // );

    // return (
    //   <Row justify="end">
    //     <Col span={12}>
    //       <div className={styles.file}>
    //         <img src={WarningIcon} alt="undo" />
    //         <span>sample_file.pdf</span>
    //       </div>
    //     </Col>
    //     <Col span={12}>
    //       <div className={styles.upload}>
    //         <span>Upload</span>
    //         <img src="data:," alt="" />
    //       </div>
    //     </Col>
    //   </Row>
    // );

    return (
      <Row justify="end">
        <Col span={12}>
          <div className={styles.file}>
            <img src={WarningIcon} alt="undo" />
            <span>sample_file.pdf</span>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.verified}>
            <span>Verified</span>
            <Tooltip title="Accepted by HR" placement="right">
              <img src={DoneIcon} alt="" />
            </Tooltip>
          </div>
        </Col>
      </Row>
    );

    // return (
    //   <Row justify="end">
    //     <Col span={24}>
    //       <div className={styles.pending}>
    //         <span>Pending Verification</span>
    //         <Tooltip title="The document is pending for verification by the HR" placement="right">
    //           <img src={WarningGrayIcon} alt="" />
    //         </Tooltip>
    //       </div>
    //     </Col>
    //   </Row>
    // );

    // return (
    //   <Row justify="end">
    //     <Col span={24}>
    //       <div className={styles.comments}>
    //         <span>View Comments</span>
    //       </div>
    //     </Col>
    //   </Row>
    // );
  };

  return (
    <Row className={styles.File} justify="space-between">
      <Col span={16}>
        <span>
          {item.alias}
          {item.required && '*'}
        </span>
      </Col>
      <Col span={8}>{renderFileStatus()}</Col>
    </Row>
  );
};

export default File;

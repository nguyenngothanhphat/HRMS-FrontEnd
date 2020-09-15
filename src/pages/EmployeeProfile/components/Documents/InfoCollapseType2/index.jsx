import { Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import TypeRow from './TypeRow';
import styles from './index.less';

class InfoCollapseType2 extends PureComponent {
  render() {
    const { data = [] } = this.props;
    return (
      <div className={styles.InfoCollapseType2}>
        <div className={styles.tableTitle}>
          <span>{data.title}</span>
        </div>
        <div className={styles.tableContent}>
          <Row className={styles.columnName}>
            <Col span={8}>
              {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.type' })}
            </Col>
            <Col span={7}>
              {data.type === 1
                ? formatMessage({
                    id: 'pages.employeeProfile.documents.infoCollapseType2.generatedBy',
                  })
                : formatMessage({
                    id: 'pages.employeeProfile.documents.infoCollapseType2.uploadedBy',
                  })}
            </Col>
            <Col span={7}>
              {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.date' })}
            </Col>
            <Col className={styles.status} span={2}>
              {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.status' })}
            </Col>
          </Row>
          <div className={styles.tableOfContents}>
            <TypeRow data={data.body} />
          </div>
        </div>
      </div>
    );
  }
}

export default InfoCollapseType2;

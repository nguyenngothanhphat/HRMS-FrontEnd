import { Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import CollapseRow from './components/CollapseRow';
import styles from './index.less';

class InfoCollapseType2 extends PureComponent {
  _renderChildren = () => {
    const { category: { children = [] } = {}, onFileClick = () => {}, isHR } = this.props;

    return children.map((child, index) => {
      return (
        <>
          <CollapseRow
            categoryId={child?._id}
            key={`${index + 1}`}
            onFileClick={onFileClick}
            data={child}
            isHR={isHR}
          />
          {index + 1 < children.length && <div className={styles.divider} />}
        </>
      );
    });
  };

  render() {
    const { category = {} } = this.props;
    const { name = '' } = category;
    return (
      <div className={styles.InfoCollapseType2}>
        <div className={styles.tableTitle}>
          <span>{name}</span>
        </div>
        <div className={styles.tableContent}>
          <Row className={styles.columnName}>
            <Col span={8}>
              {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.type' })}
            </Col>
            <Col span={6}>Uploaded by</Col>
            <Col span={6}>
              {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.date' })}
            </Col>
            <Col className={styles.status} span={4}>
              {/* {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.status' })} */}
              Status
            </Col>
          </Row>
          <div className={styles.tableOfContents}>{this._renderChildren()}</div>
        </div>
      </div>
    );
  }
}

export default InfoCollapseType2;

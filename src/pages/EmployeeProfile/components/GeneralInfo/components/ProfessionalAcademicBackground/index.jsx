import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './index.less';

class ProfessionalAcademicBackground extends PureComponent {
  render() {
    const dummyData = [
      { label: 'Previous Job label', value: 'Senior UX Designer' },
      { label: 'Previous Company', value: 'Apple' },
      { label: 'Past Experience', value: '5 Years' },
      { label: 'Total Experience', value: '12 Years' },
      { label: 'Qualification', value: '12th PUC' },
    ];
    return (
      <div className={styles.root}>
        <div className={styles.viewTitle}>
          <p className={styles.viewTitle__text}>Professional &amp; Academic Background</p>
          <div className={styles.viewTitle__edit}>
            <EditFilled className={styles.viewTitle__edit__icon} />
            <p className={styles.viewTitle__edit__text}>Edit</p>
          </div>
        </div>
        <div className={styles.viewBottom}>
          <Row gutter={[0, 16]}>
            {dummyData.map((item) => (
              <Fragment key={item.label}>
                <Col span={6} className={styles.textLabel}>
                  {item.label}
                </Col>
                <Col span={18} className={styles.textValue}>
                  {item.value}
                </Col>
              </Fragment>
            ))}
            {/* Custom Col Here */}
          </Row>
        </div>
      </div>
    );
  }
}

export default ProfessionalAcademicBackground;

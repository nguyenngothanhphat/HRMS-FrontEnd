import React, { PureComponent } from 'react';
import { Row, Col, Input } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    candidatePortal: { data: { department = {}, workLocation = {}, grade = {}, title = {} } = {} },
  }) => ({
    department,
    workLocation,
    grade,
    title,
  }),
)
class SalaryStructureInfoBoxes extends PureComponent {
  render() {
    const {
      department = {} || {},
      workLocation = {} || {},
      grade = {},
      title = {} || {},
    } = this.props;

    return (
      <div className={styles.SalaryStructureInfoBoxes}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}>Grade</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input value={grade.name} size="large" disabled />
            </div>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}>Department</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input
                value={department ? department.name : department || null}
                size="large"
                disabled
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}>Location</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input
                value={workLocation ? workLocation.name : workLocation || null}
                size="large"
                // style={{ width: 280 }}
                disabled
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}>Job Title</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input
                value={title ? title.name : title || null}
                size="large"
                // style={{ width: 280 }}
                disabled
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default SalaryStructureInfoBoxes;

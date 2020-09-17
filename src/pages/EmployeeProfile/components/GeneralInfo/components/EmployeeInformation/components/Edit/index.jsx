import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Input } from 'antd';
import styles from './index.less';

class Edit extends PureComponent {
  handleChange = () => {
    // console.log(e);
  };

  render() {
    const dummyData = [
      { label: 'Legal Name', value: 'Aditya Venkatesh' },
      { label: 'Date of Birth', value: '21st May 1995' },
      { label: 'Legal Gender', value: 'Male' },
      { label: 'Employee ID', value: 'PSI 2029' },
      { label: 'Work Email', value: 'aditya@lollypop.design' },
      { label: 'Work Number', value: '+91-8900445577' },
      { label: 'Adhaar Card Number', value: '9999-0000-0000-0000' },
      { label: 'UAN Number', value: '8736456' },
    ];
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
            </Col>
            <Col span={18} className={styles.textValue}>
              <Input onChange={this.handleChange} />
            </Col>
          </Fragment>
        ))}
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;

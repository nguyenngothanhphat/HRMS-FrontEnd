/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Row, Col, Select, Typography } from 'antd';
import { connect } from 'umi';

const { Option } = Select;

@connect(({ info: { jobDetail } = {} }) => ({
  jobDetail,
}))
class FirstFieldsComponent extends PureComponent {
  static getDerivedStateFromProps(props) {
    if ('jobDetail' in props) {
      return { jobDetail: props.jobDetail || {} };
    }
    return null;
  }

  render() {
    const { styles, dropdownField = [], handleSelect = () => {} } = this.props;
    const { jobDetail = {} } = this.state;
    const { department, jobTitle, jobCategory, workLocation, reportingManager } = jobDetail;
    return (
      <>
        <div>
          <Row gutter={[24, 0]}>
            {dropdownField.map((item) => (
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                offset={item.title === 'department' ? 12 : 0}
                pull={item.title === 'department' ? 12 : 0}
              >
                <Typography.Title level={5}>{item.name}</Typography.Title>
                <Select
                  placeholder={item.placeholder}
                  className={styles}
                  onChange={(e) => handleSelect(e, item.title)}
                  defaultValue={
                    item.title === 'department'
                      ? department
                      : item.title === 'jobTitle'
                      ? jobTitle
                      : item.title === 'jobCategory'
                      ? jobCategory
                      : item.title === 'workLocation'
                      ? workLocation
                      : item.title === 'reportingManager'
                      ? reportingManager
                      : null
                  }
                >
                  {item.Option.map((data) => (
                    <Option value={data.value}>
                      <Typography.Text>{data.value}</Typography.Text>
                    </Option>
                  ))}
                </Select>
              </Col>
            ))}
          </Row>
        </div>
      </>
    );
  }
}

export default FirstFieldsComponent;

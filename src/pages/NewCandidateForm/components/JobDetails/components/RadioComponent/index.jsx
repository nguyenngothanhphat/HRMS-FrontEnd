/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Radio, Typography, Row, Col } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect()
class RadioComponent extends PureComponent {
  componentDidMount() {
    const { employeeType = '', dispatch, employeeTypeList = [], tempData = {} } = this.props;

    if (!employeeType) {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          tempData: {
            ...tempData,
            employeeType: {
              _id: employeeTypeList[0]?._id,
              name: employeeTypeList[0]?.name,
            },
          },
        },
      });
    }
  }

  render() {
    const {
      Tab,
      handleRadio,
      employeeTypeList,
      employeeType,
      position,
      data: test,
      // processStatus,
      disabled,
    } = this.props;

    return (
      <div className={styles.RadioComponent}>
        {test.employeeType && test.position === null ? null : (
          <>
            <Typography.Title level={5}>{`${Tab.positionTab.title}*`}</Typography.Title>
            <Radio.Group
              className={styles.Padding}
              defaultValue={position !== 'EMPLOYEE' ? test.position : position}
              onChange={(e) => handleRadio(e)}
              name={Tab.positionTab.name}
            >
              <Row gutter={[24, 0]}>
                {Tab.positionTab.arr.map((data) => (
                  <Col>
                    <Radio
                      className={styles.paddingRightRadio}
                      value={data.value}
                      disabled={disabled}
                    >
                      <Typography.Text>{data.position}</Typography.Text>
                    </Radio>
                  </Col>
                ))}
              </Row>
            </Radio.Group>
            <Typography.Title level={5} className={styles.paddingBotTitle}>
              {`${Tab.classificationTab.title}*`}
            </Typography.Title>

            <Radio.Group
              className={styles.paddingRadio}
              // defaultValue={isObject(employeeType) ? employeeType._id : INTERN_TYPE}
              defaultValue={employeeType ? employeeType._id : employeeTypeList[0]._id}
              onChange={(e) => handleRadio(e)}
              name={Tab.classificationTab.name}
            >
              <Row gutter={[24, 0]}>
                <Col>
                  {employeeTypeList.map((data) => (
                    <Radio className={styles.Radio} value={data._id} disabled={disabled}>
                      <Typography.Text>{data.name}</Typography.Text>
                    </Radio>
                  ))}
                </Col>
              </Row>
            </Radio.Group>
          </>
        )}
      </div>
    );
  }
}

export default RadioComponent;

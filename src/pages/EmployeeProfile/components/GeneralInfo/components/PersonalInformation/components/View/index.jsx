import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip, Radio } from 'antd';
import Icon, { LockFilled, UserOutlined } from '@ant-design/icons';
import iconQuestTion from '../../../Icon/icon';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const { dataAPI } = this.props;
    const dummyData = [
      { label: 'Personal Number', value: dataAPI.personalNumber },
      { label: 'Personal Email', value: dataAPI.personalEmail },
      { label: 'Blood Group', value: dataAPI.Blood },
      { label: 'Marital Status', value: dataAPI.maritalStatus },
      { label: 'Linkedin', value: dataAPI.linkedIn },
      {
        label: 'Residence Address',
        value: dataAPI.residentAddress,
      },
      { label: 'Current Address', value: dataAPI.currentAddress },
    ];
    const content =
      'The number will be still visible to your Reporting Manager, HR and Finance teams however you can Choose to keep it hidden from other co-workers by toggling the highlighted toggle switch!';
    const contentEmail =
      'The email will be still visible to your Reporting Manager, HR and Finance teams however you can Choose to keep it hidden from other co-workers by toggling the highlighted toggle switch!';
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
              {item.label === 'Personal Number' || item.label === 'Personal Email' ? (
                <Tooltip
                  placement="top"
                  title={item.label === 'Personal Number' ? content : contentEmail}
                  overlayClassName={styles.GenPITooltip}
                  color="#568afa"
                >
                  <Icon component={iconQuestTion} className={styles.iconQuestTion} />
                </Tooltip>
              ) : (
                ''
              )}
            </Col>
            <Col
              span={16}
              className={item.label === 'Linkedin' ? styles.Linkedin : styles.textValue}
            >
              {item.value}
            </Col>
            {item.label === 'Personal Number' || item.label === 'Personal Email' ? (
              <Col span={2}>
                <div className={styles.iconBox}>
                  <Radio.Group
                    defaultValue="a"
                    buttonStyle="solid"
                    size="small"
                    className={styles.iconRadio}
                  >
                    <Radio.Button value="a">
                      <LockFilled />
                    </Radio.Button>
                    <Radio.Button value="b">
                      <UserOutlined />
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            ) : (
              ''
            )}
          </Fragment>
        ))}
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;

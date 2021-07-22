import { Button, Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import icon from '@/assets/settingTimeoff.svg';
import { connect } from 'umi';
import t from './index.less';

@connect()
class ScreenBegin extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        pageStart: false,
      },
    });
  }

  render() {
    const { handleChange = () => {} } = this.props;

    return (
      <div className={t.beginScreen}>
        <div className={t.from}>
          <div className={t.bodyContent}>
            <Row>
              <Col span={11}>
                <div className={t.title}>
                  Help us setup the timeoff policies for your employees.
                </div>
                <div className={t.subTitle}>
                  Tell us the kind of time offs (both paid, unpaid & holidays) your company provide.
                  We will setup the policies for you.
                </div>
                <Button onClick={() => handleChange(false)}>Get Started</Button>
              </Col>
              <Col span={13}>
                <div className={t.footer}>
                  <img src={icon} alt="" />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
export default ScreenBegin;

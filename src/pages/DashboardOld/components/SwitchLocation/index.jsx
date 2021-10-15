import React, { PureComponent } from 'react';
import { Row, Col, Select, Button } from 'antd';
import { history, connect } from 'umi';

import s from './index.less';

const { Option } = Select;

@connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { currentUser: { company: { _id: companyId = '', logoUrl = '' } = {} } = {} } = {},
    loading,
  }) => ({
    listLocationsByCompany,
    companyId,
    logoUrl,
    loadingFetchLocation: loading.effects['locationSelection/fetchLocationsByCompany'],
  }),
)
class SwitchLocation extends PureComponent {
  componentDidMount = () => {
    const { dispatch, companyId = '' } = this.props;
    dispatch({
      type: 'locationSelection/fetchLocationsByCompany',
      payload: {
        company: companyId,
      },
    });
  };

  onFinish = () => {
    history.push('/');
  };

  render() {
    const { listLocationsByCompany = [] } = this.props;

    return (
      <div className={s.SwitchLocation}>
        <Row className={s.container}>
          <Col span={4}>
            <span>Switch location</span>
          </Col>
          <Col span={14}>
            <Select placeholder="Select location">
              {listLocationsByCompany.map((value) => {
                const { _id = '', name = '' } = value;
                return <Option value={_id}>{name}</Option>;
              })}
            </Select>
          </Col>
          <Col span={6}>
            <div className={s.operationButtons}>
              <Button className={s.proceedBtn} onClick={this.onFinish}>
                Switch
              </Button>
              {/* <Button onClick={() => onClose(false)}>Cancel</Button> */}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default SwitchLocation;

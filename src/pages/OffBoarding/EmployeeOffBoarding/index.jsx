import React, { Component } from 'react';
import { Row, Col, Affix } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ViewLeft from './components/ViewLeft';
import ViewRight from './components/ViewRight';
import RightDataTable from './components/RightContent';
import styles from './index.less';

@connect(
  ({
    offboarding: { listOffboarding = [], totalList = [], hrManager = {} } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
  }) => ({
    totalList,
    locationID,
    companyID,
    listOffboarding,
    hrManager,
  }),
)
class EmployeeOffBoading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'offboarding/fetchList',
      payload: {
        status: 'IN-PROGRESS',
      },
    });
  }

  render() {
    const { listOffboarding = [], totalList = [], hrManager = {} } = this.props;

    return (
      <PageContainer>
        <div className={styles.root}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Terminate work relationship</p>
              <div>
                <span className={styles.textActivity}>View Activity Log</span>
                <span className={styles.textActivity} style={{ color: 'red', padding: '5px' }}>
                  (00)
                </span>
              </div>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 0]}>
            <Col span={18}>
              <ViewLeft data={listOffboarding} countdata={totalList} hrManager={hrManager} />
            </Col>
            <Col span={6}>{listOffboarding.length > 0 ? <RightDataTable /> : <ViewRight />}</Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default EmployeeOffBoading;

import React, { Component } from 'react';
import { Tabs, Steps } from 'antd';
import { connect } from 'umi';
// import icon from '@/assets/offboarding-flow.svg';
// import TableAssigned from '@/components/TableAssigned';
import ViewTable from './ViewTable';
import TabDrafts from './TableEmployee';

import styles from './index.less';

const { Step } = Steps;

const steps = [
  {
    step: 1,
    description: 'Begin the process',
  },
  {
    step: 2,
    description: 'Submit request',
  },
  {
    step: 3,
    description: '1-1 with your manager & their approval',
  },
  {
    step: 4,
    description: 'HR Approval',
  },
  {
    step: 5,
    description: '2 days before LWD, Relieving formalities initiated',
  },
  {
    step: 6,
    description: 'Exit Interview & profile closure',
  },
  {
    step: 7,
    description: 'Send relieving documents',
  },
  {
    step: 8,
    description: 'Termination Complete',
  },
];

@connect()
class ViewLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabId: '1',
      current: 0,
    };
  }

  componentDidMount() {
    // const { data } = this.props;
    // console.log('data: ', data);
    // this.initDataTable('1');
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { tabId } = this.state;
    const { tabId: nextTabId } = nextState;
    if (tabId !== nextTabId) {
      this.initDataTable(nextTabId);
    }
    return true;
  }

  initDataTable = (tabId) => {
    const { dispatch } = this.props;
    if (tabId === '1') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'IN-PROGRESS',
        },
      });
    }
    if (tabId === '2') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'DRAFT',
        },
      });
    }
  };

  callback = (key) => {
    this.setState({
      tabId: key,
    });
  };

  onChangeSteps = (values) => {
    // console.log(values);
  };

  operations = (countdata = []) => {
    if (countdata.length > 0) {
      return (
        <div className={styles.status}>
          <div className={styles.status__text}>Status: </div>
          <div className={styles.action}>
            <div className={styles.action__dot} />
            <div className={styles.action__text}>{countdata[0]._id}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    const { TabPane } = Tabs;
    const { data = [], countdata = [], hrManager = {}, fetchData = () => {} } = this.props;
    const { current = 0, tabId } = this.state;
    const checkDraft = countdata.filter(({ _id }) => _id === 'DRAFT').length > 0;
    // const checkAccepted = countdata.find(({ _id }) => _id === 'ACCEPTED') || {};
    // const checkSendRequest = checkInprogress.count > 0 || checkAccepted.count > 0;
    const currentStep = data.length > 0 ? data[0].nodeStep : 0;

    return (
      <div className={styles.Container}>
        {/* <div className={styles.title_Box}>
          <img src={icon} alt="iconCheck" className={styles.icon} />
          <span className={styles.title_Text}>
            Super six years with us. Thank you. We are indebted by your contribution to our company
            and clients all this while.
            <div>
              This is not the end we like to see.{' '}
              <span style={{ color: 'blue' }}> Request for feedback?</span>
            </div>
          </span>
        </div>
        {!checkSendRequest && (
          <>
            <div className={styles.subTitle_Text}>
              But, if you have made your mind then lets get to it.
            </div>
            <Button className={styles.submitButton}>
              <Link to="/offboarding/resignation-request">Set a resignation request</Link>
            </Button>
          </>
        )} */}

        <div className={styles.headerTerminate}>
          <div className={styles.leftSection}>
            <div className={styles.leftSection__title}>Super six years with us. Thank you.</div>
            <div className={styles.leftSection__content}>
              We are indebted by your contribution to our company and clients all this while. This
              is not the end we like to see.
            </div>
            <a href="#" className={styles.leftSection__linkRequest}>
              Request for feedback?
            </a>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.rightSection__bg} />
          </div>
        </div>

        <div className={styles.titleProcess}>
          However, if you have made your mind. We respect that as well.
        </div>
        <div className={styles.offboardingProcess}>
          <div className={styles.offboardingProcess__subtitle}>
            Our offboarding process at a glance
          </div>
          <div className={styles.offboardingProcess__process}>
            <Steps current={currentStep} onChange={this.onChangeSteps} labelPlacement="vertical">
              {steps.map((item) => (
                <Step key={item.step} description={item.description} />
              ))}
            </Steps>
          </div>
        </div>

        <div>
          <Tabs
            defaultActiveKey="1"
            className={styles.tabComponent}
            onTabClick={this.callback}
            tabBarExtraContent={tabId === '1' ? this.operations(countdata) : null}
          >
            {!checkDraft ? (
              <TabPane tab="Your Request" key="1">
                <div className={styles.marrinTop}>
                  <ViewTable
                    data={data}
                    countTable={countdata}
                    hrManager={hrManager}
                    tabId={tabId}
                    fetchData={fetchData}
                  />
                </div>
              </TabPane>
            ) : (
              <TabPane tab="Saved Draft" key="2">
                <div className={styles.marrinTop}>
                  <TabDrafts
                    fetchData={fetchData}
                    data={data}
                    textEmpty="No draft saved"
                    tabId={tabId}
                  />
                </div>
              </TabPane>
            )}
            {/* <TabPane tab="Assigned" key="3">
              <div className={styles.marrinTop}>
                <TableAssigned />
              </div>
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ViewLeft;

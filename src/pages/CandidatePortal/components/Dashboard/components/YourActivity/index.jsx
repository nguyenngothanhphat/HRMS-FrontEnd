import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import ArrowDownIcon from '@/assets/candidatePortal/arrowDown.svg';
import UpcomingEvents from './components/UpcomingEvents';
import NextSteps from './components/NextSteps';
// import Messages from './components/Messages';
import CommonModal from '../CommonModal';
import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ candidatePortal: { upcomingEvents: events = [], nextSteps: steps = [] } = {} }) => ({
  events,
  steps,
}))
class YourActivity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      activeKey: '1',
    };
  }

  addZeroToNumber = (number) => {
    if (number < 10 && number >= 0) return `0${number}`.slice(-2);
    return number;
  };

  openModal = (value) => {
    this.setState({
      openModal: value,
    });
  };

  getTitleModal = (activeKey, eventTabName, nextStepsTabName) => {
    switch (activeKey) {
      case '1':
        return eventTabName;
      case '2':
        return nextStepsTabName;
      default:
        return 'Unknown tab';
    }
  };

  getContentModal = (activeKey) => {
    const { events = [], steps = [] } = this.props;
    switch (activeKey) {
      case '1':
        return events;
      case '2':
        return steps;
      default:
        return 'Unknown tab';
    }
  };

  render() {
    const { events = [], steps = [] } = this.props;
    const { activeKey, openModal } = this.state;
    const eventTabName = `Upcoming events (${this.addZeroToNumber(events.length)})`;
    const nextStepsTabName = `Next Steps`;
    return (
      <div className={styles.YourActivity}>
        <div>
          <div className={styles.header}>
            <span>Your Activity</span>
          </div>
          <div className={styles.content}>
            <Tabs activeKey={activeKey} onTabClick={(key) => this.setState({ activeKey: key })}>
              <TabPane tab={eventTabName} key="1">
                <UpcomingEvents events={events} sliceNumber={3} />
              </TabPane>
              <TabPane tab={nextStepsTabName} key="2">
                <NextSteps steps={steps} sliceNumber={3} />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={styles.viewMoreBtn} onClick={() => this.openModal(true)}>
          <span>View More</span>
          <img src={ArrowDownIcon} alt="expand" />
        </div>
        <CommonModal
          title={this.getTitleModal(activeKey, eventTabName, nextStepsTabName)}
          content={this.getContentModal(activeKey)}
          visible={openModal}
          onClose={() => this.openModal(false)}
          type="your-activity"
          tabKey={activeKey}
        />
      </div>
    );
  }
}

export default YourActivity;

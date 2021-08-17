import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import ArrowDownIcon from '@/assets/candidatePortal/arrowDown.svg';
import UpcomingEvents from './components/UpcomingEvents';
import NextSteps from './components/NextSteps';
// import Messages from './components/Messages';
import CommonModal from '../CommonModal';
import styles from './index.less';

const { TabPane } = Tabs;

const steps = [
  {
    content: `Once documents are uploaded, you will have a formal induction to start off.`,
  },
  {
    content: `This will be followed by a 1-1 call with the UX Design Lead and your Manager.`,
  },
  {
    content: `You will then have an Introduction call with your team. This would be with the UX team.`,
  },
  {
    content: `This will be followed by a 1-1 call with the UX Design Lead and your Manager.`,
  },
  {
    content: `You will then have an Introduction call with your team. This would be with the UX team.`,
  },
];

const events = [
  {
    content: `HR Induction 4PM @ Thursday July 05, 2021
4PM - 5PM (IST)`,
  },
  {
    content: `Welcome to the Pop Tribe 2:30PM @ Friday
July 06, 2021 2:30 - 3:30 (IST)`,
  },
  {
    content: `Game session with Lollypop Tribe 6PM @ Friday
July 06, 2021 6PM - 7PM (IST)`,
  },
  {
    content: `HR Induction 4PM @ Thursday July 05, 2021
4PM - 5PM (IST)`,
  },
  {
    content: `Welcome to the Pop Tribe 2:30PM @ Friday
July 06, 2021 2:30 - 3:30 (IST)`,
  },
  {
    content: `Game session with Lollypop Tribe 6PM @ Friday
July 06, 2021 6PM - 7PM (IST)`,
  },
  {
    content: `HR Induction 4PM @ Thursday July 05, 2021
4PM - 5PM (IST)`,
  },
  {
    content: `Welcome to the Pop Tribe 2:30PM @ Friday
July 06, 2021 2:30 - 3:30 (IST)`,
  },
  {
    content: `Game session with Lollypop Tribe 6PM @ Friday
July 06, 2021 6PM - 7PM (IST)`,
  },
];

const messages = [
  {
    title: `What’s next?`,
    content: `Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: 'Welcome to Lollypop Design Studio!',
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: 'Welcome to Terralogic Family!',
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: `What’s next?`,
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: 'Welcome to Lollypop Design Studio!',
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: 'Welcome to Terralogic Family!',
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
];

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

  getTitleModal = (activeKey, eventTabName, nextStepsTabName, messageTabName) => {
    switch (activeKey) {
      case '1':
        return eventTabName;
      case '2':
        return nextStepsTabName;
      case '3':
        return messageTabName;
      default:
        return 'Unknown tab';
    }
  };

  getContentModal = (activeKey) => {
    switch (activeKey) {
      case '1':
        return events;
      case '2':
        return steps;
      case '3':
        return messages;
      default:
        return 'Unknown tab';
    }
  };

  render() {
    const { activeKey, openModal } = this.state;
    const eventTabName = `Upcoming events (${this.addZeroToNumber(events.length)})`;
    const nextStepsTabName = `Next Steps`;
    const messageTabName = `Messages (${this.addZeroToNumber(messages.length)})`;
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
              {/* <TabPane tab={messageTabName} key="3">
                <Messages messages={messages} sliceNumber={3} />
              </TabPane> */}
            </Tabs>
          </div>
        </div>
        <div className={styles.viewMoreBtn} onClick={() => this.openModal(true)}>
          <span>View More</span>
          <img src={ArrowDownIcon} alt="expand" />
        </div>
        <CommonModal
          title={this.getTitleModal(activeKey, eventTabName, nextStepsTabName, messageTabName)}
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

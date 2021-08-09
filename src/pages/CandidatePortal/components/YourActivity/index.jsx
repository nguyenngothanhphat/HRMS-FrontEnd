import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import UpcomingEvents from './components/UpcomingEvents';
import NextSteps from './components/NextSteps';
import Messages from './components/Messages';
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
];

const messages = [
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
  addZeroToNumber = (number) => {
    if (number < 10 && number >= 0) return `0${number}`.slice(-2);
    return number;
  };

  render() {
    return (
      <div className={styles.YourActivity}>
        <div>
          <div className={styles.header}>
            <span>Your Activity</span>
          </div>
          <div className={styles.content}>
            <Tabs defaultActiveKey="1">
              <TabPane tab={`Upcoming events (${this.addZeroToNumber(events.length)})`} key="1">
                <UpcomingEvents events={events} />
              </TabPane>
              <TabPane tab="Next Steps" key="2">
                <NextSteps steps={steps} />
              </TabPane>
              <TabPane tab={`Messages (${this.addZeroToNumber(steps.length)})`} key="3">
                <Messages messages={messages} />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={styles.viewMoreBtn}>
          <span>View More</span>
        </div>
      </div>
    );
  }
}

export default YourActivity;

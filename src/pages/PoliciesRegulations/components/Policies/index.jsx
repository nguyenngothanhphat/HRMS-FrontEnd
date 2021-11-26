import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Row, Col, Button, Menu } from 'antd';
import IconContact from '@/assets/policiesRegulations/policies-icon-contact.svg';

import EmployeeConduct from './components/EmployeeConduct';
import LeavePolicy from './components/LeavePolicy';
import CompanyAssetPolicy from './components/CompanyAssetPolicy';
import TechnologyUsage from './components/TechnologyUsage';
import TravelPolicy from './components/TravelPolicy';

import styles from './index.less';

@connect(({ info: { currentStep = 0, displayComponent = {} } = {} }) => ({
  currentStep,
  displayComponent,
}))
class Policies extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  handleChange = (key) => {
    this.setState({ content: key });
  };

  render() {
    const getContent = () => {
      const { content } = this.state;
      switch (content) {
        case 'employee-conduct':
          return <EmployeeConduct />;
        case 'leave-policy':
          return <LeavePolicy />;
        case 'company-asset-policy':
          return <CompanyAssetPolicy />;
        case 'technology-usage':
          return <TechnologyUsage />;
        case 'travel-policy':
          return <TravelPolicy />;

        default:
          return <EmployeeConduct />;
      }
    };

    return (
      <div className={styles.PoliciesLayout}>
        <Row>
          <Col sm={24} md={6} xl={5} className={styles.viewLeft}>
            <div className={styles.viewLeft__menu}>
              <Menu
                defaultSelectedKeys={['employee-conduct']}
                onClick={(e) => this.handleChange(e.key)}
              >
                <Menu.Item key="employee-conduct">Employee Conduct</Menu.Item>
                <Menu.Item key="leave-policy">Leave Policy</Menu.Item>
                <Menu.Item key="company-asset-policy">Company Asset Policy</Menu.Item>
                <Menu.Item key="technology-usage">Technology Usage</Menu.Item>
                <Menu.Item key="travel-policy">Travel Policy</Menu.Item>
              </Menu>
              <div className={styles.viewLeft__menu__btnPreviewOffer} />
            </div>
          </Col>
          <Col sm={24} md={8} xl={13} className={styles.viewCenter}>
            {getContent()}
          </Col>
          <Col sm={24} md={10} xl={6} className={styles.viewRight}>
            <div className={styles.viewRight__title}>
              <div className={styles.viewRight__title__container}>
                <div className={styles.viewRight__title__container__boder}>
                  <img src={IconContact} alt="Icon Contact" />
                </div>
              </div>
              <div className={styles.viewRight__title__text}>Still need our help?</div>
            </div>
            <div className={styles.viewRight__content}>
              Our support team is waiting to help you 24/7. Get an emailed response from our team.
            </div>
            <div className={styles.viewRight__btnContact}>
              <Button>Contact Us</Button>
            </div>
            <div />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Policies;

import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Row, Col, Button, Menu } from 'antd';
import IconContact from '@/assets/policiesRegulations/policies-icon-contact.svg';
import PdfIcon from '@/assets/policiesRegulations/pdf-2.svg';
import ViewIcon from '@/assets/policiesRegulations/view.svg';

import DocumentModal from './components/DocumentModal';
import EmployeeConduct from './components/EmployeeConduct';
import LeavePolicy from './components/LeavePolicy';
import CompanyAssetPolicy from './components/CompanyAssetPolicy';
import TechnologyUsage from './components/TechnologyUsage';
import TravelPolicy from './components/TravelPolicy';

import styles from './index.less';

const data = [
  {
    id: 'employee-conduct',
    category: 'Employee Conduct',
    attachment: [
      {
        id: 1,
        name: 'Leave Managaement 2020',
      },
      {
        id: 2,
        name: 'Relieving Formalities',
      },
      {
        id: 3,
        name: 'Variable Pay Policy',
      },
      {
        id: 4,
        name: 'Employee Handbook 2020',
      },
      {
        id: 5,
        name: 'Referral Bonus Policy',
      },
    ],
  },
  {
    id: 'travel-policy',
    category: 'Travel Policy',
    attachment: [
      {
        id: 1,
        name: 'Leave Managaement 2020',
      },
      {
        id: 2,
        name: 'Relieving Formalities',
      },
    ],
  },
  {
    id: 'technology-usage',
    category: 'Technology usage',
    attachment: [
      {
        id: 1,
        name: 'Leave Managaement 2020',
      },
      {
        id: 2,
        name: 'Relieving Formalities',
      },
      {
        id: 3,
        name: 'Variable Pay Policy',
      },
      {
        id: 4,
        name: 'Employee Handbook 2020',
      },
    ],
  },
  {
    id: 'company-asset-policy',
    category: 'Company Asset Policy',
    attachment: [
      {
        id: 1,
        name: 'Leave Managaement 2020',
      },
      {
        id: 2,
        name: 'Relieving Formalities',
      },
      {
        id: 3,
        name: 'Variable Pay Policy',
      },
    ],
  },
  {
    id: 'leave-policy',
    category: 'Leave Policy',
    attachment: [
      {
        id: 1,
        name: 'Leave Managaement 2020',
      },
      {
        id: 2,
        name: 'Relieving Formalities',
      },
    ],
  },
];
@connect(({ info: { currentStep = 0, displayComponent = {} } = {} }) => ({
  currentStep,
  displayComponent,
}))
class Policies extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: 'employee-conduct',
      viewDocument: false,
    };
  }

  handleChange = (key) => {
    this.setState({ content: key });
  };

  render() {
    const { viewDocument } = this.state;
    const getContent = () => {
      const { content } = this.state;
      const policy = data.filter((val) => val.id === content);

      if (policy) {
        const item = policy[0];
        return item.attachment.map((val) => {
          return (
            <div key={val.id} className={styles.viewCenter__title}>
              <div className={styles.viewCenter__title__text}>
                <img src={PdfIcon} alt="pdf" />
                <span className={styles.viewCenter__title__text__category}>{val.name}</span>
              </div>
              <Button
                className={styles.viewCenter__title__view}
                icon={<img src={ViewIcon} alt="view" />}
                onClick={() => this.setState({ viewDocument: true })}
              >
                <span className={styles.viewCenter__title__view__text}>View</span>
              </Button>
            </div>
          );
        });
      }
      return '';
    };
    // switch (content) {
    //   case 'employee-conduct':
    //     // return <EmployeeConduct />;
    //     return renderPolicy('Variable Pay Policy');
    //   case 'leave-policy':
    //     return <LeavePolicy />;
    //   case 'company-asset-policy':
    //     return <CompanyAssetPolicy />;
    //   case 'technology-usage':
    //     return <TechnologyUsage />;
    //   case 'travel-policy':
    //     return <TravelPolicy />;

    //   default:
    //     return <EmployeeConduct />;
    // }
    // };
    // const renderPolicy = (name) => {
    //   return (
    //     <div className={styles.viewCenter__content}>
    //       <div>
    //         <img src={PdfIcon} alt="pdf" />
    //         <span>{name}</span>
    //       </div>
    //       <div>
    //         <img src={ViewIcon} alt="view" />
    //         <span>View</span>
    //       </div>
    //     </div>
    //   );
    // };
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
            <DocumentModal
              visible={viewDocument}
              onClose={() => this.setState({ viewDocument: false })}
            />
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

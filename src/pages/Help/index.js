import React, { PureComponent } from 'react';
import { Row, Col, Affix } from 'antd';
import Demo from '@/components/VideosDemo';
import styles from './index.less';

class Help extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tagSelected: 'WebAddNewExpense',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.listenToScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
  }

  listenToScroll = () => {
    const position = window.pageYOffset;
    if (position < 500) {
      this.setState({ tagSelected: 'WebAddNewExpense' });
    } else if (position > 500 && position < 1000) {
      this.setState({ tagSelected: 'WebAddNewMileage' });
    } else if (position > 1000 && position < 1500) {
      this.setState({ tagSelected: 'WebDeleteUpdateAnExpense' });
    } else if (position > 1500 && position < 2000) {
      this.setState({ tagSelected: 'WebAddANewReport' });
    } else if (position > 2000 && position < 2500) {
      this.setState({ tagSelected: 'WebApproveAReport' });
    } else if (position > 2500 && position < 3000) {
      this.setState({ tagSelected: 'WebCommentAReport' });
    } else if (position > 3000 && position < 3500) {
      this.setState({ tagSelected: 'WebAskForMoreInfoAReport' });
    } else if (position > 3500 && position < 4000) {
      this.setState({ tagSelected: 'WebRejectAReport' });
    } else if (position > 4000 && position < 4500) {
      this.setState({ tagSelected: 'MobileAddNewExpense' });
    } else if (position > 4500 && position < 5000) {
      this.setState({ tagSelected: 'MobileAddNewMileage' });
    } else if (position > 5000 && position < 5500) {
      this.setState({ tagSelected: 'MobileDeleteUpdateAnExpense' });
    } else if (position > 5500 && position < 6000) {
      this.setState({ tagSelected: 'MobileAddNewReport' });
    } else if (position > 6000 && position < 6500) {
      this.setState({ tagSelected: 'MobileApproveAReport' });
    } else if (position > 6500 && position < 7000) {
      this.setState({ tagSelected: 'MobileCommentAReport' });
    } else if (position > 7000 && position < 7500) {
      this.setState({ tagSelected: 'MobileRejectAReport' });
    }
  };

  setTagSelected = ref => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    const { tagSelected } = this.state;
    const listMenu = [
      {
        id: 'WebAddNewExpense',
        name: 'Web - Add A New Expense',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how an employee can add a new expense in the Expenso Web Application.',
        src: 'https://apiguestlog.paxanimi.ai/video/addNewExpense.mp4',
      },
      {
        id: 'WebAddNewMileage',
        name: 'Web - Add A New Mileage',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how an employee can add a new mileage expense in the Expenso Web Application.',
        src: 'https://apiguestlog.paxanimi.ai/video/addNewMileage.mp4',
      },
      {
        id: 'WebDeleteUpdateAnExpense',
        name: 'Web - Delete Update An Expense',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how an employee can update/edit an expense’s data, and he can also delete an unused expense.',
        src: 'https://apiguestlog.paxanimi.ai/video/deleteUpdateAnExpense.mp4',
      },
      {
        id: 'WebAddANewReport',
        name: 'Web - Add A New Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how an employee can create an expense report that includes a list of expenses, and he can submit the report for the direct manager’s review in the Expenso Web Application.',
        src: 'https://apiguestlog.paxanimi.ai/video/addANewReport.mp4',
      },
      {
        id: 'WebApproveAReport',
        name: 'Web - Approve A Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how a manager can review and approve submitted reports from his team members.',
        src: 'https://apiguestlog.paxanimi.ai/video/approveReport.mp4',
      },
      {
        id: 'WebCommentAReport',
        name: 'Web - Comment A Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how a manager can comment to ask for more information on submitted reports of his team members.',
        src: 'https://apiguestlog.paxanimi.ai/video/commentReport.mp4',
      },
      {
        id: 'WebAskForMoreInfoAReport',
        name: 'Web - Ask For More Info A Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how a manager can ask for more info a submitted report of his team member.',
        src: 'https://apiguestlog.paxanimi.ai/video/askMoreInfo.mp4',
      },
      {
        id: 'WebRejectAReport',
        name: 'Web - Reject A Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how a manager can reject a submitted report of his team member.',
        src: 'https://apiguestlog.paxanimi.ai/video/rejectReport.mp4',
      },
      {
        id: 'MobileAddNewExpense',
        name: 'Mobile - Add A New Expense',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how an employee can add a new expense in the Expenso Mobile Application.',
        src: 'https://apiguestlog.paxanimi.ai/video/Add_new_expense.mp4',
      },
      {
        id: 'MobileAddNewMileage',
        name: 'Mobile - Add A New Mileage',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how an employee can add a new mileage expense in the Expenso Mobile Application.',
        src: 'https://apiguestlog.paxanimi.ai/video/Add_new_mileage.mp4',
      },
      {
        id: 'MobileDeleteUpdateAnExpense',
        name: 'Mobile - Delete Update An Expense',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how an employee can update/edit an expense’s data, and he can also delete an unused expense.',
        src: 'https://apiguestlog.paxanimi.ai/video/Delete_Update_An_Expense.mp4',
      },
      {
        id: 'MobileAddNewReport',
        name: 'Mobile - Add A New Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how an employee can create an expense report that includes a list of expenses, and he can submit the report for the direct manager’s review in the Expenso Mobile Application.',
        src: 'https://apiguestlog.paxanimi.ai/video/Add_A_NewReport.mp4',
      },
      {
        id: 'MobileApproveAReport',
        name: 'Mobile - Approve A Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how a manager can review and approve submitted reports from his team members.',
        src: 'https://apiguestlog.paxanimi.ai/video/Approve_a_report.mp4',
      },
      {
        id: 'MobileCommentAReport',
        name: 'Mobile - Comment A Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how a manager can comment to ask for more information on submitted reports of his team members.',
        src: 'https://apiguestlog.paxanimi.ai/video/Comment_a_report.mp4',
      },
      {
        id: 'MobileRejectAReport',
        name: 'Mobile - Reject A Report',
        ref: React.createRef(),
        text:
          'The video demo shows step by step on how a manager can reject a submitted report of his team member.',
        src: 'https://apiguestlog.paxanimi.ai/video/Reject_a_report.mp4',
      },
    ];
    return (
      <Row type="flex" justify="space-between" className={styles.container} gutter={20}>
        <Col span={20}>
          {listMenu.map(itemMenu => (
            <div ref={itemMenu.ref} key={itemMenu.id} style={{ height: '500px' }}>
              <p className={styles.textTitle}>{itemMenu.name}</p>
              <Demo text={itemMenu.text} src={itemMenu.src} />
            </div>
          ))}
        </Col>
        <Col span={4} className={styles.viewRight}>
          <Affix offsetTop={20}>
            <div className={styles.containerMenu}>
              {listMenu.map(itemMenu => (
                <div
                  className={tagSelected === itemMenu.id ? styles.itemMenuActive : styles.itemMenu}
                  onClick={() => this.setTagSelected(itemMenu.ref)}
                  key={itemMenu.id}
                >
                  <div className={styles.textMenu}>{itemMenu.name}</div>
                </div>
              ))}
            </div>
          </Affix>
        </Col>
      </Row>
    );
  }
}

export default Help;

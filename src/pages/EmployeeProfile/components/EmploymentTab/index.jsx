import React, { PureComponent } from 'react';
import { div, Table, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import CurrentInfo from './components/CurrentInfo';
import HandleChanges from './components/HandleChanges';
import styles from './index.less';

const steps = [
  { title: 'Effective Date', content: 'Effective Date' },
  { title: 'Compensation Details', content: 'Compensation Details' },
  { title: 'Work Group', content: 'Work Group' },
  { title: 'Who to Notify', content: 'Who to Notify' },
  { title: 'Review Changes', content: 'Review Changes' },
];

class EmploymentTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChanging: false,
      current: 0,
      currentData: {
        title: 'UX Lead',
        joiningDate: '10th December 2018',
        location: 'Bengaluru, India',
        employType: 'Full Time Employee',
        compenType: 'Salaried',
        annualSalary: '$75000',
        manager: 'Anil Reddy',
        timeOff: '20 Day PTO Applicable',
      },
    };
  }

  handleMakeChanges = () => {
    const { isChanging } = this.state;
    this.setState({ isChanging: !isChanging });
  };

  handleOk = () => {
    this.nextTab();
  };

  handleCancel = () => {
    this.setState({
      isChanging: false,
    });
  };

  handleChangeHistory = () => {
    this.setState({
      isChanging: true,
    });
  };

  nextTab = () => {
    const { current } = this.state;
    const currentTab = current + 1;
    this.setState({ current: currentTab });
  };

  previousTab = () => {
    const { current } = this.state;
    const currentTab = current - 1;
    this.setState({ current: currentTab });
  };

  onChangeSteps = (current) => {
    this.setState({ current });
  };

  render() {
    const { isChanging, current, currentData } = this.state;
    const columns = [
      {
        title: 'Changed Infomation',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
      },
      {
        title: 'Effective Date',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Changed By',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Changed Date',
        key: 'tags',
        dataIndex: 'tags',
        render: (tags) => (
          <>
            {tags.map((tag) => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
    return (
      <div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab_title}>
            <div>Employment & Compensation {isChanging ? `- ${steps[current].title}` : null}</div>

            {isChanging ? (
              <div onClick={this.handleMakeChanges}>Cancel & Return</div>
            ) : (
              <div onClick={this.handleMakeChanges}>Make changes</div>
            )}
          </div>
          {isChanging ? <HandleChanges current={current} /> : <CurrentInfo data={currentData} />}
        </div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab_title} align="middle">
            <div>Change History</div>
            <div className={styles.employmentTab_changeIcon}>
              <EditOutlined
                className={styles.employmentTab_iconEdit}
                onClick={this.handleChangeHistory}
              />
            </div>
          </div>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      </div>
    );
  }
}

export default EmploymentTab;

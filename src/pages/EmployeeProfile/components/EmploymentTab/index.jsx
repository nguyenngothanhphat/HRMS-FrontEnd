import React, { PureComponent } from 'react';
import { Row, Col, Modal, Table, Tag, Steps, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import styles from './index.less';

const { Step } = Steps;

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
      visible: false,
      current: 0,
    };
  }

  handleOk = () => {
    this.nextTab();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleChangeHistory = () => {
    this.setState({
      visible: true,
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
    const { visible, current } = this.state;
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
      <div className={styles.employmentTab}>
        <Row className={styles.employmentTab_title} justify="space-between" align="middle">
          <span>Employment & Compensation</span>
          <span span={4}>
            <u>Make changes</u>
          </span>
        </Row>
        <Row justify="start" gutter={16}>
          <Col span={4}>
            <p>Title</p>
            <p>UX Lead</p>
          </Col>
          <Col span={6}>
            <p>Joining Date</p>
            <p>10th December 2018</p>
          </Col>
          <Col span={6}>
            <p>Location</p>
            <p>Viet Nam</p>
          </Col>
          <Col span={6}>
            <p>Location</p>
            <p>Viet Nam</p>
          </Col>
        </Row>
        <hr />
        <Row justify="start" gutter={16}>
          <Col span={4}>
            <p>Title</p>
            <p>UX Lead</p>
          </Col>
          <Col span={6}>
            <p>Joining Date</p>
            <p>10th December 2018</p>
          </Col>
          <Col span={6}>
            <p>Location</p>
            <p>Bengaluru, India</p>
          </Col>
          <Col span={6}>
            <p>Employment Type</p>
            <p>Full Time Employee</p>
          </Col>
        </Row>
        <Row className={styles.employmentTab_title} align="middle">
          <span>Change History</span>
          <div className={styles.employmentTab_changeIcon}>
            <EditOutlined
              className={styles.employmentTab_iconEdit}
              onClick={this.handleChangeHistory}
            />
          </div>
        </Row>
        <Table columns={columns} dataSource={data} pagination={false} />
        <Modal
          className={styles.employmentTab_modal}
          title="Edit Employment & Compensation"
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <div className="steps-action">
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => this.nextTab()}>
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" onClick={() => message.success('Processing complete!')}>
                  Done
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => this.previousTab()}>
                  Previous
                </Button>
              )}
            </div>,
          ]}
        >
          <>
            <Steps type="navigation" size="small" current={current} onChange={this.onChangeSteps}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
          </>
        </Modal>
      </div>
    );
  }
}

export default EmploymentTab;

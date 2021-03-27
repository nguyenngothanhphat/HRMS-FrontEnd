import React, { PureComponent } from 'react';
import { Button, Row, Col, Checkbox, Form } from 'antd';

import styles from './index.less';

export default class SelectRoles extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: [],
    };
  }

  renderTitle = () => {
    const { handleEditAdmin = () => {}, dataAdmin = {} } = this.props;
    const { employeeName = '' } = dataAdmin;
    return (
      <div className={styles.titleContainer}>
        <span className={styles.title}>{`Edit ${employeeName}’s role as admin`}</span>
        <div className={styles.cancelBtn} onClick={() => handleEditAdmin(false)}>
          <span>Cancel</span>
        </div>
      </div>
    );
  };

  setList = (id) => {
    const { selectedList } = this.state;
    const isExist = selectedList.findIndex((value) => value === id) === -1;
    let newList;
    if (isExist) {
      newList = [...selectedList, id];
    } else {
      newList = selectedList.filter((value) => value !== id);
    }
    this.setState({
      selectedList: newList,
    });
  };

  checkBoxValue = (name) => {
    const { dataAdmin = {} } = this.props;
    const { listRole = [] } = dataAdmin;
    let checkValue = '';

    listRole.forEach((item) => {
      if (item.id === name) {
        checkValue = 'checked';
      }
    });

    return checkValue;
  };

  renderList = () => {
    const data = [
      {
        id: 1,
        name: 'company',
        role: 'Company',
        description: 'Has full permissions and can manage all aspects of your account.',
      },
      {
        id: 2,
        name: 'payroll',
        role: 'Payroll',
        description: 'Runs your company’s payroll.',
      },
      {
        id: 3,
        name: 'benefits',
        role: 'Benefits',
        description: 'Manages your company’s health benefits and employee’s enrollment info.',
      },
      {
        id: 4,
        name: 'hr',
        role: 'HR',
        description: 'Oversees employes’s HR records, and handles hiring and terminations.',
      },
      {
        id: 5,
        name: 'intergrations',
        role: 'Intergrations',
        description: 'Add apps and custom intergrations, and manages employee’s integrated apps.',
      },
      {
        id: 6,
        name: 'contractors',
        role: 'Contractors',
        description: 'Hires and terminates contractors, and manages contractor payments.',
      },
      {
        id: 7,
        name: 'time',
        role: 'Time',
        description: 'Regulates employee hours and time-off policies.',
      },
    ];

    return (
      <div className={styles.roleList}>
        {data.map((item) => {
          const { id = '', role = '', description = '', name = '' } = item;
          return (
            <Row gutter={[24, 24]} key={id} align="middle">
              <Col span={2}>
                <Form name="roleAdmin" initialValues={{ check: true }}>
                  <Form.Item name="check" valuePropName={this.checkBoxValue(name)}>
                    <Checkbox onChange={() => this.setList(id)} />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={6}>
                <span className={styles.roleName}>{role}</span>
              </Col>
              <Col span={16}>
                <span className={styles.roleDescription}>{description}</span>
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  renderMainForm = () => {
    const { onContinue = () => {} } = this.props;
    const { selectedList } = this.state;
    return (
      <div className={styles.mainForm}>
        <div className={styles.header}>
          <span>Admin Roles</span>
        </div>
        <div className={styles.content}>{this.renderList()}</div>
        <div className={styles.nextBtn}>
          <Button className={styles.proceedBtn} onClick={() => onContinue(1, selectedList)}>
            Continue
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.SelectRoles}>
        {this.renderTitle()}
        {this.renderMainForm()}
      </div>
    );
  }
}

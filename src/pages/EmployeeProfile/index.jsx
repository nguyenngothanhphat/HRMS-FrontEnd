import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Dropdown, Button, Menu } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Item } = Menu;

class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    // fetch employee by id
    // const {
    //   match: { params: { reId = '' } = {} },
    // } = this.props;
  }

  openModalUpload = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const { open } = this.state;
    const menu = (
      <Menu>
        <Item key="1" onClick={() => alert(1)}>
          Put on Leave (PWP)
        </Item>
        <Item key="2" onClick={() => alert(2)}>
          Raise Termination
        </Item>
        <Item key="3" onClick={() => alert(3)}>
          Request Details
        </Item>
      </Menu>
    );
    return (
      <PageContainer>
        <div className={styles.containerEmployeeProfile}>
          <Row type="flex" justify="space-between" className={styles.viewInfo_Action}>
            <div className={styles.viewInfo}>
              <div className={styles.viewInfo__upload} onClick={this.openModalUpload}>
                <PlusOutlined style={{ fontSize: '40px' }} />
              </div>
              <div className={styles.viewInfo__text}>
                <p className={styles.textName}>Aditya Venkatesh</p>
                <p className={styles.textInfo}>UX Lead (Full Time), Design</p>
                <p className={styles.textInfo}>Location: Bengaluru, India (+5:30 GMT)</p>
                <p className={styles.textInfo}>Joined on December 10th, 2018</p>
              </div>
            </div>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button type="primary" className={styles.btnActions}>
                Actions <DownOutlined />
              </Button>
            </Dropdown>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default EmployeeProfile;

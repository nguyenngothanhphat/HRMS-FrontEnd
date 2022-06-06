// import React, { Component } from 'react';
import { Row, Col, Modal } from 'antd';
import React, { Component } from 'react';
import icon from '@/assets/offboarding-schedule.svg';
import righticon1 from '@/assets/offboarding-1.svg';
import righticon2 from '@/assets/offboarding-2.svg';
import righticon3 from '@/assets/offboarding-3.svg';
import righticon4 from '@/assets/offboarding-4.svg';
import persion from '@/assets/manager.svg';
import styles from './index.less';

class RightDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      open: false,
      openSchedule: false,
    };
  }

  handleCandel = () => {
    this.setState({
      openSchedule: false,
    });
  };

  handleOpenCandel = () => {
    this.setState({
      open: false,
    });
  };

  handleOpenOK = () => {
    this.setState({
      open: false,
    });
  };

  handleOK = () => {
    this.setState({
      openSchedule: false,
    });
  };

  handleclickOpen = () => {
    const { open } = this.state;
    this.setState({
      open: !open,
    });
  };

  handleclick = () => {
    const { openSchedule } = this.state;
    this.setState({
      openSchedule: !openSchedule,
    });
  };

  handleOpenSchedule = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  handleCandelSchedule = () => {
    this.setState({
      visible: false,
    });
  };

  rederItem = (reder) => {
    return (
      <Row>
        <Col span={4}>
          <img src={reder.icon} alt="iconCheck" />
        </Col>
        <Col span={19}>
          <div>{reder.decription} </div>
        </Col>
      </Row>
    );
  };

  infoModal = () => {
    const { open } = this.state;
    const InfoEditCheckList = (
      <div className={styles.bodyInfo}>
        <div className={styles.modalText}>
          {open && open ? 'Offboarding Policy' : 'Exit Check List'}
        </div>
        <div className={styles.bodyText}>
          <div className={styles.modalTitle}>What is an Exit check list?</div>
          <div className={styles.modalContent} style={{ fontSize: '13px', lineHeight: '17px' }}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
            sanctus est Lorem ipsum dolor sit amet. Lorem ips
          </div>
          <div className={styles.modalTitle} style={{ marginTop: '30px' }}>
            What is an Exit check list?
          </div>
          <div className={styles.modalContent} style={{ fontSize: '13px', lineHeight: '17px' }}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
            sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing
          </div>
          <div className={styles.modalTitle} style={{ marginTop: '30px' }}>
            What is an Exit check list?
          </div>
          <ul className="a">
            <li className={styles.subText}>
              1. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
              tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
            </li>
            <li className={styles.subText}>
              2. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
              no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </li>
            <li className={styles.subText}>
              3. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
              no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </li>
          </ul>
        </div>
      </div>
    );
    return <div>{InfoEditCheckList}</div>;
  };

  render() {
    const array = [
      {
        icon: righticon4,
        decription: (
          <p>
            This page is just a meeting away.
            <span className={styles.actionclick}> Schedule 1-on-1 </span>
            with project manager now.
          </p>
        ),
      },
      {
        icon: persion,
        decription: (
          <p>
            Discuss this decision with a
            <span className={styles.actionclick}> random lead/manager </span>
            and not your manager
          </p>
        ),
      },

      {
        icon: righticon2,
        decription: (
          <p>
            Make sure you are done with your current project to have this discussion continued. If
            not, please
            <span className={styles.actionclick}> schedule a meeting</span>
            with project manager now.
          </p>
        ),
      },
      {
        icon: righticon1,
        decription: (
          <p>
            We have prepared an
            <span
              className={styles.actionclick}
              onClick={() => this.handleclick()}
              style={{ padding: '5px' }}
            >
              exit checklist,
            </span>
            which you might want to see before applying for a relationship termination.
          </p>
        ),
      },
      {
        icon: righticon3,
        decription: (
          <p>
            We have compiled an
            <span
              className={styles.actionclick}
              style={{ padding: '5px' }}
              onClick={() => this.handleclickOpen()}
            >
              offboarding policy
            </span>
            that you might have to read.
          </p>
        ),
      },
    ];

    const { open, openSchedule } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.boxRight}>
          <img alt="icontop" className={styles.icon} src={icon} />
          <div className={styles.text_Title}> Did you know?</div>
          <div className={styles.text_Body}>
            Your Manager, Sandeep, usually conducts 1-on-1s and you can speak anything to him. 8/10
            employees have changed their mind!
          </div>
          <div className={styles.text_Schedule} onClick={this.handleOpenSchedule}>
            Schedule 1-on-1 Now!
          </div>
          <div className={styles.twoRight}>
            <p className={styles.text_twoRight}> Few thing to consider</p>
            <div>{array.map((reder) => this.rederItem(reder))}</div>
            <Modal
              visible={openSchedule}
              footer={
                <span>
                  For any queries, e-mail at
                  <span style={{ color: '#707177' }}>hrmanager@companyname.com</span>
                </span>
              }
              className={styles.modalDataRight}
              onOk={this.handleOK}
              onCancel={this.handleCandel}
            >
              {this.infoModal()}
            </Modal>
            <Modal
              visible={open}
              footer={
                <span>
                  For any queries, e-mail at
                  <span style={{ color: '#707177' }}>hrmanager@companyname.com</span>
                </span>
              }
              className={styles.modalDataRight}
              onOk={this.handleOpenOK}
              onCancel={this.handleOpenCandel}
            >
              {this.infoModal()}
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default RightDataTable;

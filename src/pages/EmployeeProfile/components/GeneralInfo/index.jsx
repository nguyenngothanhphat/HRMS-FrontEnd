import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Row, Col, Tooltip } from 'antd';
import { QuestionCircleFilled, TeamOutlined, EditFilled, LockFilled } from '@ant-design/icons';
import ModalComponent from './components/Modal';
import styles from './index.less';

const EmployeeInfo = [
  { id: 1, title: 'Legal Name', text: 'Aditya Venkatesh' },
  { id: 2, title: 'Date of Birth', text: '21st May 1995' },
  { id: 3, title: 'Legal Gender', text: 'Male' },
  { id: 4, title: 'Employee ID', text: 'PSI 2029' },
  { id: 5, title: 'Work Email', text: 'aditya@lollypop.design' },
  { id: 6, title: 'Work Number', text: '+91-8900445577' },
];
const EmployeeInfo1 = [
  { id: 7, title: 'Adhaar Card Number', text: '9999-0000-0000-0000' },
  { id: 8, title: 'UAN Number', text: '8736456' },
];
const PersonalInfor1 = [
  { id: 1, title: 'Personal Number', text: '+91-8900445577' },
  { id: 2, title: 'Personal Email', text: 'aditya@gmail.com' },
];
const PersonalInfor2 = [
  { id: 3, title: 'Blood Group', text: 'O+' },
  { id: 4, title: 'Marital Status', text: 'Married' },
];
const PersonalInforAddr = [
  {
    id: 1,
    title: 'Residence Address',
    text: '4th Main, 18th Cross, Kochi, Belandur, Near Factory Layout, India, 230002',
  },
  {
    id: 2,
    title: 'Current Address',
    text: '4th Main, 18th Cross, Kochi, Belandur, Near Factory Layout, India, 230002',
  },
];
const PassportandVisa = [
  {
    id: 1,
    title: 'Passport Number',
    text: 'PNHG0000993748',
  },
  {
    id: 2,
    title: 'Issued Country',
    text: 'India',
  },
  {
    id: 3,
    title: 'Issued On',
    text: '22-05-2025',
  },
  {
    id: 4,
    title: 'Valid Till',
    text: '22-05-2025',
  },
  {
    id: 5,
    title: 'Visa Number',
    text: '87659087',
  },
  {
    id: 6,
    title: 'Issued On',
    text: '22-05-2025',
  },
  {
    id: 7,
    title: 'Valid Till',
    text: '22-05-2025',
  },
];
const Emergency = [
  {
    id: 1,
    title: 'Emergency Contact',
    text: '+91 9836583726',
  },
  {
    id: 2,
    title: 'Person’s Name',
    text: 'Pratyush Gupta',
  },
  {
    id: 3,
    title: 'Relation',
    text: 'Friend',
  },
];
const ProfessionalAcademic = [
  {
    id: 1,
    title: 'Previous Job Title',
    text: 'Senior UX Designer',
  },
  {
    id: 2,
    title: 'Previous Company',
    text: 'Apple Co.',
  },
  {
    id: 3,
    title: 'Past Experience',
    text: '2 Years',
  },
  {
    id: 4,
    title: 'Total Experience',
    text: '6 Years',
  },
  {
    id: 5,
    title: 'Qualification',
    text: 'Bachelors in Technology',
  },
];
const ProfessionalAcademic2 = [
  {
    id: 1,
    title: 'Certifications',
    text: [
      { id: 1, text: '1) HCI Certification' },
      { id: 2, text: '2) UX Academy Certification' },
    ],
  },
  {
    id: 2,
    title: 'Skills',
    text: [
      { id: 1, text: '1) Product Management' },
      { id: 2, text: '2) Lean/Agile Processes' },
      { id: 3, text: '3) UX Methodologies' },
    ],
  },
];
@connect(({ loading, employee }) => ({
  loading: loading.effects['login/login'],
  employee,
}))
class GeneralInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      valueNumber: 'Co-Workers',
      valueEmail: 'Co-Workers',
      itemSelected: {},
    };
  }

  showModal = (itemSelected) => {
    this.setState({
      visible: true,
      itemSelected,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleChangeRadio = (e) => {
    const { name, value } = e.target;
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'employee/saveRadio',
    //   payload: { name, value },
    // });
    if (name === 'Personal Number') {
      this.setState({
        valueNumber: value,
        visible: false,
      });
    } else {
      this.setState({
        valueEmail: value,
        visible: false,
      });
    }
  };

  render() {
    const { visible, itemSelected, valueEmail, valueNumber } = this.state;
    const content = 'We require your gender for legal reasons.';
    return (
      <div className={styles.GeneralInfo}>
        <div className={styles.Genspage}>
          <div className={styles.backgroundTitle}>
            <p className={styles.GenTitle}>Employee Information</p>
          </div>

          <Row>
            {EmployeeInfo.map((item) => {
              return (
                <Col span={4} key={item.id}>
                  <div className={styles.boxTitle}>
                    <p className={styles.titleDetail}> {item.title}</p>
                    {item.title === 'Legal Gender' ? (
                      <Tooltip title={content} overlayClassName={styles.GenPopover}>
                        <div className={styles.spaceIconLegal}>
                          <QuestionCircleFilled className={styles.GenIconlegal} />
                        </div>
                      </Tooltip>
                    ) : (
                      ''
                    )}
                  </div>
                  <p className={styles.TextDetail}>{item.text}</p>
                </Col>
              );
            })}
          </Row>
          <div className={styles.GenRowLine} />
          <Row>
            {EmployeeInfo1.map((item) => {
              return (
                <Col span={4} key={item.id}>
                  <p className={styles.titleDetail}>{item.title}</p>
                  <p className={styles.TextDetail}>{item.text}</p>
                </Col>
              );
            })}
          </Row>
        </div>
        <div className={styles.Genspage}>
          <div className={styles.backgroundTitle}>
            <p className={styles.GenTitle}>Personal Information</p>
          </div>
          <div>
            <Row>
              {PersonalInfor1.map((item) => {
                return (
                  <Col span={4} key={item.id}>
                    <div className={styles.GenFlexbox}>
                      <p className={styles.titleDetail}> {item.title} </p>
                      <div className={styles.GenBoxIcon}>
                        {(item.title === 'Personal Number' && valueNumber === 'Co-Workers') ||
                        (item.title === 'Personal Email' && valueEmail === 'Co-Workers') ? (
                          <TeamOutlined className={styles.GenIconTeam} />
                        ) : (
                          <LockFilled className={styles.GenIconTeam} />
                        )}
                        <EditFilled
                          onClick={() => this.showModal(item)}
                          className={styles.GenIconEdit}
                        />
                      </div>
                    </div>
                    <p className={styles.TextDetail}>{item.text}</p>
                  </Col>
                );
              })}
              {PersonalInfor2.map((item) => {
                return (
                  <Col span={4} key={item.id}>
                    <p className={styles.titleDetail}>{item.title}</p>
                    <p className={styles.TextDetail}>{item.text}</p>
                  </Col>
                );
              })}
              <Col span={4}>
                <p className={styles.titleDetail}>Linkedin</p>
                <a href="" className={styles.GenLink}>
                  www.linkedin.com/adityavenkatesh
                </a>
              </Col>
            </Row>
          </div>
          <div className={styles.GenRowLine} />
          <div>
            <Row>
              {PersonalInforAddr.map((item) => {
                return (
                  <Col
                    span={item.title === 'Residence Address' ? 12 : 12}
                    key={item.id}
                    className={item.title === 'Current Address' ? styles.GenColLine : ''}
                  >
                    <p className={styles.titleDetail}>{item.title}</p>
                    <p className={styles.TextDetail}>{item.text}</p>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
        <div className={styles.Genspage}>
          <div className={styles.backgroundTitle}>
            <p className={styles.GenTitle}>Passport and Visa Information</p>
          </div>
          <div>
            <Row>
              {PassportandVisa.map((item) => {
                return (
                  <Col
                    span={3}
                    key={item.id}
                    className={item.title === 'Visa Number' ? styles.GenColLine : ''}
                  >
                    <p className={styles.titleDetail}>{item.title}</p>
                    <p className={styles.TextDetail}>{item.text}</p>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
        <div className={styles.Genspage}>
          <div className={styles.backgroundTitle}>
            <p className={styles.GenTitle}>Emergency Contact Details</p>
          </div>
          <div>
            <Row>
              {Emergency.map((item) => {
                return (
                  <Col span={4} key={item.id}>
                    <p className={styles.titleDetail}>{item.title}</p>
                    <p className={styles.TextDetail}>{item.text}</p>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
        <div className={styles.Genspage}>
          <div className={styles.backgroundTitle}>
            <p className={styles.GenTitle}>Professional & Academic Background</p>
          </div>
          <div>
            <Row>
              {ProfessionalAcademic.map((item) => {
                return (
                  <Col span={4} key={item.id}>
                    <p className={styles.titleDetail}>{item.title}</p>
                    <p className={styles.TextDetail}>{item.text}</p>
                  </Col>
                );
              })}
            </Row>
            <div className={styles.GenRowLine} />
            <Row>
              {ProfessionalAcademic2.map((item) => {
                return (
                  <Col span={4} key={item.id}>
                    <p className={styles.titleDetail}>{item.title}</p>
                    {item.text.map((text) => {
                      return (
                        <p key={text.id} className={styles.TextDetail}>
                          {text.text}
                        </p>
                      );
                    })}
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
        <ModalComponent
          visible={visible}
          item={itemSelected}
          handleCancel={this.handleCancel}
          defaultValue={{ valueEmail, valueNumber }}
          handleChangeRadio={this.handleChangeRadio}
        />
      </div>
    );
  }
}

export default GeneralInfo;

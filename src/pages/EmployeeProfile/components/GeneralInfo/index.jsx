import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';

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
class GeneralInfo extends PureComponent {
  render() {
    return (
      <div>
        <div>
          <div>
            <p>Employee Information</p>
          </div>
          <Row>
            {EmployeeInfo.map((item) => {
              return (
                <Col span={4} key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.text}</p>
                </Col>
              );
            })}
            {EmployeeInfo1.map((item) => {
              return (
                <Col span={4} key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.text}</p>
                </Col>
              );
            })}
          </Row>
        </div>
        <div>
          <div>
            <p>Personal Information</p>
          </div>
          <Row>
            {PersonalInfor1.map((item) => {
              return (
                <Col span={4} key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.text}</p>
                </Col>
              );
            })}
            {PersonalInfor2.map((item) => {
              return (
                <Col span={4} key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.text}</p>
                </Col>
              );
            })}
            <Col span={8}>
              <p>Linkedin</p>
              <a href="">www.linkedin.com/adityavenkatesh</a>
            </Col>
            {PersonalInforAddr.map((item) => {
              return (
                <Col span={12} key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.text}</p>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    );
  }
}

export default GeneralInfo;

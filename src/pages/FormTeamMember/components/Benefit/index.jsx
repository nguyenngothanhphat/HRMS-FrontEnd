import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect, formatMessage } from 'umi';
import Header from './components/Header';
import GlobalEmployeeComponent from './components/GlobalEmployeeComponent';
import IndiaEmployeeComponent from './components/IndiaEmployeeComponent';
import NoteComponent from '../NoteComponent';
import styles from './index.less';

@connect(({ info: { benefits } = {} }) => ({
  benefits,
}))
class Benefit extends PureComponent {
  static getDerivedStateFromProps(props) {
    if ('benefits' in props) {
      return { benefits: props.benefits || {} };
    }
    return null;
  }

  // onChange = (e) => {
  //   const { target } = e;
  //   const { name, value } = target;
  //   const { dispatch } = this.props;
  //   const { benefits = {} } = this.state;
  //   benefits[name] = value;
  //   dispatch({
  //     type: 'info/saveBenefits',
  //     benefits,
  //   });
  // };

  render() {
    const headerText = formatMessage({ id: 'component.Benefits.subHeader' });
    const globalEmployeesCheckbox = {
      name: formatMessage({ id: 'component.Benefits.globalEmployeeTitle' }),
      checkBox: [
        {
          value: formatMessage({ id: 'component.Benefits.medical' }),
          title: formatMessage({ id: 'component.Benefits.medical' }),
          subCheckBox: [
            {
              key: 1,
              value: formatMessage({ id: 'component.Benefits.openAccess' }),
            },
            {
              key: 2,
              value: formatMessage({ id: 'component.Benefits.OAP' }),
            },
          ],
        },
        {
          value: formatMessage({ id: 'component.Benefits.dental' }),
          title: formatMessage({ id: 'component.Benefits.dental' }),
          subCheckBox: [
            {
              key: 1,
              value: formatMessage({ id: 'component.Benefits.volDental' }),
            },
          ],
        },
        {
          value: formatMessage({ id: 'component.Benefits.vision' }),
          title: formatMessage({ id: 'component.Benefits.vision' }),
          subCheckBox: [
            {
              key: 1,
              value: formatMessage({ id: 'component.Benefits.visionPro' }),
            },
          ],
        },
        {
          value: formatMessage({ id: 'component.Benefits.life' }),
          title: formatMessage({ id: 'component.Benefits.life' }),
          subCheckBox: [
            {
              key: 1,
              value: formatMessage({ id: 'component.Benefits.basicLife' }),
            },
            {
              key: 2,
              value: formatMessage({ id: 'component.Benefits.volLife' }),
            },
          ],
        },
        {
          value: formatMessage({ id: 'component.Benefits.shortTerm' }),
          title: formatMessage({ id: 'component.Benefits.shortTermTitle' }),
          subCheckBox: [
            {
              key: 1,
              value: formatMessage({ id: 'component.Benefits.basicLife' }),
            },
            {
              key: 2,
              value: formatMessage({ id: 'component.Benefits.volLife' }),
            },
          ],
        },
      ],
    };
    const IndiaEmployeesCheckbox = {
      name: formatMessage({ id: 'component.Benefits.IndiaEmployeeTitle' }),
      checkBox: [
        {
          value: formatMessage({ id: 'component.Benefits.paytm' }),
          subCheckBox: [
            {
              key: 1,
              value: formatMessage({ id: 'component.Benefits.openAccess' }),
            },
          ],
        },
        {
          value: formatMessage({ id: 'component.Benefits.paytm' }),
          title: formatMessage({ id: 'component.Benefits.employeeTitle' }),
          subCheckBox: [
            {
              key: 1,
              value: formatMessage({ id: 'component.Benefits.openAccess' }),
            },
            {
              key: 2,
              value: formatMessage({ id: 'component.Benefits.OAP' }),
            },
          ],
        },
      ],
    };
    const Note = {
      title: formatMessage({ id: 'component.noteComponent.title' }),
      data: (
        <Typography.Text>
          Please ensure with all your <span>benefit vendor</span> that the documents rolling out to
          the candidate informing about the terms and condition of all the benefits are{' '}
          <span className={styles.boldText}>up-to-date</span>
        </Typography.Text>
      ),
    };
    return (
      <>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <div className={styles.BenefitComponent}>
              <Header />
              <GlobalEmployeeComponent
                globalEmployeesCheckbox={globalEmployeesCheckbox}
                headerText={headerText}
                onChange={this.onChange}
                handleCheckAll={this.handleCheckAll}
              />
              <IndiaEmployeeComponent
                IndiaEmployeesCheckbox={IndiaEmployeesCheckbox}
                headerText={headerText}
                handleChange={this.handleChange}
              />
            </div>
          </Col>
          <Col className={styles.RightComponents} xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className={styles.rightWrapper}>
              <Row>
                <NoteComponent note={Note} />
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default Benefit;

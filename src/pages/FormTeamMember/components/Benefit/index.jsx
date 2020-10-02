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

  handleChange = (checkedList, arr, title) => {
    const { benefits } = this.state;
    const { dispatch } = this.props;
    if (title === 'Medical') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedMedical: checkedList,
            medical: checkedList.length === arr.length,
          },
        },
      });
    } else if (title === 'Life') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedLife: checkedList,
            life: checkedList.length === arr.length,
          },
        },
      });
    } else if (title === 'shortTerm') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedShortTerm: checkedList,
            shortTerm: checkedList.length === arr.length,
          },
        },
      });
    } else if (title === 'employeeProvident') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedEmployee: checkedList,
            employeeProvident: checkedList.length === arr.length,
          },
        },
      });
    }
  };

  onChange = (e) => {
    const { target } = e;
    const { value } = target;
    const { benefits } = this.state;
    const { vision, dental, paytmWallet } = benefits;
    const { dispatch } = this.props;
    if (value === 'Dental') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            dental: !dental,
          },
        },
      });
    } else if (value === 'Vision') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            vision: !vision,
          },
        },
      });
    }
    if (value === 'Paytm Wallet') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            paytmWallet: !paytmWallet,
          },
        },
      });
    }
  };

  handleCheckAll = (e, arr, title) => {
    const { benefits } = this.state;
    const { dispatch } = this.props;
    if (title === 'Medical') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedMedical: e.target.checked ? arr.map((data) => data.value) : [],
            medical: e.target.checked,
          },
        },
      });
    } else if (title === 'Life') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedLife: e.target.checked ? arr.map((data) => data.value) : [],
            life: e.target.checked,
          },
        },
      });
    } else if (title === 'shortTerm') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedShortTerm: e.target.checked ? arr.map((data) => data.value) : [],
            shortTerm: e.target.checked,
          },
        },
      });
    } else if (title === 'employeeProvident') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedEmployee: e.target.checked ? arr.map((data) => data.value) : [],
            employeeProvident: e.target.checked,
          },
        },
      });
    }
  };

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
          value: formatMessage({ id: 'component.Benefits.Employee' }),
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
    const { benefits } = this.state;
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
                handleChange={this.handleChange}
                benefits={benefits}
              />
              <IndiaEmployeeComponent
                IndiaEmployeesCheckbox={IndiaEmployeesCheckbox}
                headerText={headerText}
                onChange={this.onChange}
                handleCheckAll={this.handleCheckAll}
                handleChange={this.handleChange}
                benefits={benefits}
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

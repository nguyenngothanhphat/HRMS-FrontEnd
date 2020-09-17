import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect, formatMessage } from 'umi';
import Header from './components/Header';
import GlobalEmployeeComponent from './components/GlobalEmployeeComponent';
import NoteComponent from '../NoteComponent';
import styles from './index.less';

class Benefit extends PureComponent {
  render() {
    const header = formatMessage({ id: 'component.Benefit.EmployeeHeader' });
    const globalEmployeesCheckbox = {
      title: 'global',
      name: 'For Global employees',
      checkBox: [
        {
          value: 'Medical',
          subCheckBox: [
            {
              key: 1,
              value: '[ 2020 ] Open Access Plus - Choice Plan',
            },
            {
              key: 2,
              value: '[ 2020 ] OAP - Base Plan',
            },
          ],
        },
        {
          value: 'Dental',
          subCheckBox: [
            {
              key: 1,
              value: '[ 2020 ] Voluntary Dental',
            },
          ],
        },
        {
          value: 'Vision',
          subCheckBox: [
            {
              key: 1,
              value: '[ 2020 ] Vision PRO',
            },
          ],
        },
        {
          value: 'Life',
          subCheckBox: [
            {
              key: 1,
              value: '[ 2020 ] Basic Life / AD & D',
            },
            {
              key: 2,
              value: '[ 2020 ] Vol life / AD & D',
            },
          ],
        },
        {
          value: 'Short-term disability',
          subCheckBox: [
            {
              key: 1,
              value: '[ 2020 ] Basic Life / AD & D',
            },
            {
              key: 2,
              value: '[ 2020 ] Vol life / AD & D',
            },
          ],
        },
      ],
    };
    const IndiaEmployeesCheckbox = {
      title: 'India',
      name: 'For India employees',
      checkBox: [
        {
          value: 'Paytm Wallet',
          subCheckBox: [
            {
              key: 1,
              value: '[ 2020 ] Open Access Plus - Choice Plan',
            },
          ],
        },
        {
          value: 'Employee Provident Fund',
          subCheckBox: [
            {
              key: 1,
              value: '[ 2020 ] Open Access Plus - Choice Plan',
            },
            {
              key: 2,
              value: '[ 2020 ] Open Access Plus - Choice Plan',
            },
          ],
        },
      ],
    };
    const Note = {
      title: formatMessage({ id: 'component.noteComponent.title' }),
      data: (
        <Typography.Text>
          Please ensure with all your<span>benefit vendor</span> that the documents rolling out to
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
              <GlobalEmployeeComponent globalEmployeesCheckbox={globalEmployeesCheckbox} />
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

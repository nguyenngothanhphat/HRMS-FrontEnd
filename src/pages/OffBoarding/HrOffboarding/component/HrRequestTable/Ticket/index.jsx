import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import LastWorkingDay from './components/LastWorkingDay';
import CommentsFromHR from './components/CommentFromHr';
import ScheduleMetting from './components/SheduleMetting';
import ActionSchedule from './components/ActionSchedule';
import InfoEmployee from './components/RightContent';
import styles from './index.less';

class HRDetailTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: false,
      saveSchedule: false,
    };
  }

  handleChange = () => {
    this.setState({
      data: true,
    });
  };

  handleSaveSchedule = () => {
    this.setState({
      saveSchedule: true,
    });
  };

  render() {
    const { data, saveSchedule } = this.state;
    const { visible } = this.props;
    return (
      <PageContainer>
        <div className={styles.hrDetailTicket}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with Venkat Vamsi Kr ... [PSI: 1022]
              </p>
            </div>
          </Affix>
          <Row className={styles.detailTicket__content} gutter={[30, 30]}>
            <Col span={17}>
              <RequesteeDetail />
              <ResignationRequestDetail />
              <CommentsFromHR />
              <LastWorkingDay handleRemoveToServer={this.handleChange} visible={visible} />
            </Col>
            <Col span={7}>
              <InfoEmployee />
              {data ? <ScheduleMetting handleSubmit={this.handleSaveSchedule} /> : ''}
              {saveSchedule ? <ActionSchedule /> : ''}
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default HRDetailTicket;

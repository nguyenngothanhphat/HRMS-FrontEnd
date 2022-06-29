import { Affix, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { getEmployeeName, OFFBOARDING } from '@/utils/offboarding';
import { goToTop } from '@/utils/utils';
import Assignee from './components/Assignee';
import HR1On1 from './components/HR1On1';
import HRApproval from './components/HRApproval';
import HRClosingComment from './components/HRClosingComment';
import ManagerClosingComment from './components/ManagerClosingComment';
import ProcessStatus from './components/ProcessStatus';
import RequestDifferentLWD from './components/RequestDifferentLWD';
import RequesteeDetails from './components/RequesteeDetails';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import styles from './index.less';

const TicketDetails = (props) => {
  const {
    dispatch,
    match: { params: { id = '' } = {} },
    offboarding: {
      viewingRequest: {
        ticketId = '',
        employee = {},
        status = '',
        managerNote: {
          closingComments = '',
          isRehired = false,
          isReplacement = false,
          isHrRequired = false,
          isRequestDifferent = false,
          notes = '',
        } = {},
      } = {},
      viewingRequest = {},
    } = {},
    loadingFetchData = false,
  } = props;

  const { status: meetingStatus = '' } = viewingRequest.meeting || {};

  const [isEnterClosingComment, setIsEnterClosingComment] = useState(false);

  const getShowClosingComment = () => {
    return (
      isEnterClosingComment ||
      status === OFFBOARDING.STATUS.REJECTED ||
      meetingStatus === OFFBOARDING.MEETING_STATUS.DONE
    );
  };

  const fetchData = () => {
    dispatch({
      type: 'offboarding/getRequestByIdEffect',
      payload: {
        offBoardingId: id,
      },
    });
  };

  useEffect(() => {
    goToTop();
    fetchData();
  }, [id]);

  return (
    <PageContainer>
      <div className={styles.TicketDetails}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>
              [Ticket ID: {ticketId}] Terminate work relationship with{' '}
              {getEmployeeName(employee.generalInfoInfo)}
            </p>
          </div>
        </Affix>
        <Spin spinning={loadingFetchData}>
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={16} xs={24} lg={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ProcessStatus item={viewingRequest} />
                </Col>
                <Col span={24}>
                  <RequesteeDetails item={viewingRequest} />
                </Col>
                <Col span={24}>
                  <ResignationRequestDetail item={viewingRequest} />
                </Col>
                {[OFFBOARDING.STATUS.ACCEPTED, OFFBOARDING.STATUS.REJECTED].includes(status) && (
                  <Col span={24}>
                    <ManagerClosingComment item={viewingRequest} />
                  </Col>
                )}
                {isHrRequired && (
                  <Col span={24}>
                    {isEnterClosingComment ? (
                      <HRClosingComment
                        item={viewingRequest}
                        setIsEnterClosingComment={setIsEnterClosingComment}
                      />
                    ) : (
                      <HR1On1
                        item={viewingRequest}
                        setIsEnterClosingComment={setIsEnterClosingComment}
                      />
                    )}
                  </Col>
                )}
                {isRequestDifferent && (
                  <Col span={24}>
                    <RequestDifferentLWD item={viewingRequest} />
                  </Col>
                )}
                <Col span={24}>
                  <HRApproval item={viewingRequest} />
                </Col>
              </Row>
            </Col>
            <Col span={8} xs={24} lg={8}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Assignee item={viewingRequest} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </div>
    </PageContainer>
  );
};

export default connect(({ offboarding, loading }) => ({
  offboarding,
  loadingFetchData: loading.effects['offboarding/getRequestByIdEffect'],
}))(TicketDetails);

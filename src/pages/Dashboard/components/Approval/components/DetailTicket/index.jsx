import { DownOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Input, Modal, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ModalImage from '@/assets/projectManagement/modalImage1.png';
import CommonModal from '@/components/CommonModal';
import { getCurrentCompany } from '@/utils/authority';
import { TYPE_TICKET_APPROVAL } from '@/utils/dashboard';
import { getTimezoneViaCity } from '@/utils/times';
import { dateFormatAPI } from '@/utils/timeSheet';
import PopoverInfo from '../PopoverInfo';
import WeeklyTable from './components/WeeklyTable';
import styles from './index.less';

const DetailTicket = (props) => {
  const {
    openModal,
    onCancel,
    viewedDetail = false,
    setViewedDetail = () => {},
    refreshData = () => {},
    ticket: {
      _id,
      ticketID = '',
      ticketId = '',
      assignee: {
        generalInfoInfo: { legalName: legalNameManager = '', userIdManager = '' } = {},
      } = {},
      employee: {
        // _id: idEmployee = '',
        generalInfo: { legalName: nameInfo = '', userId = '' } = {},
        // employeeId = '',
        departmentInfo: { name: departmentName = '' } = {},
      } = {} || {},
      employeeInfo: {
        employeeId: idEmployeeTimeSheet = '',
        legalName: nameInfoTimeSheet = '',
        employeeCode: employeeIdTimeSheet = '',
        department: { name: departmentNameTimeSheet = '' } = {},
        manager: { legalName: legalNameManagerTimeSheet = '' } = {},
      } = {} || {},
      employee = {},
      status = '',
      createdAt = '',
      fromDate = '',
      toDate = '',
      type: { name: requestType = '', typeName = '' } = {},
      subject = '',
      description = '',
      typeTicket = '',
      typeReport = '',
    },
    dispatch,
    loadingApprovel,
    loadingReject,
    companyLocationList,
    myTimesheetByWeek = [],
    timeoffList = [],
    // location: { state: { currentDateProp: currentDateProps = '' } = {} } = {},
  } = props;
  const [showDetail, setShowDetail] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [timezoneList, settimezoneList] = useState([]);
  const [currentTime, setcurrentTime] = useState(moment());
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(moment());
  // const [selectedView, setSelectedView] = useState(VIEW_TYPE.W);
  const [checkType, setCheckType] = useState(false);

  useEffect(() => {
    if (
      typeTicket === TYPE_TICKET_APPROVAL.LEAVE_REQUEST ||
      typeReport === TYPE_TICKET_APPROVAL.TIMEOFF
    ) {
      setCheckType(true);
    }
  }, []);

  // const currentDateProp = moment(currentDateProps, TIMESHEET_DATE_FORMAT);
  const onApproval = async () => {
    let response = {};
    if (checkType) {
      response = await dispatch({
        type: 'dashboard/approveRequest',
        payload: {
          typeTicket,
          _id,
          comment,
        },
        statusTimeoff: 'approval',
      });
      const { statusCode = '' } = response;
      if (statusCode === 200) {
        onCancel();
        refreshData();
      }
    } else {
      response = await dispatch({
        type: 'dashboard/approveTimeSheetRequest',
        payload: {
          status: TYPE_TICKET_APPROVAL.APPROVED,
          ticketId,
          comment,
        },
      });
      const { code = '' } = response;
      if (code === 200) {
        refreshData();
        onCancel();
      }
    }
  };

  const onReject = async () => {
    let response = {};
    if (checkType) {
      response = await dispatch({
        type: 'dashboard/rejectRequest',
        payload: {
          typeTicket,
          _id,
          comment,
        },
        statusTimeoff: 'reject',
      });
      const { statusCode = '' } = response;
      if (statusCode === 200) {
        setOpenModalConfirm(false);
        onCancel();
        refreshData();
      }
    } else {
      response = await dispatch({
        type: 'dashboard/rejectTimeSheetRequest',
        payload: {
          status: TYPE_TICKET_APPROVAL.REJECTED,
          ticketId,
          comment,
        },
      });
      const { code = '' } = response;
      if (code === 200) {
        setOpenModalConfirm(false);
        onCancel();
        refreshData();
      }
    }
  };

  const fetchMyTimesheetEffectByType = (startDate, endDate) => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId: idEmployeeTimeSheet,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
        viewType: 'W',
      },
    });
  };

  useEffect(() => {
    if (viewedDetail && !checkType) {
      fetchMyTimesheetEffectByType(fromDate, toDate);
    }
    return () => {
      setViewedDetail(false);
    };
  }, [idEmployeeTimeSheet, viewedDetail, employeeIdTimeSheet, checkType]);

  const viewDetail = () => {
    setShowDetail(!showDetail);
  };
  const fetchTimezone = () => {
    const timeZoneList = [];
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id: idLocation = '',
      } = location;
      timeZoneList.push({
        locationId: idLocation,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    settimezoneList(timeZoneList);
  };

  const renderUITimeOff = () => {
    return (
      <>
        <Row className={styles.ticketTimeoffInfo__row}>
          <Col span={8} className={styles.title}>
            Requester's Name:
          </Col>
          <Col span={16} className={styles.containEmployee}>
            <Popover
              content={
                <PopoverInfo
                  companyLocationList={companyLocationList}
                  propsState={{ currentTime, timezoneList }}
                  data={employee}
                />
              }
              placement="bottomRight"
              trigger="hover"
            >
              {nameInfo} ({userId})
            </Popover>
          </Col>
        </Row>
        <Row className={styles.ticketTimeoffInfo__row}>
          <Col span={8} className={styles.title}>
            Requester's Manager:
          </Col>
          <Col span={16} className={styles.contain}>
            {legalNameManager} {userIdManager && { userIdManager }}
          </Col>
        </Row>
        <Row className={styles.ticketTimeoffInfo__row}>
          <Col span={8} className={styles.title}>
            Requester's Department:
          </Col>
          <Col span={16} className={styles.contain}>
            {departmentName}
          </Col>
        </Row>
        <Row className={styles.ticketTimeoffInfo__row}>
          <Col span={8} className={styles.title}>
            Request Date:
          </Col>
          <Col span={16} className={styles.contain}>
            {moment(createdAt).locale('en').format('DD/MM/YYYY')}
          </Col>
        </Row>
        <Row className={styles.ticketTimeoffInfo__row}>
          <Col span={8} className={styles.title}>
            Request Type:
          </Col>
          <Col span={16} className={styles.contain}>
            {typeName && typeTicket === TYPE_TICKET_APPROVAL.LEAVE_REQUEST ? 'Timeoff' : 'Comoff'}
          </Col>
        </Row>
        {subject && (
          <Row className={styles.ticketTimeoffInfo__row}>
            <Col span={8} className={styles.title}>
              Request Reason:
            </Col>
            <Col span={16} className={styles.contain}>
              {subject}
            </Col>
          </Row>
        )}
      </>
    );
  };

  const renderUITimeSheet = () => {
    return (
      <>
        <Row gutter={[0, 12]}>
          <Col span={6}>
            <span>Employee Name:</span>
            <span className={styles.titleText}>{nameInfoTimeSheet}</span>
          </Col>
          <Col span={6}>
            <span>Department:</span>
            <span className={styles.titleText}>{departmentNameTimeSheet}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }} gutter={[0, 12]}>
          <Col span={6}>
            <span>EmployeeID:</span>
            <span className={styles.titleText}>{employeeIdTimeSheet}</span>
          </Col>
          <Col span={6}>
            <span>Manager:</span>
            <span className={styles.titleText}>{legalNameManagerTimeSheet}</span>
          </Col>
        </Row>
        <Divider />
        <WeeklyTable
          startDate={fromDate}
          endDate={toDate}
          data={myTimesheetByWeek}
          timeoffList={timeoffList}
          // setSelectedDate={setSelectedDate}
          // setSelectedView={setSelectedView}
        />
      </>
    );
  };

  useEffect(() => {
    fetchTimezone();
  }, [companyLocationList]);

  return (
    <Modal
      className={styles.modalCustom}
      visible={openModal}
      onCancel={onCancel}
      destroyOnClose
      title={`${checkType ? 'Timeoff' : 'Timesheet'} Detail`}
      maskClosable={false}
      width={600}
      footer={[
        <Button
          key="cancel"
          className={styles.btnCancel}
          onClick={() => setOpenModalConfirm(true)}
          loading={loadingReject}
        >
          Reject
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          onClick={onApproval}
          className={styles.btnSubmit}
          loading={loadingApprovel}
        >
          Approve
        </Button>,
      ]}
    >
      <>
        <div className={checkType ? styles.ticketTimeoffInfo : styles.ticketTimesheetInfo}>
          {checkType ? renderUITimeOff() : renderUITimeSheet()}
          {showDetail && checkType && (
            <div className={styles.ticketTimeoffInfo__more}>
              <Row className={styles.ticketTimeoffInfo__row}>
                <Col span={8} className={styles.title}>
                  Ticket ID:
                </Col>
                <Col span={16} className={styles.contain}>
                  <span className={styles.blueText}> {ticketID}</span>
                </Col>
              </Row>
              <Row className={styles.ticketTimeoffInfo__row}>
                <Col span={8} className={styles.title}>
                  Leave Type:
                </Col>
                <Col span={16} className={styles.contain}>
                  {requestType}
                </Col>
              </Row>
              <Row className={styles.ticketTimeoffInfo__row}>
                <Col span={8} className={styles.title}>
                  Leave duration:
                </Col>
                <Col span={16} className={styles.contain}>
                  {moment(fromDate).locale('en').format('DD.MM.YYYY')}-{' '}
                  {moment(toDate).locale('en').format('DD.MM.YYYY')}
                </Col>
              </Row>
              <Row className={styles.ticketTimeoffInfo__row}>
                <Col span={8} className={styles.title}>
                  Requested on:
                </Col>
                <Col span={16} className={styles.contain}>
                  {moment(createdAt).locale('en').format('DD.MM.YYYY')}
                </Col>
              </Row>
              {description && (
                <Row className={styles.ticketTimeoffInfo__row}>
                  <Col span={8} className={styles.title}>
                    Description:
                  </Col>
                  <Col span={16} className={styles.contain}>
                    {description}
                  </Col>
                </Row>
              )}
              <Row className={styles.ticketTimeoffInfo__row}>
                <Col span={8} className={styles.title}>
                  Status:
                </Col>
                <Col span={16} className={styles.contain}>
                  <span className={styles.status}>{status}</span>
                </Col>
              </Row>
            </div>
          )}
          {checkType && (
            <Row className={styles.ticketTimeoffInfo__detail} onClick={viewDetail}>
              Request Details <DownOutlined rotate={showDetail ? 180 : 0} />
            </Row>
          )}
        </div>
        <div className={styles.addComment} onClick={() => setShowComment(!showComment)}>
          {showComment ? <MinusOutlined /> : <PlusOutlined />} Add Comments
        </div>
        {showComment && (
          <Input.TextArea
            placeholder="Type here..."
            className={styles.comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}
      </>
      <CommonModal
        firstText="Yes"
        visible={openModalConfirm}
        onClose={() => setOpenModalConfirm(false)}
        onFinish={onReject}
        width={400}
        hasHeader={false}
        content={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 24,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={ModalImage} alt="" />
            <br />
            <div style={{ textAlign: 'center' }}>Are you sure you want reject </div>
            <div style={{ fontWeight: 500 }}>This {checkType ? 'Timeoff' : 'Timesheet'} Ticket</div>
          </div>
        }
      />
    </Modal>
  );
};
export default connect(
  ({
    loading,
    location: { companyLocationList = [] },
    timeSheet: { myTimesheetByWeek = [], timeoffList = [] } = {},
  }) => ({
    loadingApprovel: loading.effects['dashboard/approvalTicket'],
    loadingReject: loading.effects['dashboard/rejectTicket'],
    companyLocationList,
    myTimesheetByWeek,
    timeoffList,
  }),
)(DetailTicket);

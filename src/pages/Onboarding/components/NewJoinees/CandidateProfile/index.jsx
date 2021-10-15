import React, { useEffect } from 'react';
import PageContainer from '@/layouts/layout/src/PageContainer';
import { Affix, Button, Row, Col } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

const CandidateProfile = (props) => {
  const { match: { params: { userId = '' } = {} } = {}, dispatch, itemNewComer } = props;
  useEffect(() => {
    if (userId) {
      dispatch({ type: 'onboard/getCandidateById', payload: { candidate: userId } });
    }
  }, [userId]);
  const {
    ticketID = '',
    firstName = '',
    middleName = '',
    lastName = '',
    dateOfJoining = '',
    privateEmail = '',
    title: { name: titleName = '' } = {},
    department: { name: departmentName = '' } = {},
    grade: { name: gradeName = '' } = {},
    previousExperience = 0,
    workLocation: { name: locationName = '' } = {},
    assignTo: { generalInfoInfo: { legalName: hrEmployeeName = '' } = {} } = {},
    reportingManager: { generalInfoInfo: { legalName: managerName = '' } = {} } = {},
  } = itemNewComer;
  let fullName = firstName;
  if (middleName) fullName += ` ${middleName}`;
  if (lastName) fullName += ` ${lastName}`;
  return (
    <PageContainer>
      <div className={styles.container}>
        <Affix offsetTop={30}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Candidate Profile</p>
            <Button className={styles.btnAction}>Action</Button>
          </div>
        </Affix>
        <Row className={styles.mainPage}>
          <Col span={11} className={styles.mainLeft}>
            <div className={styles.mainHeader}>
              <div className={styles.mainHeader__title}>Basic Details</div>
              <div className={styles.mainHeader__description}>
                General info related to the candiadte would appear here
              </div>
            </div>
            <div className={styles.mainInfo}>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Candidate Id:
                </Col>
                <Col span={16} className={styles.info}>
                  {ticketID}
                </Col>
              </Row>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Name:
                </Col>
                <Col span={16} className={styles.info}>
                  {fullName}
                </Col>
              </Row>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Joining Date:
                </Col>
                <Col span={16} className={styles.info}>
                  {moment(dateOfJoining).locale('en').format('DD-MMM-YYYY')}
                </Col>
              </Row>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Personal E-mail ID:
                </Col>
                <Col span={16} className={styles.info}>
                  {privateEmail}
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12} className={styles.mainLeft}>
            <div className={styles.mainHeader}>
              <div className={styles.mainHeader__title}>Job Details</div>
              <div className={styles.mainHeader__description}>
                Job realted info related to the candiadte would appear here
              </div>
            </div>
            <div className={styles.mainInfo}>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Designation:
                </Col>
                <Col span={16} className={styles.info}>
                  {titleName}
                </Col>
              </Row>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Department:
                </Col>
                <Col span={16} className={styles.info}>
                  {departmentName}
                </Col>
              </Row>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Years of Exp
                </Col>
                <Col span={16} className={styles.info}>
                  {previousExperience}
                </Col>
              </Row>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Reporting Manager:
                </Col>
                <Col span={16} className={styles.info}>
                  {managerName}
                </Col>
              </Row>
              {/* <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Reporting Manager:
                </Col>
                <Col span={16} className={styles.info}>
                  John Doe
                </Col>
              </Row> */}
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Location:
                </Col>
                <Col span={16} className={styles.info}>
                  {locationName}
                </Col>
              </Row>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  Grade:
                </Col>
                <Col span={16} className={styles.info}>
                  {gradeName}
                </Col>
              </Row>
              <Row className={styles.mainInfo__row}>
                <Col span={8} className={styles.label}>
                  HR Employee
                </Col>
                <Col span={16} className={styles.info}>
                  {hrEmployeeName}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};
export default connect(({ onboard: { joiningFormalities: { itemNewComer = {} } = {} } }) => ({
  itemNewComer,
}))(CandidateProfile);

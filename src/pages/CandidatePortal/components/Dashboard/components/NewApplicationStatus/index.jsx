import React, { PureComponent } from 'react';
import { Row, Col, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import DownloadIcon from '@/assets/candidatePortal/downloadIcon.svg';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import styles from './index.less';

class ApplicationStatus extends PureComponent {
  itemBox = (item, index) => {
    return (
      <Col key={index} xs={12} md={8} lg={6} className={styles.itemBox}>
        <span className={styles.status}>{item.name}:</span>
        <span className={styles.dateOfJoining}>{item.value}</span>
      </Col>
    );
  };

  getTicketStatus = () => {
    const { data: { processStatus = '' } = {} || {} } = this.props;
    switch (processStatus) {
      case NEW_PROCESS_STATUS.OFFER_ACCEPTED:
        return <span className={`${styles.status} ${styles.accepted}`}>Offer Accepted</span>;
      case NEW_PROCESS_STATUS.OFFER_REJECTED:
        return <span className={`${styles.status} ${styles.rejected}`}>Offer Rejected</span>;
      case NEW_PROCESS_STATUS.OFFER_WITHDRAWN:
        return <span className={`${styles.status} ${styles.rejected}`}>Offer Withdrawn</span>;
      default:
        return <span className={styles.status}>Onboarding</span>;
    }
  };

  downloadOfferLetter = () => {
    const { data: { offerLetter: { attachment: { url = '' } = {} || {} } = {} || {} } = {} || {} } =
      this.props;
    if (url) {
      const fileName = url.split('/').pop();
      message.loading('Downloading file. Please wait...');
      axios({
        url,
        method: 'GET',
        responseType: 'blob',
      }).then((resp) => {
        // eslint-disable-next-line compat/compat
        const urlDownload = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement('a');
        link.href = urlDownload;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
    } else {
      message.error('Something wrong.');
    }
  };

  render() {
    const {
      data: {
        title: { name: titleName = '' } = {} || {},
        reportingManager: {
          generalInfo: { firstName = '', lastName = '', middleName = '' } = {} || {},
        } = {} || {},
        dateOfJoining = '',
        department: { name: departmentName = '' } = {} || {},
        workLocation = {} || {},
        grade: { name: gradeName = '' } = {},
        firstName: candidateFirstName = '',
        middleName: candidateMiddleName = '',
        lastName: candidateLastName = '',
        ticketID = '',
        processStatus = '',
      } = {} || {},
    } = this.props;

    let candidateFullName = `${candidateFirstName} ${candidateMiddleName} ${candidateLastName}`;
    if (!candidateMiddleName) candidateFullName = `${candidateFirstName} ${candidateLastName}`;

    let managerFullName = `${firstName} ${middleName} ${lastName}`;
    if (!middleName) managerFullName = `${firstName} ${lastName}`;

    const items = [
      {
        name: 'Candidate Name',
        value: candidateFullName || '-',
      },
      {
        name: 'Designation',
        value: titleName || '-',
      },
      {
        name: 'Hiring Manager',
        value: managerFullName || '-',
      },
      {
        name: 'Joining Date',
        value: dateOfJoining ? moment(dateOfJoining).format('DD.MM.YY') : '-',
      },
      {
        name: 'Candidate ID',
        value: ticketID || '-',
      },
      {
        name: 'Department',
        value: departmentName || '-',
      },
      {
        name: 'Grade',
        value: gradeName || '-',
      },
      {
        name: 'Location',
        value: workLocation?.name || '-',
      },
    ];
    return (
      <div className={styles.ApplicationStatus}>
        <div className={styles.header}>
          <div className={styles.left}>
            <span>Application Status</span>
            {this.getTicketStatus()}
          </div>
          {processStatus === NEW_PROCESS_STATUS.OFFER_ACCEPTED && (
            <div className={styles.right} onClick={this.downloadOfferLetter}>
              <img src={DownloadIcon} alt="download" />
              <span className={styles.downloadOfferText}>Download offer letter</span>
            </div>
          )}
        </div>
        <Row gutter={[24, 10]} className={styles.content}>
          {items.map((val, index) => this.itemBox(val, index))}
        </Row>
      </div>
    );
  }
}

export default ApplicationStatus;

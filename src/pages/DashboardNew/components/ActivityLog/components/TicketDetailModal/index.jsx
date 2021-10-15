import { Button, Col, Modal, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import MessageBox from '../MessageBox';
import styles from './index.less';

const { Option } = Select;

const TicketDetailModal = (props) => {
  const {
    visible = false,
    title = '',
    onClose = () => {},
    item: {
      ticketID = '16627',
      requestDate = '12/03/2019',
      queryType = 'Leave',
      priority = 'High',
      subject = 'Leave Query',
      cc = ['Savannah Nguyen'],
      attachments = [],
      description = `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia 
      consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.`,
      status = 'In Progress',
    } = {},
  } = props;

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const renderModalContent = () => {
    const content = [
      {
        name: 'Ticket ID',
        value: <span className={styles.ticketID}>{ticketID}</span>,
        span: 12,
      },
      {
        name: 'Request Date',
        value: requestDate,
        span: 12,
      },
      {
        name: 'Query Type',
        value: queryType,
        span: 12,
      },
      {
        name: 'Priority',
        value: <span className={styles.priority}>{priority}</span>,
        span: 12,
      },
      {
        name: 'Subject',
        value: subject,
        span: 12,
      },
      {
        name: 'CC',
        value: cc.map((val) => <span>{val}</span>),
        span: 12,
      },
      {
        name: 'Attachments',
        value: '',
        span: 24,
      },
      {
        name: 'Description',
        value: description,
        span: 24,
      },
    ];
    return (
      <div className={styles.container}>
        <div className={styles.container__details}>
          <div className={styles.abovePart}>
            <Row gutter={[16, 16]}>
              {content.map((val) => (
                <Col span={val.span}>
                  <div>
                    <span className={styles.title}>{val.name}</span>:{' '}
                    <span className={styles.value}>{val.value}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className={styles.belowPart}>
            <div className={styles.status}>
              <span>Status:</span>
              <Select value={status}>
                <Option value="In Progress">In Progress</Option>
              </Select>
            </div>
            <div className={styles.actionButton}>
              <Button>Update</Button>
            </div>
          </div>
        </div>
        <MessageBox />
      </div>
    );
  };

  return (
    <Modal
      className={`${styles.TicketDetailModal} ${styles.withPadding}`}
      onCancel={handleCancel}
      destroyOnClose
      footer={null}
      title={renderModalHeader()}
      centered
      visible={visible}
      width={700}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default connect(() => ({}))(TicketDetailModal);

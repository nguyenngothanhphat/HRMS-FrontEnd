import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import ArrowDownIcon from '@/assets/candidatePortal/arrowDown.svg';
import CommonModal from '../CommonModal';
import PendingTaskTable from './components/PendingTaskTable';
import styles from './index.less';

@connect(
  ({
    candidatePortal: { pendingTasks = [], data = {}, data: { processStatus = '' } = {} } = {},
    loading,
  }) => ({
    pendingTasks,
    processStatus,
    data,
    loadingFetchDocument: loading.effects['candidatePortal/fetchDocumentByCandidate'],
  }),
)
class PendingTasks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  // no need here, refresh in fetch candidate
  // componentDidUpdate = (prevProps) => {
  //   const { dispatch, processStatus = '' } = this.props;
  //   if (processStatus !== prevProps.data.processStatus) {
  //     dispatch({
  //       type: 'candidatePortal/refreshPendingTasks',
  //     });
  //   }
  // };

  renderItem = (item, listLength, index) => {
    return (
      <>
        <Row span={24} className={styles.eachItem} align="middle">
          <Col span={16}>
            <span>{item.name}</span>
          </Col>
          <Col span={8}>
            <span>{item.dueDate}</span>
          </Col>
        </Row>
        {index + 1 < listLength && <div className={styles.divider} />}
      </>
    );
  };

  openModal = (value) => {
    this.setState({
      openModal: value,
    });
  };

  render() {
    const { openModal } = this.state;
    const { pendingTasks = [], loadingFetchDocument } = this.props;
    return (
      <div className={styles.PendingTasks}>
        <div>
          <div className={styles.header}>
            <span>Pending Tasks</span>
          </div>
          <div className={styles.content}>
            <PendingTaskTable tasks={pendingTasks} loading={loadingFetchDocument} />
          </div>
        </div>
        <div className={styles.viewMoreBtn} onClick={() => this.openModal(true)}>
          <span>View All</span>
          <img src={ArrowDownIcon} alt="expand" />
        </div>
        <CommonModal
          title="Pending Tasks"
          content={pendingTasks}
          visible={openModal}
          onClose={() => this.openModal(false)}
          type="pending-tasks"
        />
      </div>
    );
  }
}

export default PendingTasks;

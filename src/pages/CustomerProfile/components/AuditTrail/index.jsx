import { Table } from 'antd';
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import styles from './index.less';

@connect(({ loading, customerProfile: { auditTrail = [] } = {} }) => ({
  auditTrail,
  loadingAuditTrail: loading.effects['customerProfile/fetchAuditTrail'],
}))
class AuditTrail extends PureComponent {
  componentDidMount() {
    const { dispatch, reId } = this.props;

    dispatch({
      type: 'customerProfile/fetchAuditTrail',
      payload: {
        id: reId,
      },
    });
  }

  generateColumns = () => {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'time',
        align: 'left',
        width: '10%',
      },
      {
        title: 'User',
        dataIndex: 'user',
        align: 'left',
        fixed: 'left',
        width: '10%',
        render: (user) => {
          return <Link style={{ fontWeight: '700' }}>{user}</Link>;
        },
      },
      {
        title: 'Changes',
        dataIndex: 'changes',
        width: '10%',
        align: 'left',
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  render() {
    const { auditTrail } = this.props;

    return (
      <div className={styles.AuditTrail}>
        <div className={styles.documentHeader}>
          <div className={styles.documentHeaderTitle}>
            <p>Audit Trail</p>
          </div>
        </div>
        <div className={styles.documentBody}>
          <Table columns={this.generateColumns()} dataSource={auditTrail} />
        </div>
      </div>
    );
  }
}

export default AuditTrail;

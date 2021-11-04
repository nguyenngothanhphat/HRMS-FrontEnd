import { Table } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import styles from './index.less';
import docPDF from '@/assets/docPDF.svg';

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
        dataIndex: 'created_at',
        align: 'left',
        width: '10%',
        render: (created_at) => {
          const time = moment(created_at).format('MMM D, HH:mm');
          return <p style={{ textTransform: 'capitalize' }}>{time}</p>;
        },
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
        dataIndex: 'attachmentInfo',
        width: '10%',
        align: 'left',
        render: (attachmentInfo, doc) => {
          return (
            <>
              <p>{doc?.action}</p>
              <p>
                <img src={docPDF} alt="doc" />
                <span style={{ display: 'inline-block', marginLeft: '10px', color: '#2C6DF9' }}>
                  {attachmentInfo?.name.slice(0, -4)}
                </span>
                .pdf
              </p>
            </>
          );
        },
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

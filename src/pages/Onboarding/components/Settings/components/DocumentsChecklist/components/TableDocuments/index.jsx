import React from 'react';
import moment from 'moment';
import CommonTable from '@/components/CommonTable';
import styles from './index.less';

const TableDocuments = (props) => {
  const { data = [] } = props;
  const getColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name) => <span className={styles.name}>{name}</span>,
      },
      {
        title: 'Document',
        dataIndex: 'document',
        key: 'document',
        render: (document) => <span className={styles.name}>{document}</span>,
      },
      {
        title: 'Document Requirement',
        dataIndex: 'documentRequirement',
        key: 'documentRequirement',
        render: (documentRequirement) => <span className={styles.name}>{documentRequirement}</span>,
      },
      {
        title: 'Uploaded On',
        dataIndex: 'uploadedOn',
        key: 'uploadedOn',
        render: (uploadedOn) => {
          return (
            <span>{uploadedOn ? moment(uploadedOn).locale('en').format('MM.DD.YY') : '-'}</span>
          );
        },
      },
      {
        title: 'Uploaded By',
        dataIndex: 'uploadedBy',
        key: 'uploadedBy',
        render: (uploadedBy) => {
          return <span>{uploadedBy}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (action, row) => {
          return (
            <span>
              {action}
              <span className={styles.clickableTag} />
            </span>
          );
        },
      },
    ];
    return columns;
  };
  return (
    <div className={styles.TableDocuments}>
      <CommonTable list={data} columns={getColumns()} />
    </div>
  );
};

export default TableDocuments;

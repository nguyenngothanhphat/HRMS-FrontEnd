import { Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import DeleteIcon from '@/assets/onboarding/deleteIcon.svg';
import EditIcon from '@/assets/onboarding/editIcon.svg';
import PDFIcon from '@/assets/onboarding/pdfIcon.svg';
import DocIcon from '@/assets/onboarding/docIcon.svg';
import ImageIcon from '@/assets/onboarding/imageIcon.png';
import CommonTable from '@/components/CommonTable';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import styles from './index.less';

const TableDocuments = (props) => {
  const {
    data = [],
    loading = false,
    onDelete = () => {},
    onEdit = () => {},
    onChangePage = () => {},
    size = 10,
    page = 1,
  } = props;
  const [viewDocumentModal, setViewDocumentModal] = useState(false);
  const [link, setLink] = useState('');

  const handleViewAttachment = (url) => {
    setLink(url);
    setViewDocumentModal(true);
  };

  const trunCate = (string) => {
    if (string.length > 20) {
      return (
        <Tooltip placement="top" title={string}>
          {`${string.substr(0, 10)}...${string.substr(string.length - 8, string.length)}`}
        </Tooltip>
      );
    }
    return string;
  };

  const renderImg = (type) => {
    switch (type) {
      case 'application/pdf':
        return <img src={PDFIcon} alt="pdf" />;
      case 'image/svg+xml':
        return <img src={ImageIcon} alt="doc" />;
      default:
        return <img src={DocIcon} alt="pdf" />;
    }
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'displayName',
        key: 'displayName',
        render: (displayName) => <span className={styles.name}>{displayName}</span>,
      },
      {
        title: 'Document',
        dataIndex: 'attachment',
        key: 'attachment',
        render: (attachment) => {
          const { name = '', url = '', type = '' } = attachment || {};
          return (
            <div className={styles.containerAttachment}>
              {renderImg(type)}
              <div className={styles.attachment} onClick={() => handleViewAttachment(url)}>
                {trunCate(name)}
              </div>
            </div>
          );
        },
      },
      {
        title: 'Document Requirement',
        dataIndex: 'category',
        key: 'category',
        render: (category) => {
          const { name = '' } = category || {};
          return <span className={styles.name}>{name}</span>;
        },
      },
      {
        title: 'Uploaded On',
        dataIndex: 'category',
        key: 'category',
        render: (category) => {
          const { createdAt = '' } = category || {};
          return <span>{category ? moment(createdAt).locale('en').format('MM.DD.YY') : '-'}</span>;
        },
      },
      {
        title: 'Uploaded By',
        dataIndex: 'employee',
        key: 'employee',
        render: (employee) => {
          const { generalInfoInfo: { legalName = '' } = {} } = employee || {};
          return <span className={styles.uploadedBy}>{trunCate(legalName)}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, record) => {
          return (
            <div className={styles.containerAction}>
              <img src={EditIcon} alt="" onClick={() => onEdit(record)} />
              <Popconfirm placement="left" title="Are you sure?" onConfirm={() => onDelete(record)}>
                <img src={DeleteIcon} alt="" />
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return columns;
  };
  return (
    <div className={styles.TableDocuments}>
      <CommonTable
        list={data}
        columns={getColumns()}
        loading={loading}
        onChangePage={onChangePage}
        limit={size}
        page={page}
      />
      <ViewDocumentModal
        url={link}
        visible={viewDocumentModal}
        onClose={() => setViewDocumentModal(false)}
      />
    </div>
  );
};

export default TableDocuments;

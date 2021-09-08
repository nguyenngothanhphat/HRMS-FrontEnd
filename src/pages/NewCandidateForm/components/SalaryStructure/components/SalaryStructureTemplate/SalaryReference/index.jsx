import { Modal, Popover, Table } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { find, trim, trimStart } from 'lodash';
import styles from './index.less';

const SalaryReference = (props) => {
  const { openModal, onCancel, dispatch, listCandidate, loading } = props;
  useEffect(() => {
    if (openModal)
      dispatch({
        type: 'newCandidateForm/fetchListCandidate',
        payload: {
          processStatus: NEW_PROCESS_STATUS.OFFER_ACCEPTED,
        },
      });
  }, [openModal]);

  const formatNumber = (value) => {
    // const temp = toString(value);
    const list = trim(value).split('.');
    let num = list[0] === '0' ? list[0] : trimStart(list[0], '0');
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    list[0] = result;
    return list.join('.');
  };
  const renderSingle = (value, unit) => {
    if (!value) return '0';
    if (unit !== '%') return `${unit} ${formatNumber(value)}`;
    return (
      <div>
        {value}
        <span className={styles.ofBasic}> % of Basics</span>
      </div>
    );
  };

  const columns = [
    {
      title: 'Candidate Name',
      dataIndex: 'candidateName',
      key: 'candidateName',
      render: (_, record) => {
        if (record) {
          let candidateName = '';
          if (record.firstName) candidateName += record.firstName;
          if (record.middleName) candidateName += ` ${record.middleName}`;
          if (record.lastName) candidateName += ` ${record.lastName}`;
          return (
            <Popover content="test" placement="right">
              <div>{candidateName}</div>
            </Popover>
          );
        }
        return '';
      },
    },
    {
      title: 'Job title',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      render: (title) => {
        if (title) {
          return <div>{title.name}</div>;
        }
        return '';
      },
    },
    {
      title: 'Salary',
      dataIndex: 'Salary',
      key: 'salary',
      align: 'center',
      render: (_, record) => {
        const { salaryStructure } = record;
        if (salaryStructure) {
          const { settings } = salaryStructure;
          const temp = find(settings, (item) => item.key === 'total_compensation');
          if (temp) return <div>{renderSingle(temp.value, temp.unit)}</div>;
          return 0;
        }
        return 0;
      },
    },
  ];
  return (
    <Modal
      className={styles.modalCustom}
      visible={openModal}
      onCancel={onCancel}
      style={{ top: 50 }}
      destroyOnClose
      maskClosable={false}
      width={600}
      title="Salary Reference"
      footer={false}
    >
      <div>
        <Table
          columns={columns}
          dataSource={listCandidate}
          size="middle"
          pagination={false}
          loading={loading}
        />
      </div>
    </Modal>
  );
};
export default connect(
  ({
    loading,
    newCandidateForm: {
      data: { listCandidate = [] },
    },
  }) => ({
    listCandidate,
    loading: loading.effects['newCandidateForm/fetchListCandidate'],
  }),
)(SalaryReference);

import React from 'react';
import ReactExport from 'react-data-export';
import { Icon } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { getCategory } from '@/utils/utils';
import Crypto from '@/utils/Crypto';
import styles from '../index.less';

const ExcelFileEx = ReactExport.ExcelFile;
const ExcelSheetEx = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumnEx = ReactExport.ExcelFile.ExcelColumn;

const getFileName = () => {
  const d = new Date();
  return `Report-${d.getMonth() +
    1}${d.getDate()}${d.getFullYear()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
};

const getType = bill => {
  let type = '';
  if (bill.category && bill.category !== 'customer-product') {
    type = bill.mileage ? bill.mileage.type : bill.type.type;
  }
  return type;
};

const ExportExcel = ({ data = [], billData = [], type = '' }) => (
  <ExcelFileEx
    filename={getFileName()}
    element={
      <div>
        <Icon type="file-excel" />
        <span className={styles.ml10}>
          {type === 'approval'
            ? `${`${formatMessage({ id: 'common.button.export' })} EXCEL`}`
            : 'EXCEL'}
        </span>
      </div>
    }
  >
    <ExcelSheetEx data={data} name={formatMessage({ id: 'common.report' }).toUpperCase()}>
      <ExcelColumnEx
        label={formatMessage({ id: 'common.date' })}
        value={col => moment(col.date).format('YYYY-MM-DD')}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.report-id' })}
        value={col => {
          if (col.id) {
            return Crypto.encryptShort(col.id);
          }
          return '';
        }}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.requester' })}
        value={col => col.currentRequest || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.status' })}
        value={col => col.status || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.state' })}
        value={col => col.subStatus.defaultMessage || ''}
      />
      <ExcelColumnEx label={formatMessage({ id: 'common.title' })} value={col => col.title || ''} />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.description' })}
        value={col => col.description || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.current-assign' })}
        value={col => col.currentAssign || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.amount-of-bills' })}
        value={col => col.bills.length || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.currency' })}
        value={col => col.currency || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.amount' })}
        value={col => Math.round(col.amount * 100) / 100 || ''}
      />
    </ExcelSheetEx>

    <ExcelSheetEx data={billData} name={formatMessage({ id: 'excel.bill' }).toUpperCase()}>
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.report-id' })}
        value={col => (col.reportId ? col.reportId : '')}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.expense-id' })}
        value={col => col._id || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.category' })}
        value={col => getCategory(col.category)}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.expense-type' })}
        value={col => getType(col)}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.date' })}
        value={col => (col.date ? moment(col.date).format('YYYY-MM-DD') : '')}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'bill.project' })}
        value={col => (col.project ? col.project.name : '')}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.billable' })}
        value={col => {
          if (!col.project) {
            return '';
          }
          return col.billable
            ? formatMessage({ id: 'excel.reimbursable.yes' })
            : formatMessage({ id: 'excel.reimbursable.no' });
        }}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'bill.form.company' })}
        value={col => col.company || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.description' })}
        value={col => col.description || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.tag' })}
        value={col => (col.group ? col.group.groupName : '')}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.reimbursable' })}
        value={col => {
          if (col.reportId || col.space) {
            return '';
          }
          return col.reimbursable
            ? formatMessage({ id: 'common.yes' })
            : formatMessage({ id: 'common.no' });
        }}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.original-currency' })}
        value={col => col.originCurrency || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.original-amount' })}
        value={col => Math.round(col.originAmount * 100) / 100 || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.currency' })}
        value={col => col.currency || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'common.amount' })}
        value={col => Math.round(col.amount * 100) / 100 || ''}
      />
    </ExcelSheetEx>
  </ExcelFileEx>
);

export default ExportExcel;

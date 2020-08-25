import React from 'react';
import ReactExport from 'react-data-export';
import { Icon } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const ExcelFileEx = ReactExport.ExcelFile;
const ExcelSheetEx = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumnEx = ReactExport.ExcelFile.ExcelColumn;

const getFileName = () => {
  const d = new Date();
  return `Feedback-${d.getMonth() +
    1}${d.getDate()}${d.getFullYear()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
};

const ExportExcel = ({ data = [], type = '' }) => (
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
        label={formatMessage({ id: 'excel.date' })}
        value={col => moment(col.createdAt).format('YYYY-MM-DD')}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.working-email' })}
        value={col => col.email || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.description' })}
        value={col => col.description || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.type' })}
        value={col => col.feedbackFor || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.office' })}
        value={col => col.office || ''}
      />
      <ExcelColumnEx
        label={formatMessage({ id: 'excel.status' })}
        value={col => col.status || ''}
      />
    </ExcelSheetEx>
  </ExcelFileEx>
);

export default ExportExcel;

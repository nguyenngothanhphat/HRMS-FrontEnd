import React from 'react';
// import { Button } from 'antd';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import styles from './index.less';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const exportToCSV = (csvData, fileName) => {
  const ws = XLSX.utils.json_to_sheet(csvData);
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

const ExportCSV = ({ csvData, fileName }) => {
  return (
    <div className={styles.dowload}>
      <div onClick={() => exportToCSV(csvData, fileName)}>Download spreadsheet</div>
    </div>
  );
};

export default ExportCSV;

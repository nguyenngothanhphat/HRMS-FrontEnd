import React, { useState } from 'react';
import { Card, Dropdown, Menu, Button } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import SmallDownArrow from '@/assets/smallDropdownGray.svg';

import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const documentWarning = (msg) => (
  <div className={styles.documentWarning} style={{ padding: '24px' }}>
    <p>{msg}</p>
  </div>
);

const Form16 = (props) => {
  const [filterMode, setFilterMode] = useState('2021');
  const [currentPage] = useState(1);

  const renderFilterMode = () => {
    if (filterMode === '2021') return '2021';
    return '2022';
  };
  const onClick = ({ key }) => {
    setFilterMode(key);
  };

  const { url = '' } = props;
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="2021">2021</Menu.Item>
      <Menu.Item key="2022">2022</Menu.Item>
    </Menu>
  );
  const renderOption = () => {
    return (
      <Dropdown overlay={menu}>
        <div className={styles.options} onClick={(e) => e.preventDefault()}>
          <span>{renderFilterMode()}</span>

          <img src={SmallDownArrow} alt="" />
        </div>
      </Dropdown>
    );
  };

  return (
    <div className={styles.Form16}>
      <Card title="Form 16" extra={renderOption()}>
        <div className={styles.viewFile}>
          <Document
            file="https://stghrms.paxanimi.ai/api/attachments/61b04c149d426500a9953b75/Resume.pdf"
            // file={url}
            // onLoadSuccess={onLoadSuccess}
            loading={documentWarning('Loading document. Please wait...')}
            noData={documentWarning('URL is not available.')}
          >
            <Page pageNumber={currentPage} />
          </Document>
        </div>
      </Card>
      <div className={styles.btnDownLoad}>
        <Button>DownLoad</Button>
      </div>
    </div>
  );
};

export default Form16;

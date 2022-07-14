import { LoadingOutlined } from '@ant-design/icons';
import { Form, Input, Spin } from 'antd';
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const VerifyDocumentModalContent = (props) => {
  const {
    item: {
      document: { attachment: { url = '' } = {} || {} } = {} || {},
      resubmitComment = '',
    } = {} || {},
    action = '',
    onResubmit = () => {},
  } = props;

  const [numPages, setNumPages] = React.useState(null);

  const identifyImageOrPdf = () => {
    const parts = url.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 0;
    }
  };

  const onDocumentLoadSuccess = ({ numPages: numPagesProp }) => {
    setNumPages(numPagesProp);
  };

  const renderLoading = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
      <div className={styles.loading}>
        <Spin indicator={antIcon} />
      </div>
    );
  };

  const _renderViewImage = () => {
    return (
      <div className={styles.imageFrame}>
        {/* <Image width="100%" height="100%" src={url} /> */}
        <img src={url} alt="document" />
      </div>
    );
  };

  const _renderViewPDF = () => {
    return (
      <Document
        className={styles.pdfFrame}
        onLoadSuccess={onDocumentLoadSuccess}
        file={url}
        loading={renderLoading()}
        noData="Document Not Found"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            loading=""
            className={styles.pdfPage}
            key={`page_${index + 1}`}
            pageNumber={index + 1}
          />
        ))}
      </Document>
    );
  };

  const viewType = identifyImageOrPdf(url);
  return (
    <div className={styles.VerifyDocumentModalContent}>
      <div className={styles.container}>
        <div className={viewType === 0 ? styles.contentViewImage : styles.contentViewPDF}>
          {viewType === 0 && _renderViewImage()}
          {viewType === 1 && _renderViewPDF()}
        </div>
      </div>

      {(action === 'resubmit' || resubmitComment) && (
        <div className={styles.commentContent}>
          <Form
            name="basic"
            id="myForm"
            onFinish={onResubmit}
            initialValues={{
              resubmitComment,
            }}
          >
            <Form.Item
              name="resubmitComment"
              label="Enter comments"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Please input your comment!',
                },
              ]}
            >
              <Input.TextArea
                placeholder="Comment"
                autoSize={{
                  minRows: 4,
                  maxRows: 7,
                }}
                disabled={!action}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};
export default VerifyDocumentModalContent;

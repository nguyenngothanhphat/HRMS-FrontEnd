import React, { PureComponent } from 'react';
import { Collapse, Row, Col } from 'antd';
import { DownloadOutlined, CaretRightOutlined, FileOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Panel } = Collapse;
class TypeRow extends PureComponent {
  statusAndDownloadButton = () => (
    <div className={styles.statusAndDownload}>
      <a>Complete</a>
      <DownloadOutlined
        className={styles.downloadButton}
        onClick={(event) => {
          // no collapse activate when clicking on download button
          event.stopPropagation();
        }}
      />
    </div>
  );

  render() {
    const { data } = this.props;
    return (
      <div>
        {data.map((row) => (
          <Collapse
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined className={styles.collapseIcon} rotate={isActive ? 90 : 0} />
            )}
            className={styles.eachCollapse}
          >
            <Panel
              header={row.title}
              className={styles.eachPanel}
              key="1"
              extra={this.statusAndDownloadButton()}
            >
              {row.files.map((file) => (
                <Row className={styles.eachRow}>
                  <Col span={8} className={styles.fileName}>
                    <a>
                      <FileOutlined className={styles.fileIcon} />
                      <span>{file.fileName}</span>
                    </a>
                  </Col>
                  <Col span={7}>{file.generatedBy}</Col>
                  <Col span={7}>{file.date}</Col>
                  <Col span={2} />
                </Row>
              ))}
            </Panel>
          </Collapse>
        ))}
      </div>
    );
  }
}

export default TypeRow;

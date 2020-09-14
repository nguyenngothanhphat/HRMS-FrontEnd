import React, { PureComponent } from 'react';
import { Collapse, Row, Col } from 'antd';
import { DownloadOutlined, CaretRightOutlined, EllipsisOutlined } from '@ant-design/icons';
import FileIconPDF from '../../../../../../assets/pdf_icon.png';
import styles from './index.less';

const { Panel } = Collapse;
class TypeRow extends PureComponent {
  handleDownloadClick = (event) => {
    // no collapse activate when clicking on download button
    event.stopPropagation();
  };

  handleMenuClick = (event) => {
    // no collapse activate when clicking on menu button
    event.stopPropagation();
  };

  statusAndButtons = () => (
    <div className={styles.statusAndButtons}>
      <a>Complete</a>
      <DownloadOutlined className={styles.downloadButton} onClick={this.handleDownloadClick} />
      <EllipsisOutlined className={styles.menuButton} onClick={this.handleMenuClick} />
    </div>
  );

  render() {
    const { data = [] } = this.props;
    return (
      <div>
        {data.map((row) => (
          <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined className={styles.collapseIcon} rotate={isActive ? 90 : 0} />
            )}
            className={styles.eachCollapse}
          >
            <Panel
              header={row.kind}
              className={styles.eachPanel}
              key="1"
              extra={this.statusAndButtons()}
            >
              {row.files.map((file) => (
                <Row className={styles.eachRow}>
                  <Col span={8} className={styles.fileName}>
                    <a>
                      <img src={FileIconPDF} alt="file" className={styles.fileIcon} />
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

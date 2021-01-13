import { Col, Row, Button } from 'antd';
import React, { Component } from 'react';
import ModalUploadDocument from './components/ModalUploadDocument';
import s from './index.less';

class CompanyDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleSubmitUpload = (values) => {
    console.log('values', values);
  };

  showModalUpload = () => {
    this.setState({
      visible: true,
    });
  };

  hideModalUpload = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible = false } = this.state;
    return (
      <>
        <Row className={s.root} gutter={[24, 0]}>
          <Col span={7}>
            <div className={`${s.container} ${s.viewLeft}`}>
              <p>All administrative and policy documents are store here.</p>
              <p>
                You can also choose to upload a document from your device or create a new company
                document.
              </p>
              <Button className={s.btnUpload} onClick={this.showModalUpload}>
                Upload a new document
              </Button>
            </div>
          </Col>
          <Col span={17}>
            <div className={`${s.container} ${s.viewRight}`}>View Right</div>
          </Col>
        </Row>
        <ModalUploadDocument
          visible={visible}
          handleCancel={this.hideModalUpload}
          handleSubmit={this.handleSubmitUpload}
        />
      </>
    );
  }
}

export default CompanyDocuments;

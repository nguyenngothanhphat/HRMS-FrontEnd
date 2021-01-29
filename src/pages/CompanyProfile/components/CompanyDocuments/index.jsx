import { Col, Row, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import ModalUploadDocument from './components/ModalUploadDocument';
import TableDocuments from './components/TableDocuments';
import s from './index.less';

@connect(
  ({
    loading,
    user: { currentUser = {} } = {},
    documentsManagement: { listDocumentAccountSetup = [] } = {},
  }) => ({
    currentUser,
    loading: loading.effects['documentsManagement/fetchListDocumentsAccountSetup'],
    loadingSubmit: loading.effects['documentsManagement/addDocumentAccountSetup'],
    listDocumentAccountSetup,
  }),
)
class CompanyDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      keyModal: '',
    };
  }

  componentDidMount() {
    const { dispatch, currentUser: { company: { _id } = {} } = {} } = this.props;
    dispatch({
      type: 'documentsManagement/fetchListDocumentsAccountSetup',
      payload: {
        company: _id,
      },
    });
  }

  handleSubmitUpload = (values) => {
    const { dispatch, currentUser: { company: { _id: id = '' } = {} } = {} } = this.props;
    const payload = { ...values, company: id };
    dispatch({
      type: 'documentsManagement/addDocumentAccountSetup',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.hideModalUpload();
      }
    });
  };

  showModalUpload = () => {
    this.setState({
      visible: true,
      keyModal: Date.now(),
    });
  };

  hideModalUpload = () => {
    this.setState({
      visible: false,
      keyModal: '',
    });
  };

  render() {
    const { visible = false, keyModal = '' } = this.state;
    const { listDocumentAccountSetup = [], loading, loadingSubmit } = this.props;
    return (
      <>
        <Row className={s.root} gutter={[24, 0]}>
          <Col span={6}>
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
          <Col span={18}>
            <div className={`${s.container} ${s.viewRight}`}>
              <TableDocuments loading={loading} data={listDocumentAccountSetup} />
            </div>
          </Col>
        </Row>
        <ModalUploadDocument
          keyModal={keyModal}
          visible={visible}
          handleCancel={this.hideModalUpload}
          handleSubmit={this.handleSubmitUpload}
          loadingSubmit={loadingSubmit}
        />
      </>
    );
  }
}

export default CompanyDocuments;

import AttachmentIcon from '@/assets/attachment.svg';
import InfoIcon from '@/assets/candidatePortal/infoIcon.svg';
import TextSignature from '@/components/TextSignature';
import { Button, Form, Input, message, Modal, Radio, Row, Select, Space, Spin, Upload } from 'antd';
import React, { PureComponent } from 'react';
import SignaturePad from 'react-signature-canvas';
import { connect } from 'umi';
import styles from './index.less';

const { Dragger } = Upload;

const { Option } = Select;

const initialState = {
  uploadedFile: {},
  uploadedPreview: '',
  mode: 'upload',
  digitalSignatureName: '',
  arrImgBase64: [],
  finalDigitalSignature: 0,
};

@connect(({ loading }) => ({
  loadingUploadAttachment: loading.effects['upload/uploadFile'],
  loading:
    loading.effects['candidatePortal/updateByCandidateEffect'] ||
    loading.effects['candidatePortal/submitCandidateFinalOffer'],
}))
class AcceptOfferModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.sigPad = React.createRef();
  }

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'webp':
      case 'tiff':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      case 'doc':
      case 'docx':
        return 2;

      default:
        return 0;
    }
  };

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = this.props;
    const checkType =
      this.identifyImageOrPdf(file.name) === 0 || this.identifyImageOrPdf(file.name) === 1;
    if (!checkType) {
      message.error('You can only upload image and PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
      setSizeImageMatch(isLt5M);
      // this.setState({ check: isLt5M });
    }
    setTimeout(() => {
      setSizeImageMatch(isLt5M);
      // this.setState({ check: isLt5M });
    }, 2000);
    return checkType && isLt5M;
  };

  handleUpload = async (file) => {
    const getBase64 = (img, callback) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    };

    if (!file.url && !file.preview) {
      getBase64(file, (imageUrl) => this.setState({ uploadedPreview: imageUrl }));
    }

    this.setState({
      uploadedFile: file,
    });
  };

  renderHeaderModal = () => {
    const { titleModal = 'Signature of the candidate' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    this.clearState();
    onClose();
  };

  onChangeNameDigital = (value) => {
    this.setState({
      digitalSignatureName: value || '',
      arrImgBase64: [],
    });
  };

  getImg = (e) => {
    const { arrImgBase64 } = this.state;
    const arr = arrImgBase64;
    arr.push(e);
    this.setState({
      arrImgBase64: arr,
    });
  };

  // finish
  clearState = () => {
    this.setState(initialState);
  };

  dataURItoBlob = (dataURI) => {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i += 1) {
      array.push(binary.charCodeAt(i));
    }
    // eslint-disable-next-line compat/compat
    return new Blob([new Uint8Array(array)], { type: 'image/png' });
  };

  saveUploadSignature = (file) => {
    const { dispatch, onFinish = () => {} } = this.props;
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((response) => {
      const { data: imageData = [] } = response;
      const { id = '' } = imageData[0];
      onFinish(id);
      this.clearState();
    });
  };

  saveDrawSignature = async (imageBase64) => {
    const { dispatch, onFinish = () => {} } = this.props;
    const formData = new FormData();
    const file = this.dataURItoBlob(imageBase64);
    formData.append('blob', file, 'signatureCandidate.png');
    const response = await dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    });
    const { data: imageData = [] } = response;
    const { id = '' } = imageData[0];
    onFinish(id);
    this.clearState();
  };

  saveDigitalSignature = async (arrImgBase64, finalDigitalSignature) => {
    const { dispatch, onFinish = () => {} } = this.props;
    const formData = new FormData();
    if (!arrImgBase64[finalDigitalSignature]) {
      return;
    }
    const file = this.dataURItoBlob(arrImgBase64[finalDigitalSignature]);
    formData.append('blob', file, 'signatureCandidate.jpeg');
    const response = await dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    });
    const { data: imageData = [] } = response;
    const { id = '' } = imageData[0];
    onFinish(id);
    this.clearState();
  };

  onFinish = async () => {
    const { mode, uploadedFile } = this.state;
    if (mode === 'upload') {
      this.saveUploadSignature(uploadedFile);
    }
    if (mode === 'draw') {
      const value = this.sigPad.getTrimmedCanvas().toDataURL('image/png');
      this.saveDrawSignature(value);
    }
    if (mode === 'digital-signature') {
      const { arrImgBase64, finalDigitalSignature } = this.state;
      this.saveDigitalSignature(arrImgBase64, finalDigitalSignature);
    }
  };

  render() {
    const { loadingUploadAttachment, loading, visible = false } = this.props;
    const { uploadedPreview, mode, digitalSignatureName, finalDigitalSignature } = this.state;

    return (
      <>
        <Modal
          className={styles.AcceptOfferModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              // disabled={!fileName}
              loading={loadingUploadAttachment || loading}
            >
              Upload
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          <Form
            name="basic"
            // ref={this.formRef}
            id="myForm"
            onFinish={this.onFinish}
            initialValues={
              {
                // from: currentEmpId,
              }
            }
          >
            <Form.Item
              label={
                <span>
                  Choose your options for Signature
                  <img style={{ marginLeft: '10px' }} src={InfoIcon} alt="info" />
                </span>
              }
              name="mode"
              labelCol={{ span: 24 }}
            >
              <Select
                showSearch
                value={mode}
                defaultValue={mode}
                onChange={(val) => this.setState({ mode: val })}
                placeholder="Choose your options for Signature"
              >
                <Option value="upload">Upload</Option>
                <Option value="draw">Draw</Option>
                <Option value="digital-signature">Digital Signature</Option>
              </Select>
            </Form.Item>

            {mode === 'upload' && (
              <div className={styles.fileUploadForm}>
                <Dragger
                  beforeUpload={this.beforeUpload}
                  showUploadList={false}
                  // disabled={selectExistDocument || fileName}
                  action={(file) => this.handleUpload(file)}
                >
                  {uploadedPreview ? (
                    <div className={styles.fileUploadedContainer}>
                      <img src={uploadedPreview} alt="preview" />
                    </div>
                  ) : (
                    <div className={styles.drapperBlock}>
                      <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
                      <span className={styles.chooseFileText}>Choose file</span>
                      <span className={styles.uploadText}>or drop file here</span>
                    </div>
                  )}
                </Dragger>
              </div>
            )}
            {mode === 'draw' && (
              <div className={styles.signaturePad}>
                <SignaturePad
                  canvasProps={{ className: styles.sigPad }}
                  ref={(ref) => {
                    this.sigPad = ref;
                  }}
                />
              </div>
            )}

            {mode === 'digital-signature' && (
              <div className={styles.digitalSignatureZone}>
                <Form.Item
                  rules={[{ required: true, message: 'Please enter name' }]}
                  label={
                    <span>
                      Digital Signature
                      <img style={{ marginLeft: '10px' }} src={InfoIcon} alt="info" />
                    </span>
                  }
                  name="name"
                  labelCol={{ span: 24 }}
                >
                  <Input
                    placeholder="Enter your name"
                    value={digitalSignatureName}
                    autoComplete="off"
                    defaultValue={digitalSignatureName}
                    onChange={(e) => this.onChangeNameDigital(e.target?.value)}
                  />
                </Form.Item>
                {digitalSignatureName && (
                  <Row className={styles.signatures}>
                    <Radio.Group
                      onChange={(e) => {
                        this.setState({
                          finalDigitalSignature: e.target?.value,
                        });
                      }}
                      value={finalDigitalSignature}
                    >
                      <Space direction="vertical">
                        {['Airin', 'GermanyScript', 'SH Imogen Agnes', 'AudreyAndReynold'].map(
                          (item, index) => (
                            // <Col span={12}>
                            <Radio value={index} style={{ display: 'flex', alignItems: 'center' }}>
                              <TextSignature
                                name={digitalSignatureName}
                                getImage={this.getImg}
                                x={10}
                                y={75}
                                width={100}
                                height={100}
                                font={item === 'Airin' ? `48px ${item}` : `60px ${item}`}
                              />
                            </Radio>
                            // </Col>
                          ),
                        )}
                      </Space>
                    </Radio.Group>
                  </Row>
                )}
              </div>
            )}
          </Form>
        </Modal>
      </>
    );
  }
}

export default AcceptOfferModal;

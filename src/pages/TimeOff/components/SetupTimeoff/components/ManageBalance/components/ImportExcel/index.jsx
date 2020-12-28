import React from 'react';
import { Button, DatePicker, Row, Col, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Icon from '@/assets/importExcel.svg';

import { connect } from 'umi';
// import * as XLSX from 'xlsx';
import styles from './index.less';

const { Dragger } = Upload;

const propsUpload = {
  name: 'file',
  multiple: false,
  showUploadList: false,
};

@connect(({ loading, timeOff: { urlExcel = '' } = {} }) => ({
  urlExcel,
  loading: loading.effects['timeOff/uploadBalances'],
}))
class ImportExcel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      effectiveDate: '',
    };
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file) => {
    const isJpgOrPng =
      // file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      file.type === '';

    if (!isJpgOrPng) {
      message.error('You can only upload Excel file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  onChange = (date) => {
    this.setState({
      effectiveDate: date,
    });
  };

  handleSubmit = (tab) => {
    const { dispatch, urlExcel } = this.props;
    const { effectiveDate } = this.state;
    const data = {
      attachment: urlExcel,
      type: tab === 1 ? 'SWITCH' : 'IMPORT_DATA',
      effectiveDate,
    };
    dispatch({
      type: 'timeOff/uploadBalances',
      payload: data,
    });
  };

  handleUpload = (file) => {
    console.log(file);
    const { dispatch, getResponse = () => {} } = this.props;
    const formData = new FormData();
    const newFile = new File([file], 'ExcelFile.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    formData.append('uri', newFile);
    dispatch({
      // type: 'upload/uploadFile',
      type: 'timeOff/uploadFileExcel',
      payload: formData,
    }).then((resp) => {
      getResponse(resp);
    });
  };

  render() {
    const { effectiveDate } = this.state;
    const { urlExcel, tab, loading } = this.props;
    const check = !effectiveDate || !urlExcel;
    // console.log(!effectiveDate, 'effectiveDate');
    // console.log(!urlExcel, 'urlExcel');
    // console.log(check, 'check');
    console.log(tab, 'check');

    return (
      <div className={styles.root}>
        <div className={styles.form}>
          <div className={styles.import}>
            <Dragger
              {...propsUpload}
              beforeUpload={this.beforeUpload}
              action={(file) => this.handleUpload(file)}
            >
              <img src={Icon} alt="" />
              <span>
                <span className={styles.choosefile}>Choose file</span>
                <span className={styles.choosefileText}> Or drop file here</span>
              </span>
            </Dragger>
          </div>
          <Row gutter={[50, 0]}>
            <Col span={10}>As per any assigned new policies, their accrual will begin on:</Col>
            <Col span={7}>
              <DatePicker
                className={styles.datePicker}
                placeholder="Balances effective date"
                onChange={this.onChange}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.straightLine} />
        <div className={styles.save}>
          <Button
            disabled={check}
            loading={loading}
            className={styles.btnSave}
            onClick={() => {
              this.handleSubmit(tab);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
}

export default ImportExcel;

import React from 'react';
import { Button, DatePicker, Row, Col, Upload, message } from 'antd';
import moment from 'moment';
import Icon from '@/assets/importExcel.svg';

import { connect } from 'umi';
// import * as XLSX from 'xlsx';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

const { Dragger } = Upload;

const propsUpload = {
  name: 'file',
  multiple: false,
  showUploadList: false,
};

@connect(
  ({
    user: { currentUser: { location: { _id: idLocation = '' } = {} } = {} } = {},
    loading,
    timeOff: { urlExcel = '' } = {},
  }) => ({
    urlExcel,
    loading: loading.effects['timeOff/uploadBalances'],
    idLocation,
  }),
)
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
    const { dispatch, urlExcel, idLocation } = this.props;
    const { effectiveDate } = this.state;
    const data = {
      attachment: urlExcel,
      type: tab === 1 ? 'SWITCH' : 'IMPORT_DATA',
      effectiveDate,
      location: idLocation,
      tenantId: getCurrentTenant(),
    };
    dispatch({
      type: 'timeOff/uploadBalances',
      payload: data,
    });
  };

  disabledDate = (current) => {
    return current && current < moment().subtract(1, 'day').endOf('day');
  };

  handleUpload = (file) => {
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

    return (
      <div className={styles.root}>
        <div className={styles.form}>
          <div className={styles.import}>
            <Dragger
              // eslint-disable-next-line react/jsx-props-no-spreading
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
          <Row gutter={[24, 12]}>
            <Col span={6}>
              <div className={styles.textBottom}>
                As per any assigned new policies, their accrual will begin on:
              </div>
            </Col>
            <Col span={8}>
              <DatePicker
                className={styles.datePicker}
                placeholder="Balances effective date"
                onChange={this.onChange}
                disabledDate={this.disabledDate}
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

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Button, Upload, message, notification } from 'antd';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import csvtojson from 'csvtojson';
import s from './index.less';

const { Dragger } = Upload;

@connect(({ user: { currentUser = {} } = {}, loading }) => ({
  currentUser,
  loading: loading.effects['employeesManagement/importEmployees'],
}))
class UploadListEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      name: '',
    };
  }

  beforeUpload = (file) => {
    const isCSV = file.type === 'text/csv';
    if (!isCSV) {
      message.error('You can only upload CSV file!');
    }
    return isCSV;
  };

  onChange = ({ file }) => {
    const { status, name, originFileObj } = file;
    if (status === 'done') {
      this.readFileCSV(originFileObj, name);
    } else if (status === 'error') {
      message.error(`${name} upload failed.`);
    }
  };

  readFileCSV = (acceptedFiles, name) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileAsBinaryString = reader.result;
      csvtojson({
        noheader: true,
        output: 'json',
      })
        .fromString(fileAsBinaryString)
        .then((csvRows) => {
          const toJson = [];
          csvRows.map((aCsvRow, i) => {
            const isEmpty = Object.values(aCsvRow).every((x) => x === null || x === '');
            if (!isEmpty) {
              if (i !== 0) {
                const builtObject = {};
                Object.keys(aCsvRow).map((aKey) => {
                  const valueToAddInBuiltObject = aCsvRow[aKey];
                  const keyToAddInBuiltObject = csvRows[0][aKey];
                  builtObject[keyToAddInBuiltObject] = valueToAddInBuiltObject;
                  return null;
                });
                toJson.push(builtObject);
              }
            }
            return null;
          });
          this.setState({
            name,
          });
          this.handleDataUpload(toJson);
        });
    };
    reader.onabort = () => notification.error({ message: 'File reading was aborted !' });
    reader.onerror = () => notification.error({ message: 'File reading has failed !' });
    reader.readAsBinaryString(acceptedFiles);
  };

  handleDataUpload = (data) => {
    const employees = data.map((item) => {
      return {
        employeeId: item['Employee Id'],
        firstName: `${item['First Name']} ${item['Last Name']}`,
        joinDate: item['Joined Date'] && moment(new Date(item['Joined Date'])).format('YYYY-MM-DD'),
        workEmail: item['Work Email'],
        location: item.Location,
        department: item.Department,
        personalEmail: item['Personal Email'],
        managerWorkEmail: item['Manager Work Email'],
        title: item['Job Title'],
        personalNumber: item['Personal Number'],
      };
    });
    this.setState({
      employees,
    });
  };

  handleRemoveFile = (e) => {
    e.stopPropagation();
    this.setState({
      name: '',
      employees: [],
    });
  };

  handleFinish = () => {
    const { dispatch, currentUser: { company: { _id: id = '' } = {} } = {} } = this.props;
    const { employees = [] } = this.state;
    const payload = { company: id, employees };
    dispatch({
      type: 'employeesManagement/importEmployees',
      payload,
      isAccountSetup: true,
    });
  };

  render() {
    const { employees = [], name } = this.state;
    const { loading } = this.props;
    const propsUpload = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };
    return (
      <div className={s.root}>
        <div className={s.viewUpload}>
          <Dragger {...propsUpload} onChange={this.onChange} beforeUpload={this.beforeUpload}>
            <div className={s.content}>
              <div className={s.viewIconDownload}>
                <div className={s.viewIconDownload__circle}>
                  <CloudUploadOutlined className={s.viewIconDownload__circle__icon} />
                </div>
              </div>
              <p className={s.title}>Drag and drop</p>
              <p className={s.text}>
                or <span className={s.browse}>browse</span> to upload a file
              </p>
              {name && (
                <div className={s.viewName}>
                  <p className={s.viewName__text}>{name}</p>
                  <div className={s.viewName__btnRemove} onClick={(e) => this.handleRemoveFile(e)}>
                    <DeleteOutlined className={s.viewName__btnRemove__icon} />
                  </div>
                </div>
              )}
            </div>
          </Dragger>
        </div>
        <Button
          className={s.btnFinish}
          onClick={this.handleFinish}
          disabled={employees.length === 0}
          loading={loading}
        >
          Finish Setup
        </Button>
      </div>
    );
  }
}

export default UploadListEmployee;

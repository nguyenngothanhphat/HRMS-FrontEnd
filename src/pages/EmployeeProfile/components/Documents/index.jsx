import React, { Component } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Button } from 'antd';
import InfoCollapseType2 from '../../../../components/InfoCollapseType2';
import ViewDocument from './ViewDocument';
import styles from './index.less';

@connect(({ employeeProfile }) => ({
  employeeProfile,
}))
class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isViewingDocument: false,
      files: [],
      typeOfSelectedFile: '',
      selectedFile: 0,
    };
  }

  componentDidMount = () => {
    const {
      employeeProfile: { idCurrentEmployee = '' },
      dispatch,
    } = this.props;
    console.log('employee', idCurrentEmployee);
    dispatch({
      type: 'employeeProfile/fetchDocuments',
      payload: { employee: idCurrentEmployee },
    });
  };

  onBackClick = () => {
    this.setState({
      isViewingDocument: false,
    });
  };

  getFiles = (item) => {
    // console.log(item)
    if (item.attachment) {
      const { createdAt: date, url: source } = item.attachment;
      return {
        id: item._id,
        fileName: item.key,
        generatedBy: 'Terralogic',
        date: moment(date).locale('en').format('MMMM Do, YYYY'),
        source,
      };
    }
    return {
      id: '',
      fileName: '',
      generatedBy: '',
      date: '',
      source: '',
    };
  };

  generateArrayDocument = (filesList) => {
    // PARENT EMPLOYEE GROUP
    const list1 = filesList.filter((value) => {
      return value.parentEmployeeGroup !== undefined;
    });
    const parentList = [...new Set(list1.map((value) => value.parentEmployeeGroup))];

    // EMPLOYEE GROUP
    const list2 = filesList.filter((value) => {
      return value.employeeGroup !== undefined;
    });

    const typeList = list2.filter(
      (v, i, a) =>
        a.findIndex(
          (t) =>
            t.parentEmployeeGroup === v.parentEmployeeGroup && t.employeeGroup === v.employeeGroup,
        ) === i,
    );

    const data = [];
    parentList.forEach((parent) => {
      const body = [];
      typeList.forEach((value) => {
        if (value.parentEmployeeGroup === parent) {
          const files = [];
          filesList.forEach((file) => {
            if (
              file.parentEmployeeGroup === value.parentEmployeeGroup &&
              file.employeeGroup === value.employeeGroup
            ) {
              files.push(this.getFiles(file));
            }
          });
          const bodyElement = {
            kind: value.employeeGroup,
            files,
          };
          body.push(bodyElement);
        }
      });
      const dataElement = {
        title: parent,
        type: 2, // uploaded by
        body,
      };
      data.push(dataElement);
    });

    return data.reverse();
  };

  onFileClick = (id) => {
    const {
      employeeProfile: { saveDocuments = [] },
    } = this.props;
    const data = this.generateArrayDocument(saveDocuments);

    data.forEach((x) => {
      x.body.forEach((y) => {
        let count = 0;
        y.files.forEach((z) => {
          count += 1;
          if (z.id === id) {
            this.setState({
              isViewingDocument: true,
              files: y.files,
              selectedFile: count,
              typeOfSelectedFile: y.kind,
            });
          }
        });
      });
    });
  };

  render() {
    const { isViewingDocument, files, selectedFile, typeOfSelectedFile } = this.state;

    const {
      employeeProfile: { saveDocuments = [] },
    } = this.props;
    const data = this.generateArrayDocument(saveDocuments);

    const emptyData = {
      title: 'There is no any documents',
      type: 2,
      body: [],
    };
    return (
      <div className={styles.Documents}>
        {data.length === 0 ? (
          <div className={styles.noDocumentContainer}>
            <InfoCollapseType2 onFileClick={this.onFileClick} data={emptyData} />
            <div className={styles.buttonContainer}>
              <Button className={styles.uploadNewBtn} type="primary">
                Upload new
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {isViewingDocument ? (
              <ViewDocument
                files={files}
                selectedFile={selectedFile}
                typeOfSelectedFile={typeOfSelectedFile}
                onBackClick={this.onBackClick}
              />
            ) : (
              data.map((value, index) => (
                <InfoCollapseType2
                  key={`${index + 1}`}
                  onFileClick={this.onFileClick}
                  data={value}
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Documents;

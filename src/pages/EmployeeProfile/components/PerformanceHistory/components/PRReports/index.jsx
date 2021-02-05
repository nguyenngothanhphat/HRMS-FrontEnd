import React, { PureComponent } from 'react';
import InfoCollapseType2 from '@/components/InfoCollapseType2';
import { connect } from 'umi';
import moment from 'moment';
import ViewDocument from '../../../Documents/ViewDocument';
import styles from './index.less';

@connect(({ employeeProfile }) => ({ employeeProfile }))
class PRReports extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isViewingDocument: false,
      selectedFile: 0,
    };
  }

  getFiles = (item) => {
    // console.log(item)
    if (item.attachment) {
      const { createdAt: date, url: source } = item.attachment;
      return {
        id: item._id,
        fileName: item.key,
        generatedBy: 'Terralogic',
        date: moment(date).locale('en').format('MM.DD.YY'),
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

  onBackClick = () => {
    this.setState({
      isViewingDocument: false,
    });
  };

  onFileClick = (id) => {
    const {
      employeeProfile: { listPRReport = [] },
      dispatch,
    } = this.props;

    const data = this.generateArrayDocument(listPRReport);
    data.forEach((x) => {
      x.body.forEach((y) => {
        let count = 0;
        y.files.forEach((z) => {
          count += 1;
          if (z.id === id) {
            this.setState({
              isViewingDocument: true,
              selectedFile: count,
            });
            dispatch({
              type: 'employeeProfile/saveGroupViewingDocuments',
              payload: { files: y.files },
            });
          }
        });
      });
    });
  };

  render() {
    const { isViewingDocument, selectedFile } = this.state;
    const {
      employeeProfile: { listPRReport = [] },
    } = this.props;

    const data = this.generateArrayDocument(listPRReport);
    return (
      <div className={styles.prReports}>
        {isViewingDocument ? (
          <div className={styles.prReports_viewDocument}>
            <ViewDocument selectedFile={selectedFile} onBackClick={this.onBackClick} />
          </div>
        ) : (
          data.map((value, index) => (
            <InfoCollapseType2 key={`${index + 1}`} onFileClick={this.onFileClick} data={value} />
          ))
        )}
      </div>
    );
  }
}

export default PRReports;

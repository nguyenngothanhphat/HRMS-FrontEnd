import React, { Component } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Button, Spin } from 'antd';
import ViewDocument from './ViewDocument';
import InfoCollapseType2 from '../../../../components/InfoCollapseType2';
import styles from './index.less';

@connect(({ employeeProfile, loading, user: { currentUser: { roles = [] } = {} } = {} }) => ({
  loading: loading.effects['employeeProfile/fetchDocuments'],
  loading2: loading.effects['employeeProfile/shareDocumentEffect'],
  employeeProfile,
  roles,
}))
class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isViewingDocument: false,
      selectedFile: 0,
      isHR: false,
    };
  }

  componentDidMount = () => {
    const {
      roles = [],
      employeeProfile: { idCurrentEmployee = '', tenantCurrentEmployee = '' },
      dispatch,
    } = this.props;
    const findHRGlobal =
      roles.find((role) => {
        const { _id = '' } = role;
        return ['HR-GLOBAL'].includes(_id);
      }) || {};

    if (Object.keys(findHRGlobal).length > 0) {
      this.setState({
        isHR: true,
      });
    }
    dispatch({
      type: 'employeeProfile/fetchDocuments',
      payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
    });
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeProfile/clearSaveDocuments',
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

  onFileClick = (id) => {
    const {
      employeeProfile: { saveDocuments = [] },
      dispatch,
    } = this.props;

    const data = this.generateArrayDocument(saveDocuments);

    data.forEach((x) => {
      x.body.forEach((y) => {
        let count = 0;
        y.files.forEach((z) => {
          if (z.id !== '') count += 1;
          if (z.id === id) {
            const groupViewingFiles = y.files.filter((value) => value.id !== '');
            this.setState({
              isViewingDocument: true,
              selectedFile: count,
            });
            dispatch({
              type: 'employeeProfile/saveGroupViewingDocuments',
              payload: { files: groupViewingFiles },
            });
          }
        });
      });
    });
  };

  render() {
    const { isViewingDocument, selectedFile, isHR } = this.state;

    const {
      employeeProfile: { saveDocuments = [], groupViewingDocuments = [] },
      loading,
      loading2,
    } = this.props;

    const data = this.generateArrayDocument(saveDocuments);

    const emptyData = {
      title: 'There is no any documents',
      type: 2,
      body: [],
    };

    return (
      <div className={styles.Documents}>
        {loading ? (
          <div className={styles.loadingDocuments}>
            {/* <p>Loading documents</p> */}
            <Spin size="large" />
          </div>
        ) : (
          <div>
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
                {isViewingDocument && groupViewingDocuments.length !== 0 ? (
                  <ViewDocument
                    selectedFile={selectedFile}
                    onBackClick={this.onBackClick}
                    loading2={loading2}
                  />
                ) : (
                  data.map((value, index) => (
                    <InfoCollapseType2
                      key={`${index + 1}`}
                      onFileClick={this.onFileClick}
                      data={value}
                      isHR={isHR}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Documents;

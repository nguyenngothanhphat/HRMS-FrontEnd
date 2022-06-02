import React, { Component } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Skeleton } from 'antd';
import ViewDocument from './ViewDocument';
import InfoCollapseType2 from '../../../../components/InfoCollapseType2';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';

@connect(
  ({
    employeeProfile: {
      documentCategories = [],
      employee = '',

      listDocuments = [],
      groupViewingDocuments = [],
    } = {},
    loading,
    user: { currentUser: { roles = [] } = {} } = {},
  }) => ({
    loading: loading.effects['employeeProfile/fetchDocuments'],
    loading2: loading.effects['employeeProfile/shareDocumentEffect'],
    documentCategories,
    employee,

    listDocuments,
    groupViewingDocuments,
    roles,
  }),
)
class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isViewingDocument: false,
      selectedFileId: 0,
      isHR: false,
      documentStructure: [],
    };
  }

  fetchDocumentCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/fetchDocumentCategories',
      payload: {
        page: 'Document Employee',
      },
    }).then((resp) => {
      if (resp?.statusCode === 200) {
        this.generateStructure(resp.data);
      }
    });
  };

  fetchDocumentList = () => {
    const { dispatch, employee = '' } = this.props;
    dispatch({
      type: 'employeeProfile/fetchDocuments',
      payload: { employee },
    });
  };

  componentDidMount = () => {
    this.fetchDocumentCategories();
    this.fetchDocumentList();

    const { roles = [] } = this.props;
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
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeProfile/clearListDocuments',
    });
  };

  onBackClick = () => {
    this.setState(
      {
        isViewingDocument: false,
      },
      () => {
        this.fetchDocumentList();
      },
    );
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

  generateArrayDocument = (documentList) => {
    const { documentStructure } = this.state;

    const finalDocuments = JSON.parse(JSON.stringify(documentStructure));
    documentList.forEach((document) => {
      const { category: { _id: categoryId = '', categoryParent = '' } = {} } = document;
      finalDocuments.forEach((parent) => {
        const { children = {} } = parent;
        if (parent._id === categoryParent) {
          children.forEach((child) => {
            if (child._id === categoryId) {
              // eslint-disable-next-line no-param-reassign
              child.files = [...(child.files || []), document];
            }
          });
        }
      });
    });

    // finalDocuments: array of
    // _id, name, and array of {_id, name, files: []}

    // const bodyElement = {
    //   kind: value.employeeGroup,
    //   files,
    // };

    // const dataElement = {
    //   title: parent,
    //   type: 2, // uploaded by
    //   body,
    // };
    // data.push(dataElement);

    return finalDocuments;
  };

  generateStructure = (documentCategories) => {
    // PARENT EMPLOYEE GROUP
    let list1 = [];
    documentCategories.forEach((value) => {
      list1 = [
        ...list1,
        {
          name: value.categoryParent?.name,
          _id: value.categoryParent?._id,
        },
      ];
    });
    // remove duplicate objects
    const parentList = [...new Map(list1.map((item) => [item._id, item])).values()];
    const personalDocumnet = parentList.pop();
    const parentListCopy = parentList.unshift(personalDocumnet);
    const list2 = parentList.map((parent) => {
      let childList = [];
      documentCategories.forEach((child) => {
        if (child?.categoryParent?._id === parent?._id) {
          childList = [
            ...childList,
            {
              name: child?.name,
              _id: child?._id,
            },
          ];
        }
      });
      return {
        ...parent,
        children: childList,
      };
    });

    this.setState({
      documentStructure: list2,
    });
  };

  onFileClick = (id) => {
    const { listDocuments = [], dispatch } = this.props;
    const data = this.generateArrayDocument(listDocuments);

    data.forEach((x) => {
      const { children = [] } = x;
      children.forEach((y) => {
        const { files = [] } = y;
        let count = 0;
        files.forEach((z) => {
          if (z._id) count += 1;
          if (z._id === id) {
            const groupViewingFiles = y.files.filter((value) => value._id);
            this.setState({
              isViewingDocument: true,
              selectedFileId: count,
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
    const { isViewingDocument, selectedFileId, isHR } = this.state;
    const { listDocuments = [], groupViewingDocuments = [], loading, loading2 } = this.props;

    const finalDocuments = this.generateArrayDocument(listDocuments);
    // const data = [];

    const emptyData = {
      title: 'There is no any documents',
      type: 2,
      body: [],
    };

    return (
      <div className={styles.Documents}>
        <div style={{ marginBottom: 24 }}>
          <WorkInProgress />
        </div>
        {loading ? (
          <div className={styles.loadingDocuments}>
            <Skeleton />
          </div>
        ) : (
          <div>
            {finalDocuments.length === 0 ? (
              <div className={styles.noDocumentContainer}>
                <InfoCollapseType2 onFileClick={this.onFileClick} data={emptyData} />
              </div>
            ) : (
              <div>
                {isViewingDocument && groupViewingDocuments.length !== 0 ? (
                  <ViewDocument
                    selectedFileId={selectedFileId}
                    onBackClick={this.onBackClick}
                    loading2={loading2}
                  />
                ) : (
                  finalDocuments.map((eachCategory, index) => (
                    <InfoCollapseType2
                      key={`${index + 1}`}
                      onFileClick={this.onFileClick}
                      category={eachCategory}
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

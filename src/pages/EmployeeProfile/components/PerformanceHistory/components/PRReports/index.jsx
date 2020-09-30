import React, { PureComponent } from 'react';
import InfoCollapseType2 from '@/components/InfoCollapseType2';
import { connect } from 'umi';
import moment from 'moment';
import ViewDocument from '../../../Documents/ViewDocument';
import styles from './index.less';

@connect(
  ({
    upload: { employeeInformationURL = '' } = {},
    employeeProfile: {
      editGeneral: { openEmployeeInfor = false },
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    openEmployeeInfor,
    generalDataOrigin,
    generalData,
    employeeInformationURL,
  }),
)
@connect(({ employeeProfile }) => ({ employeeProfile }))
class PRReports extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isViewingDocument: false,
      files: [],
      typeOfSelectedFile: '',
      selectedFile: 0,
    };
  }

  onBackClick = () => {
    this.setState({
      isViewingDocument: false,
    });
  };

  onFileClick = (value) => {
    const {
      employeeProfile: { listPRReport = [] },
    } = this.props;

    const arrayAttachment = listPRReport.map((item) => {
      if (item.attachment) {
        const { id, name: fileName, createdAt: date, url: source } = item.attachment;
        return {
          id,
          fileName,
          date,
          source,
        };
      }
      return {
        id: 8,
        fileName: 'Agreements',
        generatedBy: 'Terralogic',
        date: 'December 10th, 2018',
        source: '/assets/images/exampleCard.png',
      };
    });
    const dummyData = [
      {
        title: 'PR Reports',
        type: 1, // uploaded by
        body: [
          {
            kind: 'Agreement',
            files: arrayAttachment,
          },
        ],
      },
    ];
    dummyData.some((x) => {
      return x.body.some((y) => {
        let count = 0;
        // eslint-disable-next-line array-callback-return
        return y.files.some((z) => {
          count += 1;
          if (z.id === value) {
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
      employeeProfile: { listPRReport = [] },
    } = this.props;

    const arrayAttachment = listPRReport.map((item) => {
      if (item.attachment) {
        const { id, name: fileName, createdAt: date, url: source } = item.attachment;
        const fileNameAfterSplit = fileName.split('.');
        return {
          id,
          fileName: fileNameAfterSplit[0],
          date: moment(date).locale('en').format('MMMM Do, YYYY'),
          source,
        };
      }
      return {
        id: 8,
        fileName: 'Agreements',
        generatedBy: 'Terralogic',
        date: 'December 10th, 2018',
        source: '/assets/images/exampleCard.png',
      };
    });
    const dummyData = [
      {
        title: 'PR Reports',
        type: 1, // uploaded by
        body: [
          {
            kind: 'Agreement',
            files: arrayAttachment,
          },
        ],
      },
    ];
    return (
      <div className={styles.prReports}>
        {isViewingDocument ? (
          <div className={styles.prReports_viewDocument}>
            <ViewDocument
              files={files}
              selectedFile={selectedFile}
              typeOfSelectedFile={typeOfSelectedFile}
              onBackClick={this.onBackClick}
            />
          </div>
        ) : (
          dummyData.map((value, index) => (
            <InfoCollapseType2 key={`${index + 1}`} onFileClick={this.onFileClick} data={value} />
          ))
        )}
      </div>
    );
  }
}

export default PRReports;

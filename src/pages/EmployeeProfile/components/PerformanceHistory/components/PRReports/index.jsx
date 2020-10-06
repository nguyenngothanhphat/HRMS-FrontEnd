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
      files: [],
      typeOfSelectedFile: '',
      selectedFile: 0,
    };
  }

  generateArrayDocument = (listPRReport) => {
    const arrayAttachment = listPRReport.map((item) => {
      if (item.attachment) {
        const { _id: id, createdAt: date, url: source } = item.attachment;
        return {
          id,
          fileName: item.key,
          generatedBy: 'Terralogic',
          date: moment(date).locale('en').format('MMMM Do, YYYY'),
          source,
        };
      }
      return null;
    });
    return [
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
  };

  onBackClick = () => {
    this.setState({
      isViewingDocument: false,
    });
  };

  onFileClick = (id) => {
    const {
      employeeProfile: { listPRReport = [] },
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

    const data = this.generateArrayDocument(listPRReport);
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
          data.map((value, index) => (
            <InfoCollapseType2 key={`${index + 1}`} onFileClick={this.onFileClick} data={value} />
          ))
        )}
      </div>
    );
  }
}

export default PRReports;

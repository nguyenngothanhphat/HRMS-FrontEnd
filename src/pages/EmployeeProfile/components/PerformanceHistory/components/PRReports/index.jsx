import React, { PureComponent } from 'react';
import InfoCollapseType2 from '@/components/InfoCollapseType2';
import { connect } from 'umi';
import ViewDocument from '../../../Documents/ViewDocument';
import styles from './index.less';

@connect(({ employeeProfile: { listPRReport = [] } }) => ({ listPRReport }))
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
    const dummyData = [
      {
        title: 'PR Reports',
        type: 1, // uploaded by
        body: [
          {
            kind: 'Agreement',
            files: [
              {
                id: 8,
                fileName: 'Agreements',
                generatedBy: 'Terralogic',
                date: 'December 10th, 2018',
                source: '/assets/images/exampleCard.png',
              },
              {
                id: 9,
                fileName: 'Employee Handbook',
                generatedBy: 'Terralogic',
                date: 'December 10th, 2018',
                source: '/assets/files/sample_2.pdf',
              },
            ],
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
    // const { listPRReport } =  this.props;
    const dummyData = [
      {
        title: 'PR Reports',
        type: 1, // uploaded by
        body: [
          {
            kind: 'Agreement',
            files: [
              {
                id: 8,
                fileName: 'Agreements',
                generatedBy: 'Terralogic',
                date: 'December 10th, 2018',
                source: '/assets/images/exampleCard.png',
              },
              {
                id: 9,
                fileName: 'Employee Handbook',
                generatedBy: 'Terralogic',
                date: 'December 10th, 2018',
                source: '/assets/files/sample_2.pdf',
              },
            ],
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
            <InfoCollapseType2 keys={index} onFileClick={this.onFileClick} data={value} />
          ))
        )}
      </div>
    );
  }
}

export default PRReports;

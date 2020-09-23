import React, { PureComponent } from 'react';
import InfoCollapseType2 from '@/components/InfoCollapseType2';
import ViewDocument from '../../../Documents/ViewDocument';
import styles from './index.less';

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
    return (
      <div className={styles.prReports}>
        {isViewingDocument ? (
          <ViewDocument
            files={files}
            selectedFile={selectedFile}
            typeOfSelectedFile={typeOfSelectedFile}
            onBackClick={this.onBackClick}
          />
        ) : (
          dummyData.map((value) => (
            <InfoCollapseType2 onFileClick={this.onFileClick} data={value} />
          ))
        )}
      </div>
    );
  }
}

export default PRReports;

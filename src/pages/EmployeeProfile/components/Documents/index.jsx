import React, { PureComponent } from 'react';
import InfoCollapseType2 from '../../../../components/InfoCollapseType2';
import ViewDocument from './ViewDocument';
import styles from './index.less';

const data = [
  {
    title: 'Hiring Documents',
    type: 1, // generated by
    body: [
      {
        kind: 'Offer Letter',
        files: [
          {
            id: 1,
            fileName: 'Offer Letter',
            generatedBy: 'Terralogic',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_1.pdf',
          },
        ],
      },
      {
        kind: 'Employment Eligibility',
        files: [
          {
            id: 2,
            fileName: 'I-9 Form',
            generatedBy: 'Terralogic',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_2.pdf',
          },
        ],
      },
      {
        kind: 'Tax Documents',
        files: [
          {
            id: 3,
            fileName: 'TDS Declaration',
            generatedBy: 'Terralogic',
            date: 'December 10th, 2018',
            source: '/assets/images/exampleCard.png',
          },
        ],
      },
      {
        kind: 'Consent Forms',
        files: [
          {
            id: 4,
            fileName: 'Consent',
            generatedBy: 'Terralogic',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_2.pdf',
          },
        ],
      },
    ],
  },
  {
    title: 'Indentification Documents',
    type: 2, // uploaded by
    body: [
      {
        kind: 'Identity',
        files: [
          {
            id: 5,
            fileName: 'Adhaar',
            generatedBy: 'Aditya Venkatesh',
            date: 'December 10th, 2018',
            source: '/assets/images/exampleCard.png',
          },
          {
            id: 6,
            fileName: 'Passport',
            generatedBy: 'Aditya Venkatesh',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_2.pdf',
          },
          {
            id: 7,
            fileName: 'Visa',
            generatedBy: 'Aditya Venkatesh',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_1.pdf',
          },
        ],
      },
    ],
  },
  {
    title: 'Handbooks & Agreements',
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
  {
    title: 'PR Reports',
    type: 1, // uploaded by
    body: [
      {
        kind: 'Agreement',
        files: [
          {
            id: 10,
            fileName: 'PR Reports 2020',
            generatedBy: 'Terralogic',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_2.pdf',
          },
          {
            id: 11,
            fileName: 'PR Report 2020',
            generatedBy: 'Terralogic',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_1.pdf',
          },
        ],
      },
    ],
  },
  {
    title: 'Qualifications/Certification',
    type: 2, // uploaded by
    body: [
      {
        kind: 'Certificates',
        files: [
          {
            id: 12,
            fileName: 'HCI Certification',
            generatedBy: 'Aditya Venkatesh',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_2.pdf',
          },
          {
            id: 13,
            fileName: 'Graduation',
            generatedBy: 'Aditya Venkatesh',
            date: 'December 10th, 2018',
            source: '/assets/files/sample_1.pdf',
          },
        ],
      },
    ],
  },
];

class Documents extends PureComponent {
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
    data.some((x) => {
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
      <div className={styles.Documents}>
        {isViewingDocument ? (
          <ViewDocument
            files={files}
            selectedFile={selectedFile}
            typeOfSelectedFile={typeOfSelectedFile}
            onBackClick={this.onBackClick}
          />
        ) : (
          data.map((value) => <InfoCollapseType2 onFileClick={this.onFileClick} data={value} />)
        )}
      </div>
    );
  }
}

export default Documents;

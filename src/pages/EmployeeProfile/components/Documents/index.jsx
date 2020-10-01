import React, { Component } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { each } from 'lodash';
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

  onBackClick = () => {
    this.setState({
      isViewingDocument: false,
    });
  };

  getFiles = (item) => {
    // console.log(item)
    if (item.attachment) {
      const id = item._id;
      const { name: fileName, createdAt: date, url: source } = item.attachment;
      const fileNameSplit = fileName.split('.');
      return {
        id,
        fileName: fileNameSplit[0],
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

  generateArrayDocument = (list) => {
    const offerLetters = [];
    const employmentEligibility = [];
    const taxDocuments = [];
    const consentForms = [];
    const identity = [];
    const agreement = [];
    const employeeHandbook = [];
    const prAgreement = [];
    const certificates = [];

    // eslint-disable-next-line array-callback-return
    list.map((eachFile) => {
      const file = this.getFiles(eachFile);
      if (eachFile.employeeGroup === 'Offer Letter') {
        offerLetters.push(file);
      }
      if (eachFile.employeeGroup === 'Employment Eligibility') {
        employmentEligibility.push(file);
      }
      if (eachFile.employeeGroup === 'Tax Documents') {
        taxDocuments.push(file);
      }
      if (eachFile.employeeGroup === 'Consent Forms') {
        consentForms.push(file);
      }
      if (eachFile.employeeGroup === 'Identity') {
        identity.push(file);
      }
      if (eachFile.employeeGroup === 'Agreement') {
        agreement.push(file);
      }
      if (eachFile.employeeGroup === 'Employee Handbook') {
        employeeHandbook.push(file);
      }
      if (eachFile.employeeGroup === 'PR Agreements') {
        prAgreement.push(file);
      }
      if (eachFile.employeeGroup === 'Certificates') {
        certificates.push(file);
      }
    });

    const data = [
      {
        title: 'Hiring Documents',
        type: 1, // uploaded by
        body: [
          {
            kind: 'Offer Letter',
            files: offerLetters,
          },
          {
            kind: 'Employment Eligibility',
            files: employmentEligibility,
          },
          {
            kind: 'Tax Documents',
            files: taxDocuments,
          },
          {
            kind: 'Consent Forms',
            files: consentForms,
          },
        ],
      },
      {
        title: 'Indentification Documents',
        type: 2,
        body: [
          {
            kind: 'Identity',
            files: identity,
          },
        ],
      },
      {
        title: 'Handbooks & Agreements',
        type: 1,
        body: [
          {
            kind: 'Agreement',
            files: agreement,
          },
          {
            kind: 'Employee Handbook',
            files: employeeHandbook,
          },
        ],
      },
      {
        title: 'PR Reports',
        type: 1,
        body: [
          {
            kind: 'Agreement',
            files: prAgreement,
          },
        ],
      },
      {
        title: 'Qualifications/Certification',
        type: 2,
        body: [
          {
            kind: 'Certificates',
            files: certificates,
          },
        ],
      },
    ];

    return data;
  };

  onFileClick = (id) => {
    const {
      employeeProfile: { saveDocuments = [] },
    } = this.props;
    const data = this.generateArrayDocument(saveDocuments);

    data.some((x) => {
      return x.body.some((y) => {
        let count = 0;
        // eslint-disable-next-line array-callback-return
        return y.files.some((z) => {
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
          data.map((value, index) => (
            <InfoCollapseType2 key={`${index + 1}`} onFileClick={this.onFileClick} data={value} />
          ))
        )}
      </div>
    );
  }
}

export default Documents;

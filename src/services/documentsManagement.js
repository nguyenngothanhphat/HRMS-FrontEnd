const dataActive = [
  {
    documentId: 'DOC 01',
    documentType: 'Test 1',
    documentName: 'Here is the name 1',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '5443',
  },
  {
    documentId: 'DOC 02',
    documentType: 'Test 2',
    documentName: 'Here is the name 2',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '2343',
  },
  {
    documentId: 'DOC 03',
    documentType: 'Test 3',
    documentName: 'Here is the name 3',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '4343',
  },
  {
    documentId: 'DOC 04',
    documentType: 'Test 4',
    documentName: 'Here is the name 4',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '8097',
  },
];

const dataInActive = [
  {
    documentId: 'DOC 05',
    documentType: 'Test 5',
    documentName: 'Here is the name 5',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '5343',
  },
  {
    documentId: 'DOC 06',
    documentType: 'Test 6',
    documentName: 'Here is the name 6',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '5423',
  },
];
export const getListDocumentsActive = async () => {
  return {
    statusCode: 200,
    data: dataActive,
  };
};
export const getListDocumentsInActive = async () => {
  return {
    statusCode: 200,
    data: dataInActive,
  };
};

export const getDocumentDetail = async (params) => {
  let i = 0;
  for (i; i < dataActive.length; i += 1) {
    if (dataActive[i].documentID === params.documentID) {
      return {
        statusCode: 200,
        data: dataActive[i],
      };
    }
  }
  return {
    statusCode: 200,
    data: [],
  };
};

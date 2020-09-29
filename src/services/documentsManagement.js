const dataActive = [
  {
    documentId: 'DOC 01',
    documentType: 'Test',
    documentName: 'Here is the name',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '8097',
  },
  {
    documentId: 'DOC 02',
    documentType: 'Test',
    documentName: 'Here is the name',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '8097',
  },
  {
    documentId: 'DOC 03',
    documentType: 'Test',
    documentName: 'Here is the name',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '8097',
  },
  {
    documentId: 'DOC 04',
    documentType: 'Test',
    documentName: 'Here is the name',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '8097',
  },
];

const dataInActive = [
  {
    documentId: 'DOC 01',
    documentType: 'Test',
    documentName: 'Here is the name',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '8097',
  },
  {
    documentId: 'DOC 02',
    documentType: 'Test',
    documentName: 'Here is the name',
    url: '',
    uploadedBy: 'Terralogic',
    createdDate: '08/29/2020',
    userId: '8097',
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

import { dialog } from '@/utils/utils';
// import {a} from '../services/projectManagement'

const mockData = [
  {
    key: '1',
    projectId: '8097',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '2',
    projectId: '8098',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '3',
    projectId: '8099',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '4',
    projectId: '8100',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
];

const projectManagement = {
  namespace: 'projectManagement',
  state: {
    activeList: mockData,
    inactiveList: mockData,
  },
  effects: {},
  reducers: {
    save(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default projectManagement;

const rookieList = [
  {
    rookieId: '#16003134',
    isNew: true,
    rookieName: 'Matt Wagoner',
    position: 'Sr. UX Designer',
    location: 'Mumbai',
    comments: 'Passport submission pending …',
    dateSent: '29th Sept, 2020',
  },
  {
    rookieId: '#18001829',
    isNew: true,
    rookieName: 'JT Grauke',
    position: 'UI Designer',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
    dateSent: '3rd Oct, 2020',
  },
  {
    rookieId: '#16210862',
    isNew: true,
    rookieName: 'Ryan Jhonson',
    position: 'Sr. UI Designer',
    location: 'Chennai',
    comments: 'Fake eligibility documents',
    dateSent: '30th Nov, 2020',
  },
  {
    rookieId: '#10928389',
    isNew: true,
    rookieName: 'Billy Hoffman',
    position: 'Illustrator',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
    dateSent: '29th Sept, 2020',
  },
  {
    rookieId: '#16013134',
    rookieName: 'Karthik Naren',
    position: 'Jr. UI Designer',
    location: 'Dubai',
    comments: 'Eligibility date expireds',
    dateSent: '12th Jan, 2020',
  },
  {
    rookieId: '#16211862',
    rookieName: 'Ema Drek',
    position: 'Sr. UX Designer',
    location: 'Bangalore',
    comments: 'Eligibility date expired',
    dateSent: '09th Aug, 2020',
  },
  {
    rookieId: '#11928389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
    dateSent: '19th June, 2020',
  },
  {
    rookieId: '#10978389',
    rookieName: 'Siddartha',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#10926389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#10928089',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
  },
  // Clone
  {
    rookieId: '#26003134',

    rookieName: 'Matt Wagoner',
    position: 'Sr. UX Designer',
    location: 'Mumbai',
    comments: 'Passport submission pending …',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#28001829',
    isNew: true,
    rookieName: 'JT Grauke',
    position: 'UI Designer',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#26210862',

    rookieName: 'Ryan Jhonson',
    position: 'Sr. UI Designer',
    location: 'Chennai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#20928389',

    rookieName: 'Billy Hoffman',
    position: 'Illustrator',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#26013134',
    rookieName: 'Karthik Naren',
    position: 'Jr. UI Designer',
    location: 'Dubai',
    comments: 'Eligibility date expireds',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#26211862',
    isNew: true,
    rookieName: 'Ema Drek',
    position: 'Sr. UX Designer',
    location: 'Bangalore',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#21928389',
    isNew: true,
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#20978389',
    rookieName: 'Siddartha',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#20926389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
  },
  {
    rookieId: '#20928089',
    isNew: true,
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
  },
];

const COLUMN_NAME = {
  ID: 'rookieId',
  NAME: 'name',
  POSITION: 'position',
  LOCATION: 'location',
  DATE_SENT: 'date_sent',
  COMMENT: 'comment',
  ACTION: 'action',
};

const TABLE_TYPE = {
  PENDING_ELIGIBILITY_CHECKS: 'PENDING_ELIGIBILITY_CHECKS',
  ELIGIBLE_CANDIDATES: 'ELIGIBLE_CANDIDATE',
  INELIGIBLE_CANDIDATES: 'INELIGIBLE_CANDIDATE',
  PROVISIONAL_OFFERS: 'PROVISIONAL_OFFER', // Provisional offers
  SENT_PROVISIONAL_OFFERS: 'SENT_PROVISIONAL_OFFER', // Provisional offers
  RECEIVED_PROVISIONAL_OFFERS: 'RECEIVED_PROVISIONAL_OFFER', // Provisional offers
  DISCARDED_PROVISIONAL_OFFERS: 'DISCARDED_PROVISIONAL_OFFERS',
  RECEIVED_PROVISIONAL_OFFERS: 'RECEIVED_PROVISIONAL_OFFERS',
  AWAITING_APPROVAL: 'AWAITING_APPROVAL',
  FINAL_OFFERS: 'FINAL_OFFERS',
  FINAL_OFFERS_DRAFTS: 'FINAL_OFFERS_DRAFTS',
  PENDING_APPROVALS: 'PENDING_APPROVALS', // Awaiting approval
  APPROVED_FINAL_OFFERS: 'APPROVED_FINAL_OFFERS', // Awaiting approval
  REJECTED_FINAL_OFFERS: 'REJECTED_FINAL_OFFERS', // Awaiting approval
  SENT_FINAL_OFFERS: 'SENT_FINAL_OFFERS', // Final offers
  ACCEPTED_FINAL_OFFERS: 'ACCEPTED_FINAL_OFFERS', // Final offers
  DISCARDED_FINAL_OFFERS: 'DISCARDED_FINAL_OFFERS',
};

export { rookieList, COLUMN_NAME, TABLE_TYPE };

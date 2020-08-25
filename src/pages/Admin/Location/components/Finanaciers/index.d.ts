import * as React from 'react';
import { RouteProps } from 'react-router';

interface User {
  _id: number;
  fullName: string;
  email: string;
}

interface IFinanciersProps extends RouteProps {
  position: string;
  user: User;
  format: 'vertical' | 'horizontal';
}

export default class Financiers extends React.PureComponent<IFinanciersProps, any> {}

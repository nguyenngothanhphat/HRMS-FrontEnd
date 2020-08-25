import * as React from 'react';
import { RouteProps } from 'react-router';

interface IFCurrencyProps extends RouteProps {
  code?: string;
  currency?: {
    code: string;
    name: string;
    symbol: string;
    nativeIcon: string;
  };
}
export default class Currency extends React.PureComponent<IFCurrencyProps, any> {}

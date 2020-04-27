import React, { ReactNode } from 'react';
import MenuContainer from './MenuContainer';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return (
    <>
      <MenuContainer />
      <div id="appContainer">{children}</div>
    </>
  );
}

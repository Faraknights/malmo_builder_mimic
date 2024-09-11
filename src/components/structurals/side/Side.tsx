import React, { ReactNode } from 'react';

interface SideProps {
	children: ReactNode;
}

const Side: React.FC<SideProps> = ({ children }) => {
	return <div id="side">{children}</div>;
};

export default Side;

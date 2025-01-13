import React, { ReactNode } from 'react';
import {BodyBoxClasses} from "./styles";

type BodyBoxProps = {
	children: ReactNode;
};

const BodyBox: React.FC<BodyBoxProps> = ({ children }) => {
	return (
		<main className={BodyBoxClasses.container}>
			{children}
		</main>
	);
};

export default BodyBox;
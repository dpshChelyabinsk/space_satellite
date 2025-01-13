import React from 'react';
import {SectionBlockClasses} from "./styles";

type SectionBlockProps = {
	children?: React.ReactNode;
	additionalClass?: string;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ children, additionalClass }) => {
	return (
		<section className={`${SectionBlockClasses.container} ${additionalClass || ''}`}>
			{children}
		</section>
	);
};

export default SectionBlock;
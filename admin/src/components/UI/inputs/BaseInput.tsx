import React from 'react';
import classes from './styles/BaseInput.module.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	error?: string;
	additionalClass?: string;
};

const BaseInput: React.FC<InputProps> = ({ label, error, additionalClass, ...props }) => {
	return (
		<div className={`${classes.container} ${additionalClass || ''}`}>
			<input className={`${classes.input} ${error ? classes.errorInput : ''}`} {...props} />
		</div>
	);
};

export default BaseInput;

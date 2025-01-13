import React from 'react';
import classes from './styles/BaseButton.module.css'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: string;
};

const BaseButton: React.FC<ButtonProps> = ({ children, ...props }) => {
	return (
		<button className={classes.container} {...props}>
			{children}
		</button>
	);
};

export default BaseButton;
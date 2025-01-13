import React from 'react';
import LoginForm from "../components/UI/forms/LoginForm";
import BodyBox from "../components/UI/views/BodyBox";
import SectionBlock from "../components/UI/views/SectionBlock";
import {AuthClasses} from "./Styles";

const Auth: React.FC = () => {
	return (
		<>
			<BodyBox>
				<SectionBlock additionalClass={AuthClasses.container}>
					<LoginForm />
				</SectionBlock>
			</BodyBox>
		</>
	);
};

export default Auth;
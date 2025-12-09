import React, { useContext } from 'react'
import "../InternalPages/home.scss";
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserServiceContext } from '../../context/userService.provider';
export default function LandingPage() {
	const { user } = useContext(UserServiceContext)!;

	return (
		<div className="page">
			<div className="title">
				<h1>
					Public Landing Page

					{!user && <Button sx={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }} variant="contained" component={Link} to="/signin">
						Sign In
					</Button>}
				</h1>
			</div>
		</div>

	)
}


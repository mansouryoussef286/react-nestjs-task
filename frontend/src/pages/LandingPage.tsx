import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
	const navigate = useNavigate();

	return (
		<h1>
			Public Landing Page
			<button onClick={() => navigate("/signin")}>Go to Signin</button>
		</h1>
	)
}


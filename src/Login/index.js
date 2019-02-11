import React, { Component } from 'react';

class Login extends Component {
	constructor() {
		super();


		this.state = {
			username: '',
			password: ''
		}
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const loginResponse = await fetch('http://localhost:9000/auth/login', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(this.state),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if(!loginResponse.ok) {
				throw Error(loginResponse.statusText);
			}

			const parsedResponse = await loginResponse.json();
			console.log(parsedResponse, ' this is parsedResponse');
			this.props.login(parsedResponse.data.user);
			console.log(parsedResponse.data.user, ' this parsedResoonsedatauser');
		} catch(err) {
			console.log(err, ' this is err');
		}
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input type='text' name='username' onChange={this.handleChange} placeholder='Enter Username' />
					<input type='password' name='password' onChange={this.handleChange} placeholder='Enter Password' />
					<button>Login</button>
				</form>
			</div>
		)
	}
}

export default Login;
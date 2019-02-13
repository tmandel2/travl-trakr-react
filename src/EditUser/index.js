import React from 'react';


const EditUser = (props) => {

	return (
			<div>
				<div>Edit User</div>
				<form onSubmit={props.handleUserEditSubmit}>
					<input type='text' name='username' onChange={props.handleEditFormInput} value={props.userToEdit.username}/><br/>
					<input type='password' name='password' onChange={props.handleEditFormInput} value={props.userToEdit.password}/><br/>
					<input type='text' name='email' onChange={props.handleEditFormInput} value={props.userToEdit.email}/><br/>
					<button>Edit yourself</button>

				</form>
			</div>
		)
}


export default EditUser;
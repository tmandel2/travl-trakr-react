// Goes to the UserContainer (because Trips are user specific), All the trip specific items then flow through here.
import React, { Component } from 'react';
import NewTrip from '../NewTrip';
import TripPage from '../TripPage';
import TripList from '../TripList';
import EditTrip from '../EditTrip';
import AddNote from '../AddNote';


class TripContainer extends Component {
	constructor() {
		super();
		this.state = {
			trips: [],
			currentTrip: {},
			// Modals to show screens when actions are going to be done to trips.
			newTripScreen: false,
			showTripScreen: false,
			showTripEdit: false,
			showNoteAdd: false,
			tripToEdit: {
				name: '',
				state: '',
				country: '',
				dateArrived: '',
				dateLeft: '',
				notes: [],
				_id: null
			},
			noteToAdd: {
				note: ''
			}
		}
	}
// Populating all the trips a User has.
	componentDidMount () {
		this.getTrips();
	}

	addTrip = async (trip, e) => {
		e.preventDefault();
		// Necessary to make sure trip notes are in an array, not just a loose string.
		trip.notes = [trip.notes];
		try {
			const tripCreateResponse = await fetch(`${process.env.REACT_APP_ROUTE}api/v1/trips/`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(trip),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if(!tripCreateResponse.ok) {
				throw Error(tripCreateResponse.statusText);
			}
			const parsedResponse = await tripCreateResponse.json();
			this.setState({
				trips: parsedResponse.data.user.trips,
				newTripScreen: false
			})

		} catch(err) {
			console.log(err);
		}
	}

	newTrip = () => {
		this.setState({
			newTripScreen: true,
			showTripScreen: false
		})
	}

	hideNewTrip = (e) => {
		this.setState({
			newTripScreen: false
		})
	}

	showTrip = async (trip, e) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_ROUTE}api/v1/trips/${trip._id}`, {
				credentials: 'include'
			});
			if(!response.ok){
				throw Error(response.statusText);
			}
			const tripParsed = await response.json();
			this.setState({
				currentTrip: tripParsed.data,
				showTripScreen: true,
				newTripScreen: false
			})
		} catch(err) {
			console.log(err);
			return err;
		}
	}

	hideTrip = () => {
		this.setState({
			showTripScreen: false
		})
	}

	getTrips = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_ROUTE}api/v1/users/${this.props._id}`, {
				credentials: 'include'
			});
			if(!response.ok){
				throw Error(response.statusText);
			}
			const userParsed = await response.json();
			this.setState({
				trips: userParsed.data.trips
			})
		} catch(err) {
			console.log(err);
			return err;
		}
	}

	showEditTrip = (trip, e) => {
		this.setState({
			showTripEdit: true,
			showTripScreen: false,
			tripToEdit: {
				name: trip.name,
				state: trip.state,
				country: trip.country,
				// The slice is necessary to reformat so it pre-populates in the edit screen. It removes the '#Z' from the end of the date string
				// Slice can only happen if the dates actually exist, so a ternary is needed to avoid errors.
				dateArrived: trip.dateArrived ? trip.dateArrived.slice(0, -2) : '',
				dateLeft: trip.dateLeft ? trip.dateLeft.slice(0, -2) : '',
				notes: trip.notes,
				_id: trip._id
			}
		})
	}
// This accesses the note adding screen.
	addNote = (trip, e) => {
		this.setState({
			showNoteAdd: true,
			tripToEdit: {
				_id: trip._id
			}
		})
	}

	handleTripEditSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`${process.env.REACT_APP_ROUTE}api/v1/trips/${this.state.tripToEdit._id}`, {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify(this.state.tripToEdit),
				headers:{
					'Content-Type': 'application/json'
				}
			});
			if(!response.ok){
				throw Error(response.statusText);
			}
			const parsedResponse = await response.json();
			const mappedTrips = this.state.trips.map((trip) => {
				if(trip._id === this.state.tripToEdit._id) {
					return parsedResponse.data;
				} else {
					return trip;
				}
			});
			this.setState({
				trips: mappedTrips,
				showTripEdit: false,
				showTripScreen: true,
				currentTrip: parsedResponse.data
			});
		} catch(err) {
			console.log(err);
		}
	}

	handleEditFormInput = (e) => {
		this.setState({
			tripToEdit: {
				...this.state.tripToEdit,
				[e.target.name]: e.target.value
			}
		})
	}

	handleNoteChange = (e) => {
		this.setState({
			noteToAdd: {
				note: e.target.value
			}
		})
	}
// Called as a type of "back" button from the edit screen.
	undoEdit = (e) => {
		this.setState({
			showTripScreen: true,
			showTripEdit: false
		})
	}

	handleAddNote = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`${process.env.REACT_APP_ROUTE}api/v1/trips/${this.state.tripToEdit._id}/addNote`, {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify(this.state.noteToAdd),
				headers:{
					'Content-Type': 'application/json'
				}
			});
			if(!response.ok){
				throw Error(response.statusText);
			}
			const parsedResponse = await response.json();
			const mappedTrips = this.state.trips.map((trip) => {
				if(trip._id === this.state.tripToEdit._id) {
					return parsedResponse.data;
				} else {
					return trip;
				}
			});
			this.setState({
				trips: mappedTrips,
				showNoteAdd: false,
				currentTrip: parsedResponse.data
			});
		} catch(err) {
			console.log(err);
		}
	}

	deleteTrip = async (e) => {
		e.preventDefault();
		try {
			await fetch(`${process.env.REACT_APP_ROUTE}api/v1/trips/${this.state.currentTrip._id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			this.setState({
				trips: this.state.trips.filter(trip => trip._id !== this.state.currentTrip._id),
				showTripScreen: false

			})
		} catch(err) {
			console.log(err);
		}
	}

	deleteNote = async (i, e) => {
		e.preventDefault();
		const currentNotes = this.state.currentTrip.notes;
		currentNotes.splice(i, 1);
		try {
			const response = await fetch(`${process.env.REACT_APP_ROUTE}api/v1/trips/${this.state.currentTrip._id}/deleteNote`, {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify(currentNotes),
				headers:{
					'Content-Type': 'application/json'
				}
			});
			if(!response.ok){
				throw Error(response.statusText);
			}
			const parsedResponse = await response.json();
			const mappedTrips = this.state.trips.map((trip) => {
				if(trip._id === this.state.currentTrip._id) {
					return parsedResponse.data;
				} else {
					return trip;
				}
			});
			this.setState({
				trips: mappedTrips,
				currentTrip: parsedResponse.data
			});
		} catch(err) {
			console.log(err);
		}
	}
// There are a lot of ternaries just to determine what action the user is taking.
// If they are adding a trip, they shouldn't also be editing a trip and showing a different trip.
	render() {
		return(
			<div id="trip-container">
				{this.state.newTripScreen ? 
					<NewTrip history={this.props.history} addTrip={this.addTrip} hideNewTrip={this.hideNewTrip}/> : 
						<div>
							{this.state.showTripEdit ?
								null :
								<button id='new-trip-button' onClick={this.newTrip}>Make a NewTrip</button>
							}
						</div>
				}
				{this.state.showNoteAdd ? 
					<AddNote handleAddNote={this.handleAddNote} handleNoteChange={this.handleNoteChange}/> : 
					null
				}
				{this.state.showTripScreen ? 
					<div id='trip-nav'>
						<button onClick={this.hideTrip}>Back to List</button>
						<button onClick={this.addNote.bind(null, this.state.currentTrip)}>Add Note</button>
						<button onClick={this.showEditTrip.bind(null, this.state.currentTrip)}>Edit This Trip</button>
						<button onClick={this.deleteTrip}>Delete This Trip</button>
					</div> :
					null
				}
				{this.state.showTripEdit ? 
					<EditTrip undoEdit={this.undoEdit} handleEditFormInput={this.handleEditFormInput} tripToEdit={this.state.tripToEdit} handleTripEditSubmit={this.handleTripEditSubmit}/> : 
					<div>
						{this.state.showTripScreen ? 
							<TripPage currentTrip={this.state.currentTrip} hideTrip={this.hideTrip} deleteTrip={this.deleteTrip} showEditTrip={this.showEditTrip} addNote={this.addNote} deleteNote={this.deleteNote}/> : 
							<TripList trips={this.state.trips} showTrip={this.showTrip} />
						}
					</div>
				}
			</div>

		)
	}
}



export default TripContainer;
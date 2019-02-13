import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';


const style = {
	width: '100%',
	height: '100%'
}


export class MapContainer extends Component {

	render() {
		const yelpsList = this.props.yelps.map((yelp, i) => {
			return <Marker 
						key= {i}
						position={{
							lng: yelp.coordinates.longitude,
							lat: yelp.coordinates.latitude
						}}
						icon={{
							url: `mapicons/number_${i + 1}.png`
						}}
					/>
		});
		return (
			<div id="map">
				<Map
					google={this.props.google}
					style={style}
					zoom={10}
					initialCenter={{
						lat: this.props.lat,
						lng: this.props.lng
					}}
					>

					{yelpsList}
				</Map>
			</div>
		)
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyDVsJgiL0yPXQQJWNQztdG2YJYzROdZ8Mg'
})(MapContainer);
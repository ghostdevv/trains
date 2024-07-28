export interface LiveTimes {
	location: Location;
	filter: null;
	services: Service[] | null;
}

export interface Location {
	name: string;
	crs: string;
	tiploc: string[];
	country: string;
	system: string;
}

export interface Service {
	locationDetail: LocationDetail;
	serviceUid: string;
	runDate: string;
	trainIdentity: string;
	runningIdentity: string;
	atocCode: string;
	atocName: string;
	serviceType: string;
	isPassenger: boolean;
}

export interface LocationDetail {
	tiploc: string;
	gbttBookedDeparture: string;
	origin: Origin[];
	destination: Destination[];
	isCall: boolean;
	isPublicCall: boolean;
	platform: string;
	displayAs: string;
}

export interface Origin {
	tiploc: string;
	description: string;
	workingTime: string;
	publicTime: string;
}

export interface Destination {
	tiploc: string;
	description: string;
	workingTime: string;
	publicTime: string;
}

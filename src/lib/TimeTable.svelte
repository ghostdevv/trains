<script lang="ts">
	import type { Service } from '$lib/types/liveTimes.d';

	export let stationName: string;
	export let services: Service[];

	function getRTTLink(uid: string, runDate: string) {
		return `https://www.realtimetrains.co.uk/service/gb-nr:${uid}/${runDate}/detailed`;
	}

	async function fetchClass() {}
</script>

<h1>{stationName}</h1>
<p>{services.length} services</p>

<section>
	<table>
		<tr>
			<th>Depature Time</th>
			<th>From</th>
			<th>To</th>
			<th>TOC</th>
			<th>UID</th>
			<th>Class</th>
			<th>RTT</th>
			<th>RR</th>
		</tr>

		{#each services as service}
			<tr>
				<td>{service.locationDetail.origin[0]?.publicTime}</td>
				<td>
					{service.locationDetail.origin.map(
						(o) => o.description,
					)}</td>
				<td>
					{service.locationDetail.destination.map(
						(o) => o.description,
					)}
				</td>
				<td>{service.atocCode}</td>
				<td>{service.serviceUid}</td>
				<td />
				<td>
					<a
						target="_blank"
						href={getRTTLink(service.serviceUid, service.runDate)}>
						RTT
					</a>
				</td>
				<td>
					<a
						target="_blank"
						href="https://live.rail-record.co.uk/train.php/?c={service.serviceUid}&d={service.runDate}">
						RR
					</a>
				</td>
			</tr>
		{/each}
	</table>
</section>

<style lang="scss">
	th {
		background-color: #1e1e1f;
		position: sticky;
		top: 0;
	}
</style>

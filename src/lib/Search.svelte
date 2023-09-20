<script lang="ts">
	function submit(form: HTMLFormElement) {
		const data = new FormData(form);
		const station = data.get('station');

		window.location.href = `/station/${station}`;
	}
</script>

<form on:submit|preventDefault={(event) => submit(event.currentTarget)}>
	<label>
		<input
			value="WAT"
			type="text"
			name="station"
			placeholder="Station Code" />
	</label>

	<button>Search</button>
</form>

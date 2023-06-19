<script>
	import { Column, Content, Grid, Row } from 'carbon-components-svelte';
</script>

<Content id="network">
	<Grid>
		<Row padding={true}>
			<Column sm={4} md={2}>
				<h5>The Network</h5>
			</Column>
			<Column>
				<h4>
					Project JOAN is tried, tested, and trusted by the following educational institutions and
					organizations:
				</h4>
				<br /><br />
			</Column>
		</Row>
		<Row padding={true}>
			<div class="w-full pb-8 lg:w-1/4 lg:pb-0">
				<img class="w-24 h-24 rounded mx-auto" src="images/logos/admu.png" alt="" />
			</div>
			<div class="w-full pb-8 lg:w-1/4 lg:pb-0">
				<img class="w-24 h-24 rounded mx-auto" src="images/logos/dlsu.png" alt="" />
			</div>
			<div class="w-full pb-8 lg:w-1/4 lg:pb-0">
				<img class="w-24 h-24 rounded mx-auto" src="images/logos/tup.png" alt="" />
			</div>
			<div class="w-full lg:w-1/4">
				<img class="w-24 h-24 rounded mx-auto" src="images/logos/deped.png" alt="" />
			</div>
		</Row>
	</Grid>
</Content>

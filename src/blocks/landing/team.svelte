<script>
	import { ClickableTile, Column, Content, Grid, Row } from 'carbon-components-svelte';
	import { SecureProfile, TimeLapse, TrustedUser, CloudServices } from 'carbon-pictograms-svelte';
</script>

<Content id="team">
	<Grid>
		<Row padding={true}>
			<Column sm={4} md={2}>
				<h5>The Dev Team</h5>
			</Column>
			<Column class="flex flex-wrap">
				<div class="w-1/2 lg:w-1/4">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><img class="w-16 h-16 rounded" src="images/assets/avatar.svg" alt=""></div>
						<br />
						<div><h4>Lyndone</h4></div>
						<p>
							Project Lead
						</p>
					</ClickableTile>
				</div>
				<div class="w-1/2 lg:w-1/4">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><img class="w-16 h-16 rounded" src="images/assets/avatar.svg" alt=""></div>
						<br />
						<div><h4>Byron</h4></div>
						<p>
							UX Specialist
						</p>
					</ClickableTile>
				</div>
				<div class="w-1/2 lg:w-1/4">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><img class="w-16 h-16 rounded" src="images/assets/avatar.svg" alt=""></div>
						<br />
						<div><h4>Jemmie</h4></div>
						<p>
							QA Engineer
						</p>
					</ClickableTile>
				</div>
				<div class="w-1/2 lg:w-1/4">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><img class="w-16 h-16 rounded" src="images/assets/avatar.svg" alt=""></div>
						<br />
						<div><h4>Angel Joy</h4></div>
						<p>
							Analyst
						</p>
					</ClickableTile>
				</div>
			</Column>
		</Row>
	</Grid>
</Content>

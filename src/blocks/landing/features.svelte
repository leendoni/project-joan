<script>
	import { ClickableTile, Column, Content, Grid, Row } from 'carbon-components-svelte';
	import { SecureProfile, TimeLapse, TrustedUser, CloudServices } from 'carbon-pictograms-svelte';
</script>

<Content id="features">
	<Grid>
		<Row padding={true}>
			<Column sm={4} md={2}>
				<h5>Features</h5>
			</Column>
			<Column class="flex flex-wrap">
				<div class="w-full lg:w-1/2">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><SecureProfile /></div>
						<br /><br /><br />
						<div><h4>Secure.</h4></div>
						<br />
						<p>
							Project JOAN is designed with security in mind, with features such as user
							authentication, access control, and data encryption, ensuring that sensitive data is
							protected.
						</p>
						<br />
					</ClickableTile>
				</div>
				<div class="w-full lg:w-1/2">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><TimeLapse /></div>
						<br /><br /><br />
						<div><h4>Real-time.</h4></div>
						<br />
						<p>
							Project JOAN provides real-time updates on schedules, grades, and other important
							information, which allows users to stay informed and up-to-date.
						</p>
						<br />
					</ClickableTile>
				</div>
				<div class="w-full lg:w-1/2">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><CloudServices /></div>
						<br /><br /><br />
						<div><h4>Cloud-based.</h4></div>
						<br />
						<p>
							Project JOAN is a cloud-based application that can be accessed from anywhere with an
							internet connection, making it more convenient for each and every user.
						</p>
						<br />
					</ClickableTile>
				</div>
				<div class="w-full lg:w-1/2">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><TrustedUser /></div>
						<br /><br /><br />
						<div><h4>User-friendly.</h4></div>
						<br />
						<p>
							Project JOAN is designed to be user-friendly, with a simple and intuitive interface
							that is easy to navigate. This makes it easier for users to learn and use the system.
						</p>
						<br />
					</ClickableTile>
				</div>
			</Column>
		</Row>
	</Grid>
</Content>

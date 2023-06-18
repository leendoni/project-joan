<script>
	import {
		Button,
		Column,
		Content,
		Grid,
		Row,
		TextArea,
		TextInput
	} from 'carbon-components-svelte';
</script>

<Content id="demo">
	<Grid>
		<Row padding={true}>
			<Column sm={4} md={2}>
				<h5>Schedule a Demo</h5>
			</Column>
			<Column>
				<h4>
					Discover the power of <strong>Project JOAN</strong> firsthand - schedule a demo today.
				</h4>
				<br /><br />
				<TextInput
					size="xl"
					labelText="Name of your Company / Institution"
					placeholder="Company / Institution"
					required
				/>
				<br /><br />
				<div class="flex flex-wrap">
					<div class="w-full mb-8 lg:mb-0 lg:w-1/2 lg:pr-2">
						<TextInput size="xl" labelText="Full Name" placeholder="Your full name" required />
					</div>
					<div class="w-full lg:w-1/2 lg:pl-2">
						<TextInput
							size="xl"
							labelText="Email Address"
							placeholder="Your email address"
							required
						/>
					</div>
				</div>
				<br /><br />
				<TextArea
					labelText="Current problems / difficulties in your company"
					helperText="A rich description helps us better understand which problem areas to focus on the scheduled demonstration."
					placeholder="Describe why you are interested in Project JOAN"
				/>
				<br /><br />
				<div class="w-full">
					<Button>Submit</Button>
				</div>
			</Column>
		</Row>
		<Row padding={true} id="demo" />
	</Grid>
</Content>

<script>
	import {
		Button,
		Checkbox,
		Column,
		ComboBox,
		Content,
		Grid,
		Modal,
		Row,
		TextInput
	} from 'carbon-components-svelte';
	import { PageFirst, PageLast, WatsonHealthRegistration } from 'carbon-icons-svelte';

	let open = false;
</script>

<Content id="contact">
	<Grid>
		<Row padding={true}>
			<Column sm={4} md={2} />
			<Column>
				<p>
					Interested in enrolling to Colegio de San Juan de Dios? Fill out this form to Pre-Register
					and save time on enrollment.<br />
					<strong>Become a part of the CSJD Family!</strong>
				</p>
			</Column>
		</Row>
		<Row padding={true}>
			<Column sm={4} md={2}>
				<h5>Primary Academic Information</h5>
			</Column>
			<Column class="flex flex-wrap">
				<div class="w-full lg:w-1/3 lg:pr-3 pb-3 lg:pb-0">
					<TextInput labelText="Learner's Reference Number" placeholder="Enter your LRN" required />
				</div>
				<div class="w-full lg:w-1/3 lg:pr-3 pb-3 lg:pb-0">
					<TextInput labelText="Academic Year" placeholder="A.Y. 2023-2024" readonly required />
				</div>
				<div class="w-full lg:w-1/3 lg:pr-3 pb-3 lg:pb-0">
					<ComboBox
						required
						titleText="Semester"
						placeholder="Semester"
						items={[
							{ id: '0', text: 'First' },
							{ id: '1', text: 'Second' },
							{ id: '2', text: 'Summer' }
						]}
					/>
				</div>
			</Column>
		</Row>
		<Row padding={true}>
			<Column sm={4} md={2}>
				<h5>Primary Personal Information</h5>
			</Column>
			<Column class="flex flex-wrap">
				<div class="w-full lg:w-4/12 lg:pr-3 pb-3 lg:pb-0">
					<TextInput labelText="Last Name" placeholder="Enter your last name" required />
				</div>
				<div class="w-full lg:w-3/12 lg:pr-3 pb-3 lg:pb-0">
					<TextInput labelText="First Name" placeholder="Enter your first name" required />
				</div>
				<div class="w-full lg:w-4/12 lg:pr-3 pb-3 lg:pb-0">
					<TextInput labelText="Middle Name" placeholder="Enter your middle name" required />
				</div>
				<div class="w-full lg:w-1/12 lg:pr-3">
					<TextInput labelText="Suffix" placeholder="Jr." />
				</div>
			</Column>
		</Row>
		<Row padding={true}>
			<Column sm={4} md={2} />
			<Column class="flex flex-wrap">
				<div class="w-full lg:w-1/12 lg:pr-3 pb-3 lg:pb-0">
					<TextInput labelText="Age" placeholder="Age" required />
				</div>
				<div class="w-full lg:w-2/12 lg:pr-3 pb-3 lg:pb-0">
					<ComboBox
						required
						titleText="Gender"
						placeholder="Select gender"
						items={[
							{ id: '0', text: 'Male' },
							{ id: '1', text: 'Female' }
						]}
					/>
				</div>
				<div class="w-full lg:w-2/12 lg:pr-3 pb-3 lg:pb-0">
					<ComboBox
						required
						titleText="Civil Status"
						placeholder="Select status"
						items={[
							{ id: '0', text: 'Single' },
							{ id: '1', text: 'Married' },
							{ id: '2', text: 'Separated' },
							{ id: '3', text: 'Widowed' }
						]}
					/>
				</div>
				<div class="w-full lg:w-3/12 lg:pr-3 pb-3 lg:pb-0">
					<TextInput
						required
						labelText="Nationality"
						placeholder="Filipino, Chinese-Filipino, etc."
					/>
				</div>
				<div class="w-full lg:w-4/12 lg:pr-3">
					<TextInput
						required
						labelText="Religion"
						placeholder="Roman Catholic, Born-again Christian, etc."
					/>
				</div>
			</Column>
		</Row>
		<Row padding={true}>
			<Column sm={4} md={2}>
				<h5>Contact Information</h5>
			</Column>
			<Column class="flex flex-wrap">
				<div class="w-full lg:w-1/3 lg:pr-3 pb-3 lg:pb-0">
					<TextInput required labelText="Phone Number" placeholder="Enter your phone number" />
				</div>
				<div class="w-full lg:w-1/3 lg:pr-3 pb-3 lg:pb-0">
					<TextInput
						labelText="Home / Telephone Number"
						placeholder="Enter your home / telephone number"
					/>
				</div>
				<div class="w-full lg:w-1/3 lg:pr-3 pb-3 lg:pb-0">
					<TextInput required labelText="Email Address" placeholder="Enter your email address" />
				</div>
			</Column>
		</Row>
		<Row padding={true}>
			<Column sm={4} md={2} />
			<Column class="flex flex-wrap">
				<Button icon={PageLast} on:click={() => (open = true)}>Submit</Button>
			</Column>
		</Row>
	</Grid>
</Content>

<Modal
	bind:open
	modalHeading="Pre-Registration Complete"
	primaryButtonText="Return to Landing Page"
    primaryButtonIcon={PageFirst}
    on:click:button--primary={() => (location.href='https://csjd.project-joan.cloud')}
	on:open
	on:close
	on:submit
>
	<p>You have successfully pre-registered for this term's enrollment. Below is your reference code:</p><br>
    <h3>FHI2293ER</h3><br>
    <p>Take note of this code and present it upon enrollment.</p>
</Modal>

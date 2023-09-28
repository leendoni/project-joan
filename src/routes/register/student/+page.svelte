<script>
	// #region imports
	// svelte
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	// components
	import {
		Button,
		ButtonSet,
		Checkbox,
		Content,
		Header,
		HeaderUtilities,
		Modal,
		NumberInput,
		PasswordInput,
		ProgressBar,
		RadioButton,
		RadioButtonGroup,
		TextArea,
		TextInput
	} from 'carbon-components-svelte';
	// icons
	import { Asleep, Checkmark, Debug, DotMark, Logout, Pen, Return } from 'carbon-icons-svelte';
	// pictograms
	// firebase
	import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
	import { db } from '../../../firebase';
	// for password hashing
	// #endregion
	// #region database values
	let pageID = '/register/student';
	let dbConn = false;
	// database values
	const getSchoolID = doc(db, 'schools', '0303001');
	const getUsers = collection(getSchoolID, 'users');
	// schoolyear data
	let acadYR = '',
		acadSM = '';
	// user data
	let userID = '',
		userCL = '',
		userST = '',
		userUN = '',
		userPW = '',
		userLR = '',
		userLN = '',
		userFN = '',
		userMN = '',
		userSF = '',
		userAD = '',
		userMA = '',
		userFA = '',
		userGA = '',
		userCP = '',
		userCR = '',
		userCN = '',
		userEC = '';
	// login data
	let nputUN = '',
		nputPW = '',
		nputLR = '';
	let invaUN = false,
		invaPW = false;
	// local stored
	let loclID = '',
		loclCL = '',
		loclFN = '',
		loclTM = 'white'; // "white" | "g10" | "g80" | "g90" | "g100"
	// bugreports
	let probID = '',
		probTT = '',
		probDC = '',
		probST = '';
	// progress
	let progTX = '',
		headTX = '',
		descTX = '';
	// #endregion
	// #region functional variables
	// confirm
	let confirm = false;
	// modals
	let reportBugMD00 = false, // open
		reportBugMD01 = false, // default
		reportBugMD02 = false; // success
	// #endregion
	// #region functions
	// #region general
	// change theme
	function toggleDark() {
		if (loclTM == 'white') {
			loclTM = 'g100';
			document.documentElement.setAttribute('theme', loclTM);
			localStorage.setItem('loclTM', loclTM);
		} else {
			loclTM = 'white';
			document.documentElement.setAttribute('theme', loclTM);
			localStorage.setItem('loclTM', loclTM);
		}
	}

	function goLogin() {
		goto('/login');
	}

	function handleLogout() {
		localStorage.removeItem('userID');
		localStorage.removeItem('userCL');
	}
	// #endregion
	// #region for database
	function generateProbID() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < 6; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		probID = result;
	}

	async function reportProb(event) {
		if (probID === '' || probTT === '' || probDC === '') {
			return;
		}

		try {
			const reportData = {
				probID,
				pageID,
				probTT,
				probDC,
				probST: 'unsolved'
			};

			await addDoc(collection(db, 'bugs'), reportData);
		} catch (e) {
			console.log(e);
			console.log('Failed to save data. Please try again.');
		}
	}

	// #endregion
	// #endregion
	onMount(async () => {
		loclTM = localStorage.getItem('loclTM'); // get stored theme on load
		document.documentElement.setAttribute('theme', loclTM); // set selected theme on load

		try {
			const getSchoolID = doc(db, 'schools', '0303001');
			progTX = 'Retrieving...';
			const getUsers = collection(getSchoolID, 'users');
			progTX = 'Connecting...';
			await getDocs(getUsers);
			console.log('Connected.');

			dbConn = true;

			loclID = localStorage.getItem('userID');
			loclCL = localStorage.getItem('userCL');
			loclFN = localStorage.getItem('userFN');

			headTX = 'Pick a module.';
			descTX = 'On the sidebar, choose the module that you want to work on.';
		} catch (error) {
			console.error('Failed. :', error);
			dbConn = false;
		}
	});
</script>

<Header company="Project" platformName="JOAN" href="/">
	<div class="text-white hidden lg:flex">Registration</div>
	<HeaderUtilities>
		<div class="flex">
			<div class="flex">
				<Button
					on:click={() => (reportBugMD00 = true)}
					tooltipPosition="left"
					iconDescription="Report a bug"
					kind="ghost"
					icon={Debug}
				/>
				<Button
					on:click={toggleDark}
					tooltipPosition="left"
					iconDescription="Dim"
					kind="secondary"
					icon={Asleep}
				/>
				<Button
					on:click={goLogin}
					on:click={handleLogout}
					tooltipPosition="left"
					iconDescription="Logout"
					kind="primary"
					icon={Return}
				/>
			</div>
		</div>
	</HeaderUtilities>
</Header>

{#if dbConn}
	<div class="flex flex-col">
		<!-- displayed on mobile -->
		<Content class="flex flex-col bg-neutral-900 h-72">
			<h1 class="pt-32 lg:pt-44 text-white">Student Registration</h1>
		</Content>
		<Content class="h-auto">
			<div class="flex flex-col lg:flex-row">
				<div class="w-full lg:w-1/4 lg:self-center">
					<h6 class="underline">Academic Information</h6>
				</div>
				<br />
				<div class="flex flex-col w-full lg:flex-row gap-2">
					<TextInput labelText="Academic Year" value="2023-2024" readonly />
					<TextInput labelText="Academic Semester" value="Second" readonly />
					<TextInput labelText="Learner's Reference Number" placeholder="Enter your LRN" />
				</div>
			</div>
			<br /><br /><br />
			<div class="flex flex-col lg:flex-row">
				<div class="w-full lg:w-1/4 lg:self-center">
					<h6 class="underline">Student Information</h6>
				</div>
				<br />
				<div class="flex flex-col w-full">
					<div class="flex flex-col w-full lg:flex-row gap-2">
						<TextInput labelText="Last Name" placeholder="Enter your last name" />
						<TextInput labelText="First Name" placeholder="Enter your first name" />
						<TextInput labelText="Middle Name" placeholder="Enter your middle name" />
						<TextInput labelText="Suffix (if any)" placeholder="Sr., Jr., III., etc." />
					</div>
					<br />
					<div class="flex flex-col w-full lg:flex-row gap-2">
						<TextInput labelText="Student Address" placeholder="Enter your complete address" />
					</div>
					<br />
					<div class="flex flex-col w-full lg:flex-row gap-2">
						<NumberInput label="Student Contact Number" value={0} hideSteppers />
						<NumberInput label="Emergency Contact Number" value={0} hideSteppers />
					</div>
					<br />
					<div class="flex flex-col w-full lg:flex-row gap-2">
						<div class="flex flex-row w-full">
							<TextInput labelText="Mother's Name" placeholder="Enter your mother's name" />
							<div class="pt-6">
								<Button
									size="field"
									kind="secondary"
									iconDescription="Primary Emergency Contact"
									icon={Checkmark}
									tooltipPosition="left"
								/>
							</div>
						</div>
						<div class="flex flex-row w-full">
							<TextInput labelText="Father's Name" placeholder="Enter your father's name" />
							<div class="pt-6">
								<Button
									size="field"
									kind="secondary"
									iconDescription="Primary Emergency Contact"
									icon={Checkmark}
									tooltipPosition="left"
								/>
							</div>
						</div>
						<div class="flex flex-row w-full">
							<TextInput labelText="Guardian's Name" placeholder="Enter your guardian's name" />
							<div class="pt-6">
								<Button
									size="field"
									kind="secondary"
									iconDescription="Primary Emergency Contact"
									icon={Checkmark}
									tooltipPosition="left"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<br /><br /><br />
			<div class="flex flex-col lg:flex-row">
				<div class="w-full lg:w-1/4 lg:self-center">
					<h6 class="underline">Account Information</h6>
				</div>
				<br />
				<div class="flex flex-col w-full lg:flex-row gap-2">
					<TextInput labelText="Account ID" placeholder="System-generated account ID" readonly />
					<TextInput labelText="Username" placeholder="System-generated username" readonly />
					<PasswordInput
						labelText="Password"
						placeholder="Enter your password"
						tooltipPosition="left"
						readonly
					/>
				</div>
			</div>
			<br /><br /><br />
			<div class="flex flex-col lg:items-center lg:flex-row">
				<Checkbox
					bind:checked={confirm}
					labelText="I certify that the information above is correct."
				/>
				<br />
				<Button disabled={!confirm} icon={Pen}>Register</Button>
			</div>
		</Content>
	</div>
{:else}
	<div class="flex flex-col items-stretch lg:flex-row">
		<!-- displayed on mobile -->
		<Content id="#" class="flex flex-col bg-neutral-900 h-60 lg:hidden">
			<ProgressBar size="md" helperText={progTX} />
		</Content>
		<Content id="#" class="bg-neutral-900 w-1/3 h-screen hidden lg:flex" />
		<Content class="self-center w-11/12 lg:w-2/5">
			<ProgressBar size="md" helperText={progTX} />
		</Content>
		<Content />
	</div>
{/if}
<!-- modals -->
<!-- reportbug -->
<Modal
	on:click:button--primary={async () => {
		try {
			await reportProb();
			reportBugMD02 = true;
		} catch (error) {
			reportBugMD02 = false;
		}
		reportBugMD01 = false;
	}}
	bind:open={reportBugMD00}
	on:open={() => ((reportBugMD01 = true), (reportBugMD02 = false))}
	modalHeading={reportBugMD01 ? 'Report a bug' : reportBugMD02 ? 'Bug reported' : ''}
	size={reportBugMD02 ? 'xs' : !reportBugMD01 ? 'xs' : 'md'}
	passiveModal={reportBugMD02 || !reportBugMD01}
	primaryButtonText="Submit"
>
	{#if reportBugMD01}
		<br />
		<h6 class="flex flex-col">Tell us more about your encountered problem.</h6>
		<br />
		<div class="flex flex-col gap-3">
			<div class="flex flex-col gap-3 lg:flex-row">
				<TextInput bind:value={pageID} labelText="Page Link" placeholder={pageID} readonly />
				<TextInput
					bind:value={probID}
					labelText="Problem ID"
					placeholder="System-generated problem ID"
					readonly
				/>
			</div>
			<div class="flex flex-col lg:flex-row">
				<TextInput
					bind:value={probTT}
					on:change={generateProbID}
					labelText="Problem Title"
					placeholder="Provide a short description of the problem you encountered"
					required
				/>
			</div>
			<div class="flex flex-col lg:flex-row">
				<TextArea
					placeholder="Provide an in-depth description of the problem you encountered"
					bind:value={probDC}
					required
				/>
			</div>
		</div>
	{:else if reportBugMD02}
		<br />
		<h5>Thanks for your feedback!</h5>
		<br />
		<p class="italic">
			We intend to make Project JOAN a cohesive and effective application. We value your feedback
			regarding problems you face while using the application.
		</p>
	{:else if !reportBugMD02}
		<br />
		<p>Error reporting bug. Make sure to fill up all fields.</p>
	{/if}
</Modal>

<script>
	// #region imports
	// svelte
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	// components
	import {
		Button,
		Checkbox,
		ComboBox,
		Content,
		Header,
		HeaderUtilities,
		Modal,
		NumberInput,
		PasswordInput,
		ProgressBar,
		TextArea,
		TextInput
	} from 'carbon-components-svelte';
	// icons
	import { Asleep, Checkmark, Debug, Pen, Return } from 'carbon-icons-svelte';
	// pictograms
	// firebase
	import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';
	import { db } from '../../firebase';
	// for passwords
	import bcrypt from 'bcryptjs';
	// for password hashing
	// #endregion
	// #region database values
	let pageID = '/registration/employee';
	let dbConn = false;
	// schoolyear data
	let schlID = '0303001',
		acadYR = '2023-2024',
		acadSM = 'Second';
	// database values
	const getSchoolID = doc(db, schlID, acadYR);
	const getUsers = collection(db, schlID, 'data', 'users');
	// user data
	let userID = '',
		userCL = '',
		userST = '',
		userUN = '',
		userPW = '',
		userAY = '2023-2024',
		userSM = 'Second',
		userYR = '',
		userSC = '',
		userLR = '',
		userLN = '',
		userFN = '',
		userMN = '',
		userSF = '',
		userSX = '',
		userAD = '',
		userMA = '',
		userFA = '',
		userGA = '',
		userCP = '',
		userCR = '',
		userCN = 0,
		userEC = 0;
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
	// person picker
	let pickMA = true,
		pickFA = true,
		pickGA = true;
	// #endregion
	// #region functional variables
	// confirm
	let confirm = false;
	let invalid = true;
	// modals
	let reportBugMD00 = false, // open
		reportBugMD01 = false, // default
		reportBugMD02 = false; // success
	let studApplyMD00 = false, // open
		studApplyMD01 = false, // default
		studApplyMD02 = false; // success
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

	function goHome() {
		goto('/');
	}

	function goLogin() {
		goto('/login');
	}

	function handleLogout() {
		localStorage.removeItem('userID');
		localStorage.removeItem('userCL');
		goto('/login');
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

	function selectMA() {
		pickMA = true;
		pickFA = false;
		pickGA = false;
		userCP = userMA;
		userCR = 'Mother';
	}

	function selectFA() {
		pickMA = false;
		pickFA = true;
		pickGA = false;
		userCP = userFA;
		userCR = 'Father';
	}

	function selectGA() {
		pickMA = false;
		pickFA = false;
		pickGA = true;
		userCP = userGA;
		userCR = 'Guardian';
	}

	function generateUserID() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

		let result = '';
		for (let i = 0; i < 8; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		userID = result;
	}

	function generateUserUN() {
		const trimLR = userLR.slice(-6); // Get the last 6 characters of the LRN
		userUN = `${userLN}.${trimLR}@csjd.project-joan.cloud`;
	}

	async function generateUserPW(userPW) {
		const salt = await bcrypt.genSalt(10); // Generate a salt
		const hashedPassword = await bcrypt.hash(userPW, salt); // Hash the password
		return hashedPassword;
	}

	async function checkUserLR(value) {
		const getSchoolID = doc(db, acadYR, '0303001');
		const getUsers = collection(getSchoolID, 'users');
		const q = query(getUsers, where('userLR', '==', value));
		const snapshot = await getDocs(q);
		return !snapshot.empty; // Returns true if the entry exists
	}

	async function registerUser(event) {
		let fillST, xistST;
		let duplCN = await checkUserLR(userLR);

		// check empty
		if (
			userID == '' ||
			userPW == '' ||
			userCN == 0 ||
			userLN == '' ||
			userFN == '' ||
			userMN == '' ||
			userSX == '' ||
			userAD == '' ||
			userEC == 0 ||
			userCP == ''
		) {
			confirm = false;
			fillST = false;
			studApplyMD01 = true; // fill all modal
		} else {
			fillST = true;
		}

		if (duplCN) {
			confirm = false;
			xistST = true;
			studApplyMD02 = true; // exists modal
		} else {
			xistST = false;
		}

		if (fillST && !xistST) {
			confirm = false;

			event.preventDefault();
			const pass = await generateUserPW(userPW);

			// Construct the data object
			const userData = {
				userID,
				userCL: 'employee',
				userST: 'INACTIVE',
				userUN,
				userPW: pass,
				userAY,
				userSM,
				userYR,
				userSC,
				userLR,
				userLN,
				userFN,
				userMN,
				userSF,
				userSX,
				userAD,
				userMA,
				userFA,
				userGA,
				userCP,
				userCR,
				userCN,
				userEC
			};

			// check duplicates
			if (duplCN) {
				return; // Don't proceed with saving the data if there are duplicates
			} else {
				try {
					await uploadUser(userData);
					studApplyMD00 = true; // success modal
				} catch (e) {
					console.log('Failed to save data. Please try again.');
				}
			}
		}
	}

	async function uploadUser(data) {
		try {
			const docRef = await addDoc(collection(db, schlID, 'data', 'users'), data);
			console.log('Document written with ID: ', docRef.id);
			return docRef.id; // you can return the ID to further use it if needed
		} catch (e) {
			console.error('Error adding document: ', e);
			throw e; // re-throwing the error for the caller to handle
		}
	}
	// #endregion
	// #endregion
	onMount(async () => {
		loclTM = localStorage.getItem('loclTM'); // get stored theme on load
		document.documentElement.setAttribute('theme', loclTM); // set selected theme on load

		try {
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
	<div class="text-white hidden lg:flex">Employee Registration</div>
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
			<h1 class="pt-32 lg:pt-44 text-white">Employee Registration</h1>
		</Content>
		<Content class="h-auto">
			<p>This page is reserved <strong>only for employees.</strong></p>
			<br />
			<hr />
			<br />
			<div class="flex flex-col lg:flex-row">
				<div class="w-full lg:w-1/4 lg:self-center">
					<h6 class="underline">Basic Information</h6>
				</div>
				<br />
				<div class="flex flex-col w-full lg:flex-row gap-3">
					<ComboBox
						titleText="Type of Government ID"
						placeholder="Select ID type"
						items={[
							{ id: '0', text: 'Professional Regulatory Commission (PRC License)' },
							{ id: '1', text: 'Land Transportation Office (Drivers License)' },
							{ id: '2', text: 'Philippine Identification System (National ID)' },
							{ id: '3', text: 'Philippine Health Insurance Corp. (PhilHealth)' },
							{ id: '4', text: 'Philippine Passport' }
						]}
					/>
					<TextInput
						bind:value={userLR}
						labelText="Government ID Number"
						placeholder="Enter your ID number"
					/>
				</div>
			</div>
			<br />
			<hr />
			<br />
			<div class="flex flex-col lg:flex-row">
				<div class="w-full lg:w-1/4 lg:self-center">
					<h6 class="underline">Employee Information</h6>
				</div>
				<br />
				<div class="flex flex-col w-full">
					<div class="flex flex-col w-full lg:flex-row gap-3">
						<TextInput
							bind:value={userLN}
							labelText="Last Name"
							placeholder="Enter your last name"
						/>
						<TextInput
							bind:value={userFN}
							labelText="First Name"
							placeholder="Enter your first name"
						/>
						<TextInput
							bind:value={userMN}
							labelText="Middle Name"
							placeholder="Enter your middle name"
						/>
						<TextInput
							bind:value={userSF}
							labelText="Suffix (if any)"
							placeholder="Sr., Jr., III., etc."
						/>
					</div>
					<br />
					<div class="flex flex-col w-full lg:flex-row gap-3">
						<ComboBox
							bind:value={userSX}
							titleText="Gender"
							placeholder="Select gender"
							items={[
								{ id: '0', text: 'Male' },
								{ id: '1', text: 'Female' }
							]}
						/>
						<NumberInput bind:value={userCN} label="Contact Number" hideSteppers />
						<TextInput
							bind:value={userAD}
							labelText="Employee Address"
							placeholder="Enter your complete address"
						/>
					</div>
					<br />
					<div class="flex flex-col w-full lg:flex-row gap-3">
						<TextInput
							bind:value={userCP}
							labelText="Emergency Contact Person"
							placeholder="Select from the three below"
						/>
						<NumberInput bind:value={userEC} label="Emergency Contact Number" hideSteppers />
						<TextInput
							bind:value={userCR}
							labelText="Relation to Contact Person (optional)"
							placeholder="Relationship to contact person"
						/>
					</div>
				</div>
			</div>
			<br />
			<hr />
			<br />
			<div class="flex flex-col lg:flex-row">
				<div class="w-full lg:w-1/4 lg:self-center">
					<h6 class="underline">Account Information</h6>
				</div>
				<br />
				<div class="flex flex-col w-full lg:flex-row gap-3">
					<TextInput
						bind:value={userID}
						labelText="Account ID"
						placeholder="System-generated account ID"
						readonly
					/>
					<TextInput
						bind:value={userUN}
						labelText="Username"
						placeholder="System-generated username"
						readonly
					/>
					<PasswordInput bind:value={userPW} labelText="Password" placeholder="Enter password" />
				</div>
			</div>
			<br />
			<hr />
			<br />
			<div class="flex flex-col lg:items-center lg:flex-row">
				<Checkbox
					bind:checked={confirm}
					on:click={generateUserID}
					on:click={generateUserUN}
					labelText="I certify that the information above is correct."
				/>
				<br />
				<Button on:click={registerUser} disabled={!confirm} icon={Pen}>Register</Button>
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
<Modal
	bind:open={studApplyMD00}
	on:close={goLogin}
	modalHeading="Application Received!"
	passiveModal
>
	<div class="flex flex-col content-center">
		<div>
			<br />
			<p class="italic">Username:</p>
			<h3>{userUN}</h3>
			<br />
			<br />
			<p class="italic">Account Code:</p>
			<h3>{userID}</h3>
			<br />
		</div>
		<div>
			<p class="italic">
				Important: <strong>Jot down your account code or take a screenshot</strong> as this will be presented
				upon enrollment.
			</p>
		</div>
	</div>
</Modal>
<Modal bind:open={studApplyMD01} modalHeading="Registration Failed." size="xs" passiveModal>
	<div class="flex flex-col content-center">
		<div>
			<p class="italic">
				Make sure to fill up all required fields before submitting your application.
			</p>
		</div>
	</div>
</Modal>
<Modal bind:open={studApplyMD02} modalHeading="Registration Failed." size="xs" passiveModal>
	<div class="flex flex-col content-center">
		<div>
			<p class="italic">The government ID number you used is already in use by another user.</p>
		</div>
	</div>
</Modal>

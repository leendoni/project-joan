<script>
	// #region imports
	// svelte
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	// components
	import {
		Button,
		ButtonSet,
		Content,
		Form,
		Header,
		HeaderUtilities,
		Link,
		Modal,
		PasswordInput,
		ProgressBar,
		TextArea,
		TextInput
	} from 'carbon-components-svelte';
	// icons
	import {
		Asleep,
		Carbon,
		CloudLogging,
		Debug,
		HelpFilled,
		Home,
		Login,
		Search
	} from 'carbon-icons-svelte';
	// pictograms
	// firebase
	import bcrypt from 'bcryptjs';
	import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
	import { db } from '../../firebase';
	// for password hashing
	// #endregion
	// #region database values
	let pageID = '/login';
	let dbConn = false;
	// schoolyear data
	let schlID = '0303001',
		acadYR = '2023-2024',
		acadSM = 'Second';
	// database values
	const getSchoolID = doc(db, schlID, acadYR);
	const getUsers = collection(db, schlID, 'data', 'users');
	// local stored
	let loclID = '',
		loclCL = '',
		loclFN = '',
		loclTM = 'white'; // "white" | "g10" | "g80" | "g90" | "g100"
	// user data
	let userID = '',
		userCL = '',
		userST = false,
		userUN = '',
		userPW = '',
		userLN = '',
		userFN = '',
		userMN = '';
	// login data
	let nputUN = '',
		nputPW = '',
		nputID = '';
	let invaUN = false,
		invaPW = false;
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
	// sidebar
	let sideBR = false;
	// modals
	let reportBugMD00 = false, // open
		reportBugMD01 = false, // default
		reportBugMD02 = false; // success
	let resetPassMD00 = false, // open
		resetPassMD01 = false, // default
		resetPassMD02 = false; // success
	let inactvAccMD00 = false; // open
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

	async function handleLogin() {
		try {
			const q = query(getUsers, where('userUN', '==', nputUN));

			const snapshot = await getDocs(q);

			if (snapshot.empty) {
				invaUN = true;
				handleAccess(nputUN, false);
				return;
			}

			const userData = snapshot.docs[0].data();

			userST = userData.userST;

			if (userST == true) {
				// Check the password using the function from before
				const isPasswordValid = await bcrypt.compare(nputPW, userData.userPW);

				if (isPasswordValid) {
					userID = userData.userID;
					userCL = userData.userCL;
					userFN = userData.userFN;

					localStorage.setItem('userID', userID);
					localStorage.setItem('userCL', userCL);
					localStorage.setItem('userFN', userFN);
					localStorage.setItem('userLG', 'true');

					handleAccess(nputUN, true);
					goto('/home');
				} else {
					invaPW = true;
				}
			} else {
				inactvAccMD00 = true;
			}
		} catch (error) {
			handleAccess(nputUN, false);
			console.error('Login error:', error);
		}
	}

	async function handleAccess(userUN, aclgST) {
		try {
			const formattedDate = generateDate(new Date());
			const data = {
				userUN,
				aclgST,
				aclgDT: formattedDate
			};

			await addDoc(collection(db, schlID, acadYR, 'access'), data);
		} catch (error) {
			console.error('Failed to log access:', error);
		}
	}

	function generateDate(date) {
		const YYYY = date.getFullYear();
		const MM = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
		const DD = String(date.getDate()).padStart(2, '0');
		const HH = String(date.getHours()).padStart(2, '0');
		const MIN = String(date.getMinutes()).padStart(2, '0');
		const SS = String(date.getSeconds()).padStart(2, '0');

		return `${YYYY}${MM}${DD}-${HH}:${MIN}:${SS}`;
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
	// #region password reset functions
	// load user data
	async function loadUserData() {
		// Fetch the user's data from Firestore using the entered username
		const q = query(getUsers, where('userID', '==', nputID));

		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			return;
		}

		const userData = snapshot.docs[0].data();

		console.log(userLN);

		userLN = userData.userLN;
		userFN = userData.userFN;
		userMN = userData.userMN;
	}

	// update user data
	async function updateUserData() {
		const updatedData = {
			userRP: true
		};

		const q = query(getUsers, where('userID', '==', nputID));
		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			console.error('No records found for the selected reference code.');
			return;
		}

		const docId = snapshot.docs[0].id;
		const docRef = doc(db, schlID, 'data', 'users', docId);

		try {
			await updateDoc(docRef, updatedData);
			console.log('Successfully updated');
		} catch (error) {
			console.error('Error updating document:', error);
		}
	}
	// #endregion

	// #endregion
	onMount(async () => {
		loclTM = localStorage.getItem('loclTM'); // get stored theme on load
		document.documentElement.setAttribute('theme', loclTM); // set selected theme on load

		try {
			progTX = 'Retrieving...';
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
	<div class="text-white hidden lg:flex">Account Login</div>
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
					on:click={goHome}
					tooltipPosition="left"
					iconDescription="Return home"
					kind="primary"
					icon={Home}
				/>
			</div>
		</div>
	</HeaderUtilities>
</Header>

{#if dbConn}
	{#if loclCL}
		{goto('/home')}
	{:else}
		<div class="flex flex-col items-stretch lg:flex-row">
			<!-- displayed on mobile -->
			<Content id="#" class="flex flex-col bg-neutral-900 h-52 lg:hidden">
				<h1 class="pt-24 text-white">Account Log-in</h1>
			</Content>
			<Content id="#" class="bg-neutral-900 w-1/3 h-screen hidden lg:flex" />
			<Content class="self-center w-11/12 lg:w-2/5">
				<h1 class="pb-12 hidden lg:flex">Account Log-in</h1>
				<Form on:submit>
					<div class="flex flex-col gap-6">
						<div>
							<TextInput
								bind:value={nputUN}
								invalid={invaUN}
								placeholder="Username"
								labelText="Username"
								size="xl"
								required
							/>
							<br />
							<div class="flex w-full">
								<PasswordInput
									bind:value={nputPW}
									invalid={invaPW}
									type="password"
									placeholder="Password"
									labelText="Password"
									tooltipPosition="left"
									size="xl"
									required
								/>
							</div>
						</div>
						<ButtonSet stacked>
							<Button on:click={handleLogin} icon={Login}>Log in</Button>
							<Button on:click={() => (resetPassMD00 = true)} kind="ghost" icon={HelpFilled}
								>Forgot password?</Button
							>
						</ButtonSet>
						<br />
					</div>
				</Form>
			</Content>
		</div>
	{/if}
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

<!-- toasts -->

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
<!-- reset password -->
<Modal
	on:click:button--primary={async () => {
		try {
			await updateUserData();
			resetPassMD02 = true;
		} catch (error) {
			resetPassMD02 = false;
		}
		resetPassMD01 = false;
	}}
	on:click:button--secondary={() => {
		resetPassMD00 = false;
	}}
	bind:open={resetPassMD00}
	on:open={() => ((resetPassMD01 = true), (resetPassMD02 = false))}
	modalHeading={resetPassMD01
		? 'Reset your password'
		: resetPassMD02
		? 'Password reset requested'
		: ''}
	size={resetPassMD02 ? 'sm' : !resetPassMD01 ? 'xs' : 'md'}
	passiveModal={resetPassMD02 || !resetPassMD01}
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
>
	{#if resetPassMD01}
		<br />
		<h6 class="flex flex-col">It appears you have forgotten your password.</h6>
		<br />
		<p>Provide your Account Code to notify your system adminstrator to reset your account.</p>
		<br />
		<div class="flex flex-col gap-3">
			<div class="flex flex-row">
				<TextInput
					bind:value={nputID}
					labelText="Account ID"
					placeholder="Enter your account ID"
					required
				/>
				<div class="pt-6">
					<Button
						on:click={loadUserData}
						size="field"
						kind="secondary"
						iconDescription="Search"
						icon={Search}
						tooltipPosition="left">Search</Button
					>
				</div>
			</div>
			<div class="flex flex-col gap-3 lg:flex-row">
				<TextInput
					bind:value={userLN}
					readonly
					labelText="Last Name"
					placeholder="Your last name"
					required
				/>
				<TextInput
					bind:value={userFN}
					readonly
					labelText="First Name"
					placeholder="Your first name"
					required
				/>
				<TextInput
					bind:value={userMN}
					readonly
					labelText="Middle Name"
					placeholder="Your middle name"
					required
				/>
			</div>
		</div>
	{:else if resetPassMD02}
		<h5>A notification to reset your account has been sent to your System Administrator.</h5>
		<br />
		<h5 class="italic">Temporary Password:</h5>
		<h3>csjd.reset123</h3>
		<br />
		<p class="italic">
			Using the temporary password, try logging in to your account within 1-2 days from resetting
			your password. If the temporary password does not work within that period, contact your system
			administrator for a follow-up reset.
		</p>
	{:else if !resetPassMD02}
		<br />
		<p>Error resetting password. Please try again.</p>
	{/if}
</Modal>
<Modal bind:open={inactvAccMD00} modalHeading="Inactive Account" size="xs" passiveModal>
	<br />
	<h5>Your account is not yet activated. Enroll to activate / reactivate your account.</h5>
	<br />
	<p class="italic">
		To ensure system efficiency, student accounts get reset every semester. You must first enroll to
		the current semester to regain access to your account.
	</p>
</Modal>

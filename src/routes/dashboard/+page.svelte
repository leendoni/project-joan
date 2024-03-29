<script>
	// #region imports
	// svelte
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	// components
	import {
		Button,
		ButtonSet,
		ComboBox,
		Content,
		Header,
		HeaderUtilities,
		InlineNotification,
		Modal,
		PasswordInput,
		ProgressBar,
		SideNav,
		SideNavDivider,
		SideNavItems,
		SideNavLink,
		SideNavMenu,
		TextArea,
		TextInput,
		Tile,
		ToastNotification
	} from 'carbon-components-svelte';
	// icons
	import {
		Asleep,
		Book,
		Box,
		Calendar,
		CalendarSettings,
		Catalog,
		CatalogPublish,
		Categories,
		ContainerSoftware,
		Dashboard,
		Debug,
		Edit,
		Education,
		EventSchedule,
		Events,
		GroupObjectsNew,
		HardwareSecurityModule,
		Information,
		Logout,
		Money,
		Notebook,
		NotebookReference,
		Partnership,
		Recycle,
		Report,
		Save,
		Settings,
		SettingsAdjust,
		Stethoscope,
		TrashCan,
		UserSponsor,
		Wallet
	} from 'carbon-icons-svelte';
	// pictograms
	// firebase
	import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
	import { db } from '../../firebase';
	// for password hashing
	import bcrypt from 'bcryptjs';
	// #endregion
	// #region database values
	let pageID = '/dashboard';
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
		userST = false,
		userUN = '',
		userPW = '',
		userAY = '',
		userSM = '',
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
	// post data
	let postID = '',
		postBY = '',
		postTP = '',
		postCL = '',
		postTT = '',
		postDC = '',
		postSD = '',
		postED = '',
		postAY = '';
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
	// sidebar
	let sideBR = false;
	// password
	let editAC = false;
	// modals
	let reportBugMD00 = false, // open
		reportBugMD01 = false, // default
		reportBugMD02 = false; // success
	let accountSTMD00 = false, // open
		accountSTMD01 = false, // default
		accountSTMD02 = false; // success
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

	async function getUserData() {
		const q = query(getUsers, where('userID', '==', loclID));
		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			// No records found for the provided reference code
			console.log('getUserData: Empty records.');
			return null;
		}

		const userData = snapshot.docs[0].data();
		const pass = await bcrypt.compare(userPW, userData.userPW);
		userPW = pass;

		return snapshot.docs[0].data();
	}

	async function loadUserData() {
		console.log('load');
		const data = await getUserData(); // convert to string or it wont load

		if (data) {
			userID = data.userID;
			userCL = data.userCL;
			userST = data.userST;
			userUN = data.userUN;
			userPW = data.userPW;
			userAY = data.userAY;
			userSM = data.userSM;
			userYR = data.userYR;
			userSC = data.userSC;
			userLR = data.userLR;
			userLN = data.userLN;
			userFN = data.userFN;
			userMN = data.userMN;
			userSF = data.userSF;
			userSX = data.userSX;
			userAD = data.userAD;
			userMA = data.userMA;
			userFA = data.userFA;
			userGA = data.userGA;
			userCP = data.userCP;
			userCR = data.userCR;
			(userCN = data.userCN), (userEC = data.userEC);
		} else {
			userID = '';
			userCL = '';
			(userST = false), (userUN = '');
			userPW = '';
			userAY = '';
			userSM = '';
			userYR = '';
			userSC = '';
			userLR = '';
			userLN = '';
			userFN = '';
			userMN = '';
			userSF = '';
			userSX = '';
			userAD = '';
			userMA = '';
			userFA = '';
			userGA = '';
			userCP = '';
			userCR = '';
			(userCN = 0), (userEC = 0);
		}
	}

	async function createUserPW(userPW) {
		const salt = await bcrypt.genSalt(10); // Generate a salt
		const hash = await bcrypt.hash(userPW, salt); // Hash the password
		return hash;
	}

	async function updateUserData() {
		let updatedData;

		if (loclCL == 'student') {
			updatedData = {
				userID: userID,
				userCL: userCL,
				userST: userST,
				userUN: userUN,
				userLR: userLR,
				userLN: userLN,
				userFN: userFN,
				userMN: userMN,
				userSX: userSX,
				userAD: userAD,
				userMA: userMA,
				userFA: userFA,
				userCN: userCN,
				userCR: userCR,
				userCP: userCP,
				userEC: userEC
			};
		} else {
			updatedData = {
				userID: userID,
				userCL: userCL,
				userST: userST,
				userUN: userUN,
				userLN: userLN,
				userFN: userFN,
				userMN: userMN,
				userSX: userSX,
				userAD: userAD,
				userCP: userCP,
				userCR: userCR,
				userCN: userCN,
				userEC: userEC
			};
		}

		const q = query(getUsers, where('userID', '==', loclID));
		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			console.error('No records found for the selected reference code.');
			return;
		}

		const docId = snapshot.docs[0].id;
		const docRef = doc(getSchoolID, 'users', docId);

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
			progTX = 'Connecting...';
			await getDocs(getUsers);
			console.log('Connected.');

			dbConn = true;

			loclID = localStorage.getItem('userID');
			loclCL = localStorage.getItem('userCL');
			loclFN = localStorage.getItem('userFN');

			headTX = 'Select a module.';
			descTX = 'On the sidebar, choose the module that you want to work on.';
		} catch (error) {
			console.error('Failed. :', error);
			dbConn = false;
		}
	});
</script>

<Header company="Project" platformName="JOAN" href="/home">
	<div class="text-white hidden lg:flex">Dashboard</div>
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
					kind="danger"
					icon={Logout}
				/>
			</div>
		</div>
	</HeaderUtilities>
</Header>

{#if dbConn}
	<SideNav bind:isOpen={sideBR} rail>
		{#if loclCL === 'god'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={Debug} href="/bugs" text="Reported Bugs" />
				<SideNavDivider />
				<SideNavMenu icon={SettingsAdjust} text="Management Modules">
					<SideNavLink href="/administrator/users" text="User Management" />
					<SideNavLink href="/administrator/sections" text="Section Management" />
					<SideNavLink href="/administrator/subjects" text="Subject Management" />
					<SideNavLink href="/administrator/schedules" text="Schedule Management" />
					<SideNavLink href="/administrator/bulletin" text="Bulletin Management" />
				</SideNavMenu>
				<SideNavMenu icon={Education} text="Academic Modules">
					<SideNavLink href="/academic/admission" text="Admissions" />
					<SideNavLink href="/academic/enrollment" text="Enrolments" />
					<SideNavLink href="/academic/sections" text="Sections" />
					<SideNavLink href="/academic/subjects" text="Subjects" />
					<SideNavLink href="/academic/gradebook" text="Gradebook" />
					<hr />
					<SideNavLink href="/guidance/records" text="Guidance Records" />
					<SideNavLink href="/guidance/defaults" text="Guidance Settings" />
				</SideNavMenu>
				<SideNavMenu icon={Money} text="Financial Modules">
					<SideNavLink href="/finance/transact" text="Financial Transactions" />
					<SideNavLink href="/finance/defaults" text="Financial Settings" />
				</SideNavMenu>
				<SideNavMenu icon={ContainerSoftware} text="Miscellaneous Modules">
					<SideNavLink href="/library" text="Library Management" />
					<SideNavLink href="/health" text="Health Records" />
				</SideNavMenu>
				<SideNavDivider />
				<SideNavLink icon={Information} href="/about" text="System Information" />
				<SideNavLink icon={Report} href="/reports" text="System Reports" />
				<SideNavLink icon={Settings} href="/defaults" text="System Settings" />
				<SideNavDivider />
				<SideNavMenu icon={Box} text="Archives">
					<SideNavLink href="/archives/system" text="System Archives" />
					<SideNavLink href="/archives/student" text="Student Archives" />
					<SideNavLink href="/archives/employee" text="Employee Archives" />
				</SideNavMenu>
				<SideNavDivider />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
			</SideNavItems>
		{:else if loclCL === 'administrator'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={Events} href="/administrator/users" text="User Management" />
				<SideNavLink
					icon={NotebookReference}
					href="/administrator/subjects"
					text="Subject Management"
				/>
				<SideNavLink icon={Categories} href="/administrator/subjects" text="Subject Management" />
				<SideNavLink
					icon={CalendarSettings}
					href="/administrator/schedules"
					text="Schedule Management"
				/>
				<SideNavLink
					icon={CatalogPublish}
					href="/administrator/bulletin"
					text="Bulletin Management"
				/>
				<SideNavDivider />
				<SideNavLink icon={Information} href="/about" text="System Information" />
				<SideNavLink icon={Report} href="/reports" text="System Reports" />
				<SideNavLink icon={Settings} href="/defaults" text="System Settings" />
				<SideNavDivider />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
				<SideNavDivider />
				<SideNavMenu icon={Box} text="Archives">
					<SideNavLink href="/archives/system" text="System Archives" />
					<SideNavLink href="/archives/student" text="Student Archives" />
					<SideNavLink href="/archives/employee" text="Employee Archives" />
				</SideNavMenu>
			</SideNavItems>
		{:else if loclCL === 'admission'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={GroupObjectsNew} href="/academic/admission" text="Admissions" />
				<SideNavLink icon={Notebook} href="/academic/subjects" text="Subjects" />
			</SideNavItems>
		{:else if loclCL === 'registrar'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={Education} href="/academic/enrollment" text="Enrolments" />
				<SideNavLink icon={Categories} href="/academic/sections" text="Sections" />
				<SideNavLink icon={Notebook} href="/academic/subjects" text="Subjects" />
				<SideNavLink icon={NotebookReference} href="/academic/gradebook" text="Gradebook" />
				<SideNavDivider />
				<SideNavLink icon={Box} href="/archives/student" text="Student Archives" />
			</SideNavItems>
		{:else if loclCL === 'cashier'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={Money} href="/finance/transact" text="Financial Transactions" />
				<SideNavLink icon={Wallet} href="/finance/defaults" text="Financial Settings" />
			</SideNavItems>
		{:else if loclCL === 'guidance'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={UserSponsor} href="/guidance/records" text="Guidance Records" />
				<SideNavLink icon={Partnership} href="/guidance/defaults" text="Guidance Settings" />
				<SideNavDivider />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
			</SideNavItems>
		{:else if loclCL === 'faculty'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={Notebook} href="/academic/subjects" text="Subjects" />
				<SideNavLink icon={NotebookReference} href="/academic/gradebook" text="Gradebook" />
				<SideNavDivider />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
			</SideNavItems>
		{:else if loclCL === 'librarian'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={Book} href="/library" text="Library Management" />
			</SideNavItems>
		{:else if loclCL === 'nurse'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={Stethoscope} href="/health" text="Health Records" />
			</SideNavItems>
		{:else if loclCL === 'student'}
			<SideNavItems>
				<SideNavLink isSelected icon={Dashboard} href="/dashboard" text="Dashboard" />
				<SideNavDivider />
				<SideNavLink icon={Calendar} href="/student/schedules" text="Class Schedules" />
				<SideNavLink icon={Catalog} href="/student/grades" text="Subject Grades" />
				<SideNavLink icon={Money} href="/student/transactions" text="Balance & Transactions" />
			</SideNavItems>
		{:else if loclCL === 'employee'}
			<SideNavItems />
		{:else}
			<!-- return to login if no stored class -->
			{goto('/login')}
		{/if}
	</SideNav>

	<div class="flex flex-col h-screen pl-12 pt-12">
		<Content>
			<div class="flex flex-wrap w-full gap-3">
				<div class="flex flex-col w-full lg:flex-row gap-3">
					<div class="flex flex-wrap w-full lg:w-2/3 gap-3">
						<div class="w-full">
							<div class="flex items-center justify-between h-8 pl-3 bg-stone-900">
								<h6 class="text-white">Campus Bulletin</h6>
								<Button
									kind="secondary"
									size="small"
									icon={Recycle}
									iconDescription="Reload"
									tooltipPosition="left"
								/>
							</div>
							<Tile class="h-auto">
								<div class="flex flex-wrap">
									<!-- announcement block -->
									<div class="flex flex-col p-3 gap-3 w-full h-auto lg:w-1/3">
										<div class="h-1 bg-red-500" />
										<div class="flex flex-col w-full">
											<p class="italic text-sm"><strong>Important Announcement</strong></p>
											<p class="text-lg">Suspension of Classes</p>
											<p class="italic text-xs">by: Admin Arcy</p>
										</div>
										<hr />
										<p class="inline-flex flex-col text-sm whitespace-normal">
											Due to inclement weather, classes are suspended for Monday, 09 October 2023.
											Classes will resume on Tuesday if the weather permits.
										</p>
									</div>
									<!-- announcement block -->
									<div class="flex flex-col p-3 gap-3 w-full h-auto lg:w-1/3">
										<div class="h-1 bg-amber-500" />
										<div class="flex flex-col w-full">
											<p class="italic text-sm"><strong>Announcement</strong></p>
											<p class="text-lg">Filing of Candidacy</p>
											<p class="italic text-xs">by: Admin Arcy</p>
										</div>
										<hr />
										<p class="inline-flex flex-col text-sm whitespace-normal">
											The filing for certificates of candidacy for the upcoming SSG elections are
											open starting today, 15 November 2023 until 31 November 2023. Students may
											file their forms at the Office of the SSG Adviser.
										</p>
									</div>
									<!-- announcement block -->
									<div class="flex flex-col p-3 gap-3 w-full h-auto lg:w-1/3">
										<div class="h-1 bg-sky-500" />
										<div class="flex flex-col w-full">
											<p class="italic text-sm"><strong>Upcoming Event</strong></p>
											<p class="text-lg">SSG Elections</p>
											<p class="italic text-xs">by: Admin Arcy</p>
										</div>
										<hr />
										<p class="inline-flex flex-col text-sm whitespace-normal">
											The Elections for Supreme Student Council will be held on 05 December 2023.
											All aspiring candidates are encouraged to file their certificates of candidacy
											as early as possible.
										</p>
									</div>
								</div>
							</Tile>
						</div>
					</div>
					<div class="flex flex-col gap-3 w-full lg:w-1/3">
						<div class="w-full overflow-y-auto">
							<div class="flex items-center justify-between h-8 pl-3 bg-stone-900">
								<h6 class="text-white">Notifications</h6>
								<Button
									kind="secondary"
									size="small"
									icon={Edit}
									iconDescription="Edit"
									tooltipPosition="left"
								/>
							</div>
							<Tile class="h-auto">
								<div class="flex flex-col w-full">
									<InlineNotification
										hideCloseButton
										kind="warning"
										title="System Notice:"
										subtitle="This application is still under development. Some features might not work as expected."
									/>
									<InlineNotification
										hideCloseButton
										kind="info-square"
										title="Gradebook Open"
										subtitle="You can now post your students' grades on the Gradebook."
									/>
								</div>
							</Tile>
						</div>
					</div>
				</div>
				<div class="flex flex-col w-full lg:flex-row gap-3">
					<div class="flex flex-wrap w-full lg:w-1/2 gap-3">
						<div class="w-full">
							<div class="flex items-center justify-between h-8 pl-3 bg-stone-900">
								<h6 class="text-white">User Information</h6>
								<div class="flex">
									<Button
										kind="secondary"
										size="small"
										icon={Edit}
										iconDescription="Edit"
										tooltipPosition="left"
									/>
									<Button
										kind="secondary"
										size="small"
										icon={Save}
										iconDescription="Save Changes"
										tooltipPosition="left"
									/>
								</div>
							</div>
							<Tile class="flex flex-col w-full lg:flex-row">
								<div class="flex flex-col w-full gap-3">
									<div class="flex flex-col gap-3">
										<div class="flex flex-col lg:flex-row gap-3">
											<TextInput
												bind:value={userLN}
												labelText="Last Name"
												placeholder="Your last name"
												readonly
											/>
											<TextInput
												bind:value={userFN}
												labelText="First Name"
												placeholder="Your first name"
												readonly
											/>
											<TextInput
												bind:value={userMN}
												labelText="Middle Name"
												placeholder="Your middle name"
												readonly
											/>
										</div>
										<div class="flex flex-col lg:flex-row gap-3">
											<TextInput
												bind:value={userSF}
												labelText="Suffix (if any)"
												placeholder="Sr., Jr., III., etc."
												readonly
											/>
											<TextInput
												bind:value={userSX}
												labelText="Employee Gender"
												placeholder="Gender"
												readonly
											/>
										</div>
										<TextInput
											bind:value={userAD}
											labelText="Employee Address"
											placeholder="Your complete address"
											readonly
										/>
										<div class="flex flex-col lg:flex-row gap-3">
											<TextInput
												bind:value={userCN}
												labelText="Employee Contact Number"
												placeholder="09876543210"
												readonly
											/>
											<TextInput
												bind:value={userEC}
												labelText="Emergency Contact Number"
												placeholder="09876543210"
												readonly
											/>
										</div>
										<div class="flex flex-col lg:flex-row gap-3">
											<TextInput
												bind:value={userCP}
												labelText="Contact Person"
												placeholder="Your contact person"
												readonly
											/>
											<TextInput
												bind:value={userCR}
												labelText="Relation (optional)"
												placeholder="Relation to contact person"
												readonly
											/>
										</div>
									</div>
								</div>
							</Tile>
						</div>
					</div>
					<div class="flex flex-col gap-3 w-full lg:w-1/2">
						<div class="w-full overflow-y-auto">
							<div class="flex items-center justify-between h-8 pl-3 bg-stone-900">
								<h6 class="text-white">Account Options</h6>
							</div>
							<Tile class="h-auto">
								<div class="flex flex-col gap-3">
									<div class="flex items-center justify-between h-8">
										<h6>Change your password</h6>
										<div class="flex">
											<Button size="small" tooltipPosition="left" iconDescription="Edit password" icon={HardwareSecurityModule} />
											<Button size="small" tooltipPosition="left" iconDescription="Save password" icon={Save} />
										</div>
									</div>
									<div class="flex flex-col gap-3 lg:flex-row">
										<PasswordInput
											bind:value={userPW}
											labelText="Password"
											placeholder="Enter password"
											tooltipPosition="left"
										/>
										<PasswordInput
											bind:value={userPW}
											labelText="Confirm Password"
											placeholder="Confirm password"
											tooltipPosition="left"
										/>
									</div>
									<hr />
									<div class="flex items-center justify-between h-8">
										<h6>Danger Zone</h6>
									</div>
									<Button disabled kind="danger" icon={TrashCan}>Delete Account</Button>
								</div>
							</Tile>
						</div>
					</div>
				</div>
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
	primaryButtonText="Submit"
	size={reportBugMD02 ? 'xs' : !reportBugMD01 ? 'xs' : 'md'}
	passiveModal={reportBugMD02 || !reportBugMD01}
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

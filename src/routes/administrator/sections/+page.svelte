<script>
	// #region imports
	// svelte
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	// components
	import {
		Button,
		ComboBox,
		Content,
		DataTable,
		Header,
		HeaderUtilities,
		Link,
		Modal,
		Pagination,
		PasswordInput,
		ProgressBar,
		SideNav,
		SideNavDivider,
		SideNavItems,
		SideNavLink,
		SideNavMenu,
		TextArea,
		TextInput,
		Toolbar,
		ToolbarContent,
		ToolbarSearch
	} from 'carbon-components-svelte';
	// icons
	import {
		AddAlt,
		Asleep,
		Book,
		Box,
		Bullhorn,
		Calendar,
		Catalog,
		Categories,
		ContainerSoftware,
		Debug,
		Edit,
		Education,
		EventSchedule,
		Export,
		Finance,
		Home,
		Information,
		Logout,
		Money,
		Notebook,
		NotebookReference,
		Notification,
		Partnership,
		Recycle,
		Save,
		Settings,
		SettingsAdjust,
		Stethoscope,
		TrashCan,
		UserSettings,
		UserSponsor,
		Wallet
	} from 'carbon-icons-svelte';
	// pictograms
	// firebase
	import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
	import { db } from '../../../firebase';
	// for password hashing
	// #endregion
	// #region database values
	let pageID = '/administrator/sections';
	let dbConn = false;
	// database values
	const getSchoolID = doc(db, 'schools', '0303001');
	const getUsers = collection(getSchoolID, 'users');
	// user data
	let userID = '',
		userCL = '',
		userST = '',
		userUN = '',
		userPW = '',
		userLN = '',
		userFN = '',
		userMN = '';
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

	function goHome() {
		goto('/home');
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
	// #region page logic
	let edit = false;

	let sectHeader = [
		{ key: 'sectAY', value: 'Academic Year' },
		{ key: 'sectID', value: 'Section ID' },
		{ key: 'sectYR', value: 'Section Year' },
		{ key: 'sectNM', value: 'Section Name' },
		{ key: 'sectTS', value: 'Total Students' },
		{ key: 'sectST', value: 'Section Status' }
	];

	let sectRow = [];
	let sectSize = 10;
	let sectPage = 1;

	let selectedRowIds = []; // get toggled radio

	let listHeader = [
		{ key: 'userID', value: 'Account ID' },
		{ key: 'userLN', value: 'Last Name' },
		{ key: 'userFN', value: 'First Name' },
		{ key: 'userMN', value: 'Middle Name' },
		{ key: 'userSX', value: 'Gender' }
	];

	let listRow = [];
	let listSize = 10;
	let listPage = 1;
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

			headTX = 'Select a module.';
			descTX = 'On the sidebar, choose the module that you want to work on.';
		} catch (error) {
			console.error('Failed. :', error);
			dbConn = false;
		}
	});
</script>

<Header company="Project" platformName="JOAN" href="/home">
	<div class="text-white hidden lg:flex">Section Management</div>
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
					tooltipPosition="left"
					iconDescription="Notifications"
					kind="secondary"
					icon={Notification}
				/>
				<Button
					on:click={goHome}
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
				<SideNavLink
					icon={UserSettings}
					on:click={() => (accountSTMD00 = true)}
					text="Account Information"
				/>
				<SideNavDivider />
				<SideNavLink icon={Debug} href="/bugs" text="Reported Bugs" />
				<SideNavDivider />
				<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
				<SideNavLink icon={Finance} href="/school" text="School Information" />
				<SideNavDivider />
				<SideNavMenu expanded icon={SettingsAdjust} text="Management Modules">
					<SideNavLink href="/administrator/users" text="User Management" />
					<SideNavLink isSelected href="/administrator/sections" text="Section Management" />
					<SideNavLink href="/administrator/subjects" text="Subject Management" />
					<SideNavLink href="/administrator/schedules" text="Schedule Management" />
					<SideNavLink href="/administrator/bulletin" text="Bulletin Management" />
				</SideNavMenu>
				<SideNavMenu icon={Education} text="Academic Modules">
					<SideNavLink href="/academic/sections" text="Sections" />
					<SideNavLink href="/academic/students" text="Students" />
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
					<SideNavLink href="/library" text="Library" />
					<SideNavLink href="/health" text="Health Records" />
				</SideNavMenu>
				<SideNavDivider />
				<SideNavLink icon={Information} href="/about" text="System Information" />
				<SideNavLink icon={Settings} href="/defaults" text="System Settings" />
				<SideNavDivider />
				<SideNavLink icon={Box} href="/archives" text="System Archives" />
			</SideNavItems>
		{:else if loclCL === 'admin'}
			<SideNavItems>
				<SideNavItems>
					<SideNavLink
						icon={UserSettings}
						on:click={() => (accountSTMD00 = true)}
						text="Account Information"
					/>
					<SideNavDivider />
					<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
					<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
					<SideNavLink icon={Finance} href="/school" text="School Information" />
					<SideNavDivider />
					<SideNavMenu expanded icon={SettingsAdjust} text="Management Modules">
						<SideNavLink href="/administrator/users" text="User Management" />
						<SideNavLink isSelected href="/administrator/sections" text="Section Management" />
						<SideNavLink href="/administrator/subjects" text="Subject Management" />
						<SideNavLink href="/administrator/schedules" text="Schedule Management" />
						<SideNavLink href="/administrator/bulletin" text="Bulletin Management" />
					</SideNavMenu>
					<SideNavMenu icon={Education} text="Academic Modules">
						<SideNavLink href="/academic/sections" text="Sections" />
						<SideNavLink href="/academic/students" text="Students" />
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
						<SideNavLink href="/library" text="Library" />
						<SideNavLink href="/health" text="Health Records" />
					</SideNavMenu>
					<SideNavDivider />
					<SideNavLink icon={Information} href="/about" text="System Information" />
					<SideNavLink icon={Settings} href="/defaults" text="System Settings" />
					<SideNavDivider />
					<SideNavLink icon={Box} href="/archives" text="System Archives" />
				</SideNavItems>
			</SideNavItems>
		{:else if loclCL === 'registrar'}
			<SideNavItems>
				<SideNavLink
					icon={UserSettings}
					on:click={() => (accountSTMD00 = true)}
					text="Account Information"
				/>
				<SideNavDivider />
				<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
				<SideNavLink icon={Finance} href="/school" text="School Information" />
				<SideNavDivider />
				<SideNavLink icon={Categories} href="/academic/sections" text="Sections" />
				<SideNavLink icon={Education} href="/academic/students" text="Students" />
				<SideNavLink icon={Notebook} href="/academic/subjects" text="Subjects" />
				<SideNavLink icon={NotebookReference} href="/academic/gradebook" text="Gradebook" />
			</SideNavItems>
		{:else if loclCL === 'cashier'}
			<SideNavItems>
				<SideNavLink
					icon={UserSettings}
					on:click={() => (accountSTMD00 = true)}
					text="Account Information"
				/>
				<SideNavDivider />
				<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
				<SideNavLink icon={Finance} href="/school" text="School Information" />
				<SideNavDivider />
				<SideNavLink icon={Money} href="/finance/transact" text="Financial Transactions" />
				<SideNavLink icon={Wallet} href="/finance/defaults" text="Financial Settings" />
			</SideNavItems>
		{:else if loclCL === 'guidance'}
			<SideNavItems>
				<SideNavLink
					icon={UserSettings}
					on:click={() => (accountSTMD00 = true)}
					text="Account Information"
				/>
				<SideNavDivider />
				<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
				<SideNavLink icon={Finance} href="/school" text="School Information" />
				<SideNavDivider />
				<SideNavLink icon={UserSponsor} href="/guidance/records" text="Guidance Records" />
				<SideNavLink icon={Partnership} href="/guidance/defaults" text="Guidance Settings" />
			</SideNavItems>
		{:else if loclCL === 'faculty'}
			<SideNavItems>
				<SideNavLink
					icon={UserSettings}
					on:click={() => (accountSTMD00 = true)}
					text="Account Information"
				/>
				<SideNavDivider />
				<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
				<SideNavLink icon={EventSchedule} href="/schedules" text="Class Schedules" />
				<SideNavLink icon={Finance} href="/school" text="School Information" />
				<SideNavDivider />
				<SideNavLink icon={Notebook} href="/academic/subjects" text="Subjects" />
				<SideNavLink icon={NotebookReference} href="/academic/gradebook" text="Gradebook" />
			</SideNavItems>
		{:else if loclCL === 'librarian'}
			<SideNavItems>
				<SideNavLink
					icon={UserSettings}
					on:click={() => (accountSTMD00 = true)}
					text="Account Information"
				/>
				<SideNavDivider />
				<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
				<SideNavLink icon={Finance} href="/school" text="School Information" />
				<SideNavDivider />
				<SideNavLink icon={Book} href="/library" text="Library" />
			</SideNavItems>
		{:else if loclCL === 'nurse'}
			<SideNavItems>
				<SideNavLink
					icon={UserSettings}
					on:click={() => (accountSTMD00 = true)}
					text="Account Information"
				/>
				<SideNavDivider />
				<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
				<SideNavLink icon={Finance} href="/school" text="School Information" />
				<SideNavDivider />
				<SideNavLink icon={Stethoscope} href="/health" text="Health Records" />
			</SideNavItems>
		{:else if loclCL === 'student'}
			<SideNavItems>
				<SideNavLink
					icon={UserSettings}
					on:click={() => (accountSTMD00 = true)}
					text="Account Information"
				/>
				<SideNavDivider />
				<SideNavLink icon={Bullhorn} href="/bulletin" text="Campus Bulletin" />
				<SideNavLink icon={Finance} href="/school" text="School Information" />
				<SideNavDivider />
				<SideNavLink icon={Calendar} href="/student/schedules" text="Class Schedules" />
				<SideNavLink icon={Catalog} href="/student/grades" text="Subject Grades" />
				<SideNavLink icon={Money} href="/student/transactions" text="Balance & Transactions" />
			</SideNavItems>
		{:else}
			<!-- return to login if no stored class -->
			{goto('/login')}
		{/if}
	</SideNav>

	{#if loclCL === 'god' || loclCL === 'admin'}
		<Content>
			<div class="flex md:hidden lg:hidden">
				<p>
					If you are seeing this message, your screen is too small.<br /><br />Change to a device
					with a larger screen or rotate your device to view the master table.
				</p>
			</div>
			<div class="hidden md:flex lg:flex gap-2">
				<div class="w-screen">
					<DataTable
						radio
						zebra
						sortable
						size="short"
						headers={sectHeader}
						rows={sectRow}
						page={sectPage}
						pageSize={sectSize}
						bind:selectedRowIds
					>
						<Toolbar>
							<ToolbarContent>
								<ToolbarSearch shouldFilterRows />
								<Button
									kind="ghost"
									icon={Recycle}
									iconDescription="Reload"
									tooltipPosition="left"
								/>
								<Button
									kind="ghost"
									icon={AddAlt}
									iconDescription="Create New"
									tooltipPosition="left"
								/>
								<Button
									kind="tertiary"
									icon={Edit}
									iconDescription="Edit Selected"
									tooltipPosition="left"
								/>
								<Button
									kind="primary"
									icon={Save}
									iconDescription="Save Changes"
									tooltipPosition="left"
									bind:disabled={edit}
								/>
								<Button
									kind="danger"
									icon={TrashCan}
									iconDescription="Delete Selected"
									tooltipPosition="left"
									bind:disabled={edit}
								/>
							</ToolbarContent>
						</Toolbar>
					</DataTable>
					<Pagination
						bind:pageSize={sectSize}
						bind:page={sectPage}
						totalItems={sectRow.length}
						pageSizeInputDisabled
					/>
					<!-- <Pagination {rows} /> -->
				</div>
			</div>
			<br />
			<hr />
			<br />
			<div class="w-full">
				<div class="flex flex-col lg:flex-row">
					<div class="w-full lg:w-1/4 lg:self-center">
						<h6 class="underline">Section Information</h6>
					</div>
					<br />
					<div class="flex flex-col w-full gap-4">
						<div class="flex flex-col w-full lg:flex-row gap-2">
							<ComboBox
								titleText="Academic Year"
								placeholder="Subject academic year"
								items={[
									{ id: '0', text: '2023-2024' },
									{ id: '1', text: '2024-2025' },
									{ id: '2', text: '2025-2026' },
									{ id: '3', text: '2026-2027' },
									{ id: '4', text: '2027-2028' },
									{ id: '5', text: '2028-2029' },
									{ id: '6', text: '2029-2030' },
									{ id: '7', text: '2030-2031' },
									{ id: '8', text: '2031-2032' },
									{ id: '9', text: '2032-2033' },
									{ id: '10', text: '2033-2034' },
									{ id: '11', text: '2034-2035' },
									{ id: '12', text: '2035-2036' },
									{ id: '13', text: '2036-2037' },
									{ id: '14', text: '2037-2038' },
									{ id: '15', text: '2038-2039' },
									{ id: '16', text: '2039-2040' },
									{ id: '17', text: '2040-2041' },
									{ id: '18', text: '2041-2042' },
									{ id: '19', text: '2042-2043' },
									{ id: '20', text: '2043-2044' },
									{ id: '21', text: '2044-2045' },
									{ id: '22', text: '2045-2046' },
									{ id: '23', text: '2046-2047' },
									{ id: '24', text: '2047-2048' }
								]}
								disabled={!edit}
							/>
							<TextInput labelText="Section ID" placeholder="Section ID here" readonly />
							<TextInput
								labelText="Section Name"
								placeholder="Section name here"
								readonly={!edit}
							/>
							<ComboBox
								titleText="Section Status"
								placeholder="Section status"
								items={[
									{ id: '0', text: 'ACTIVE' },
									{ id: '1', text: 'INACTIVE' }
								]}
								disabled={!edit}
							/>
						</div>
						<div class="flex flex-col w-full lg:flex-row gap-2">
							<TextInput
								labelText="Total Male Students"
								placeholder="Total here"
								readonly={!edit}
							/>
							<TextInput
								labelText="Total Female Students"
								placeholder="Total here"
								readonly={!edit}
							/>
							<TextInput labelText="Total Students" placeholder="Total here" readonly={!edit} />
						</div>
						<ComboBox
							titleText="Section Adviser"
							placeholder="Select adviser"
							items={[
								{ id: '0', text: 'ACTIVE' },
								{ id: '1', text: 'INACTIVE' }
							]}
							disabled={!edit}
						/>
					</div>
				</div>
			</div>
			<br />
			<hr />
			<br />
			<div class="hidden md:flex lg:flex gap-2">
				<div class="w-screen">
					<DataTable
						zebra
						sortable
						size="short"
						headers={listHeader}
						rows={listRow}
						page={listPage}
						pageSize={listSize}
					>
						<Toolbar>
							<ToolbarContent>
								<ToolbarSearch shouldFilterRows />
								<Button
									kind="ghost"
									icon={Recycle}
									iconDescription="Reload"
									tooltipPosition="left"
								/>
								<Button
									kind="primary"
									icon={Export}
									iconDescription="Export Masterlist"
									tooltipPosition="left"
									bind:disabled={edit}
								/>
							</ToolbarContent>
						</Toolbar>
					</DataTable>
					<Pagination
						bind:pageSize={listSize}
						bind:page={listPage}
						totalItems={listRow.length}
						pageSizeInputDisabled
					/>
					<!-- <Pagination {rows} /> -->
				</div>
			</div>
		</Content>
	{:else}
		<div class="flex flex-col h-screen justify-center lg:flex-row pl-10">
			<!-- displayed on mobile -->
			<Content class="self-center">
				<h1>Access Unauthorized.</h1>
				<br />
				<p>
					Hello, <strong>{loclFN}</strong>. You are not allowed to access this module.
					<br />
					<Link href="/home">Return home.</Link>
				</p>
			</Content>
			<Content />
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
<!-- #region modals -->
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
<Modal
	bind:open={accountSTMD00}
	on:click:button--primary={() => (editAC = false)}
	on:click:button--primary={() => (accountSTMD01 = true)}
	on:click:button--secondary={() => (editAC = true)}
	modalHeading="Account Information"
	primaryButtonText="Save"
	primaryButtonDisabled={!editAC}
	secondaryButtonText="Edit"
	hasScrollingContent
>
	<Content>
		<div class="flex flex-col lg:flex-row">
			<div class="w-full lg:w-1/4 lg:self-center">
				<h6 class="underline">Login Details</h6>
			</div>
			<br />
			<div class="flex flex-col w-full gap-4">
				<TextInput labelText="Account ID" placeholder="System-generated account ID" readonly />
				<TextInput labelText="Username" placeholder="System-generated username" readonly />
				<PasswordInput
					labelText="Password"
					placeholder="Your password"
					tooltipPosition="left"
					disabled={!editAC}
				/>
				<TextInput labelText="Current User Class" placeholder="Designated user-class" readonly />
			</div>
		</div>
		<br />
		<hr class="outline-black" />
		<br />
		{#if loclCL === 'student'}
			<div class="flex flex-col lg:flex-row">
				<div class="w-full lg:w-1/4 lg:self-center">
					<h6 class="underline">Student Information</h6>
				</div>
				<br />
				<div class="flex flex-col w-full">
					<div class="flex flex-col w-full gap-4">
						<TextInput labelText="Last Name" placeholder="Your last name" readonly={!editAC} />
						<TextInput labelText="First Name" placeholder="Your first name" readonly={!editAC} />
						<TextInput labelText="Middle Name" placeholder="Your middle name" readonly={!editAC} />
						<TextInput
							labelText="Suffix (if any)"
							placeholder="Sr., Jr., III., etc."
							readonly={!editAC}
						/>
						<TextInput
							labelText="Student Address"
							placeholder="Your complete address"
							readonly={!editAC}
						/>
					</div>
					<br />
					<div class="flex flex-col w-full lg:flex-row gap-4">
						<TextInput
							labelText="Student Contact Number"
							placeholder="Your contact number"
							readonly={!editAC}
						/>
						<TextInput
							labelText="Emergency Contact Number"
							placeholder="Your emergency contact number"
							readonly={!editAC}
						/>
					</div>
					<br />
					<div class="flex flex-col w-full gap-4">
						<TextInput
							labelText="Mother's Name"
							placeholder="Your mother's name"
							readonly={!editAC}
						/>
						<TextInput
							labelText="Father's Name"
							placeholder="Your father's name"
							readonly={!editAC}
						/>
						<TextInput
							labelText="Guardian's Name"
							placeholder="Your guardian's name"
							readonly={!editAC}
						/>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-col lg:flex-row">
				<div class="w-full lg:w-1/4 lg:self-center">
					<h6 class="underline">Personal Information</h6>
				</div>
				<br />
				<div class="flex flex-col w-full">
					<div class="flex flex-col w-full gap-4">
						<TextInput
							labelText="Last Name"
							placeholder="Enter your last name"
							readonly={!editAC}
						/>
						<TextInput
							labelText="First Name"
							placeholder="Enter your first name"
							readonly={!editAC}
						/>
						<TextInput
							labelText="Middle Name"
							placeholder="Enter your middle name"
							readonly={!editAC}
						/>
						<TextInput
							labelText="Suffix (if any)"
							placeholder="Sr., Jr., III., etc."
							readonly={!editAC}
						/>
						<TextInput
							labelText="Employee Address"
							placeholder="Enter your complete address"
							readonly={!editAC}
						/>
						<TextInput
							labelText="Employee Contact Number"
							placeholder="Your contact number"
							readonly={!editAC}
						/>
						<TextInput
							labelText="Emergency Contact Number"
							placeholder="Your emergency contact number"
							readonly={!editAC}
						/>
					</div>
					<br />
					<div class="flex flex-col w-full gap-4">
						<TextInput
							labelText="Contact Person"
							placeholder="Enter your contact person's name"
							readonly={!editAC}
						/>
						<TextInput
							labelText="Relation (optional)"
							placeholder="Your relationship to your contact person"
							readonly={!editAC}
						/>
					</div>
				</div>
			</div>
		{/if}
	</Content>
</Modal>
<Modal
	bind:open={accountSTMD01}
	on:close={() => (accountSTMD01 = false)}
	modalHeading="Account Details Changed"
	passiveModal
>
	Success
</Modal>
<!-- #endregion -->

<script>
	// #region imports
	// svelte
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	// components
	import {
		Button,
		Header,
		HeaderUtilities,
		Modal,
		SideNav,
		SideNavDivider,
		SideNavItems,
		SideNavLink,
		TextArea,
		TextInput
	} from 'carbon-components-svelte';
	// icons
	import {
		AccessibilityColorFilled,
		Asleep,
		Bullhorn,
		Debug,
		EventSchedule,
		Help,
		Login,
		Network_4,
		Partnership,
		Quotes,
		UpdateNow
	} from 'carbon-icons-svelte';
	// pictograms
	// firebase
	import { db } from '../firebase';
	import { addDoc, collection } from 'firebase/firestore';
	import { page } from '$app/stores';
	// for password hashing
	// #endregion
	// #region database values
	let pageID = '/';
	let loclID,
		loclCL,
		loclFN,
		loclTM = 'white'; // "white" | "g10" | "g80" | "g90" | "g100"
	// bugreports
	let probID, probTT, probDC, probST;
	// #endregion
	// #region functional variables
	// sidebar
	let sideBR = false;
	// modals
	let reportBugMD00 = false,
		reportBugMD01 = false,
		reportBugMD02 = false;
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
	function handleLogin() {
		goto('/login');
	}
	// #endregion
	// #region for database
	function gener8ProbID() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < 6; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		probID = result;
	}
	async function reportProb(event) {
		if (probID === '' || probTT === '' || probDC === '') {
			reportBugMD03 = true;
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
	onMount(() => {
		loclTM = localStorage.getItem('loclTM'); // get stored theme on load
		document.documentElement.setAttribute('theme', loclTM); // set selected theme on load
	});
</script>

<Header company="Project" platformName="JOAN" href="/">
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
					on:click={handleLogin}
					tooltipPosition="left"
					iconDescription="Login"
					kind="primary"
					icon={Login}
				/>
			</div>
		</div>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={sideBR} rail>
	<SideNavItems>
		<SideNavLink icon={Help} href="/" text="What is Project JOAN?" />
		<SideNavLink icon={AccessibilityColorFilled} href="/" text="Who uses Project JOAN?" />
		<SideNavLink icon={Network_4} href="/" text="The Network" />
		<SideNavLink icon={Partnership} href="/" text="Partners" />
		<SideNavDivider />
		<SideNavLink icon={Bullhorn} href="/" text="Recent News" />
		<SideNavLink icon={UpdateNow} href="/" text="Updates and Bugfixes" />
		<SideNavDivider />
		<SideNavLink icon={Quotes} href="" text="Testimonials" />
		<SideNavLink icon={EventSchedule} href="" text="Schedule a Demo" />
	</SideNavItems>
</SideNav>

<div class="flex flex-col" />

<!-- toasts -->

<!-- modals -->
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
					on:change={gener8ProbID}
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

<!-- FINALIZED -->

<!-- #region scripts -->
<script>
	import About from '../blocks/landing/about.svelte';
	//#region components
	import {
		Button,
		Content,
		Header,
		HeaderUtilities,
		SkipToContent
	} from 'carbon-components-svelte';
	//#endregion
	//#region icons
	import { Login, WatsonHealthRegistration } from 'carbon-icons-svelte';
	//#endregion
	//#region pictograms
	//#endregion
	//#region variables
	let isSideNavOpen = false;
	//#endregion
</script>

<!-- #endregion -->

<!-- #region header -->
<Header company="Project" platformName="JOAN" bind:isSideNavOpen href="https://project-joan.cloud">
	<div class="text-white invisible lg:visible">for Colegio de San Juan de Dios Incorporated</div>
	<HeaderUtilities>
		<div class="flex">
			<div class="flex lg:hidden">
				<Button kind="secondary" icon={WatsonHealthRegistration} href="/preRegistration/"/>
				<Button kind="primary" icon={Login} />
			</div>
			<div class="hidden lg:flex">
				<Button kind="secondary" icon={WatsonHealthRegistration} href="/preRegistration/">Pre-Register</Button>
				<Button kind="primary" icon={Login}>Login</Button>
			</div>
		</div>
	</HeaderUtilities>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
</Header>
<!-- #endregion -->

<img id="#" class="object-cover h-96 w-full" src="images/assets/banner.jpg" alt="" />

<Content>
	<About />
</Content>
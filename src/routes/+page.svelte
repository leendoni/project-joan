<!-- FINALIZED -->

<!-- #region scripts -->
<script>
	import About from '../blocks/landing/about.svelte';
//#region components
	import {
		Button,
		Header,
		HeaderUtilities,
		SkipToContent
	} from 'carbon-components-svelte';
	//#endregion
	//#region icons
	import {
		Login
	} from 'carbon-icons-svelte';
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
		<Button icon={Login}>Login</Button>
	</HeaderUtilities>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
</Header>
<!-- #endregion -->

<!-- #region sidebar -->
<!-- <SideNav bind:isOpen={isSideNavOpen} rail>
	<SideNavItems>
		<SideNavLink id="aboutLink" icon={Help} href="#about" text="About CSJD" />
		<SideNavDivider />
		<SideNavLink icon={TableOfContents} href="#features" text="Features" />
		<SideNavLink icon={Api} href="#network" text="The Network" />
		<SideNavLink icon={EventSchedule} href="#demo" text="Schedule a Demo" />
		<SideNavLink icon={PhoneVoice} href="#contact" text="Contact Us" />
		<SideNavDivider />
		<SideNavLink icon={IbmWatsonKnowledgeCatalog} href="#news" text="News" />
	</SideNavItems>
</SideNav> -->
<!-- #endregion -->

<img id="#" class="object-cover h-96 w-full" src="images/assets/banner.jpg" alt="" />

<About />

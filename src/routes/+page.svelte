<!-- #region scripts -->
<script>
	import About from '../blocks/landing/about.svelte';
	import Contact from '../blocks/landing/contact.svelte';
	import Demo from '../blocks/landing/demo.svelte';
	import Features from '../blocks/landing/features.svelte';
	import Network from '../blocks/landing/network.svelte';
	import News from '../blocks/landing/news.svelte';
//#region components
	import {
		Content,
		Header,
		SideNav,
		SideNavDivider,
		SideNavItems,
		SideNavLink,
		SkipToContent
	} from 'carbon-components-svelte';
	//#endregion
	//#region icons
	import {
		Api,
		EventSchedule,
		Help,
		IbmWatsonKnowledgeCatalog,
		PhoneVoice,
		TableOfContents
	} from 'carbon-icons-svelte';
	//#endregion
	//#region pictograms
	//#endregion
	//#region variables
	let isSideNavOpen = false;
	let isLoginModalOpen = false;
	let isSupportModalOpen = false;
	//#endregion
</script>

<!-- #endregion -->

<!-- #region header -->
<Header company="Project" platformName="JOAN" bind:isSideNavOpen href="https://project-joan.cloud/">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
</Header>
<!-- #endregion -->

<!-- #region sidebar -->
<SideNav bind:isOpen={isSideNavOpen} rail>
	<SideNavItems>
		<SideNavLink id="aboutLink" icon={Help} href="#about" text="About JOAN" />
		<SideNavDivider />
		<SideNavLink icon={TableOfContents} href="#features" text="Features" />
		<SideNavLink icon={Api} href="#network" text="The Network" />
		<SideNavLink icon={EventSchedule} href="#demo" text="Schedule a Demo" />
		<SideNavLink icon={PhoneVoice} href="#contact" text="Contact Us" />
		<SideNavDivider />
		<SideNavLink icon={IbmWatsonKnowledgeCatalog} href="#news" text="News" />
	</SideNavItems>
</SideNav>
<!-- #endregion -->

<Content id="#" class="bg-neutral-800 h-96" />

<About />
<Features />
<Network />
<Demo />
<Contact />
<News />

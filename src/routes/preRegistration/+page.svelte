<script>
	import PreRegistration from '../../blocks/external/preRegistration.svelte';
	import {
		Button,
		Content,
		Header,
		HeaderUtilities,
		SkipToContent
	} from 'carbon-components-svelte';
	import { Login, PageFirst } from 'carbon-icons-svelte';
	//#region variables
	let isSideNavOpen = false;
	//#endregion
</script>

<Header company="Project" platformName="JOAN" bind:isSideNavOpen href="https://project-joan.cloud">
	<div class="text-white invisible lg:visible">for Colegio de San Juan de Dios Incorporated</div>
	<HeaderUtilities>
		<div class="flex">
			<div class="flex lg:hidden">
				<Button kind="secondary" icon={PageFirst} href="../" />
				<Button kind="primary" icon={Login} />
			</div>
			<div class="hidden lg:flex">
				<Button kind="secondary" icon={PageFirst} href="../" iconDescription="Return to Landing Page"></Button>
				<Button kind="primary" icon={Login}>Login</Button>
			</div>
		</div>
	</HeaderUtilities>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
</Header>

<Content id="#" class="bg-neutral-900 h-48 flex flex-wrap text-white place-items-bottom">
	<div class="my-20">
		<h1>Pre-Registration</h1>
	</div>
</Content>

<PreRegistration />

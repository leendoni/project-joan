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
				<Button kind="secondary" icon={PageFirst} href="../"/>
				<Button kind="primary" icon={Login} />
			</div>
			<div class="hidden lg:flex">
				<Button kind="secondary" icon={PageFirst} href="../">Back to Landing Page</Button>
				<Button kind="primary" icon={Login}>Login</Button>
			</div>
		</div>
	</HeaderUtilities>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
</Header>

<div class="h-96 w-full"></div>

<Content>
    <PreRegistration />
</Content>

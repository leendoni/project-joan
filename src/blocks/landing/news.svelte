<script>
	import { ClickableTile, Column, Content, Grid, Link, Row, Tag } from 'carbon-components-svelte';
</script>

<Content id="news">
	<Grid>
		<Row padding={true}>
			<Column sm={4} md={2}>
				<h5>Latest News</h5>
			</Column>
			<Column class="flex flex-wrap">
				<div class="w-full lg:w-1/2">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><img class="object-cover h-60 w-full" src="images/stocks/news1.jpg" alt="" /></div>
						<br />
						<Tag type="green" size="sm">News</Tag>
						<div><h4>Project JOAN for SRNTS goes live</h4></div>
						<br />
						<p>
							San Rafael National Trade School joins the JOAN family this week as the final
							preparations for implementing Project JOAN is completed.
							<Link href="/">Read more...</Link>
						</p>
						<br />
					</ClickableTile>
				</div>
				<div class="w-full lg:w-1/2">
					<ClickableTile
						href="/"
						on:click={(e) => {
							e.preventDefault();
							// custom behavior
						}}
					>
						<div><img class="object-cover h-60 w-full" src="images/stocks/news4.jpg" alt="" /></div>
						<br />
						<Tag type="red" size="sm">Updates</Tag>
						<div><h4>Changes in v0.69.420</h4></div>
						<br />
						<p>
							Version 0.69.420 implements several changes in the workflow of certain areas of JOAN.
							View the full changelog and other notices
							<Link href="/">here.</Link>
						</p>
						<br />
					</ClickableTile>
				</div>
			</Column>
		</Row>
	</Grid>
</Content>

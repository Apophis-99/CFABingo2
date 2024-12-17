<script lang="ts">
	import Theme, {AllThemes, CurrentTheme, LoadCurrentTheme, LoadThemes} from "./theme";
	
	let { showModal = $bindable() } = $props();
	
	let dialog: HTMLDialogElement | null = $state(null);
	
	let unsavedChange: boolean = $state(false);
	let selectedTheme: string = $state('');
	let hasSetBeforeChangedOnLoad: boolean = false;
	let beforeChanges: Theme | null = $state(null);
	
	$effect(() => {
		if (showModal) {
			dialog?.showModal();
			if (!hasSetBeforeChangedOnLoad) {
				selectedTheme = localStorage.getItem('currentTheme') ?? "";
				beforeChanges = $state.snapshot<Theme>($CurrentTheme);
				hasSetBeforeChangedOnLoad = true;
			}
		}
	});
	
	const updateMainPanelBackgroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.MainPanelBackgroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateMainBallForegroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.MainBallForegroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateMainBallBackgroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.MainBallBackgroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateBottomPanelBackgroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.BottomBarBackgroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateBottomBallForegroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.BottomBarBallForegroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateBottomBallBackgroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.BottomBarBallBackgroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateSidebarBackgroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.SidebarBackgroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateSidebarUncalledBallBackgroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.SidebarBallUncalledBackgroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateSidebarUncalledBallForegroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.SidebarBallUncalledForegroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateSidebarCalledBallBackgroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.SidebarBallCalledBackgroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const updateSidebarCalledBallForegroundColour = (event: Event) => {
		unsavedChange = true;
		let colours = $CurrentTheme;
		colours.SidebarBallCalledForegroundColour = event.target?.value;
		CurrentTheme.set(colours);
	}
	
	const selectTheme = () => {
		CurrentTheme.set($AllThemes[selectedTheme]);
		beforeChanges = $state.snapshot<Theme>($CurrentTheme);
		
		localStorage.setItem("currentTheme", selectedTheme);
	}
	
	const saveClicked = async () => {
		unsavedChange = false;
		let themes = $AllThemes;
		themes[selectedTheme] = $CurrentTheme;
		AllThemes.set(themes);
		localStorage.setItem('themes', JSON.stringify(themes));
		beforeChanges = $state.snapshot<Theme>($CurrentTheme);
	}
	
	const discardClicked = () => {
		unsavedChange = false;
		if (beforeChanges !== null) {
			CurrentTheme.set(beforeChanges);
		}
	}
	
	const closeClicked = () => {
		discardClicked();
		showModal = false;
		dialog?.close();
	}
	
	const reloadDefaults = async () => {
		if (window.confirm("Are you sure? \nAll theme changes will be erased!")) {
			await LoadThemes();
			LoadCurrentTheme();
		}
	}
	
</script>

<dialog bind:this={dialog}>
	<div>
		<div class="dialog-header">
			Settings
		</div>
		<div class="dialog-body">
			<div class="theme-select">
				<select bind:value={selectedTheme} onchange={selectTheme} disabled={unsavedChange}>
					{#each Object.keys($AllThemes) as theme}
						<option value={theme}>{theme.toUpperCase()}</option>
					{/each}
				</select>
			</div>
			<div class="options">
				<h3>Main Panel</h3>
				<hr />
				<label for="MainPanelBackgroundColour">Background</label>
				<input type="color" id="MainPanelBackgroundColour"
				       bind:value={$CurrentTheme.MainPanelBackgroundColour}
					   oninput={updateMainPanelBackgroundColour} />
				<label for="MainBallBackgroundColour">Ball Background</label>
				<input type="color" id="MainBallBackgroundColour"
				       bind:value={$CurrentTheme.MainBallBackgroundColour}
				       oninput={updateMainBallBackgroundColour} />
				<label for="MainBallForegroundColour">Ball Foreground</label>
				<input type="color" id="MainBallForegroundColour"
				       bind:value={$CurrentTheme.MainBallForegroundColour}
				       oninput={updateMainBallForegroundColour} />
				<br />
				
				<h3>Recent Panel</h3>
				<hr />
				<label for="BottomBallBackgroundColour">Background</label>
				<input type="color" id="BottomPanelBackgroundColour"
				       bind:value={$CurrentTheme.BottomBarBackgroundColour}
				       oninput={updateBottomPanelBackgroundColour} />
				<label for="BottomBallBackgroundColour">Ball Background</label>
				<input type="color" id="BottomBallBackgroundColour"
				       bind:value={$CurrentTheme.BottomBarBallBackgroundColour}
				       oninput={updateBottomBallBackgroundColour} />
				<label for="BottomBallForegroundColour">Ball Foreground</label>
				<input type="color" id="BottomBallForegroundColour"
				       bind:value={$CurrentTheme.BottomBarBallForegroundColour}
				       oninput={updateBottomBallForegroundColour} />
				<br />
				
				<h3>Side Panel</h3>
				<hr />
				<label for="SidePanelBackground">Background</label>
				<input type="color" id="SidePanelBackground"
				       bind:value={$CurrentTheme.SidebarBackgroundColour}
				       oninput={updateSidebarBackgroundColour} />
				<label for="SideBallUncalledBackground">Uncalled Ball Background</label>
				<input type="color" id="SideBallUncalledBackground"
				       bind:value={$CurrentTheme.SidebarBallUncalledBackgroundColour}
				       oninput={updateSidebarUncalledBallBackgroundColour} />
				<label for="SideBallUncalledForeground">Uncalled Ball Foreground</label>
				<input type="color" id="SideBallUncalledForeground"
				       bind:value={$CurrentTheme.SidebarBallUncalledForegroundColour}
				       oninput={updateSidebarUncalledBallForegroundColour} />
				<label for="SideBallCalledBackground">Called Ball Background</label>
				<input type="color" id="SideBallCalledBackground"
				       bind:value={$CurrentTheme.SidebarBallCalledBackgroundColour}
				       oninput={updateSidebarCalledBallBackgroundColour} />
				<label for="SideBallCalledForeground">Called Ball Foreground</label>
				<input type="color" id="SideBallCalledForeground"
				       bind:value={$CurrentTheme.SidebarBallCalledForegroundColour}
				       oninput={updateSidebarCalledBallForegroundColour} />
			</div>
			<div class="preview">
				<div class="preview-container">
					<div class="main-panel"
						style="background-color: {$CurrentTheme.MainPanelBackgroundColour}">
						<div style="background-color: {$CurrentTheme.MainBallBackgroundColour}; color: {$CurrentTheme.MainBallForegroundColour};">
							90
						</div>
					</div>
					<div class="bottom-panel" style="background-color: {$CurrentTheme.BottomBarBackgroundColour};">
						<div style="background-color: {$CurrentTheme.BottomBarBallBackgroundColour}; color: {$CurrentTheme.BottomBarBallForegroundColour};">90</div>
						<div style="background-color: {$CurrentTheme.BottomBarBallBackgroundColour}; color: {$CurrentTheme.BottomBarBallForegroundColour};">89</div>
						<div style="background-color: {$CurrentTheme.BottomBarBallBackgroundColour}; color: {$CurrentTheme.BottomBarBallForegroundColour};">88</div>
						<div style="background-color: {$CurrentTheme.BottomBarBallBackgroundColour}; color: {$CurrentTheme.BottomBarBallForegroundColour};">87</div>
						<div style="background-color: {$CurrentTheme.BottomBarBallBackgroundColour}; color: {$CurrentTheme.BottomBarBallForegroundColour};">86</div>
						<div style="background-color: {$CurrentTheme.BottomBarBallBackgroundColour}; color: {$CurrentTheme.BottomBarBallForegroundColour};">85</div>
						<div style="background-color: {$CurrentTheme.BottomBarBallBackgroundColour}; color: {$CurrentTheme.BottomBarBallForegroundColour};">84</div>
					</div>
					<div class="side-panel" style="background-color: {$CurrentTheme.SidebarBackgroundColour}">
						<div style="background-color: {$CurrentTheme.SidebarBallCalledBackgroundColour}; color: {$CurrentTheme.SidebarBallCalledForegroundColour};">1</div>
						<div style="background-color: {$CurrentTheme.SidebarBallCalledBackgroundColour}; color: {$CurrentTheme.SidebarBallCalledForegroundColour};">2</div>
						<div style="background-color: {$CurrentTheme.SidebarBallUncalledBackgroundColour}; color: {$CurrentTheme.SidebarBallUncalledForegroundColour};">3</div>
						<div style="background-color: {$CurrentTheme.SidebarBallUncalledBackgroundColour}; color: {$CurrentTheme.SidebarBallUncalledForegroundColour};">4</div>
						<div style="background-color: {$CurrentTheme.SidebarBallUncalledBackgroundColour}; color: {$CurrentTheme.SidebarBallUncalledForegroundColour};">5</div>
						<div style="background-color: {$CurrentTheme.SidebarBallCalledBackgroundColour}; color: {$CurrentTheme.SidebarBallCalledForegroundColour};">6</div>
						<div style="background-color: {$CurrentTheme.SidebarBallCalledBackgroundColour}; color: {$CurrentTheme.SidebarBallCalledForegroundColour};">7</div>
						<div style="background-color: {$CurrentTheme.SidebarBallCalledBackgroundColour}; color: {$CurrentTheme.SidebarBallCalledForegroundColour};">8</div>
						<div style="background-color: {$CurrentTheme.SidebarBallCalledBackgroundColour}; color: {$CurrentTheme.SidebarBallCalledForegroundColour};">9</div>
						<div style="background-color: {$CurrentTheme.SidebarBallCalledBackgroundColour}; color: {$CurrentTheme.SidebarBallCalledForegroundColour};">10</div>
					</div>
				</div>
			</div>
		</div>
		<div class="dialog-footer">
			<div>
				<button class="reset" onclick={reloadDefaults}>Reload Default Settings</button>
			</div>
			<div>
				<button class="save" onclick={saveClicked} disabled={!unsavedChange}>Save</button>
				<button class="discard" onclick={discardClicked} disabled={!unsavedChange}>Discard</button>
				<button class="close" onclick={closeClicked}>Close</button>
			</div>
		</div>
	</div>
</dialog>

<style lang="sass">
	dialog
		border-radius: 0.2em
		border: none
		padding: 0
		font-family: "Cascadia Code", monospace

		&::backdrop
			background: rgba(0, 0, 0, 0.4)
		div
			padding: 0.5em
			box-sizing: border-box

	.dialog-header
		font-size: 1.8em
		border-bottom: 1px solid lightgray
		
	.dialog-body
		display: grid
		grid-template-areas: 'top top' 'options preview'
		grid-template-columns: 400px 1fr
		grid-template-rows: auto 550px
		box-sizing: border-box
		padding: 1em 0
		
		.theme-select
			grid-area: top
			display: flex
			width: 100%
			box-sizing: border-box
			margin: 0 0 20px
			padding: 0
			
			select
				width: 100%
				box-sizing: border-box
				padding: 8px
				margin: 0
				border: none
				border-bottom: 1px solid black
				outline: none
			
		.options
			grid-area: options
			display: flex
			flex-direction: column
			width: auto
			max-height: 100%
			overflow-y: scroll
			overflow-x: hidden
			box-sizing: border-box
			
			input
				width: 100%
				box-sizing: border-box
				padding: 0
				margin: 0
				background-color: transparent
				border: none
				min-height: 20px
				
				&::-webkit-color-swatch-wrapper
					padding: 0
				
			h3
				margin: 0
				padding: 0
				
			hr
				padding: 0
				border-color: black
				width: 100%
				margin: 0 0 10px
		
		.preview
			grid-area: preview
			display: flex
			flex-direction: column
			background: lightgray
			align-content: center
			justify-content: center
			
			.preview-container
				background: white
				display: grid
				grid-template-areas: 'main sidebar' 'bottom sidebar'
				grid-template-columns: 1fr auto
				grid-template-rows: 1fr auto
				height: 32em
				width: 38em
				
				.main-panel
					grid-area: main
					
					div
						border-radius: 50%
						aspect-ratio: 1 / 1
						text-align: center
						align-content: center
						font-size: 48pt
				
				.side-panel
					grid-area: sidebar
					display: grid
					grid-template-columns: auto auto
					grid-template-rows: auto auto auto
					gap: 5px
					
					div
						border-radius: 50%
						aspect-ratio: 1 / 1
						height: 80px
						text-align: center
						align-content: center
						font-size: 14pt
					
				.bottom-panel
					grid-area: bottom
					display: flex
					gap: 5px
					max-width: 100%
					overflow-x: hidden
					
					div
						height: 60px
						aspect-ratio: 1 / 1
						text-align: center
						align-content: center
						border-radius: 50%
				
	.dialog-footer
		border-top: 1px solid lightgray
		display: flex
		width: 100%
		gap: 10px
		justify-content: space-between
		
		div
			display: flex
			gap: 10px
		
		button
			padding: 12px 24px
			border: none
			border-radius: 4px
			cursor: pointer
			
			&.reset
				background-color: #e35050
			&.save
				background-color: #6e91e8
			&.discard
				background-color: #e35050
			&.close
				background-color: #b3b3b3
	
</style>

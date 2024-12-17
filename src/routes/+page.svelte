<script lang="ts">
	import Modal from '../settingsModal.svelte';
	import { onMount, tick } from "svelte";
	import {CurrentTheme, LoadThemes, LoadCurrentTheme, AllThemes} from "../theme";
	import {getCurrentWindow} from '@tauri-apps/api/window';

	class GameState {
		public currentNumber: number = $state(0);
		public calledNumbers: number[] = $state([]);
		private remainingNumbers: number[] = $state([]);
		
		constructor() {
			this.reset();
		}
		
		next() {
			if (this.remainingNumbers.length === 0) {
				return
			}
			
			const randomIndex = Math.floor(Math.random() * this.remainingNumbers.length);
			
			const chosenNum = this.remainingNumbers.splice(randomIndex, 1)[0];
			let calledNums = this.calledNumbers.reverse();
			calledNums.push(chosenNum);
			this.calledNumbers = calledNums.reverse();
			this.currentNumber = chosenNum;
		}
		
		reset() {
			this.currentNumber = 0
			this.calledNumbers = [];
			this.remainingNumbers = [];
			for (let i = 1; i <= 90; i++) {
				this.remainingNumbers.push(i);
			}
		}
	}
	
	let gameState = $state(new GameState());
	
	let showModal = $state(false);
	let showSidebar = $state(true);
	let showBottomBar = $state(true);
	
	let mainDiv: HTMLDivElement | null = null;
	let ballSize = $state(0);
	
	function nextNumber() {
		gameState.next();
	}
	
	async function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key == ' ') {
			nextNumber();
			event.preventDefault();
		}
		else if (event.key === 'f') {
			await getCurrentWindow().setFullscreen(!(await getCurrentWindow().isFullscreen()));
			await handleResize();
			event.preventDefault();
		}
		else if (event.key === '[') {
			showBottomBar = !showBottomBar;
			await tick();
			await handleResize();
			await tick();
			await handleResize();
			event.preventDefault();
		}
		else if (event.key === ']') {
			showSidebar = !showSidebar;
			await tick();
			await handleResize();
			event.preventDefault();
		}
		else if (event.key === 'n' && event.ctrlKey) {
			gameState = new GameState();
			event.preventDefault();
		}
		else if (event.key === 't' && event.ctrlKey) {
			// switch theme
			let selectedTheme = localStorage.getItem('currentTheme') ?? "";
			let themes = JSON.parse(localStorage.getItem('themes') ?? "{}");
			let keys = Object.keys(themes);
			let index = keys.indexOf(selectedTheme);
			index += 1;
			if (index >= keys.length) {
				index = 0;
			}
			localStorage.setItem('currentTheme', keys[index]);
			CurrentTheme.set(themes[keys[index]]);
			event.preventDefault();
		}
		else if (event.key === 's' && event.ctrlKey) {
			// Settings
			showModal = true;
			event.preventDefault();
		}
	}
	
	async function handleResize() {
		if (mainDiv === null) {
			return;
		}
		const { width, height } = mainDiv.getBoundingClientRect();
		ballSize = Math.min(width, height) - 100;
		console.log(width, height, ballSize)
	}
	
	onMount(async () => {
		if (localStorage.getItem('themes') == null) {
			await LoadThemes();
		}
		AllThemes.set(JSON.parse(localStorage.getItem('themes') ?? "{}"));
		LoadCurrentTheme();
		
		await handleResize();
	});
	
</script>

<svelte:window onkeydown={handleKeyDown} onresize={handleResize} />

<main class="page">
	
	<div bind:this={mainDiv} class="main" style="background-color: {$CurrentTheme.MainPanelBackgroundColour}">
		<button class="main-ball" onclick={nextNumber}
		        style="background-color: {$CurrentTheme.MainBallBackgroundColour}; color: {$CurrentTheme.MainBallForegroundColour}; height: {ballSize}px;">
			{gameState.currentNumber}
		</button>
	</div>
	
	{#if showBottomBar}
		<div class="bottom" style="background-color: {$CurrentTheme.BottomBarBackgroundColour}">
			{#each gameState.calledNumbers as num}
				<div style="background-color: {$CurrentTheme.BottomBarBallBackgroundColour}; color: {$CurrentTheme.BottomBarBallForegroundColour}">
					{num}
				</div>
			{/each}
		</div>
	{/if}
	
	{#if showSidebar}
		<div class="sidebar" style="background-color: {$CurrentTheme.SidebarBackgroundColour}">
			{#each {length: 90} as _, num }
				{#if gameState.calledNumbers.includes(num + 1)}
					<div style="background-color: {$CurrentTheme.SidebarBallCalledBackgroundColour}; color: {$CurrentTheme.SidebarBallCalledForegroundColour};">
						{num + 1}
					</div>
				{:else}
					<div style="background-color: {$CurrentTheme.SidebarBallUncalledBackgroundColour}; color: {$CurrentTheme.SidebarBallUncalledForegroundColour};">
						{num + 1}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
	
	<Modal bind:showModal />
	
</main>

<style lang="sass">
	
	.page
		padding: 0
		margin: 0
		width: 100vw
		height: 100vh
		max-width: 100vw
		max-height: 100vh
		overflow: hidden
		display: grid
		grid-template-areas: 'main sidebar' 'bottom sidebar'
		grid-template-columns: 1fr max-content
		grid-template-rows: 1fr max-content

	.main
		grid-area: main
		width: 100%
		height: 100%
		display: flex
		align-items: center
		margin: auto
		box-sizing: border-box
		
		.main-ball
			box-sizing: border-box
			border: none
			border-radius: 50%
			aspect-ratio: 1 / 1
			justify-content: center
			align-self: center
			margin: 0 auto
			cursor: pointer
			height: 50vmin
			font-size: 40vmin
			
			&:focus
				outline: none
		
	.sidebar
		grid-area: sidebar
		width: auto
		height: 100vh
		overflow: hidden
		box-sizing: border-box
		padding: 10px
		display: grid
		grid-template-columns: repeat(6, auto)
		grid-template-rows: repeat(15, 1fr)
		gap: 5px
		
		div
			height: 100%
			border-radius: 50%
			aspect-ratio: 1 / 1
			justify-content: center
			align-self: center
			align-content: center
			text-align: center
			font-family: "Cascadia Code", monospace
			font-size: 2rem
			padding: 5px
			box-sizing: border-box
		
	.bottom
		grid-area: bottom
		width: 100%
		max-width: 100%
		height: 20vh
		display: flex
		box-sizing: border-box
		padding: 10px
		gap: 10px
		overflow-x: scroll
		
		div
			height: 100%
			padding: 10px
			box-sizing: border-box
			border-radius: 50%
			aspect-ratio: 1 / 1
			justify-content: center
			align-self: center
			align-content: center
			text-align: center
			font-family: "Cascadia Code", monospace
			font-size: 2rem
			
			
			
::-webkit-scrollbar
	width: 10px
	height: 8px

::-webkit-scrollbar-track
	background: transparent

::-webkit-scrollbar-thumb
	background: #404040
	border-radius: 10px

::-webkit-scrollbar-thumb:hover
	background: #505050

</style>

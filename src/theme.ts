import {type Writable, writable} from "svelte/store";

class Theme {
	public MainPanelBackgroundColour: string = '#000000';
	public MainBallBackgroundColour: string = '#000000';
	public MainBallForegroundColour: string = '#000000';
	public SidebarBackgroundColour: string = '#000000';
	public SidebarBallCalledBackgroundColour: string = '#000000';
	public SidebarBallUncalledBackgroundColour: string  = '#000000';
	public SidebarBallCalledForegroundColour: string = '#000000';
	public SidebarBallUncalledForegroundColour: string = '#000000';
	public BottomBarBackgroundColour: string = '#000000';
	public BottomBarBallBackgroundColour: string = '#000000';
	public BottomBarBallForegroundColour: string = '#000000';
}

export async function LoadThemes() {
	let themes: { [id: string]: Theme } = {};
	const themeListResponse = await fetch('/themes.json');
	if (themeListResponse.ok) {
		const themeList = await themeListResponse.json();
		const themeKeys = Object.keys(themeList);
		
		for (const key of themeKeys) {
			const themeResponse = await fetch(themeList[key]);
			if (themeResponse.ok) {
				themes[key] = await themeResponse.json();
			}
		}
	}
	
	AllThemes.set(themes);
	localStorage.setItem('themes', JSON.stringify(themes));
}

export function LoadCurrentTheme() {
	let currentTheme = localStorage.getItem('currentTheme');
	let themes = JSON.parse(localStorage.getItem('themes') ?? "{}");
	
	if (currentTheme === null) {
		let topTheme = Object.keys(themes)[0];
		localStorage.setItem('currentTheme', topTheme);
		CurrentTheme.set(themes[topTheme]);
	}
	else {
		let currTheme = localStorage.getItem('currentTheme') ?? "";
		CurrentTheme.set(themes[currTheme]);
	}
}

export default Theme;

export const CurrentTheme = writable(new Theme());

export const AllThemes: Writable<{ [id: string]: Theme }> = writable({});

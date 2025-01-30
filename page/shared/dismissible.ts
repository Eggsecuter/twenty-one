export function registerDismissible(element: HTMLElement, onopen: () => void, onclose: () => void) {
	// close menu when clicked outside
	const handlePossibleDismiss = (event: MouseEvent) => {
		if (!element.contains(event.target as HTMLElement)) {
			document.removeEventListener('mouseup', handlePossibleDismiss);
			onclose();
		}
	}

	element.onclick = () => {
		document.addEventListener('mouseup', handlePossibleDismiss);
		onopen();
	}
}

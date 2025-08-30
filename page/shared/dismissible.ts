export function registerDismissible(element: () => HTMLElement, isOpen: () => boolean, onopen: () => void, onclose: () =>  void) {
	// close menu when clicked outside
	const handlePossibleDismiss = (event: MouseEvent) => {
		if (!element().contains(event.target as HTMLElement)) {
			document.removeEventListener('mouseup', handlePossibleDismiss);
			onclose();
		}
	}

	element().onclick = () => {
		if (isOpen()) {
			return;
		}

		document.addEventListener('mouseup', handlePossibleDismiss);
		onopen();
	}
}

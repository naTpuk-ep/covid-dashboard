export const check = async () => {
	await fetch('http://localhost:4000/')
	.then(() => {
		setTimeout(check, 1000);
	})
	.catch(() => {
		window.close();
	});
};

check();
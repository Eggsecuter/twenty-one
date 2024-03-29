export class Service {
	static get = (path: string) => fetch(path).then(response => response.json());

	static post = (path: string, body: any) => fetch(path, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then(response => response.json());
}
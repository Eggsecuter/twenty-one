import { apiBasePath } from "../util/constants";

export default class APIService<T> {
    private basePath: string;

    constructor(apiRoute: string) {
        this.basePath = `${apiBasePath}/${apiRoute}`;
    }

    async list(): Promise<T[]> {
        return this.handleResponse(await fetch(this.basePath));
    }

    async get(id: string): Promise<T> {
        return this.handleResponse(await fetch(`${this.basePath}/${id}`));
    }

    async post(model: T): Promise<T> {
        return this.handleResponse(await fetch(this.basePath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(model)
        }));
    }

    async put(id: string, model: T): Promise<T> {
        return this.handleResponse(await fetch(`${this.basePath}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(model)
        }));
    }

    async delete(id: string): Promise<void> {
        return this.handleResponse(await fetch(`${this.basePath}/${id}`, {
            method: 'DELETE'
        }));
    }

    private async handleResponse(res: Response): Promise<any> {
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text) })
        }
        else {
            return res.text();
        }
    }
}

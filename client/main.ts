import { Component, Router } from "vldom";
import { registerDirectives } from "vldom-default-directives";
import { PageComponent } from "./page.component";
import { MainComponent } from "./components/main.component";
import { UserModel } from "./models/user.model";
import './directives/index';

class App {
    //#region Singleton
    private static _instance: App;

    static get instance(): App {
        if (!this._instance) {
            this._instance = new App();
        }

        return this._instance;
    }
    //#endregion

    currentUser: UserModel;

    private constructor() {
        if (!location.hash) {
            location.hash = '#/';
        }

        const router = new Router(
            PageComponent
                .route('/', MainComponent)
                .route('/:token', MainComponent)
        );

        registerDirectives(Component, router);

        router.host(document.body);
        window.onhashchange = () => router.update();
    }
}

export const app = App.instance;

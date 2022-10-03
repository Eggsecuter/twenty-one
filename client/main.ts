import { Component, Router } from "vldom";
import { registerDirectives } from "vldom-default-directives";
import { HomeComponent } from "./components/home.component";
import { LobbyComponent } from "./components/lobby.component";
import { PageComponent } from "./components/page.component";

if (!location.hash) {
    location.hash = '#/home';
}

const router = new Router(
    PageComponent
        .route('/home', HomeComponent)
        .route('/:token', LobbyComponent)
);

registerDirectives(Component, router);

router.host(document.body);
onhashchange = () => router.update();

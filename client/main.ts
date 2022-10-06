import { Component, Router } from "vldom";
import { registerDirectives } from "vldom-default-directives";
import { LobbyComponent } from "./components/lobby.component";
import { PageComponent } from "./components/page.component";

if (!location.hash) {
    location.hash = '#/';
}

const router = new Router(
    PageComponent
        .route('/', LobbyComponent)
        .route('/:token', LobbyComponent)
);

registerDirectives(Component, router);

router.host(document.body);
onhashchange = () => router.update();

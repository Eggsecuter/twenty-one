import { Component, Router } from "vldom";
import { registerDirectives } from "vldom-default-directives";
import { HomeComponent } from "./components/home.component";
import { PageComponent } from "./components/page.component";
import { TestComponent } from "./components/test.component";

if (!location.hash) {
    location.hash = '#/home';
}

const router = new Router(
    PageComponent
        .route('/home', HomeComponent)
        .route('/test', TestComponent)
);

registerDirectives(Component, router);

router.host(document.body);
onhashchange = () => router.update();

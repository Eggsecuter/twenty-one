import { Component, Router } from "vldom";
import { registerDirectives } from "vldom-default-directives";
import { PageComponent } from "./page.component";
import { TestComponent } from "./test.component";

const router = new Router(PageComponent
        .route('/test', TestComponent)
    );

registerDirectives(Component, router);

router.host(document.body);
onhashchange = () => router.update();

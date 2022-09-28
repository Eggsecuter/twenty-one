# Overview

## Introduction
This is a card game you can play with your friends in the browser. Just create a new room and let your friends join.

## Structure
The project consists of a server node app and a vldom client app.

Both apps are bundled into single (html, css, js, svg, ...) files. Vercel's [ncc package](https://www.npmjs.com/package/@vercel/ncc) is used to bundle the server. As it states in the design goals of the documentation, it is specifically build for node apps and perfectly fits the needs. For the client [parcel](https://parceljs.org/) is used.

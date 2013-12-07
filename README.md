tart-lambda
===========

A simple lambda-calculus evaluator (tart module)

## Usage

To run the below example run:

    npm run readme

```javascript
"use strict";

var tart = require('tart');
var lambda = require('../index.js');

var sponsor = tart.sponsor();
var env = lambda.env(sponsor);

var xVariable = env.variable('x');
var identityFunction = env.lambda('x', xVariable);
var testApplication = env.apply(identityFunction, env.constant(42));

testApplication({
	environment: env.empty,
	customer: sponsor(function (result) {
        console.log('result:', result);
    })
});

```

## Tests

    npm test
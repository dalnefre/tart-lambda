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

var emptyEnv = sponsor(lambda.emptyEnvBeh);
var xVariable = sponsor(lambda.variableExpr('x'));
var identityFunction = sponsor(lambda.lambdaExpr('x', xVariable));
var constant42 = sponsor(lambda.constantExpr(42));
var testApplication = sponsor(lambda.applyExpr(identityFunction, constant42));

testApplication({
    environment: emptyEnv,
    customer: sponsor(function (result) {
        console.log('result:', result);
    })
});

```

## Tests

    npm test
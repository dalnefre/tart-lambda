/*

test.js - test script

The MIT License (MIT)

Copyright (c) 2013 Dale Schumacher

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

var tart = require('tart-tracing');
var lambda = require('../index.js');

var test = module.exports = {};   

test['empty environment should return undefined'] = function (test) {
    test.expect(2);
    var tracing = tart.tracing();
    var sponsor = tracing.sponsor;

    var emptyEnv = sponsor(lambda.emptyEnvBeh);

    var expectUndefined = sponsor(function (result) {
        test.equal(result, undefined);
    });
    emptyEnv({
        customer: expectUndefined,
        name: 'not-used'
    });
    
    test.ok(tracing.eventLoop());
    test.done();
};

test['environment lookup should return value, or undefined'] = function (test) {
    test.expect(3);
    var tracing = tart.tracing();
    var sponsor = tracing.sponsor;

    var emptyEnv = sponsor(lambda.emptyEnvBeh);
    var value = 42;
    var environment = sponsor(lambda.boundEnv('foo', value, emptyEnv));

    var expectUndefined = sponsor(function (result) {
        test.equal(result, undefined);
    });
    environment({
        customer: expectUndefined,
        name: 'bar'
    });

    var expectValue = sponsor(function (result) {
        test.equal(result, value);
    });
    environment({
        customer: expectValue,
        name: 'foo'
    });
    
    test.ok(tracing.eventLoop());
    test.done();
};

test['variable evaluation should return value, or undefined'] = function (test) {
    test.expect(3);
    var tracing = tart.tracing();
    var sponsor = tracing.sponsor;

    var emptyEnv = sponsor(lambda.emptyEnvBeh);
    var value = 42;
    var environment = sponsor(lambda.boundEnv('x', value, emptyEnv));
    var xVariable = sponsor(lambda.variableExpr('x'));
    var yVariable = sponsor(lambda.variableExpr('y'));

    var expectValue = sponsor(function (result) {
        test.equal(result, value);
    });
    xVariable({
        customer: expectValue,
        environment: environment
    });
    
    var expectUndefined = sponsor(function (result) {
        test.equal(result, undefined);
    });
    yVariable({
        customer: expectUndefined,
        environment: environment
    });

    test.ok(tracing.eventLoop());
    test.done();
};

test['identity function definition and application returns 42'] = function (test) {
    test.expect(2);
    var tracing = tart.tracing();
    var sponsor = tracing.sponsor;

    var emptyEnv = sponsor(lambda.emptyEnvBeh);
    var xVariable = sponsor(lambda.variableExpr('x'));
    var identityFunction = sponsor(lambda.lambdaExpr('x', xVariable));
    var constant42 = sponsor(lambda.constantExpr(42));
    var testApplication = sponsor(lambda.applyExpr(identityFunction, constant42));

    var expect42 = sponsor(function (result) {
        test.equal(result, 42);
    });
    testApplication({
        environment: emptyEnv,
        customer: expect42
    });
    
    test.ok(tracing.eventLoop());
    test.done();
};

/*

index.js - "tart-lambda": A simple lambda-calculus evaluator (tart module)

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

var lambda = module.exports;

lambda.emptyEnvBeh = function emptyEnvBeh(message) {
    message.customer(undefined);
};

lambda.boundEnv = function (name, value, env) {
    return function boundEnvBeh(message) {
        if (message.name === name) {
            message.customer(value);
        } else {
            env(message);
        }
    };
};

lambda.variableExpr = function (name) {
    return function variableExprBeh(message) {
        message.environment({
            name: name,
            customer: message.customer
        });
    };
};

lambda.constantExpr = function (value) {
    return function contantBeh(message) {
        message.customer(value);
    };
};

lambda.lambdaExpr = function (name, bodyExpr) {
    return function lambdaExprBeh(message) {
        var lexical = message.environment;
        var closure = this.sponsor(function closureBeh(message) {
            var value = message.value;
            bodyExpr({
                environment: this.sponsor(lambda.boundEnv(name, value, lexical)),
                customer: message.customer
            });
        });
        message.customer(closure);
    };
};

lambda.applyExpr = function (funExpr, argExpr) {
    return function applyExprBeh(message) {
        var cust = message.customer;
        funExpr({
            environment: message.environment,
            customer: function (fun) {
                argExpr({
                    environment: message.environment,
                    customer: function (arg) {
                        fun({
                            value: arg,
                            customer: cust
                        });
                    }
                });
            }
        });
    };
};

lambda.env = function env(sponsor) {

    var bind = function bind(name, value, env) {
        return sponsor(lambda.boundEnv(name, value, env));
    };

    var variable = function variable(name) {
        return sponsor(lambda.variableExpr(name));
    };

    var constant = function constant(value) {
        return sponsor(lambda.constantExpr(value));
    };

    var abstraction = function abstraction(name, body) {
        return sponsor(lambda.lambdaExpr(name, body));
    };

    var application = function application(funExpr, argExpr) {
        return sponsor(lambda.applyExpr(funExpr, argExpr));
    };

    return {
        bind: bind,
        variable: variable,
        constant: constant,
        lambda: abstraction,
        apply: application,
        empty: sponsor(lambda.emptyEnvBeh)
    };
};
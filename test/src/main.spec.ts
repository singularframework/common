import 'source-map-support/register';
import { expect } from 'chai';
import { resolveRef, validate, transform, route, AggregationTarget, Request, RouteMethod } from '../..';

describe('Common', function() {

  it('should resolve values from references correctly', function() {

    const body = {
      ref1: false,
      ref2: 'string',
      ref3: {
        ref4: 'here'
      },
      arr: [
        'value',
        { ref8: { ref9: 123 } }
      ]
    };

    expect(resolveRef('ref1', body)).to.be.false;
    expect(resolveRef('ref2', body)).to.equal('string');
    expect(resolveRef('ref3', body)).to.deep.equal({ ref4: 'here' });
    expect(resolveRef('ref3.ref4', body)).to.equal('here');
    expect(resolveRef('ref5', body)).to.be.undefined;
    expect(resolveRef('ref5.ref6.ref7', body)).to.be.undefined;
    expect(resolveRef('arr.0', body)).to.equal('value');
    expect(resolveRef('arr.1.ref8.ref9', body)).to.equal(123);

  });

  it('should generate ValidationRule using "validate" helper correctly', function() {

    const headersRuleValidator = {
      'content-type': value => value === 'application/json',
      'authorization': value => typeof value === 'string' && !! value.length
    };
    const headersRule = validate.headers(headersRuleValidator);

    expect(headersRule).to.deep.equal({
      target: AggregationTarget.Headers,
      validator: headersRuleValidator
    });

    const queriesRuleValidator = {
      'page': value => +value > 0 && +value < 100
    };
    const queriesRule = validate.queries(queriesRuleValidator);

    expect(queriesRule).to.deep.equal({
      target: AggregationTarget.Queries,
      validator: queriesRuleValidator
    });

    const bodyRuleValidator = {
      'value': value => +value > 0 && +value < 100,
      nested: {
        value: async value => typeof value === 'number',
        betterSyntax: { __exec: () => async value => value === false }
      }
    };
    const bodyRule = validate.body(bodyRuleValidator);

    expect(bodyRule).to.deep.equal({
      target: AggregationTarget.Body,
      validator: bodyRuleValidator
    });

    const paramsRuleValidator = {
      'value': value => +value > 0 && +value < 100
    };
    const paramsRule = validate.params(paramsRuleValidator);

    expect(paramsRule).to.deep.equal({
      target: AggregationTarget.Params,
      validator: paramsRuleValidator
    });

    const customValidator = (req) => req !== undefined;
    const customRule = validate.custom(customValidator);

    expect(customRule).to.deep.equal({
      target: AggregationTarget.Custom,
      validator: customValidator
    });

  });

  it('should generate TransformationRule using "transform" helper correctly', function() {

    const headersRuleTransformer = {
      'content-type': value => value.toLowerCase().trim(),
      'authorization': value => value.trim()
    };
    const headersRule = transform.headers(headersRuleTransformer);

    expect(headersRule).to.deep.equal({
      target: AggregationTarget.Headers,
      transformer: headersRuleTransformer
    });

    const headersRuleOrigin = transform.headers('origin');

    expect(headersRuleOrigin).to.deep.equal({
      target: AggregationTarget.Headers,
      transformer: 'origin'
    });

    const queriesRuleTransformer = {
      'page': value => +value
    };
    const queriesRule = transform.queries(queriesRuleTransformer);

    expect(queriesRule).to.deep.equal({
      target: AggregationTarget.Queries,
      transformer: queriesRuleTransformer
    });

    const queriesRuleOrigin = transform.queries('origin');

    expect(queriesRuleOrigin).to.deep.equal({
      target: AggregationTarget.Queries,
      transformer: 'origin'
    });

    const bodyRuleTransformer = {
      'value': value => +value,
      nested: {
        value: async value => +value,
        betterSyntax: { __exec: () => async value => +value }
      }
    };
    const bodyRule = transform.body(bodyRuleTransformer);

    expect(bodyRule).to.deep.equal({
      target: AggregationTarget.Body,
      transformer: bodyRuleTransformer
    });

    const bodyRuleOrigin = transform.body('origin');

    expect(bodyRuleOrigin).to.deep.equal({
      target: AggregationTarget.Body,
      transformer: 'origin'
    });

    const paramsRuleTransformer = {
      'page': value => +value
    };
    const paramsRule = transform.params(paramsRuleTransformer);

    expect(paramsRule).to.deep.equal({
      target: AggregationTarget.Params,
      transformer: paramsRuleTransformer
    });

    const paramsRuleOrigin = transform.params('origin');

    expect(paramsRuleOrigin).to.deep.equal({
      target: AggregationTarget.Params,
      transformer: 'origin'
    });

    const customTransformer = (req: Request) => { req.sessionId = null; return req; };
    const customRule = transform.custom(customTransformer);

    expect(customRule).to.deep.equal({
      target: AggregationTarget.Custom,
      transformer: customTransformer
    });

  });

  it('should build route definitions correctly', function() {

    const validator = value => !!value;
    const transformer = value => +value;

    expect(route.get('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.GET,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.post('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.POST,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.put('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.PUT,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.delete('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.DELETE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.patch('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.PATCH,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.checkout('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.CHECKOUT,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.copy('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.COPY,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.head('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.HEAD,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.lock('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.LOCK,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.merge('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.MERGE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.mkactivity('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.MKACTIVITY,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.mkcol('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.MKCOL,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.move('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.MOVE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.msearch('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.M_SEARCH,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.notify('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.NOTIFY,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.options('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.OPTIONS,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.purge('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.PURGE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.report('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.REPORT,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.search('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.SEARCH,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.subscribe('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.SUBSCRIBE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.trace('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.TRACE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.unlock('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.UNLOCK,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.UNSUBSCRIBE('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.UNSUBSCRIBE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.all('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.ALL,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.global('/', 'middleware', [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: undefined,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.GET('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.GET,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.POST('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.POST,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.PUT('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.PUT,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.DELETE('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.DELETE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.PATCH('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.PATCH,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.CHECKOUT('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.CHECKOUT,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.COPY('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.COPY,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.HEAD('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.HEAD,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.LOCK('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.LOCK,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.MERGE('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.MERGE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.MKACTIVITY('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.MKACTIVITY,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.MKCOL('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.MKCOL,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.MOVE('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.MOVE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.MSEARCH('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.M_SEARCH,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.NOTIFY('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.NOTIFY,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.OPTIONS('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.OPTIONS,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.PURGE('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.PURGE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.REPORT('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.REPORT,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.SEARCH('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.SEARCH,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.SUBSCRIBE('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.SUBSCRIBE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.TRACE('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.TRACE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.UNLOCK('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.UNLOCK,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.UNSUBSCRIBE('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.UNSUBSCRIBE,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.ALL('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: RouteMethod.ALL,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

    expect(route.GLOBAL('/', ['middleware'], [ validate.body(validator), transform.body(transformer) ], { origin: true }))
    .to.deep.equal({
      path: '/',
      method: undefined,
      middleware: ['middleware'],
      aggregate: [
        { target: AggregationTarget.Body, validator },
        { target: AggregationTarget.Body, transformer }
      ],
      corsPolicy: { origin: true }
    });

  });

});

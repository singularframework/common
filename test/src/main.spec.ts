import 'source-map-support/register';
import { expect } from 'chai';
import { resolveRef, validate, transform, AggregationTarget, Request } from '../..';

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

    const customTransformer = (req: Request) => { req.sessionId = null; return req; };
    const customRule = transform.custom(customTransformer);

    expect(customRule).to.deep.equal({
      target: AggregationTarget.Custom,
      transformer: customTransformer
    });

  });

});

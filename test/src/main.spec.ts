import 'source-map-support/register';
import { expect } from 'chai';
import { resolveRef } from '../..';

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

});

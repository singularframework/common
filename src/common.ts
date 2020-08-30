import 'source-map-support/register';
import {
  ValidatorFunction,
  AsyncValidatorFunction,
  ValidationRule,
  ValidationDefinition,
  BodyValidationDefinition,
  ExecutableValidators,
  TransformationRule,
  TransformationDefinition,
  BodyTransformationDefinition,
  RequestTransformerFunction,
  AsyncRequestTransformerFunction,
  CustomTransformationRule,
  AggregationTarget
} from './models';

export * from './models';

/**
* Resolves reference from raw values.
*/
export function resolveRef(ref: string, rawValues: any): any {

  const segments = ref.split('.');
  let currentRef: any = rawValues;

  for ( const segment of segments ) {

    if ( currentRef === undefined ) return undefined;

    currentRef = currentRef[segment];

  }

  return currentRef;

}

export namespace validate {

  /** Creates validation rule for request headers. */
  export function headers(validator: ValidationDefinition): ValidationRule { return { target: AggregationTarget.Headers, validator }; }
  /** Creates validation rule for request query parameters. */
  export function queries(validator: ValidationDefinition): ValidationRule { return { target: AggregationTarget.Queries, validator }; }
  /** Creates validation rule for request body. */
  export function body(validator: BodyValidationDefinition): ValidationRule { return { target: AggregationTarget.Body, validator }; }
  /** Creates custom validation rule for request. */
  export function custom(validator: AsyncValidatorFunction|ValidatorFunction|ExecutableValidators): ValidationRule { return { target: AggregationTarget.Custom, validator } };

}

export namespace transform {

  /** Creates transformation rule for request headers. */
  export function headers(transformer: TransformationDefinition|'origin'): TransformationRule { return { target: AggregationTarget.Headers, transformer }; }
  /** Creates transformation rule for request query parameters. */
  export function queries(transformer: TransformationDefinition|'origin'): TransformationRule { return { target: AggregationTarget.Queries, transformer }; }
  /** Creates transformation rule for request body. */
  export function body(transformer: BodyTransformationDefinition|'origin'): TransformationRule { return { target: AggregationTarget.Body, transformer }; }
  /** Creates custom transformation rule for request. */
  export function custom(transformer: RequestTransformerFunction|AsyncRequestTransformerFunction): CustomTransformationRule { return { target: AggregationTarget.Custom, transformer } };

}

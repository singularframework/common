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
  AggregationTarget,
  PipeFunction,
  AsyncPipeFunction,
  ExecutablePipes,
  CORSPolicy,
  RouteDefinition,
  RouteMethod
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
  export function body(validator: BodyValidationDefinition|ValidatorFunction|AsyncValidatorFunction|ExecutableValidators): ValidationRule { return { target: AggregationTarget.Body, validator }; }
  /** Creates custom validation rule for request. */
  export function custom(validator: AsyncValidatorFunction|ValidatorFunction): ValidationRule { return { target: AggregationTarget.Custom, validator } };

}

export namespace transform {

  /** Creates transformation rule for request headers. */
  export function headers(transformer: TransformationDefinition|'origin'): TransformationRule { return { target: AggregationTarget.Headers, transformer }; }
  /** Creates transformation rule for request query parameters. */
  export function queries(transformer: TransformationDefinition|'origin'): TransformationRule { return { target: AggregationTarget.Queries, transformer }; }
  /** Creates transformation rule for request body. */
  export function body(transformer: BodyTransformationDefinition|PipeFunction|AsyncPipeFunction|ExecutablePipes|'origin'): TransformationRule { return { target: AggregationTarget.Body, transformer }; }
  /** Creates custom transformation rule for request. */
  export function custom(transformer: RequestTransformerFunction|AsyncRequestTransformerFunction): TransformationRule { return { target: AggregationTarget.Custom, transformer } };

}

class RouteDefinitionBuilderClass {

  private static __buildRoute(method: RouteMethod, ...args: any[]): RouteDefinition {

    return {
      method,
      path: args[0],
      middleware: typeof args[1] === 'string' ? [args[1]] : args[1],
      aggregate: args[2],
      corsPolicy: args[3]
    };

  }

  public static get(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.GET, ...args); }
  public static post(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.POST, ...args); }
  public static put(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.PUT, ...args); }
  public static delete(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.DELETE, ...args); }
  public static patch(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.PATCH, ...args); }
  public static checkout(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.CHECKOUT, ...args); }
  public static copy(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.COPY, ...args); }
  public static head(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.HEAD, ...args); }
  public static lock(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.LOCK, ...args); }
  public static merge(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.MERGE, ...args); }
  public static mkactivity(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.MKACTIVITY, ...args); }
  public static mkcol(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.MKCOL, ...args); }
  public static move(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.MOVE, ...args); }
  public static msearch(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.M_SEARCH, ...args); }
  public static notify(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.NOTIFY, ...args); }
  public static options(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.OPTIONS, ...args); }
  public static purge(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.PURGE, ...args); }
  public static report(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.REPORT, ...args); }
  public static search(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.SEARCH, ...args); }
  public static subscribe(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.SUBSCRIBE, ...args); }
  public static trace(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.TRACE, ...args); }
  public static unlock(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.UNLOCK, ...args); }
  public static unsubscribe(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.UNSUBSCRIBE, ...args); }
  public static all(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.ALL, ...args); }
  public static global(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(undefined, ...args); }
  public static GET(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.GET, ...args); }
  public static POST(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.POST, ...args); }
  public static PUT(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.PUT, ...args); }
  public static DELETE(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.DELETE, ...args); }
  public static PATCH(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.PATCH, ...args); }
  public static CHECKOUT(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.CHECKOUT, ...args); }
  public static COPY(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.COPY, ...args); }
  public static HEAD(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.HEAD, ...args); }
  public static LOCK(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.LOCK, ...args); }
  public static MERGE(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.MERGE, ...args); }
  public static MKACTIVITY(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.MKACTIVITY, ...args); }
  public static MKCOL(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.MKCOL, ...args); }
  public static MOVE(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.MOVE, ...args); }
  public static MSEARCH(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.M_SEARCH, ...args); }
  public static NOTIFY(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.NOTIFY, ...args); }
  public static OPTIONS(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.OPTIONS, ...args); }
  public static PURGE(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.PURGE, ...args); }
  public static REPORT(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.REPORT, ...args); }
  public static SEARCH(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.SEARCH, ...args); }
  public static SUBSCRIBE(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.SUBSCRIBE, ...args); }
  public static TRACE(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.TRACE, ...args); }
  public static UNLOCK(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.UNLOCK, ...args); }
  public static UNSUBSCRIBE(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.UNSUBSCRIBE, ...args); }
  public static ALL(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(RouteMethod.ALL, ...args); }
  public static GLOBAL(...args: any[]) { return RouteDefinitionBuilderClass.__buildRoute(undefined, ...args); }

}

type RouteDefinitionBuilderFunction = (path: string, middleware: string|string[], aggregate?: Array<ValidationRule|TransformationRule>, corsPolicy?: CORSPolicy) => RouteDefinition;

interface RouteDefinitionBuilder {

  /** Defines a GET route with the provided arguments. */
  get: RouteDefinitionBuilderFunction;
  /** Defines a POST route with the provided arguments. */
  post: RouteDefinitionBuilderFunction;
  /** Defines a PUT route with the provided arguments. */
  put: RouteDefinitionBuilderFunction;
  /** Defines a DELETE route with the provided arguments. */
  delete: RouteDefinitionBuilderFunction;
  /** Defines a PATCH route with the provided arguments. */
  patch: RouteDefinitionBuilderFunction;
  /** Defines a CHECKOUT route with the provided arguments. */
  checkout: RouteDefinitionBuilderFunction;
  /** Defines a COPY route with the provided arguments. */
  copy: RouteDefinitionBuilderFunction;
  /** Defines a HEAD route with the provided arguments. */
  head: RouteDefinitionBuilderFunction;
  /** Defines a LOCK route with the provided arguments. */
  lock: RouteDefinitionBuilderFunction;
  /** Defines a MERGE route with the provided arguments. */
  merge: RouteDefinitionBuilderFunction;
  /** Defines a MKACTIVITY route with the provided arguments. */
  mkactivity: RouteDefinitionBuilderFunction;
  /** Defines a MKCOL route with the provided arguments. */
  mkcol: RouteDefinitionBuilderFunction;
  /** Defines a MOVE route with the provided arguments. */
  move: RouteDefinitionBuilderFunction;
  /** Defines a M-SEARCH route with the provided arguments. */
  msearch: RouteDefinitionBuilderFunction;
  /** Defines a NOTIFY route with the provided arguments. */
  notify: RouteDefinitionBuilderFunction;
  /** Defines an OPTIONS route with the provided arguments. */
  options: RouteDefinitionBuilderFunction;
  /** Defines a PURGE route with the provided arguments. */
  purge: RouteDefinitionBuilderFunction;
  /** Defines a REPORT route with the provided arguments. */
  report: RouteDefinitionBuilderFunction;
  /** Defines a SEARCH route with the provided arguments. */
  search: RouteDefinitionBuilderFunction;
  /** Defines a SUBSCRIBE route with the provided arguments. */
  subscribe: RouteDefinitionBuilderFunction;
  /** Defines a TRACE route with the provided arguments. */
  trace: RouteDefinitionBuilderFunction;
  /** Defines an UNLOCK route with the provided arguments. */
  unlock: RouteDefinitionBuilderFunction;
  /** Defines an UNSUBSCRIBE route with the provided arguments. */
  unsubscribe: RouteDefinitionBuilderFunction;
  /** Defines an ALL route with the provided arguments. */
  all: RouteDefinitionBuilderFunction;
  /** Defines a global route with the provided arguments (using 'app.use()'). */
  global: RouteDefinitionBuilderFunction;
  /** Defines a GET route with the provided arguments. */
  GET: RouteDefinitionBuilderFunction;
  /** Defines a POST route with the provided arguments. */
  POST: RouteDefinitionBuilderFunction;
  /** Defines a PUT route with the provided arguments. */
  PUT: RouteDefinitionBuilderFunction;
  /** Defines a DELETE route with the provided arguments. */
  DELETE: RouteDefinitionBuilderFunction;
  /** Defines a PATCH route with the provided arguments. */
  PATCH: RouteDefinitionBuilderFunction;
  /** Defines a CHECKOUT route with the provided arguments. */
  CHECKOUT: RouteDefinitionBuilderFunction;
  /** Defines a COPY route with the provided arguments. */
  COPY: RouteDefinitionBuilderFunction;
  /** Defines a HEAD route with the provided arguments. */
  HEAD: RouteDefinitionBuilderFunction;
  /** Defines a LOCK route with the provided arguments. */
  LOCK: RouteDefinitionBuilderFunction;
  /** Defines a MERGE route with the provided arguments. */
  MERGE: RouteDefinitionBuilderFunction;
  /** Defines a MKACTIVITY route with the provided arguments. */
  MKACTIVITY: RouteDefinitionBuilderFunction;
  /** Defines a MKCOL route with the provided arguments. */
  MKCOL: RouteDefinitionBuilderFunction;
  /** Defines a MOVE route with the provided arguments. */
  MOVE: RouteDefinitionBuilderFunction;
  /** Defines a M-SEARCH route with the provided arguments. */
  MSEARCH: RouteDefinitionBuilderFunction;
  /** Defines a NOTIFY route with the provided arguments. */
  NOTIFY: RouteDefinitionBuilderFunction;
  /** Defines an OPTIONS route with the provided arguments. */
  OPTIONS: RouteDefinitionBuilderFunction;
  /** Defines a PURGE route with the provided arguments. */
  PURGE: RouteDefinitionBuilderFunction;
  /** Defines a REPORT route with the provided arguments. */
  REPORT: RouteDefinitionBuilderFunction;
  /** Defines a SEARCH route with the provided arguments. */
  SEARCH: RouteDefinitionBuilderFunction;
  /** Defines a SUBSCRIBE route with the provided arguments. */
  SUBSCRIBE: RouteDefinitionBuilderFunction;
  /** Defines a TRACE route with the provided arguments. */
  TRACE: RouteDefinitionBuilderFunction;
  /** Defines an UNLOCK route with the provided arguments. */
  UNLOCK: RouteDefinitionBuilderFunction;
  /** Defines an UNSUBSCRIBE route with the provided arguments. */
  UNSUBSCRIBE: RouteDefinitionBuilderFunction;
  /** Defines an ALL route with the provided arguments. */
  ALL: RouteDefinitionBuilderFunction;
  /** Defines a global route with the provided arguments (using 'app.use()'). */
  GLOBAL: RouteDefinitionBuilderFunction;

}

export const route: RouteDefinitionBuilder = RouteDefinitionBuilderClass;

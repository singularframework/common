import { Request as OriginalRequest, Response as OriginalResponse } from 'express';
import { CorsOptions } from 'cors';

export { NextFunction } from 'express';
export type PipeFunction = (value: any, rawValues?: any) => Exclude<Exclude<any, void>, Promise<any>>;
export type AsyncPipeFunction = (value: any, rawValues?: any) => Promise<Exclude<any, void>>;
export type RequestTransformerFunction = (req: Request) => void;
export type AsyncRequestTransformerFunction = (req: Request) => Promise<void>;
export type ValidatorFunction = (value: any, rawValues?: any) => boolean|Error;
export type AsyncValidatorFunction = (value: any, rawValues?: any) => Promise<boolean|Error>;
export type RequestValidatorFunction = (req: Request) => boolean|Error;
export type AsyncRequestValidatorFunction = (req: Request) => Promise<boolean|Error>;

export type ServerConfig<T=BaseServerConfig> = BaseServerConfig & T;

export interface BaseServerConfig {

  https?: boolean;
  port?: number;
  httpsPort?: number;
  httpsOnly?: boolean;
  httpsKey?: string;
  httpsCert?: string;
  predictive404?: boolean;
  predictive404Priority?: number;
  timezone?: string;
  colorfulLogs?: boolean;
  consoleLogLevels?: ('debug'|'info'|'notice'|'warn'|'error')[]|'all';
  writeLogsToFile?: boolean;
  logFileDirPath?: string;
  logFileArchiveDirPath?: string;
  logFileLevels?: ('debug'|'info'|'notice'|'warn'|'error')[]|'all';
  logFileMaxAge?: number;
  archiveLogs?: boolean;
  excludeQueryParamsInLogs?: string[];
  excludeHeadersInLogs?: string[];
  logRequestHeaders?: boolean;
  logResponseErrors?: boolean;
  fileUploadLimit?: string;
  sessionManagement?: boolean;
  cookieSecret?: string;
  enableCors?: boolean;
  [key: string]: any;

}

export interface Request extends OriginalRequest {

  session?: {
    id: string;
    isNew: boolean;
  };

}

export interface Response extends OriginalResponse {

  /**
  * Runs all interceptors and sends the body.
  * If body is error, it will be converted to ServerError and be sent using ServerError.respond().
  * If body is object, it will be sent using res.json() and res.send() if otherwise.
  */
  respond(body: any): Promise<void>;

}

export interface PluginDecoratorArgs {

  name: string;

}

export interface ServiceDecoratorArgs extends PluginDecoratorArgs {

  priority?: number;

}

export interface RouterDecoratorArgs extends ServiceDecoratorArgs {

  routes: RouteDefinition[];
  corsPolicy?: CORSPolicy;

}

export interface InterceptorDecoratorArgs extends ServiceDecoratorArgs {

  intercepts?: 'all' | string[];

}

export interface CORSPolicy {

  origin?: CorsOptions['origin'];
  methods?: CorsOptions['methods'];
  allowedHeaders?: CorsOptions['allowedHeaders'];
  exposedHeaders?: CorsOptions['exposedHeaders'];
  credentials?: CorsOptions['credentials'];
  maxAge?: CorsOptions['maxAge'];
  optionsSuccessStatus?: CorsOptions['optionsSuccessStatus'];

}

export interface RouteDefinition {

  path: string;
  middleware: string[];
  method?: RouteMethod;
  aggregate?: Array<ValidationRule|TransformationRule>;
  corsPolicy?: CORSPolicy;

}

export enum RouteMethod {

  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  CHECKOUT = 'checkout',
  COPY = 'copy',
  HEAD = 'head',
  LOCK = 'lock',
  MERGE = 'merge',
  MKACTIVITY = 'mkactivity',
  MKCOL = 'mkcol',
  MOVE = 'move',
  M_SEARCH = 'm-search',
  NOTIFY = 'notify',
  OPTIONS = 'options',
  PURGE = 'purge',
  REPORT = 'report',
  SEARCH = 'search',
  SUBSCRIBE = 'subscribe',
  TRACE = 'trace',
  UNLOCK = 'unlock',
  UNSUBSCRIBE = 'unsubscribe',
  ALL = 'all'

}

export enum ModuleType {

  Service,
  Router,
  Interceptor,
  Plugin

}

export interface BasicModule {

  __metadata: ModuleMetadata;

}

export interface ModuleMetadata {

  name: string;
  type: ModuleType;
  routes?: RouteDefinition[];
  priority?: number;
  corsPolicy?: CORSPolicy;
  intercepts?: 'all' | string[];

}

export interface OnInjection {

  onInjection(services: any): void|Promise<void>;

}

export interface OnConfig {

  onConfig(config: ServerConfig): void|Promise<void>;

}

export interface OnInit {

  onInit(): void|Promise<void>;

}

export interface OnInterception {

  onInterception(body: any, req: Request, res: Response): any;

}

export enum AggregationTarget {

  Headers,
  Queries,
  Body,
  Params,
  Custom

}

export interface ValidationRule {

  target: AggregationTarget;
  validator: BodyValidationDefinition|ValidationDefinition|ValidatorFunction|AsyncValidatorFunction|ExecutableValidators;

}

export interface TransformationRule {

  target: AggregationTarget;
  transformer: BodyTransformationDefinition|TransformationDefinition|PipeFunction|AsyncPipeFunction|RequestTransformerFunction|AsyncRequestTransformerFunction|ExecutablePipes|'origin';

}

export interface ExecutableValidators {

  __exec(): AsyncValidatorFunction;

}

export interface ExecutablePipes {

  __exec(): AsyncPipeFunction;

}

export interface BodyValidationDefinition {

  [key: string]: AsyncValidatorFunction|ValidatorFunction|BodyValidationDefinition|ExecutableValidators;

}

export interface BodyTransformationDefinition {

  [key: string]: AsyncPipeFunction|PipeFunction|BodyTransformationDefinition|ExecutablePipes;

}

export interface ValidationDefinition {

  [key: string]: AsyncValidatorFunction|ValidatorFunction|ExecutableValidators;

}

export interface TransformationDefinition {

  [key: string]: AsyncPipeFunction|PipeFunction|ExecutablePipes;

}

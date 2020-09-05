import { Request as OriginalRequest } from 'express';
import { CorsOptions } from 'cors';
import { Express } from 'express';

export { Response, NextFunction } from 'express';
export type PipeFunction = (value: any, rawValues?: any) => Exclude<Exclude<any, void>, Promise<any>>;
export type AsyncPipeFunction = (value: any, rawValues?: any) => Promise<Exclude<any, void>>;
export type RequestTransformerFunction = (req: Request) => void;
export type AsyncRequestTransformerFunction = (req: Request) => Promise<void>;
export type ValidatorFunction = (value: any, rawValues?: any) => boolean|Error;
export type AsyncValidatorFunction = (value: any, rawValues?: any) => Promise<boolean|Error>;

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

  sessionId: string;

}

export interface ModuleDecoratorArgs {

  name: string;
  priority?: number;

}

export interface RouterDecoratorArgs extends ModuleDecoratorArgs {

  routes: RouteDefinition[];
  corsPolicy?: CORSPolicy;

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
  Router

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

export enum AggregationTarget {

  Headers,
  Queries,
  Body,
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

export interface PluginEvents {

  on(event: 'plugin:config:before', listener: (data: PluginDataBeforeConfig) => void|Promise<void>): this;
  on(event: 'plugin:config:after', listener: (data: PluginDataAfterConfig) => void|Promise<void>): this;
  on(event: 'plugin:middleware:internal:before', listener: (data: PluginDataBeforeInternalMiddleware) => void|Promise<void>): this;
  on(event: 'plugin:middleware:internal:after', listener: (data: PluginDataAfterInternalMiddleware) => void|Promise<void>): this;
  on(event: 'plugin:middleware:user:before', listener: (data: PluginDataBeforeUserMiddleware) => void|Promise<void>): this;
  on(event: 'plugin:middleware:user:after', listener: (data: PluginDataAfterUserMiddleware) => void|Promise<void>): this;
  on(event: 'plugin:launch:before', listener: (data: PluginDataBeforeLaunch) => void|Promise<void>): this;
  on(event: 'plugin:launch:after', listener: (data: PluginDataAfterLaunch) => void|Promise<void>): this;

  addListener(event: 'plugin:config:before', listener: (data: PluginDataBeforeConfig) => void|Promise<void>): this;
  addListener(event: 'plugin:config:after', listener: (data: PluginDataAfterConfig) => void|Promise<void>): this;
  addListener(event: 'plugin:middleware:internal:before', listener: (data: PluginDataBeforeInternalMiddleware) => void|Promise<void>): this;
  addListener(event: 'plugin:middleware:internal:after', listener: (data: PluginDataAfterInternalMiddleware) => void|Promise<void>): this;
  addListener(event: 'plugin:middleware:user:before', listener: (data: PluginDataBeforeUserMiddleware) => void|Promise<void>): this;
  addListener(event: 'plugin:middleware:user:after', listener: (data: PluginDataAfterUserMiddleware) => void|Promise<void>): this;
  addListener(event: 'plugin:launch:before', listener: (data: PluginDataBeforeLaunch) => void|Promise<void>): this;
  addListener(event: 'plugin:launch:after', listener: (data: PluginDataAfterLaunch) => void|Promise<void>): this;

}

export interface PluginDataBeforeConfig {

  /** The Express application used internally by Singular. */
  app: Express;
  /** The absolute path of the root directory. */
  rootdir: string;
  /** The registered config profiles. */
  profiles: { [name: string]: ServerConfig };

}

export interface PluginDataAfterConfig extends PluginDataBeforeConfig {

  /** The resolved config object. */
  config: ServerConfig;

}

export interface PluginDataBeforeInternalMiddleware extends PluginDataAfterConfig {

  /** Installed components (not initialized). */
  components: {
    routers: { [name: string]: PluginSingularComponent<'router'>; };
    services: { [name: string]: PluginSingularComponent<'service'>; };
  };

}

export interface PluginDataAfterInternalMiddleware extends PluginDataBeforeInternalMiddleware {}

export interface PluginDataBeforeUserMiddleware extends PluginDataAfterInternalMiddleware {}

export interface PluginDataAfterUserMiddleware extends PluginDataBeforeUserMiddleware {}

export interface PluginDataBeforeLaunch extends PluginDataAfterUserMiddleware {

  /** Installed components (initialized). */
  components: {
    routers: { [name: string]: PluginSingularComponent<'router'>; };
    services: { [name: string]: PluginSingularComponent<'service'>; };
  };

}

export interface PluginDataAfterLaunch extends PluginDataBeforeLaunch {}

export interface PluginSingularComponent<T extends 'service'|'router' = any> {

  metadata: PluginSingularComponentMetadata<T>;
  onInit?(): void|Promise<void>;
  onInjection?(services: any): void|Promise<void>;
  onConfig?(config: ServerConfig): void|Promise<void>;

}

export interface PluginSingularComponentMetadata<T extends 'service'|'router' = any> {

  name: string;
  type: (T extends 'service' ? ModuleType.Service : ModuleType.Router);
  priority: number;
  routes?: (T extends 'router' ? Array<RouteDefinition> : undefined);
  corsPolicy?: (T extends 'router' ? CORSPolicy : undefined);

}

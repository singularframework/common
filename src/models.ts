import { Request as OriginalRequest } from 'express';
import { CorsOptions } from 'cors';

export { Response, NextFunction } from 'express';
export type PipeFunction = (value: any, rawValues?: any) => Exclude<Exclude<any, void>, Promise<any>>;
export type AsyncPipeFunction = (value: any, rawValues?: any) => Promise<Exclude<any, void>>;
export type RequestTransformerFunction = (req: Request) => void;
export type AsyncRequestTransformerFunction = (req: Request) => Promise<void>;
export type ValidatorFunction = (value: any, rawValues?: any) => boolean|Error;
export type AsyncValidatorFunction = (value: any, rawValues?: any) => Promise<boolean|Error>;

export type ServerConfig<T=BaseServerConfig> = BaseServerConfig & T;

export interface BaseServerConfig {

  port?: number;
  predictive404?: boolean;
  predictive404Priority?: number;
  timezone?: string;
  colorfulLogs?: boolean;
  consoleLogLevels?: ('debug'|'info'|'notice'|'warn'|'error')[]|'all';
  writeLogsToFile?: boolean;
  logFileLevels?: ('debug'|'info'|'notice'|'warn'|'error')[]|'all';
  logFileMaxAge?: number;
  archiveLogs?: boolean;
  excludeQueryParamsInLogs?: string[];
  excludeHeadersInLogs?: string[];
  logRequestHeaders?: boolean;
  logResponseMessages?: boolean;
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
  PATCH = 'patch'

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


/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AssetType
 * 
 */
export type AssetType = $Result.DefaultSelection<Prisma.$AssetTypePayload>
/**
 * Model Asset
 * 
 */
export type Asset = $Result.DefaultSelection<Prisma.$AssetPayload>
/**
 * Model AssetAssignment
 * 
 */
export type AssetAssignment = $Result.DefaultSelection<Prisma.$AssetAssignmentPayload>
/**
 * Model LifecycleEvent
 * 
 */
export type LifecycleEvent = $Result.DefaultSelection<Prisma.$LifecycleEventPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AssetStatus: {
  available: 'available',
  assigned: 'assigned',
  maintenance: 'maintenance',
  retired: 'retired'
};

export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus]

}

export type AssetStatus = $Enums.AssetStatus

export const AssetStatus: typeof $Enums.AssetStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AssetTypes
 * const assetTypes = await prisma.assetType.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more AssetTypes
   * const assetTypes = await prisma.assetType.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.assetType`: Exposes CRUD operations for the **AssetType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetTypes
    * const assetTypes = await prisma.assetType.findMany()
    * ```
    */
  get assetType(): Prisma.AssetTypeDelegate<ExtArgs>;

  /**
   * `prisma.asset`: Exposes CRUD operations for the **Asset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assets
    * const assets = await prisma.asset.findMany()
    * ```
    */
  get asset(): Prisma.AssetDelegate<ExtArgs>;

  /**
   * `prisma.assetAssignment`: Exposes CRUD operations for the **AssetAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetAssignments
    * const assetAssignments = await prisma.assetAssignment.findMany()
    * ```
    */
  get assetAssignment(): Prisma.AssetAssignmentDelegate<ExtArgs>;

  /**
   * `prisma.lifecycleEvent`: Exposes CRUD operations for the **LifecycleEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LifecycleEvents
    * const lifecycleEvents = await prisma.lifecycleEvent.findMany()
    * ```
    */
  get lifecycleEvent(): Prisma.LifecycleEventDelegate<ExtArgs>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    AssetType: 'AssetType',
    Asset: 'Asset',
    AssetAssignment: 'AssetAssignment',
    LifecycleEvent: 'LifecycleEvent',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "assetType" | "asset" | "assetAssignment" | "lifecycleEvent" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AssetType: {
        payload: Prisma.$AssetTypePayload<ExtArgs>
        fields: Prisma.AssetTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload>
          }
          findFirst: {
            args: Prisma.AssetTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload>
          }
          findMany: {
            args: Prisma.AssetTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload>[]
          }
          create: {
            args: Prisma.AssetTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload>
          }
          createMany: {
            args: Prisma.AssetTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload>[]
          }
          delete: {
            args: Prisma.AssetTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload>
          }
          update: {
            args: Prisma.AssetTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload>
          }
          deleteMany: {
            args: Prisma.AssetTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssetTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetTypePayload>
          }
          aggregate: {
            args: Prisma.AssetTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetType>
          }
          groupBy: {
            args: Prisma.AssetTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetTypeCountArgs<ExtArgs>
            result: $Utils.Optional<AssetTypeCountAggregateOutputType> | number
          }
        }
      }
      Asset: {
        payload: Prisma.$AssetPayload<ExtArgs>
        fields: Prisma.AssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findFirst: {
            args: Prisma.AssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findMany: {
            args: Prisma.AssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          create: {
            args: Prisma.AssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          createMany: {
            args: Prisma.AssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          delete: {
            args: Prisma.AssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          update: {
            args: Prisma.AssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          deleteMany: {
            args: Prisma.AssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          aggregate: {
            args: Prisma.AssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsset>
          }
          groupBy: {
            args: Prisma.AssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetCountArgs<ExtArgs>
            result: $Utils.Optional<AssetCountAggregateOutputType> | number
          }
        }
      }
      AssetAssignment: {
        payload: Prisma.$AssetAssignmentPayload<ExtArgs>
        fields: Prisma.AssetAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload>
          }
          findFirst: {
            args: Prisma.AssetAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload>
          }
          findMany: {
            args: Prisma.AssetAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload>[]
          }
          create: {
            args: Prisma.AssetAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload>
          }
          createMany: {
            args: Prisma.AssetAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload>[]
          }
          delete: {
            args: Prisma.AssetAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload>
          }
          update: {
            args: Prisma.AssetAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.AssetAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssetAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetAssignmentPayload>
          }
          aggregate: {
            args: Prisma.AssetAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetAssignment>
          }
          groupBy: {
            args: Prisma.AssetAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<AssetAssignmentCountAggregateOutputType> | number
          }
        }
      }
      LifecycleEvent: {
        payload: Prisma.$LifecycleEventPayload<ExtArgs>
        fields: Prisma.LifecycleEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LifecycleEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LifecycleEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload>
          }
          findFirst: {
            args: Prisma.LifecycleEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LifecycleEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload>
          }
          findMany: {
            args: Prisma.LifecycleEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload>[]
          }
          create: {
            args: Prisma.LifecycleEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload>
          }
          createMany: {
            args: Prisma.LifecycleEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LifecycleEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload>[]
          }
          delete: {
            args: Prisma.LifecycleEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload>
          }
          update: {
            args: Prisma.LifecycleEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload>
          }
          deleteMany: {
            args: Prisma.LifecycleEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LifecycleEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LifecycleEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifecycleEventPayload>
          }
          aggregate: {
            args: Prisma.LifecycleEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLifecycleEvent>
          }
          groupBy: {
            args: Prisma.LifecycleEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<LifecycleEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.LifecycleEventCountArgs<ExtArgs>
            result: $Utils.Optional<LifecycleEventCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AssetTypeCountOutputType
   */

  export type AssetTypeCountOutputType = {
    assets: number
  }

  export type AssetTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | AssetTypeCountOutputTypeCountAssetsArgs
  }

  // Custom InputTypes
  /**
   * AssetTypeCountOutputType without action
   */
  export type AssetTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTypeCountOutputType
     */
    select?: AssetTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AssetTypeCountOutputType without action
   */
  export type AssetTypeCountOutputTypeCountAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
  }


  /**
   * Count Type AssetCountOutputType
   */

  export type AssetCountOutputType = {
    assignments: number
    lifecycle: number
  }

  export type AssetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | AssetCountOutputTypeCountAssignmentsArgs
    lifecycle?: boolean | AssetCountOutputTypeCountLifecycleArgs
  }

  // Custom InputTypes
  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCountOutputType
     */
    select?: AssetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetAssignmentWhereInput
  }

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountLifecycleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifecycleEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AssetType
   */

  export type AggregateAssetType = {
    _count: AssetTypeCountAggregateOutputType | null
    _min: AssetTypeMinAggregateOutputType | null
    _max: AssetTypeMaxAggregateOutputType | null
  }

  export type AssetTypeMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type AssetTypeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type AssetTypeCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    _all: number
  }


  export type AssetTypeMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type AssetTypeMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type AssetTypeCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type AssetTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetType to aggregate.
     */
    where?: AssetTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetTypes to fetch.
     */
    orderBy?: AssetTypeOrderByWithRelationInput | AssetTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetTypes
    **/
    _count?: true | AssetTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetTypeMaxAggregateInputType
  }

  export type GetAssetTypeAggregateType<T extends AssetTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetType[P]>
      : GetScalarType<T[P], AggregateAssetType[P]>
  }




  export type AssetTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetTypeWhereInput
    orderBy?: AssetTypeOrderByWithAggregationInput | AssetTypeOrderByWithAggregationInput[]
    by: AssetTypeScalarFieldEnum[] | AssetTypeScalarFieldEnum
    having?: AssetTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetTypeCountAggregateInputType | true
    _min?: AssetTypeMinAggregateInputType
    _max?: AssetTypeMaxAggregateInputType
  }

  export type AssetTypeGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    _count: AssetTypeCountAggregateOutputType | null
    _min: AssetTypeMinAggregateOutputType | null
    _max: AssetTypeMaxAggregateOutputType | null
  }

  type GetAssetTypeGroupByPayload<T extends AssetTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetTypeGroupByOutputType[P]>
            : GetScalarType<T[P], AssetTypeGroupByOutputType[P]>
        }
      >
    >


  export type AssetTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    assets?: boolean | AssetType$assetsArgs<ExtArgs>
    _count?: boolean | AssetTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assetType"]>

  export type AssetTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["assetType"]>

  export type AssetTypeSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type AssetTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | AssetType$assetsArgs<ExtArgs>
    _count?: boolean | AssetTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AssetTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AssetTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetType"
    objects: {
      assets: Prisma.$AssetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
    }, ExtArgs["result"]["assetType"]>
    composites: {}
  }

  type AssetTypeGetPayload<S extends boolean | null | undefined | AssetTypeDefaultArgs> = $Result.GetResult<Prisma.$AssetTypePayload, S>

  type AssetTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AssetTypeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AssetTypeCountAggregateInputType | true
    }

  export interface AssetTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetType'], meta: { name: 'AssetType' } }
    /**
     * Find zero or one AssetType that matches the filter.
     * @param {AssetTypeFindUniqueArgs} args - Arguments to find a AssetType
     * @example
     * // Get one AssetType
     * const assetType = await prisma.assetType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetTypeFindUniqueArgs>(args: SelectSubset<T, AssetTypeFindUniqueArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AssetType that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AssetTypeFindUniqueOrThrowArgs} args - Arguments to find a AssetType
     * @example
     * // Get one AssetType
     * const assetType = await prisma.assetType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AssetType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTypeFindFirstArgs} args - Arguments to find a AssetType
     * @example
     * // Get one AssetType
     * const assetType = await prisma.assetType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetTypeFindFirstArgs>(args?: SelectSubset<T, AssetTypeFindFirstArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AssetType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTypeFindFirstOrThrowArgs} args - Arguments to find a AssetType
     * @example
     * // Get one AssetType
     * const assetType = await prisma.assetType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AssetTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetTypes
     * const assetTypes = await prisma.assetType.findMany()
     * 
     * // Get first 10 AssetTypes
     * const assetTypes = await prisma.assetType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetTypeWithIdOnly = await prisma.assetType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetTypeFindManyArgs>(args?: SelectSubset<T, AssetTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AssetType.
     * @param {AssetTypeCreateArgs} args - Arguments to create a AssetType.
     * @example
     * // Create one AssetType
     * const AssetType = await prisma.assetType.create({
     *   data: {
     *     // ... data to create a AssetType
     *   }
     * })
     * 
     */
    create<T extends AssetTypeCreateArgs>(args: SelectSubset<T, AssetTypeCreateArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AssetTypes.
     * @param {AssetTypeCreateManyArgs} args - Arguments to create many AssetTypes.
     * @example
     * // Create many AssetTypes
     * const assetType = await prisma.assetType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetTypeCreateManyArgs>(args?: SelectSubset<T, AssetTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AssetTypes and returns the data saved in the database.
     * @param {AssetTypeCreateManyAndReturnArgs} args - Arguments to create many AssetTypes.
     * @example
     * // Create many AssetTypes
     * const assetType = await prisma.assetType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AssetTypes and only return the `id`
     * const assetTypeWithIdOnly = await prisma.assetType.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AssetType.
     * @param {AssetTypeDeleteArgs} args - Arguments to delete one AssetType.
     * @example
     * // Delete one AssetType
     * const AssetType = await prisma.assetType.delete({
     *   where: {
     *     // ... filter to delete one AssetType
     *   }
     * })
     * 
     */
    delete<T extends AssetTypeDeleteArgs>(args: SelectSubset<T, AssetTypeDeleteArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AssetType.
     * @param {AssetTypeUpdateArgs} args - Arguments to update one AssetType.
     * @example
     * // Update one AssetType
     * const assetType = await prisma.assetType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetTypeUpdateArgs>(args: SelectSubset<T, AssetTypeUpdateArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AssetTypes.
     * @param {AssetTypeDeleteManyArgs} args - Arguments to filter AssetTypes to delete.
     * @example
     * // Delete a few AssetTypes
     * const { count } = await prisma.assetType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetTypeDeleteManyArgs>(args?: SelectSubset<T, AssetTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetTypes
     * const assetType = await prisma.assetType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetTypeUpdateManyArgs>(args: SelectSubset<T, AssetTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AssetType.
     * @param {AssetTypeUpsertArgs} args - Arguments to update or create a AssetType.
     * @example
     * // Update or create a AssetType
     * const assetType = await prisma.assetType.upsert({
     *   create: {
     *     // ... data to create a AssetType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetType we want to update
     *   }
     * })
     */
    upsert<T extends AssetTypeUpsertArgs>(args: SelectSubset<T, AssetTypeUpsertArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AssetTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTypeCountArgs} args - Arguments to filter AssetTypes to count.
     * @example
     * // Count the number of AssetTypes
     * const count = await prisma.assetType.count({
     *   where: {
     *     // ... the filter for the AssetTypes we want to count
     *   }
     * })
    **/
    count<T extends AssetTypeCountArgs>(
      args?: Subset<T, AssetTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetTypeAggregateArgs>(args: Subset<T, AssetTypeAggregateArgs>): Prisma.PrismaPromise<GetAssetTypeAggregateType<T>>

    /**
     * Group by AssetType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetTypeGroupByArgs['orderBy'] }
        : { orderBy?: AssetTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetType model
   */
  readonly fields: AssetTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assets<T extends AssetType$assetsArgs<ExtArgs> = {}>(args?: Subset<T, AssetType$assetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AssetType model
   */ 
  interface AssetTypeFieldRefs {
    readonly id: FieldRef<"AssetType", 'String'>
    readonly name: FieldRef<"AssetType", 'String'>
    readonly createdAt: FieldRef<"AssetType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AssetType findUnique
   */
  export type AssetTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * Filter, which AssetType to fetch.
     */
    where: AssetTypeWhereUniqueInput
  }

  /**
   * AssetType findUniqueOrThrow
   */
  export type AssetTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * Filter, which AssetType to fetch.
     */
    where: AssetTypeWhereUniqueInput
  }

  /**
   * AssetType findFirst
   */
  export type AssetTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * Filter, which AssetType to fetch.
     */
    where?: AssetTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetTypes to fetch.
     */
    orderBy?: AssetTypeOrderByWithRelationInput | AssetTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetTypes.
     */
    cursor?: AssetTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetTypes.
     */
    distinct?: AssetTypeScalarFieldEnum | AssetTypeScalarFieldEnum[]
  }

  /**
   * AssetType findFirstOrThrow
   */
  export type AssetTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * Filter, which AssetType to fetch.
     */
    where?: AssetTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetTypes to fetch.
     */
    orderBy?: AssetTypeOrderByWithRelationInput | AssetTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetTypes.
     */
    cursor?: AssetTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetTypes.
     */
    distinct?: AssetTypeScalarFieldEnum | AssetTypeScalarFieldEnum[]
  }

  /**
   * AssetType findMany
   */
  export type AssetTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * Filter, which AssetTypes to fetch.
     */
    where?: AssetTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetTypes to fetch.
     */
    orderBy?: AssetTypeOrderByWithRelationInput | AssetTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetTypes.
     */
    cursor?: AssetTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetTypes.
     */
    skip?: number
    distinct?: AssetTypeScalarFieldEnum | AssetTypeScalarFieldEnum[]
  }

  /**
   * AssetType create
   */
  export type AssetTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a AssetType.
     */
    data: XOR<AssetTypeCreateInput, AssetTypeUncheckedCreateInput>
  }

  /**
   * AssetType createMany
   */
  export type AssetTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetTypes.
     */
    data: AssetTypeCreateManyInput | AssetTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AssetType createManyAndReturn
   */
  export type AssetTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AssetTypes.
     */
    data: AssetTypeCreateManyInput | AssetTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AssetType update
   */
  export type AssetTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a AssetType.
     */
    data: XOR<AssetTypeUpdateInput, AssetTypeUncheckedUpdateInput>
    /**
     * Choose, which AssetType to update.
     */
    where: AssetTypeWhereUniqueInput
  }

  /**
   * AssetType updateMany
   */
  export type AssetTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetTypes.
     */
    data: XOR<AssetTypeUpdateManyMutationInput, AssetTypeUncheckedUpdateManyInput>
    /**
     * Filter which AssetTypes to update
     */
    where?: AssetTypeWhereInput
  }

  /**
   * AssetType upsert
   */
  export type AssetTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the AssetType to update in case it exists.
     */
    where: AssetTypeWhereUniqueInput
    /**
     * In case the AssetType found by the `where` argument doesn't exist, create a new AssetType with this data.
     */
    create: XOR<AssetTypeCreateInput, AssetTypeUncheckedCreateInput>
    /**
     * In case the AssetType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetTypeUpdateInput, AssetTypeUncheckedUpdateInput>
  }

  /**
   * AssetType delete
   */
  export type AssetTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    /**
     * Filter which AssetType to delete.
     */
    where: AssetTypeWhereUniqueInput
  }

  /**
   * AssetType deleteMany
   */
  export type AssetTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetTypes to delete
     */
    where?: AssetTypeWhereInput
  }

  /**
   * AssetType.assets
   */
  export type AssetType$assetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    cursor?: AssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * AssetType without action
   */
  export type AssetTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
  }


  /**
   * Model Asset
   */

  export type AggregateAsset = {
    _count: AssetCountAggregateOutputType | null
    _avg: AssetAvgAggregateOutputType | null
    _sum: AssetSumAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  export type AssetAvgAggregateOutputType = {
    cost: number | null
  }

  export type AssetSumAggregateOutputType = {
    cost: number | null
  }

  export type AssetMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    type: string | null
    description: string | null
    fundingDepartment: string | null
    manufacturer: string | null
    model: string | null
    modelGeneration: string | null
    serialNumber: string | null
    vendor: string | null
    memory: string | null
    hddSize: string | null
    hddType: string | null
    cpuGeneration: string | null
    cpuSpeed: string | null
    gpuModel: string | null
    videoCard: string | null
    wiredMac: string | null
    wirelessMac: string | null
    output1: string | null
    output2: string | null
    receivedDate: Date | null
    cost: number | null
    po: string | null
    disposalDate: Date | null
    disposalType: string | null
    location: string | null
    status: $Enums.AssetStatus | null
    assignedToId: string | null
    assignedToName: string | null
    assignedToEmail: string | null
    assignedDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    assetTypeId: string | null
  }

  export type AssetMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    type: string | null
    description: string | null
    fundingDepartment: string | null
    manufacturer: string | null
    model: string | null
    modelGeneration: string | null
    serialNumber: string | null
    vendor: string | null
    memory: string | null
    hddSize: string | null
    hddType: string | null
    cpuGeneration: string | null
    cpuSpeed: string | null
    gpuModel: string | null
    videoCard: string | null
    wiredMac: string | null
    wirelessMac: string | null
    output1: string | null
    output2: string | null
    receivedDate: Date | null
    cost: number | null
    po: string | null
    disposalDate: Date | null
    disposalType: string | null
    location: string | null
    status: $Enums.AssetStatus | null
    assignedToId: string | null
    assignedToName: string | null
    assignedToEmail: string | null
    assignedDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    assetTypeId: string | null
  }

  export type AssetCountAggregateOutputType = {
    id: number
    assetId: number
    type: number
    description: number
    fundingDepartment: number
    manufacturer: number
    model: number
    modelGeneration: number
    serialNumber: number
    vendor: number
    memory: number
    hddSize: number
    hddType: number
    cpuGeneration: number
    cpuSpeed: number
    gpuModel: number
    videoCard: number
    wiredMac: number
    wirelessMac: number
    output1: number
    output2: number
    receivedDate: number
    cost: number
    po: number
    disposalDate: number
    disposalType: number
    location: number
    status: number
    assignedToId: number
    assignedToName: number
    assignedToEmail: number
    assignedDate: number
    createdAt: number
    updatedAt: number
    assetTypeId: number
    _all: number
  }


  export type AssetAvgAggregateInputType = {
    cost?: true
  }

  export type AssetSumAggregateInputType = {
    cost?: true
  }

  export type AssetMinAggregateInputType = {
    id?: true
    assetId?: true
    type?: true
    description?: true
    fundingDepartment?: true
    manufacturer?: true
    model?: true
    modelGeneration?: true
    serialNumber?: true
    vendor?: true
    memory?: true
    hddSize?: true
    hddType?: true
    cpuGeneration?: true
    cpuSpeed?: true
    gpuModel?: true
    videoCard?: true
    wiredMac?: true
    wirelessMac?: true
    output1?: true
    output2?: true
    receivedDate?: true
    cost?: true
    po?: true
    disposalDate?: true
    disposalType?: true
    location?: true
    status?: true
    assignedToId?: true
    assignedToName?: true
    assignedToEmail?: true
    assignedDate?: true
    createdAt?: true
    updatedAt?: true
    assetTypeId?: true
  }

  export type AssetMaxAggregateInputType = {
    id?: true
    assetId?: true
    type?: true
    description?: true
    fundingDepartment?: true
    manufacturer?: true
    model?: true
    modelGeneration?: true
    serialNumber?: true
    vendor?: true
    memory?: true
    hddSize?: true
    hddType?: true
    cpuGeneration?: true
    cpuSpeed?: true
    gpuModel?: true
    videoCard?: true
    wiredMac?: true
    wirelessMac?: true
    output1?: true
    output2?: true
    receivedDate?: true
    cost?: true
    po?: true
    disposalDate?: true
    disposalType?: true
    location?: true
    status?: true
    assignedToId?: true
    assignedToName?: true
    assignedToEmail?: true
    assignedDate?: true
    createdAt?: true
    updatedAt?: true
    assetTypeId?: true
  }

  export type AssetCountAggregateInputType = {
    id?: true
    assetId?: true
    type?: true
    description?: true
    fundingDepartment?: true
    manufacturer?: true
    model?: true
    modelGeneration?: true
    serialNumber?: true
    vendor?: true
    memory?: true
    hddSize?: true
    hddType?: true
    cpuGeneration?: true
    cpuSpeed?: true
    gpuModel?: true
    videoCard?: true
    wiredMac?: true
    wirelessMac?: true
    output1?: true
    output2?: true
    receivedDate?: true
    cost?: true
    po?: true
    disposalDate?: true
    disposalType?: true
    location?: true
    status?: true
    assignedToId?: true
    assignedToName?: true
    assignedToEmail?: true
    assignedDate?: true
    createdAt?: true
    updatedAt?: true
    assetTypeId?: true
    _all?: true
  }

  export type AssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asset to aggregate.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Assets
    **/
    _count?: true | AssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetMaxAggregateInputType
  }

  export type GetAssetAggregateType<T extends AssetAggregateArgs> = {
        [P in keyof T & keyof AggregateAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsset[P]>
      : GetScalarType<T[P], AggregateAsset[P]>
  }




  export type AssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithAggregationInput | AssetOrderByWithAggregationInput[]
    by: AssetScalarFieldEnum[] | AssetScalarFieldEnum
    having?: AssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetCountAggregateInputType | true
    _avg?: AssetAvgAggregateInputType
    _sum?: AssetSumAggregateInputType
    _min?: AssetMinAggregateInputType
    _max?: AssetMaxAggregateInputType
  }

  export type AssetGroupByOutputType = {
    id: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer: string | null
    model: string | null
    modelGeneration: string | null
    serialNumber: string | null
    vendor: string | null
    memory: string | null
    hddSize: string | null
    hddType: string | null
    cpuGeneration: string | null
    cpuSpeed: string | null
    gpuModel: string | null
    videoCard: string | null
    wiredMac: string | null
    wirelessMac: string | null
    output1: string | null
    output2: string | null
    receivedDate: Date | null
    cost: number | null
    po: string | null
    disposalDate: Date | null
    disposalType: string | null
    location: string | null
    status: $Enums.AssetStatus
    assignedToId: string | null
    assignedToName: string | null
    assignedToEmail: string | null
    assignedDate: Date | null
    createdAt: Date
    updatedAt: Date
    assetTypeId: string | null
    _count: AssetCountAggregateOutputType | null
    _avg: AssetAvgAggregateOutputType | null
    _sum: AssetSumAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  type GetAssetGroupByPayload<T extends AssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetGroupByOutputType[P]>
            : GetScalarType<T[P], AssetGroupByOutputType[P]>
        }
      >
    >


  export type AssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    type?: boolean
    description?: boolean
    fundingDepartment?: boolean
    manufacturer?: boolean
    model?: boolean
    modelGeneration?: boolean
    serialNumber?: boolean
    vendor?: boolean
    memory?: boolean
    hddSize?: boolean
    hddType?: boolean
    cpuGeneration?: boolean
    cpuSpeed?: boolean
    gpuModel?: boolean
    videoCard?: boolean
    wiredMac?: boolean
    wirelessMac?: boolean
    output1?: boolean
    output2?: boolean
    receivedDate?: boolean
    cost?: boolean
    po?: boolean
    disposalDate?: boolean
    disposalType?: boolean
    location?: boolean
    status?: boolean
    assignedToId?: boolean
    assignedToName?: boolean
    assignedToEmail?: boolean
    assignedDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assetTypeId?: boolean
    assetType?: boolean | Asset$assetTypeArgs<ExtArgs>
    assignments?: boolean | Asset$assignmentsArgs<ExtArgs>
    lifecycle?: boolean | Asset$lifecycleArgs<ExtArgs>
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    type?: boolean
    description?: boolean
    fundingDepartment?: boolean
    manufacturer?: boolean
    model?: boolean
    modelGeneration?: boolean
    serialNumber?: boolean
    vendor?: boolean
    memory?: boolean
    hddSize?: boolean
    hddType?: boolean
    cpuGeneration?: boolean
    cpuSpeed?: boolean
    gpuModel?: boolean
    videoCard?: boolean
    wiredMac?: boolean
    wirelessMac?: boolean
    output1?: boolean
    output2?: boolean
    receivedDate?: boolean
    cost?: boolean
    po?: boolean
    disposalDate?: boolean
    disposalType?: boolean
    location?: boolean
    status?: boolean
    assignedToId?: boolean
    assignedToName?: boolean
    assignedToEmail?: boolean
    assignedDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assetTypeId?: boolean
    assetType?: boolean | Asset$assetTypeArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectScalar = {
    id?: boolean
    assetId?: boolean
    type?: boolean
    description?: boolean
    fundingDepartment?: boolean
    manufacturer?: boolean
    model?: boolean
    modelGeneration?: boolean
    serialNumber?: boolean
    vendor?: boolean
    memory?: boolean
    hddSize?: boolean
    hddType?: boolean
    cpuGeneration?: boolean
    cpuSpeed?: boolean
    gpuModel?: boolean
    videoCard?: boolean
    wiredMac?: boolean
    wirelessMac?: boolean
    output1?: boolean
    output2?: boolean
    receivedDate?: boolean
    cost?: boolean
    po?: boolean
    disposalDate?: boolean
    disposalType?: boolean
    location?: boolean
    status?: boolean
    assignedToId?: boolean
    assignedToName?: boolean
    assignedToEmail?: boolean
    assignedDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assetTypeId?: boolean
  }

  export type AssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assetType?: boolean | Asset$assetTypeArgs<ExtArgs>
    assignments?: boolean | Asset$assignmentsArgs<ExtArgs>
    lifecycle?: boolean | Asset$lifecycleArgs<ExtArgs>
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AssetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assetType?: boolean | Asset$assetTypeArgs<ExtArgs>
  }

  export type $AssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Asset"
    objects: {
      assetType: Prisma.$AssetTypePayload<ExtArgs> | null
      assignments: Prisma.$AssetAssignmentPayload<ExtArgs>[]
      lifecycle: Prisma.$LifecycleEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      type: string
      description: string
      fundingDepartment: string
      manufacturer: string | null
      model: string | null
      modelGeneration: string | null
      serialNumber: string | null
      vendor: string | null
      memory: string | null
      hddSize: string | null
      hddType: string | null
      cpuGeneration: string | null
      cpuSpeed: string | null
      gpuModel: string | null
      videoCard: string | null
      wiredMac: string | null
      wirelessMac: string | null
      output1: string | null
      output2: string | null
      receivedDate: Date | null
      cost: number | null
      po: string | null
      disposalDate: Date | null
      disposalType: string | null
      location: string | null
      status: $Enums.AssetStatus
      assignedToId: string | null
      assignedToName: string | null
      assignedToEmail: string | null
      assignedDate: Date | null
      createdAt: Date
      updatedAt: Date
      assetTypeId: string | null
    }, ExtArgs["result"]["asset"]>
    composites: {}
  }

  type AssetGetPayload<S extends boolean | null | undefined | AssetDefaultArgs> = $Result.GetResult<Prisma.$AssetPayload, S>

  type AssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AssetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AssetCountAggregateInputType | true
    }

  export interface AssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asset'], meta: { name: 'Asset' } }
    /**
     * Find zero or one Asset that matches the filter.
     * @param {AssetFindUniqueArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetFindUniqueArgs>(args: SelectSubset<T, AssetFindUniqueArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Asset that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AssetFindUniqueOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Asset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetFindFirstArgs>(args?: SelectSubset<T, AssetFindFirstArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Asset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Assets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assets
     * const assets = await prisma.asset.findMany()
     * 
     * // Get first 10 Assets
     * const assets = await prisma.asset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetWithIdOnly = await prisma.asset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetFindManyArgs>(args?: SelectSubset<T, AssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Asset.
     * @param {AssetCreateArgs} args - Arguments to create a Asset.
     * @example
     * // Create one Asset
     * const Asset = await prisma.asset.create({
     *   data: {
     *     // ... data to create a Asset
     *   }
     * })
     * 
     */
    create<T extends AssetCreateArgs>(args: SelectSubset<T, AssetCreateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Assets.
     * @param {AssetCreateManyArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetCreateManyArgs>(args?: SelectSubset<T, AssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assets and returns the data saved in the database.
     * @param {AssetCreateManyAndReturnArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Asset.
     * @param {AssetDeleteArgs} args - Arguments to delete one Asset.
     * @example
     * // Delete one Asset
     * const Asset = await prisma.asset.delete({
     *   where: {
     *     // ... filter to delete one Asset
     *   }
     * })
     * 
     */
    delete<T extends AssetDeleteArgs>(args: SelectSubset<T, AssetDeleteArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Asset.
     * @param {AssetUpdateArgs} args - Arguments to update one Asset.
     * @example
     * // Update one Asset
     * const asset = await prisma.asset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetUpdateArgs>(args: SelectSubset<T, AssetUpdateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Assets.
     * @param {AssetDeleteManyArgs} args - Arguments to filter Assets to delete.
     * @example
     * // Delete a few Assets
     * const { count } = await prisma.asset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetDeleteManyArgs>(args?: SelectSubset<T, AssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetUpdateManyArgs>(args: SelectSubset<T, AssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Asset.
     * @param {AssetUpsertArgs} args - Arguments to update or create a Asset.
     * @example
     * // Update or create a Asset
     * const asset = await prisma.asset.upsert({
     *   create: {
     *     // ... data to create a Asset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asset we want to update
     *   }
     * })
     */
    upsert<T extends AssetUpsertArgs>(args: SelectSubset<T, AssetUpsertArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCountArgs} args - Arguments to filter Assets to count.
     * @example
     * // Count the number of Assets
     * const count = await prisma.asset.count({
     *   where: {
     *     // ... the filter for the Assets we want to count
     *   }
     * })
    **/
    count<T extends AssetCountArgs>(
      args?: Subset<T, AssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetAggregateArgs>(args: Subset<T, AssetAggregateArgs>): Prisma.PrismaPromise<GetAssetAggregateType<T>>

    /**
     * Group by Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetGroupByArgs['orderBy'] }
        : { orderBy?: AssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Asset model
   */
  readonly fields: AssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assetType<T extends Asset$assetTypeArgs<ExtArgs> = {}>(args?: Subset<T, Asset$assetTypeArgs<ExtArgs>>): Prisma__AssetTypeClient<$Result.GetResult<Prisma.$AssetTypePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    assignments<T extends Asset$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Asset$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "findMany"> | Null>
    lifecycle<T extends Asset$lifecycleArgs<ExtArgs> = {}>(args?: Subset<T, Asset$lifecycleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Asset model
   */ 
  interface AssetFieldRefs {
    readonly id: FieldRef<"Asset", 'String'>
    readonly assetId: FieldRef<"Asset", 'String'>
    readonly type: FieldRef<"Asset", 'String'>
    readonly description: FieldRef<"Asset", 'String'>
    readonly fundingDepartment: FieldRef<"Asset", 'String'>
    readonly manufacturer: FieldRef<"Asset", 'String'>
    readonly model: FieldRef<"Asset", 'String'>
    readonly modelGeneration: FieldRef<"Asset", 'String'>
    readonly serialNumber: FieldRef<"Asset", 'String'>
    readonly vendor: FieldRef<"Asset", 'String'>
    readonly memory: FieldRef<"Asset", 'String'>
    readonly hddSize: FieldRef<"Asset", 'String'>
    readonly hddType: FieldRef<"Asset", 'String'>
    readonly cpuGeneration: FieldRef<"Asset", 'String'>
    readonly cpuSpeed: FieldRef<"Asset", 'String'>
    readonly gpuModel: FieldRef<"Asset", 'String'>
    readonly videoCard: FieldRef<"Asset", 'String'>
    readonly wiredMac: FieldRef<"Asset", 'String'>
    readonly wirelessMac: FieldRef<"Asset", 'String'>
    readonly output1: FieldRef<"Asset", 'String'>
    readonly output2: FieldRef<"Asset", 'String'>
    readonly receivedDate: FieldRef<"Asset", 'DateTime'>
    readonly cost: FieldRef<"Asset", 'Float'>
    readonly po: FieldRef<"Asset", 'String'>
    readonly disposalDate: FieldRef<"Asset", 'DateTime'>
    readonly disposalType: FieldRef<"Asset", 'String'>
    readonly location: FieldRef<"Asset", 'String'>
    readonly status: FieldRef<"Asset", 'AssetStatus'>
    readonly assignedToId: FieldRef<"Asset", 'String'>
    readonly assignedToName: FieldRef<"Asset", 'String'>
    readonly assignedToEmail: FieldRef<"Asset", 'String'>
    readonly assignedDate: FieldRef<"Asset", 'DateTime'>
    readonly createdAt: FieldRef<"Asset", 'DateTime'>
    readonly updatedAt: FieldRef<"Asset", 'DateTime'>
    readonly assetTypeId: FieldRef<"Asset", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Asset findUnique
   */
  export type AssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findUniqueOrThrow
   */
  export type AssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findFirst
   */
  export type AssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findFirstOrThrow
   */
  export type AssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findMany
   */
  export type AssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Assets to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset create
   */
  export type AssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to create a Asset.
     */
    data: XOR<AssetCreateInput, AssetUncheckedCreateInput>
  }

  /**
   * Asset createMany
   */
  export type AssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Asset createManyAndReturn
   */
  export type AssetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asset update
   */
  export type AssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to update a Asset.
     */
    data: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
    /**
     * Choose, which Asset to update.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset updateMany
   */
  export type AssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput
  }

  /**
   * Asset upsert
   */
  export type AssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The filter to search for the Asset to update in case it exists.
     */
    where: AssetWhereUniqueInput
    /**
     * In case the Asset found by the `where` argument doesn't exist, create a new Asset with this data.
     */
    create: XOR<AssetCreateInput, AssetUncheckedCreateInput>
    /**
     * In case the Asset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
  }

  /**
   * Asset delete
   */
  export type AssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter which Asset to delete.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset deleteMany
   */
  export type AssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assets to delete
     */
    where?: AssetWhereInput
  }

  /**
   * Asset.assetType
   */
  export type Asset$assetTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetType
     */
    select?: AssetTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTypeInclude<ExtArgs> | null
    where?: AssetTypeWhereInput
  }

  /**
   * Asset.assignments
   */
  export type Asset$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    where?: AssetAssignmentWhereInput
    orderBy?: AssetAssignmentOrderByWithRelationInput | AssetAssignmentOrderByWithRelationInput[]
    cursor?: AssetAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetAssignmentScalarFieldEnum | AssetAssignmentScalarFieldEnum[]
  }

  /**
   * Asset.lifecycle
   */
  export type Asset$lifecycleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    where?: LifecycleEventWhereInput
    orderBy?: LifecycleEventOrderByWithRelationInput | LifecycleEventOrderByWithRelationInput[]
    cursor?: LifecycleEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LifecycleEventScalarFieldEnum | LifecycleEventScalarFieldEnum[]
  }

  /**
   * Asset without action
   */
  export type AssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
  }


  /**
   * Model AssetAssignment
   */

  export type AggregateAssetAssignment = {
    _count: AssetAssignmentCountAggregateOutputType | null
    _min: AssetAssignmentMinAggregateOutputType | null
    _max: AssetAssignmentMaxAggregateOutputType | null
  }

  export type AssetAssignmentMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    personId: string | null
    personName: string | null
    personEmail: string | null
    assignedAt: Date | null
    unassignedAt: Date | null
  }

  export type AssetAssignmentMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    personId: string | null
    personName: string | null
    personEmail: string | null
    assignedAt: Date | null
    unassignedAt: Date | null
  }

  export type AssetAssignmentCountAggregateOutputType = {
    id: number
    assetId: number
    personId: number
    personName: number
    personEmail: number
    assignedAt: number
    unassignedAt: number
    _all: number
  }


  export type AssetAssignmentMinAggregateInputType = {
    id?: true
    assetId?: true
    personId?: true
    personName?: true
    personEmail?: true
    assignedAt?: true
    unassignedAt?: true
  }

  export type AssetAssignmentMaxAggregateInputType = {
    id?: true
    assetId?: true
    personId?: true
    personName?: true
    personEmail?: true
    assignedAt?: true
    unassignedAt?: true
  }

  export type AssetAssignmentCountAggregateInputType = {
    id?: true
    assetId?: true
    personId?: true
    personName?: true
    personEmail?: true
    assignedAt?: true
    unassignedAt?: true
    _all?: true
  }

  export type AssetAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetAssignment to aggregate.
     */
    where?: AssetAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetAssignments to fetch.
     */
    orderBy?: AssetAssignmentOrderByWithRelationInput | AssetAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetAssignments
    **/
    _count?: true | AssetAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetAssignmentMaxAggregateInputType
  }

  export type GetAssetAssignmentAggregateType<T extends AssetAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetAssignment[P]>
      : GetScalarType<T[P], AggregateAssetAssignment[P]>
  }




  export type AssetAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetAssignmentWhereInput
    orderBy?: AssetAssignmentOrderByWithAggregationInput | AssetAssignmentOrderByWithAggregationInput[]
    by: AssetAssignmentScalarFieldEnum[] | AssetAssignmentScalarFieldEnum
    having?: AssetAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetAssignmentCountAggregateInputType | true
    _min?: AssetAssignmentMinAggregateInputType
    _max?: AssetAssignmentMaxAggregateInputType
  }

  export type AssetAssignmentGroupByOutputType = {
    id: string
    assetId: string
    personId: string
    personName: string | null
    personEmail: string | null
    assignedAt: Date
    unassignedAt: Date | null
    _count: AssetAssignmentCountAggregateOutputType | null
    _min: AssetAssignmentMinAggregateOutputType | null
    _max: AssetAssignmentMaxAggregateOutputType | null
  }

  type GetAssetAssignmentGroupByPayload<T extends AssetAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], AssetAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type AssetAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    personId?: boolean
    personName?: boolean
    personEmail?: boolean
    assignedAt?: boolean
    unassignedAt?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assetAssignment"]>

  export type AssetAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    personId?: boolean
    personName?: boolean
    personEmail?: boolean
    assignedAt?: boolean
    unassignedAt?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assetAssignment"]>

  export type AssetAssignmentSelectScalar = {
    id?: boolean
    assetId?: boolean
    personId?: boolean
    personName?: boolean
    personEmail?: boolean
    assignedAt?: boolean
    unassignedAt?: boolean
  }

  export type AssetAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }
  export type AssetAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }

  export type $AssetAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetAssignment"
    objects: {
      asset: Prisma.$AssetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      personId: string
      personName: string | null
      personEmail: string | null
      assignedAt: Date
      unassignedAt: Date | null
    }, ExtArgs["result"]["assetAssignment"]>
    composites: {}
  }

  type AssetAssignmentGetPayload<S extends boolean | null | undefined | AssetAssignmentDefaultArgs> = $Result.GetResult<Prisma.$AssetAssignmentPayload, S>

  type AssetAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AssetAssignmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AssetAssignmentCountAggregateInputType | true
    }

  export interface AssetAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetAssignment'], meta: { name: 'AssetAssignment' } }
    /**
     * Find zero or one AssetAssignment that matches the filter.
     * @param {AssetAssignmentFindUniqueArgs} args - Arguments to find a AssetAssignment
     * @example
     * // Get one AssetAssignment
     * const assetAssignment = await prisma.assetAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetAssignmentFindUniqueArgs>(args: SelectSubset<T, AssetAssignmentFindUniqueArgs<ExtArgs>>): Prisma__AssetAssignmentClient<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AssetAssignment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AssetAssignmentFindUniqueOrThrowArgs} args - Arguments to find a AssetAssignment
     * @example
     * // Get one AssetAssignment
     * const assetAssignment = await prisma.assetAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetAssignmentClient<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AssetAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAssignmentFindFirstArgs} args - Arguments to find a AssetAssignment
     * @example
     * // Get one AssetAssignment
     * const assetAssignment = await prisma.assetAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetAssignmentFindFirstArgs>(args?: SelectSubset<T, AssetAssignmentFindFirstArgs<ExtArgs>>): Prisma__AssetAssignmentClient<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AssetAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAssignmentFindFirstOrThrowArgs} args - Arguments to find a AssetAssignment
     * @example
     * // Get one AssetAssignment
     * const assetAssignment = await prisma.assetAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetAssignmentClient<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AssetAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetAssignments
     * const assetAssignments = await prisma.assetAssignment.findMany()
     * 
     * // Get first 10 AssetAssignments
     * const assetAssignments = await prisma.assetAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetAssignmentWithIdOnly = await prisma.assetAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetAssignmentFindManyArgs>(args?: SelectSubset<T, AssetAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AssetAssignment.
     * @param {AssetAssignmentCreateArgs} args - Arguments to create a AssetAssignment.
     * @example
     * // Create one AssetAssignment
     * const AssetAssignment = await prisma.assetAssignment.create({
     *   data: {
     *     // ... data to create a AssetAssignment
     *   }
     * })
     * 
     */
    create<T extends AssetAssignmentCreateArgs>(args: SelectSubset<T, AssetAssignmentCreateArgs<ExtArgs>>): Prisma__AssetAssignmentClient<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AssetAssignments.
     * @param {AssetAssignmentCreateManyArgs} args - Arguments to create many AssetAssignments.
     * @example
     * // Create many AssetAssignments
     * const assetAssignment = await prisma.assetAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetAssignmentCreateManyArgs>(args?: SelectSubset<T, AssetAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AssetAssignments and returns the data saved in the database.
     * @param {AssetAssignmentCreateManyAndReturnArgs} args - Arguments to create many AssetAssignments.
     * @example
     * // Create many AssetAssignments
     * const assetAssignment = await prisma.assetAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AssetAssignments and only return the `id`
     * const assetAssignmentWithIdOnly = await prisma.assetAssignment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AssetAssignment.
     * @param {AssetAssignmentDeleteArgs} args - Arguments to delete one AssetAssignment.
     * @example
     * // Delete one AssetAssignment
     * const AssetAssignment = await prisma.assetAssignment.delete({
     *   where: {
     *     // ... filter to delete one AssetAssignment
     *   }
     * })
     * 
     */
    delete<T extends AssetAssignmentDeleteArgs>(args: SelectSubset<T, AssetAssignmentDeleteArgs<ExtArgs>>): Prisma__AssetAssignmentClient<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AssetAssignment.
     * @param {AssetAssignmentUpdateArgs} args - Arguments to update one AssetAssignment.
     * @example
     * // Update one AssetAssignment
     * const assetAssignment = await prisma.assetAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetAssignmentUpdateArgs>(args: SelectSubset<T, AssetAssignmentUpdateArgs<ExtArgs>>): Prisma__AssetAssignmentClient<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AssetAssignments.
     * @param {AssetAssignmentDeleteManyArgs} args - Arguments to filter AssetAssignments to delete.
     * @example
     * // Delete a few AssetAssignments
     * const { count } = await prisma.assetAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetAssignmentDeleteManyArgs>(args?: SelectSubset<T, AssetAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetAssignments
     * const assetAssignment = await prisma.assetAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetAssignmentUpdateManyArgs>(args: SelectSubset<T, AssetAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AssetAssignment.
     * @param {AssetAssignmentUpsertArgs} args - Arguments to update or create a AssetAssignment.
     * @example
     * // Update or create a AssetAssignment
     * const assetAssignment = await prisma.assetAssignment.upsert({
     *   create: {
     *     // ... data to create a AssetAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetAssignment we want to update
     *   }
     * })
     */
    upsert<T extends AssetAssignmentUpsertArgs>(args: SelectSubset<T, AssetAssignmentUpsertArgs<ExtArgs>>): Prisma__AssetAssignmentClient<$Result.GetResult<Prisma.$AssetAssignmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AssetAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAssignmentCountArgs} args - Arguments to filter AssetAssignments to count.
     * @example
     * // Count the number of AssetAssignments
     * const count = await prisma.assetAssignment.count({
     *   where: {
     *     // ... the filter for the AssetAssignments we want to count
     *   }
     * })
    **/
    count<T extends AssetAssignmentCountArgs>(
      args?: Subset<T, AssetAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetAssignmentAggregateArgs>(args: Subset<T, AssetAssignmentAggregateArgs>): Prisma.PrismaPromise<GetAssetAssignmentAggregateType<T>>

    /**
     * Group by AssetAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: AssetAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetAssignment model
   */
  readonly fields: AssetAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    asset<T extends AssetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AssetDefaultArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AssetAssignment model
   */ 
  interface AssetAssignmentFieldRefs {
    readonly id: FieldRef<"AssetAssignment", 'String'>
    readonly assetId: FieldRef<"AssetAssignment", 'String'>
    readonly personId: FieldRef<"AssetAssignment", 'String'>
    readonly personName: FieldRef<"AssetAssignment", 'String'>
    readonly personEmail: FieldRef<"AssetAssignment", 'String'>
    readonly assignedAt: FieldRef<"AssetAssignment", 'DateTime'>
    readonly unassignedAt: FieldRef<"AssetAssignment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AssetAssignment findUnique
   */
  export type AssetAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which AssetAssignment to fetch.
     */
    where: AssetAssignmentWhereUniqueInput
  }

  /**
   * AssetAssignment findUniqueOrThrow
   */
  export type AssetAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which AssetAssignment to fetch.
     */
    where: AssetAssignmentWhereUniqueInput
  }

  /**
   * AssetAssignment findFirst
   */
  export type AssetAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which AssetAssignment to fetch.
     */
    where?: AssetAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetAssignments to fetch.
     */
    orderBy?: AssetAssignmentOrderByWithRelationInput | AssetAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetAssignments.
     */
    cursor?: AssetAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetAssignments.
     */
    distinct?: AssetAssignmentScalarFieldEnum | AssetAssignmentScalarFieldEnum[]
  }

  /**
   * AssetAssignment findFirstOrThrow
   */
  export type AssetAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which AssetAssignment to fetch.
     */
    where?: AssetAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetAssignments to fetch.
     */
    orderBy?: AssetAssignmentOrderByWithRelationInput | AssetAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetAssignments.
     */
    cursor?: AssetAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetAssignments.
     */
    distinct?: AssetAssignmentScalarFieldEnum | AssetAssignmentScalarFieldEnum[]
  }

  /**
   * AssetAssignment findMany
   */
  export type AssetAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which AssetAssignments to fetch.
     */
    where?: AssetAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetAssignments to fetch.
     */
    orderBy?: AssetAssignmentOrderByWithRelationInput | AssetAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetAssignments.
     */
    cursor?: AssetAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetAssignments.
     */
    skip?: number
    distinct?: AssetAssignmentScalarFieldEnum | AssetAssignmentScalarFieldEnum[]
  }

  /**
   * AssetAssignment create
   */
  export type AssetAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a AssetAssignment.
     */
    data: XOR<AssetAssignmentCreateInput, AssetAssignmentUncheckedCreateInput>
  }

  /**
   * AssetAssignment createMany
   */
  export type AssetAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetAssignments.
     */
    data: AssetAssignmentCreateManyInput | AssetAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AssetAssignment createManyAndReturn
   */
  export type AssetAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AssetAssignments.
     */
    data: AssetAssignmentCreateManyInput | AssetAssignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AssetAssignment update
   */
  export type AssetAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a AssetAssignment.
     */
    data: XOR<AssetAssignmentUpdateInput, AssetAssignmentUncheckedUpdateInput>
    /**
     * Choose, which AssetAssignment to update.
     */
    where: AssetAssignmentWhereUniqueInput
  }

  /**
   * AssetAssignment updateMany
   */
  export type AssetAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetAssignments.
     */
    data: XOR<AssetAssignmentUpdateManyMutationInput, AssetAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which AssetAssignments to update
     */
    where?: AssetAssignmentWhereInput
  }

  /**
   * AssetAssignment upsert
   */
  export type AssetAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the AssetAssignment to update in case it exists.
     */
    where: AssetAssignmentWhereUniqueInput
    /**
     * In case the AssetAssignment found by the `where` argument doesn't exist, create a new AssetAssignment with this data.
     */
    create: XOR<AssetAssignmentCreateInput, AssetAssignmentUncheckedCreateInput>
    /**
     * In case the AssetAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetAssignmentUpdateInput, AssetAssignmentUncheckedUpdateInput>
  }

  /**
   * AssetAssignment delete
   */
  export type AssetAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
    /**
     * Filter which AssetAssignment to delete.
     */
    where: AssetAssignmentWhereUniqueInput
  }

  /**
   * AssetAssignment deleteMany
   */
  export type AssetAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetAssignments to delete
     */
    where?: AssetAssignmentWhereInput
  }

  /**
   * AssetAssignment without action
   */
  export type AssetAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetAssignment
     */
    select?: AssetAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model LifecycleEvent
   */

  export type AggregateLifecycleEvent = {
    _count: LifecycleEventCountAggregateOutputType | null
    _min: LifecycleEventMinAggregateOutputType | null
    _max: LifecycleEventMaxAggregateOutputType | null
  }

  export type LifecycleEventMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    action: string | null
    actorId: string | null
    occurredAt: Date | null
  }

  export type LifecycleEventMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    action: string | null
    actorId: string | null
    occurredAt: Date | null
  }

  export type LifecycleEventCountAggregateOutputType = {
    id: number
    assetId: number
    action: number
    actorId: number
    metadata: number
    occurredAt: number
    _all: number
  }


  export type LifecycleEventMinAggregateInputType = {
    id?: true
    assetId?: true
    action?: true
    actorId?: true
    occurredAt?: true
  }

  export type LifecycleEventMaxAggregateInputType = {
    id?: true
    assetId?: true
    action?: true
    actorId?: true
    occurredAt?: true
  }

  export type LifecycleEventCountAggregateInputType = {
    id?: true
    assetId?: true
    action?: true
    actorId?: true
    metadata?: true
    occurredAt?: true
    _all?: true
  }

  export type LifecycleEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifecycleEvent to aggregate.
     */
    where?: LifecycleEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifecycleEvents to fetch.
     */
    orderBy?: LifecycleEventOrderByWithRelationInput | LifecycleEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LifecycleEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifecycleEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifecycleEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LifecycleEvents
    **/
    _count?: true | LifecycleEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LifecycleEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LifecycleEventMaxAggregateInputType
  }

  export type GetLifecycleEventAggregateType<T extends LifecycleEventAggregateArgs> = {
        [P in keyof T & keyof AggregateLifecycleEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLifecycleEvent[P]>
      : GetScalarType<T[P], AggregateLifecycleEvent[P]>
  }




  export type LifecycleEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifecycleEventWhereInput
    orderBy?: LifecycleEventOrderByWithAggregationInput | LifecycleEventOrderByWithAggregationInput[]
    by: LifecycleEventScalarFieldEnum[] | LifecycleEventScalarFieldEnum
    having?: LifecycleEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LifecycleEventCountAggregateInputType | true
    _min?: LifecycleEventMinAggregateInputType
    _max?: LifecycleEventMaxAggregateInputType
  }

  export type LifecycleEventGroupByOutputType = {
    id: string
    assetId: string
    action: string
    actorId: string | null
    metadata: JsonValue | null
    occurredAt: Date
    _count: LifecycleEventCountAggregateOutputType | null
    _min: LifecycleEventMinAggregateOutputType | null
    _max: LifecycleEventMaxAggregateOutputType | null
  }

  type GetLifecycleEventGroupByPayload<T extends LifecycleEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LifecycleEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LifecycleEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LifecycleEventGroupByOutputType[P]>
            : GetScalarType<T[P], LifecycleEventGroupByOutputType[P]>
        }
      >
    >


  export type LifecycleEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    action?: boolean
    actorId?: boolean
    metadata?: boolean
    occurredAt?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifecycleEvent"]>

  export type LifecycleEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    action?: boolean
    actorId?: boolean
    metadata?: boolean
    occurredAt?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifecycleEvent"]>

  export type LifecycleEventSelectScalar = {
    id?: boolean
    assetId?: boolean
    action?: boolean
    actorId?: boolean
    metadata?: boolean
    occurredAt?: boolean
  }

  export type LifecycleEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }
  export type LifecycleEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
  }

  export type $LifecycleEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LifecycleEvent"
    objects: {
      asset: Prisma.$AssetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      action: string
      actorId: string | null
      metadata: Prisma.JsonValue | null
      occurredAt: Date
    }, ExtArgs["result"]["lifecycleEvent"]>
    composites: {}
  }

  type LifecycleEventGetPayload<S extends boolean | null | undefined | LifecycleEventDefaultArgs> = $Result.GetResult<Prisma.$LifecycleEventPayload, S>

  type LifecycleEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LifecycleEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LifecycleEventCountAggregateInputType | true
    }

  export interface LifecycleEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LifecycleEvent'], meta: { name: 'LifecycleEvent' } }
    /**
     * Find zero or one LifecycleEvent that matches the filter.
     * @param {LifecycleEventFindUniqueArgs} args - Arguments to find a LifecycleEvent
     * @example
     * // Get one LifecycleEvent
     * const lifecycleEvent = await prisma.lifecycleEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LifecycleEventFindUniqueArgs>(args: SelectSubset<T, LifecycleEventFindUniqueArgs<ExtArgs>>): Prisma__LifecycleEventClient<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LifecycleEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LifecycleEventFindUniqueOrThrowArgs} args - Arguments to find a LifecycleEvent
     * @example
     * // Get one LifecycleEvent
     * const lifecycleEvent = await prisma.lifecycleEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LifecycleEventFindUniqueOrThrowArgs>(args: SelectSubset<T, LifecycleEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LifecycleEventClient<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LifecycleEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifecycleEventFindFirstArgs} args - Arguments to find a LifecycleEvent
     * @example
     * // Get one LifecycleEvent
     * const lifecycleEvent = await prisma.lifecycleEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LifecycleEventFindFirstArgs>(args?: SelectSubset<T, LifecycleEventFindFirstArgs<ExtArgs>>): Prisma__LifecycleEventClient<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LifecycleEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifecycleEventFindFirstOrThrowArgs} args - Arguments to find a LifecycleEvent
     * @example
     * // Get one LifecycleEvent
     * const lifecycleEvent = await prisma.lifecycleEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LifecycleEventFindFirstOrThrowArgs>(args?: SelectSubset<T, LifecycleEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__LifecycleEventClient<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LifecycleEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifecycleEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LifecycleEvents
     * const lifecycleEvents = await prisma.lifecycleEvent.findMany()
     * 
     * // Get first 10 LifecycleEvents
     * const lifecycleEvents = await prisma.lifecycleEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lifecycleEventWithIdOnly = await prisma.lifecycleEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LifecycleEventFindManyArgs>(args?: SelectSubset<T, LifecycleEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LifecycleEvent.
     * @param {LifecycleEventCreateArgs} args - Arguments to create a LifecycleEvent.
     * @example
     * // Create one LifecycleEvent
     * const LifecycleEvent = await prisma.lifecycleEvent.create({
     *   data: {
     *     // ... data to create a LifecycleEvent
     *   }
     * })
     * 
     */
    create<T extends LifecycleEventCreateArgs>(args: SelectSubset<T, LifecycleEventCreateArgs<ExtArgs>>): Prisma__LifecycleEventClient<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LifecycleEvents.
     * @param {LifecycleEventCreateManyArgs} args - Arguments to create many LifecycleEvents.
     * @example
     * // Create many LifecycleEvents
     * const lifecycleEvent = await prisma.lifecycleEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LifecycleEventCreateManyArgs>(args?: SelectSubset<T, LifecycleEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LifecycleEvents and returns the data saved in the database.
     * @param {LifecycleEventCreateManyAndReturnArgs} args - Arguments to create many LifecycleEvents.
     * @example
     * // Create many LifecycleEvents
     * const lifecycleEvent = await prisma.lifecycleEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LifecycleEvents and only return the `id`
     * const lifecycleEventWithIdOnly = await prisma.lifecycleEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LifecycleEventCreateManyAndReturnArgs>(args?: SelectSubset<T, LifecycleEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LifecycleEvent.
     * @param {LifecycleEventDeleteArgs} args - Arguments to delete one LifecycleEvent.
     * @example
     * // Delete one LifecycleEvent
     * const LifecycleEvent = await prisma.lifecycleEvent.delete({
     *   where: {
     *     // ... filter to delete one LifecycleEvent
     *   }
     * })
     * 
     */
    delete<T extends LifecycleEventDeleteArgs>(args: SelectSubset<T, LifecycleEventDeleteArgs<ExtArgs>>): Prisma__LifecycleEventClient<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LifecycleEvent.
     * @param {LifecycleEventUpdateArgs} args - Arguments to update one LifecycleEvent.
     * @example
     * // Update one LifecycleEvent
     * const lifecycleEvent = await prisma.lifecycleEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LifecycleEventUpdateArgs>(args: SelectSubset<T, LifecycleEventUpdateArgs<ExtArgs>>): Prisma__LifecycleEventClient<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LifecycleEvents.
     * @param {LifecycleEventDeleteManyArgs} args - Arguments to filter LifecycleEvents to delete.
     * @example
     * // Delete a few LifecycleEvents
     * const { count } = await prisma.lifecycleEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LifecycleEventDeleteManyArgs>(args?: SelectSubset<T, LifecycleEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifecycleEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifecycleEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LifecycleEvents
     * const lifecycleEvent = await prisma.lifecycleEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LifecycleEventUpdateManyArgs>(args: SelectSubset<T, LifecycleEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LifecycleEvent.
     * @param {LifecycleEventUpsertArgs} args - Arguments to update or create a LifecycleEvent.
     * @example
     * // Update or create a LifecycleEvent
     * const lifecycleEvent = await prisma.lifecycleEvent.upsert({
     *   create: {
     *     // ... data to create a LifecycleEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LifecycleEvent we want to update
     *   }
     * })
     */
    upsert<T extends LifecycleEventUpsertArgs>(args: SelectSubset<T, LifecycleEventUpsertArgs<ExtArgs>>): Prisma__LifecycleEventClient<$Result.GetResult<Prisma.$LifecycleEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LifecycleEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifecycleEventCountArgs} args - Arguments to filter LifecycleEvents to count.
     * @example
     * // Count the number of LifecycleEvents
     * const count = await prisma.lifecycleEvent.count({
     *   where: {
     *     // ... the filter for the LifecycleEvents we want to count
     *   }
     * })
    **/
    count<T extends LifecycleEventCountArgs>(
      args?: Subset<T, LifecycleEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LifecycleEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LifecycleEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifecycleEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LifecycleEventAggregateArgs>(args: Subset<T, LifecycleEventAggregateArgs>): Prisma.PrismaPromise<GetLifecycleEventAggregateType<T>>

    /**
     * Group by LifecycleEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifecycleEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LifecycleEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LifecycleEventGroupByArgs['orderBy'] }
        : { orderBy?: LifecycleEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LifecycleEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLifecycleEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LifecycleEvent model
   */
  readonly fields: LifecycleEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LifecycleEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LifecycleEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    asset<T extends AssetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AssetDefaultArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LifecycleEvent model
   */ 
  interface LifecycleEventFieldRefs {
    readonly id: FieldRef<"LifecycleEvent", 'String'>
    readonly assetId: FieldRef<"LifecycleEvent", 'String'>
    readonly action: FieldRef<"LifecycleEvent", 'String'>
    readonly actorId: FieldRef<"LifecycleEvent", 'String'>
    readonly metadata: FieldRef<"LifecycleEvent", 'Json'>
    readonly occurredAt: FieldRef<"LifecycleEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LifecycleEvent findUnique
   */
  export type LifecycleEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * Filter, which LifecycleEvent to fetch.
     */
    where: LifecycleEventWhereUniqueInput
  }

  /**
   * LifecycleEvent findUniqueOrThrow
   */
  export type LifecycleEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * Filter, which LifecycleEvent to fetch.
     */
    where: LifecycleEventWhereUniqueInput
  }

  /**
   * LifecycleEvent findFirst
   */
  export type LifecycleEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * Filter, which LifecycleEvent to fetch.
     */
    where?: LifecycleEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifecycleEvents to fetch.
     */
    orderBy?: LifecycleEventOrderByWithRelationInput | LifecycleEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifecycleEvents.
     */
    cursor?: LifecycleEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifecycleEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifecycleEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifecycleEvents.
     */
    distinct?: LifecycleEventScalarFieldEnum | LifecycleEventScalarFieldEnum[]
  }

  /**
   * LifecycleEvent findFirstOrThrow
   */
  export type LifecycleEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * Filter, which LifecycleEvent to fetch.
     */
    where?: LifecycleEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifecycleEvents to fetch.
     */
    orderBy?: LifecycleEventOrderByWithRelationInput | LifecycleEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifecycleEvents.
     */
    cursor?: LifecycleEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifecycleEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifecycleEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifecycleEvents.
     */
    distinct?: LifecycleEventScalarFieldEnum | LifecycleEventScalarFieldEnum[]
  }

  /**
   * LifecycleEvent findMany
   */
  export type LifecycleEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * Filter, which LifecycleEvents to fetch.
     */
    where?: LifecycleEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifecycleEvents to fetch.
     */
    orderBy?: LifecycleEventOrderByWithRelationInput | LifecycleEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LifecycleEvents.
     */
    cursor?: LifecycleEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifecycleEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifecycleEvents.
     */
    skip?: number
    distinct?: LifecycleEventScalarFieldEnum | LifecycleEventScalarFieldEnum[]
  }

  /**
   * LifecycleEvent create
   */
  export type LifecycleEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * The data needed to create a LifecycleEvent.
     */
    data: XOR<LifecycleEventCreateInput, LifecycleEventUncheckedCreateInput>
  }

  /**
   * LifecycleEvent createMany
   */
  export type LifecycleEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LifecycleEvents.
     */
    data: LifecycleEventCreateManyInput | LifecycleEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LifecycleEvent createManyAndReturn
   */
  export type LifecycleEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LifecycleEvents.
     */
    data: LifecycleEventCreateManyInput | LifecycleEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifecycleEvent update
   */
  export type LifecycleEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * The data needed to update a LifecycleEvent.
     */
    data: XOR<LifecycleEventUpdateInput, LifecycleEventUncheckedUpdateInput>
    /**
     * Choose, which LifecycleEvent to update.
     */
    where: LifecycleEventWhereUniqueInput
  }

  /**
   * LifecycleEvent updateMany
   */
  export type LifecycleEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LifecycleEvents.
     */
    data: XOR<LifecycleEventUpdateManyMutationInput, LifecycleEventUncheckedUpdateManyInput>
    /**
     * Filter which LifecycleEvents to update
     */
    where?: LifecycleEventWhereInput
  }

  /**
   * LifecycleEvent upsert
   */
  export type LifecycleEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * The filter to search for the LifecycleEvent to update in case it exists.
     */
    where: LifecycleEventWhereUniqueInput
    /**
     * In case the LifecycleEvent found by the `where` argument doesn't exist, create a new LifecycleEvent with this data.
     */
    create: XOR<LifecycleEventCreateInput, LifecycleEventUncheckedCreateInput>
    /**
     * In case the LifecycleEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LifecycleEventUpdateInput, LifecycleEventUncheckedUpdateInput>
  }

  /**
   * LifecycleEvent delete
   */
  export type LifecycleEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
    /**
     * Filter which LifecycleEvent to delete.
     */
    where: LifecycleEventWhereUniqueInput
  }

  /**
   * LifecycleEvent deleteMany
   */
  export type LifecycleEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifecycleEvents to delete
     */
    where?: LifecycleEventWhereInput
  }

  /**
   * LifecycleEvent without action
   */
  export type LifecycleEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifecycleEvent
     */
    select?: LifecycleEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifecycleEventInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    entity: string | null
    entityId: string | null
    action: string | null
    actorId: string | null
    at: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    entity: string | null
    entityId: string | null
    action: string | null
    actorId: string | null
    at: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    entity: number
    entityId: number
    action: number
    actorId: number
    at: number
    metadata: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    entity?: true
    entityId?: true
    action?: true
    actorId?: true
    at?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    entity?: true
    entityId?: true
    action?: true
    actorId?: true
    at?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    entity?: true
    entityId?: true
    action?: true
    actorId?: true
    at?: true
    metadata?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    entity: string
    entityId: string
    action: string
    actorId: string | null
    at: Date
    metadata: JsonValue | null
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entity?: boolean
    entityId?: boolean
    action?: boolean
    actorId?: boolean
    at?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entity?: boolean
    entityId?: boolean
    action?: boolean
    actorId?: boolean
    at?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    entity?: boolean
    entityId?: boolean
    action?: boolean
    actorId?: boolean
    at?: boolean
    metadata?: boolean
  }


  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entity: string
      entityId: string
      action: string
      actorId: string | null
      at: Date
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */ 
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly entity: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly actorId: FieldRef<"AuditLog", 'String'>
    readonly at: FieldRef<"AuditLog", 'DateTime'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AssetTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type AssetTypeScalarFieldEnum = (typeof AssetTypeScalarFieldEnum)[keyof typeof AssetTypeScalarFieldEnum]


  export const AssetScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    type: 'type',
    description: 'description',
    fundingDepartment: 'fundingDepartment',
    manufacturer: 'manufacturer',
    model: 'model',
    modelGeneration: 'modelGeneration',
    serialNumber: 'serialNumber',
    vendor: 'vendor',
    memory: 'memory',
    hddSize: 'hddSize',
    hddType: 'hddType',
    cpuGeneration: 'cpuGeneration',
    cpuSpeed: 'cpuSpeed',
    gpuModel: 'gpuModel',
    videoCard: 'videoCard',
    wiredMac: 'wiredMac',
    wirelessMac: 'wirelessMac',
    output1: 'output1',
    output2: 'output2',
    receivedDate: 'receivedDate',
    cost: 'cost',
    po: 'po',
    disposalDate: 'disposalDate',
    disposalType: 'disposalType',
    location: 'location',
    status: 'status',
    assignedToId: 'assignedToId',
    assignedToName: 'assignedToName',
    assignedToEmail: 'assignedToEmail',
    assignedDate: 'assignedDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    assetTypeId: 'assetTypeId'
  };

  export type AssetScalarFieldEnum = (typeof AssetScalarFieldEnum)[keyof typeof AssetScalarFieldEnum]


  export const AssetAssignmentScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    personId: 'personId',
    personName: 'personName',
    personEmail: 'personEmail',
    assignedAt: 'assignedAt',
    unassignedAt: 'unassignedAt'
  };

  export type AssetAssignmentScalarFieldEnum = (typeof AssetAssignmentScalarFieldEnum)[keyof typeof AssetAssignmentScalarFieldEnum]


  export const LifecycleEventScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    action: 'action',
    actorId: 'actorId',
    metadata: 'metadata',
    occurredAt: 'occurredAt'
  };

  export type LifecycleEventScalarFieldEnum = (typeof LifecycleEventScalarFieldEnum)[keyof typeof LifecycleEventScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    entity: 'entity',
    entityId: 'entityId',
    action: 'action',
    actorId: 'actorId',
    at: 'at',
    metadata: 'metadata'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'AssetStatus'
   */
  export type EnumAssetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetStatus'>
    


  /**
   * Reference to a field of type 'AssetStatus[]'
   */
  export type ListEnumAssetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type AssetTypeWhereInput = {
    AND?: AssetTypeWhereInput | AssetTypeWhereInput[]
    OR?: AssetTypeWhereInput[]
    NOT?: AssetTypeWhereInput | AssetTypeWhereInput[]
    id?: StringFilter<"AssetType"> | string
    name?: StringFilter<"AssetType"> | string
    createdAt?: DateTimeFilter<"AssetType"> | Date | string
    assets?: AssetListRelationFilter
  }

  export type AssetTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    assets?: AssetOrderByRelationAggregateInput
  }

  export type AssetTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: AssetTypeWhereInput | AssetTypeWhereInput[]
    OR?: AssetTypeWhereInput[]
    NOT?: AssetTypeWhereInput | AssetTypeWhereInput[]
    createdAt?: DateTimeFilter<"AssetType"> | Date | string
    assets?: AssetListRelationFilter
  }, "id" | "name">

  export type AssetTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    _count?: AssetTypeCountOrderByAggregateInput
    _max?: AssetTypeMaxOrderByAggregateInput
    _min?: AssetTypeMinOrderByAggregateInput
  }

  export type AssetTypeScalarWhereWithAggregatesInput = {
    AND?: AssetTypeScalarWhereWithAggregatesInput | AssetTypeScalarWhereWithAggregatesInput[]
    OR?: AssetTypeScalarWhereWithAggregatesInput[]
    NOT?: AssetTypeScalarWhereWithAggregatesInput | AssetTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssetType"> | string
    name?: StringWithAggregatesFilter<"AssetType"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AssetType"> | Date | string
  }

  export type AssetWhereInput = {
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    id?: StringFilter<"Asset"> | string
    assetId?: StringFilter<"Asset"> | string
    type?: StringFilter<"Asset"> | string
    description?: StringFilter<"Asset"> | string
    fundingDepartment?: StringFilter<"Asset"> | string
    manufacturer?: StringNullableFilter<"Asset"> | string | null
    model?: StringNullableFilter<"Asset"> | string | null
    modelGeneration?: StringNullableFilter<"Asset"> | string | null
    serialNumber?: StringNullableFilter<"Asset"> | string | null
    vendor?: StringNullableFilter<"Asset"> | string | null
    memory?: StringNullableFilter<"Asset"> | string | null
    hddSize?: StringNullableFilter<"Asset"> | string | null
    hddType?: StringNullableFilter<"Asset"> | string | null
    cpuGeneration?: StringNullableFilter<"Asset"> | string | null
    cpuSpeed?: StringNullableFilter<"Asset"> | string | null
    gpuModel?: StringNullableFilter<"Asset"> | string | null
    videoCard?: StringNullableFilter<"Asset"> | string | null
    wiredMac?: StringNullableFilter<"Asset"> | string | null
    wirelessMac?: StringNullableFilter<"Asset"> | string | null
    output1?: StringNullableFilter<"Asset"> | string | null
    output2?: StringNullableFilter<"Asset"> | string | null
    receivedDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    cost?: FloatNullableFilter<"Asset"> | number | null
    po?: StringNullableFilter<"Asset"> | string | null
    disposalDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    disposalType?: StringNullableFilter<"Asset"> | string | null
    location?: StringNullableFilter<"Asset"> | string | null
    status?: EnumAssetStatusFilter<"Asset"> | $Enums.AssetStatus
    assignedToId?: StringNullableFilter<"Asset"> | string | null
    assignedToName?: StringNullableFilter<"Asset"> | string | null
    assignedToEmail?: StringNullableFilter<"Asset"> | string | null
    assignedDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    createdAt?: DateTimeFilter<"Asset"> | Date | string
    updatedAt?: DateTimeFilter<"Asset"> | Date | string
    assetTypeId?: StringNullableFilter<"Asset"> | string | null
    assetType?: XOR<AssetTypeNullableRelationFilter, AssetTypeWhereInput> | null
    assignments?: AssetAssignmentListRelationFilter
    lifecycle?: LifecycleEventListRelationFilter
  }

  export type AssetOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    fundingDepartment?: SortOrder
    manufacturer?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    modelGeneration?: SortOrderInput | SortOrder
    serialNumber?: SortOrderInput | SortOrder
    vendor?: SortOrderInput | SortOrder
    memory?: SortOrderInput | SortOrder
    hddSize?: SortOrderInput | SortOrder
    hddType?: SortOrderInput | SortOrder
    cpuGeneration?: SortOrderInput | SortOrder
    cpuSpeed?: SortOrderInput | SortOrder
    gpuModel?: SortOrderInput | SortOrder
    videoCard?: SortOrderInput | SortOrder
    wiredMac?: SortOrderInput | SortOrder
    wirelessMac?: SortOrderInput | SortOrder
    output1?: SortOrderInput | SortOrder
    output2?: SortOrderInput | SortOrder
    receivedDate?: SortOrderInput | SortOrder
    cost?: SortOrderInput | SortOrder
    po?: SortOrderInput | SortOrder
    disposalDate?: SortOrderInput | SortOrder
    disposalType?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    status?: SortOrder
    assignedToId?: SortOrderInput | SortOrder
    assignedToName?: SortOrderInput | SortOrder
    assignedToEmail?: SortOrderInput | SortOrder
    assignedDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assetTypeId?: SortOrderInput | SortOrder
    assetType?: AssetTypeOrderByWithRelationInput
    assignments?: AssetAssignmentOrderByRelationAggregateInput
    lifecycle?: LifecycleEventOrderByRelationAggregateInput
  }

  export type AssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    assetId?: string
    serialNumber?: string
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    type?: StringFilter<"Asset"> | string
    description?: StringFilter<"Asset"> | string
    fundingDepartment?: StringFilter<"Asset"> | string
    manufacturer?: StringNullableFilter<"Asset"> | string | null
    model?: StringNullableFilter<"Asset"> | string | null
    modelGeneration?: StringNullableFilter<"Asset"> | string | null
    vendor?: StringNullableFilter<"Asset"> | string | null
    memory?: StringNullableFilter<"Asset"> | string | null
    hddSize?: StringNullableFilter<"Asset"> | string | null
    hddType?: StringNullableFilter<"Asset"> | string | null
    cpuGeneration?: StringNullableFilter<"Asset"> | string | null
    cpuSpeed?: StringNullableFilter<"Asset"> | string | null
    gpuModel?: StringNullableFilter<"Asset"> | string | null
    videoCard?: StringNullableFilter<"Asset"> | string | null
    wiredMac?: StringNullableFilter<"Asset"> | string | null
    wirelessMac?: StringNullableFilter<"Asset"> | string | null
    output1?: StringNullableFilter<"Asset"> | string | null
    output2?: StringNullableFilter<"Asset"> | string | null
    receivedDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    cost?: FloatNullableFilter<"Asset"> | number | null
    po?: StringNullableFilter<"Asset"> | string | null
    disposalDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    disposalType?: StringNullableFilter<"Asset"> | string | null
    location?: StringNullableFilter<"Asset"> | string | null
    status?: EnumAssetStatusFilter<"Asset"> | $Enums.AssetStatus
    assignedToId?: StringNullableFilter<"Asset"> | string | null
    assignedToName?: StringNullableFilter<"Asset"> | string | null
    assignedToEmail?: StringNullableFilter<"Asset"> | string | null
    assignedDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    createdAt?: DateTimeFilter<"Asset"> | Date | string
    updatedAt?: DateTimeFilter<"Asset"> | Date | string
    assetTypeId?: StringNullableFilter<"Asset"> | string | null
    assetType?: XOR<AssetTypeNullableRelationFilter, AssetTypeWhereInput> | null
    assignments?: AssetAssignmentListRelationFilter
    lifecycle?: LifecycleEventListRelationFilter
  }, "id" | "assetId" | "serialNumber">

  export type AssetOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    fundingDepartment?: SortOrder
    manufacturer?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    modelGeneration?: SortOrderInput | SortOrder
    serialNumber?: SortOrderInput | SortOrder
    vendor?: SortOrderInput | SortOrder
    memory?: SortOrderInput | SortOrder
    hddSize?: SortOrderInput | SortOrder
    hddType?: SortOrderInput | SortOrder
    cpuGeneration?: SortOrderInput | SortOrder
    cpuSpeed?: SortOrderInput | SortOrder
    gpuModel?: SortOrderInput | SortOrder
    videoCard?: SortOrderInput | SortOrder
    wiredMac?: SortOrderInput | SortOrder
    wirelessMac?: SortOrderInput | SortOrder
    output1?: SortOrderInput | SortOrder
    output2?: SortOrderInput | SortOrder
    receivedDate?: SortOrderInput | SortOrder
    cost?: SortOrderInput | SortOrder
    po?: SortOrderInput | SortOrder
    disposalDate?: SortOrderInput | SortOrder
    disposalType?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    status?: SortOrder
    assignedToId?: SortOrderInput | SortOrder
    assignedToName?: SortOrderInput | SortOrder
    assignedToEmail?: SortOrderInput | SortOrder
    assignedDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assetTypeId?: SortOrderInput | SortOrder
    _count?: AssetCountOrderByAggregateInput
    _avg?: AssetAvgOrderByAggregateInput
    _max?: AssetMaxOrderByAggregateInput
    _min?: AssetMinOrderByAggregateInput
    _sum?: AssetSumOrderByAggregateInput
  }

  export type AssetScalarWhereWithAggregatesInput = {
    AND?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    OR?: AssetScalarWhereWithAggregatesInput[]
    NOT?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Asset"> | string
    assetId?: StringWithAggregatesFilter<"Asset"> | string
    type?: StringWithAggregatesFilter<"Asset"> | string
    description?: StringWithAggregatesFilter<"Asset"> | string
    fundingDepartment?: StringWithAggregatesFilter<"Asset"> | string
    manufacturer?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    model?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    modelGeneration?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    serialNumber?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    vendor?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    memory?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    hddSize?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    hddType?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    cpuGeneration?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    cpuSpeed?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    gpuModel?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    videoCard?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    wiredMac?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    wirelessMac?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    output1?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    output2?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    receivedDate?: DateTimeNullableWithAggregatesFilter<"Asset"> | Date | string | null
    cost?: FloatNullableWithAggregatesFilter<"Asset"> | number | null
    po?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    disposalDate?: DateTimeNullableWithAggregatesFilter<"Asset"> | Date | string | null
    disposalType?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    location?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    status?: EnumAssetStatusWithAggregatesFilter<"Asset"> | $Enums.AssetStatus
    assignedToId?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    assignedToName?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    assignedToEmail?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    assignedDate?: DateTimeNullableWithAggregatesFilter<"Asset"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Asset"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Asset"> | Date | string
    assetTypeId?: StringNullableWithAggregatesFilter<"Asset"> | string | null
  }

  export type AssetAssignmentWhereInput = {
    AND?: AssetAssignmentWhereInput | AssetAssignmentWhereInput[]
    OR?: AssetAssignmentWhereInput[]
    NOT?: AssetAssignmentWhereInput | AssetAssignmentWhereInput[]
    id?: StringFilter<"AssetAssignment"> | string
    assetId?: StringFilter<"AssetAssignment"> | string
    personId?: StringFilter<"AssetAssignment"> | string
    personName?: StringNullableFilter<"AssetAssignment"> | string | null
    personEmail?: StringNullableFilter<"AssetAssignment"> | string | null
    assignedAt?: DateTimeFilter<"AssetAssignment"> | Date | string
    unassignedAt?: DateTimeNullableFilter<"AssetAssignment"> | Date | string | null
    asset?: XOR<AssetRelationFilter, AssetWhereInput>
  }

  export type AssetAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    personId?: SortOrder
    personName?: SortOrderInput | SortOrder
    personEmail?: SortOrderInput | SortOrder
    assignedAt?: SortOrder
    unassignedAt?: SortOrderInput | SortOrder
    asset?: AssetOrderByWithRelationInput
  }

  export type AssetAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AssetAssignmentWhereInput | AssetAssignmentWhereInput[]
    OR?: AssetAssignmentWhereInput[]
    NOT?: AssetAssignmentWhereInput | AssetAssignmentWhereInput[]
    assetId?: StringFilter<"AssetAssignment"> | string
    personId?: StringFilter<"AssetAssignment"> | string
    personName?: StringNullableFilter<"AssetAssignment"> | string | null
    personEmail?: StringNullableFilter<"AssetAssignment"> | string | null
    assignedAt?: DateTimeFilter<"AssetAssignment"> | Date | string
    unassignedAt?: DateTimeNullableFilter<"AssetAssignment"> | Date | string | null
    asset?: XOR<AssetRelationFilter, AssetWhereInput>
  }, "id">

  export type AssetAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    personId?: SortOrder
    personName?: SortOrderInput | SortOrder
    personEmail?: SortOrderInput | SortOrder
    assignedAt?: SortOrder
    unassignedAt?: SortOrderInput | SortOrder
    _count?: AssetAssignmentCountOrderByAggregateInput
    _max?: AssetAssignmentMaxOrderByAggregateInput
    _min?: AssetAssignmentMinOrderByAggregateInput
  }

  export type AssetAssignmentScalarWhereWithAggregatesInput = {
    AND?: AssetAssignmentScalarWhereWithAggregatesInput | AssetAssignmentScalarWhereWithAggregatesInput[]
    OR?: AssetAssignmentScalarWhereWithAggregatesInput[]
    NOT?: AssetAssignmentScalarWhereWithAggregatesInput | AssetAssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssetAssignment"> | string
    assetId?: StringWithAggregatesFilter<"AssetAssignment"> | string
    personId?: StringWithAggregatesFilter<"AssetAssignment"> | string
    personName?: StringNullableWithAggregatesFilter<"AssetAssignment"> | string | null
    personEmail?: StringNullableWithAggregatesFilter<"AssetAssignment"> | string | null
    assignedAt?: DateTimeWithAggregatesFilter<"AssetAssignment"> | Date | string
    unassignedAt?: DateTimeNullableWithAggregatesFilter<"AssetAssignment"> | Date | string | null
  }

  export type LifecycleEventWhereInput = {
    AND?: LifecycleEventWhereInput | LifecycleEventWhereInput[]
    OR?: LifecycleEventWhereInput[]
    NOT?: LifecycleEventWhereInput | LifecycleEventWhereInput[]
    id?: StringFilter<"LifecycleEvent"> | string
    assetId?: StringFilter<"LifecycleEvent"> | string
    action?: StringFilter<"LifecycleEvent"> | string
    actorId?: StringNullableFilter<"LifecycleEvent"> | string | null
    metadata?: JsonNullableFilter<"LifecycleEvent">
    occurredAt?: DateTimeFilter<"LifecycleEvent"> | Date | string
    asset?: XOR<AssetRelationFilter, AssetWhereInput>
  }

  export type LifecycleEventOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    actorId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    occurredAt?: SortOrder
    asset?: AssetOrderByWithRelationInput
  }

  export type LifecycleEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LifecycleEventWhereInput | LifecycleEventWhereInput[]
    OR?: LifecycleEventWhereInput[]
    NOT?: LifecycleEventWhereInput | LifecycleEventWhereInput[]
    assetId?: StringFilter<"LifecycleEvent"> | string
    action?: StringFilter<"LifecycleEvent"> | string
    actorId?: StringNullableFilter<"LifecycleEvent"> | string | null
    metadata?: JsonNullableFilter<"LifecycleEvent">
    occurredAt?: DateTimeFilter<"LifecycleEvent"> | Date | string
    asset?: XOR<AssetRelationFilter, AssetWhereInput>
  }, "id">

  export type LifecycleEventOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    actorId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    occurredAt?: SortOrder
    _count?: LifecycleEventCountOrderByAggregateInput
    _max?: LifecycleEventMaxOrderByAggregateInput
    _min?: LifecycleEventMinOrderByAggregateInput
  }

  export type LifecycleEventScalarWhereWithAggregatesInput = {
    AND?: LifecycleEventScalarWhereWithAggregatesInput | LifecycleEventScalarWhereWithAggregatesInput[]
    OR?: LifecycleEventScalarWhereWithAggregatesInput[]
    NOT?: LifecycleEventScalarWhereWithAggregatesInput | LifecycleEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LifecycleEvent"> | string
    assetId?: StringWithAggregatesFilter<"LifecycleEvent"> | string
    action?: StringWithAggregatesFilter<"LifecycleEvent"> | string
    actorId?: StringNullableWithAggregatesFilter<"LifecycleEvent"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"LifecycleEvent">
    occurredAt?: DateTimeWithAggregatesFilter<"LifecycleEvent"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    entity?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    actorId?: StringNullableFilter<"AuditLog"> | string | null
    at?: DateTimeFilter<"AuditLog"> | Date | string
    metadata?: JsonNullableFilter<"AuditLog">
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    actorId?: SortOrderInput | SortOrder
    at?: SortOrder
    metadata?: SortOrderInput | SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    entity?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    actorId?: StringNullableFilter<"AuditLog"> | string | null
    at?: DateTimeFilter<"AuditLog"> | Date | string
    metadata?: JsonNullableFilter<"AuditLog">
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    actorId?: SortOrderInput | SortOrder
    at?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    entity?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    actorId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    at?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
  }

  export type AssetTypeCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    assets?: AssetCreateNestedManyWithoutAssetTypeInput
  }

  export type AssetTypeUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    assets?: AssetUncheckedCreateNestedManyWithoutAssetTypeInput
  }

  export type AssetTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assets?: AssetUpdateManyWithoutAssetTypeNestedInput
  }

  export type AssetTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assets?: AssetUncheckedUpdateManyWithoutAssetTypeNestedInput
  }

  export type AssetTypeCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type AssetTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetCreateInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assetType?: AssetTypeCreateNestedOneWithoutAssetsInput
    assignments?: AssetAssignmentCreateNestedManyWithoutAssetInput
    lifecycle?: LifecycleEventCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assetTypeId?: string | null
    assignments?: AssetAssignmentUncheckedCreateNestedManyWithoutAssetInput
    lifecycle?: LifecycleEventUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetType?: AssetTypeUpdateOneWithoutAssetsNestedInput
    assignments?: AssetAssignmentUpdateManyWithoutAssetNestedInput
    lifecycle?: LifecycleEventUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    assignments?: AssetAssignmentUncheckedUpdateManyWithoutAssetNestedInput
    lifecycle?: LifecycleEventUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetCreateManyInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assetTypeId?: string | null
  }

  export type AssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetTypeId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AssetAssignmentCreateInput = {
    id?: string
    personId: string
    personName?: string | null
    personEmail?: string | null
    assignedAt?: Date | string
    unassignedAt?: Date | string | null
    asset: AssetCreateNestedOneWithoutAssignmentsInput
  }

  export type AssetAssignmentUncheckedCreateInput = {
    id?: string
    assetId: string
    personId: string
    personName?: string | null
    personEmail?: string | null
    assignedAt?: Date | string
    unassignedAt?: Date | string | null
  }

  export type AssetAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    personEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unassignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asset?: AssetUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type AssetAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    personEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unassignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AssetAssignmentCreateManyInput = {
    id?: string
    assetId: string
    personId: string
    personName?: string | null
    personEmail?: string | null
    assignedAt?: Date | string
    unassignedAt?: Date | string | null
  }

  export type AssetAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    personEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unassignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AssetAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    personEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unassignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LifecycleEventCreateInput = {
    id?: string
    action: string
    actorId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
    asset: AssetCreateNestedOneWithoutLifecycleInput
  }

  export type LifecycleEventUncheckedCreateInput = {
    id?: string
    assetId: string
    action: string
    actorId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
  }

  export type LifecycleEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    asset?: AssetUpdateOneRequiredWithoutLifecycleNestedInput
  }

  export type LifecycleEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifecycleEventCreateManyInput = {
    id?: string
    assetId: string
    action: string
    actorId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
  }

  export type LifecycleEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifecycleEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    entity: string
    entityId: string
    action: string
    actorId?: string | null
    at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    entity: string
    entityId: string
    action: string
    actorId?: string | null
    at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogCreateManyInput = {
    id?: string
    entity: string
    entityId: string
    action: string
    actorId?: string | null
    at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AssetListRelationFilter = {
    every?: AssetWhereInput
    some?: AssetWhereInput
    none?: AssetWhereInput
  }

  export type AssetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssetTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type EnumAssetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetStatusFilter<$PrismaModel> | $Enums.AssetStatus
  }

  export type AssetTypeNullableRelationFilter = {
    is?: AssetTypeWhereInput | null
    isNot?: AssetTypeWhereInput | null
  }

  export type AssetAssignmentListRelationFilter = {
    every?: AssetAssignmentWhereInput
    some?: AssetAssignmentWhereInput
    none?: AssetAssignmentWhereInput
  }

  export type LifecycleEventListRelationFilter = {
    every?: LifecycleEventWhereInput
    some?: LifecycleEventWhereInput
    none?: LifecycleEventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AssetAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LifecycleEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssetCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    fundingDepartment?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    modelGeneration?: SortOrder
    serialNumber?: SortOrder
    vendor?: SortOrder
    memory?: SortOrder
    hddSize?: SortOrder
    hddType?: SortOrder
    cpuGeneration?: SortOrder
    cpuSpeed?: SortOrder
    gpuModel?: SortOrder
    videoCard?: SortOrder
    wiredMac?: SortOrder
    wirelessMac?: SortOrder
    output1?: SortOrder
    output2?: SortOrder
    receivedDate?: SortOrder
    cost?: SortOrder
    po?: SortOrder
    disposalDate?: SortOrder
    disposalType?: SortOrder
    location?: SortOrder
    status?: SortOrder
    assignedToId?: SortOrder
    assignedToName?: SortOrder
    assignedToEmail?: SortOrder
    assignedDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assetTypeId?: SortOrder
  }

  export type AssetAvgOrderByAggregateInput = {
    cost?: SortOrder
  }

  export type AssetMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    fundingDepartment?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    modelGeneration?: SortOrder
    serialNumber?: SortOrder
    vendor?: SortOrder
    memory?: SortOrder
    hddSize?: SortOrder
    hddType?: SortOrder
    cpuGeneration?: SortOrder
    cpuSpeed?: SortOrder
    gpuModel?: SortOrder
    videoCard?: SortOrder
    wiredMac?: SortOrder
    wirelessMac?: SortOrder
    output1?: SortOrder
    output2?: SortOrder
    receivedDate?: SortOrder
    cost?: SortOrder
    po?: SortOrder
    disposalDate?: SortOrder
    disposalType?: SortOrder
    location?: SortOrder
    status?: SortOrder
    assignedToId?: SortOrder
    assignedToName?: SortOrder
    assignedToEmail?: SortOrder
    assignedDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assetTypeId?: SortOrder
  }

  export type AssetMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    fundingDepartment?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    modelGeneration?: SortOrder
    serialNumber?: SortOrder
    vendor?: SortOrder
    memory?: SortOrder
    hddSize?: SortOrder
    hddType?: SortOrder
    cpuGeneration?: SortOrder
    cpuSpeed?: SortOrder
    gpuModel?: SortOrder
    videoCard?: SortOrder
    wiredMac?: SortOrder
    wirelessMac?: SortOrder
    output1?: SortOrder
    output2?: SortOrder
    receivedDate?: SortOrder
    cost?: SortOrder
    po?: SortOrder
    disposalDate?: SortOrder
    disposalType?: SortOrder
    location?: SortOrder
    status?: SortOrder
    assignedToId?: SortOrder
    assignedToName?: SortOrder
    assignedToEmail?: SortOrder
    assignedDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assetTypeId?: SortOrder
  }

  export type AssetSumOrderByAggregateInput = {
    cost?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumAssetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetStatusFilter<$PrismaModel>
    _max?: NestedEnumAssetStatusFilter<$PrismaModel>
  }

  export type AssetRelationFilter = {
    is?: AssetWhereInput
    isNot?: AssetWhereInput
  }

  export type AssetAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    personId?: SortOrder
    personName?: SortOrder
    personEmail?: SortOrder
    assignedAt?: SortOrder
    unassignedAt?: SortOrder
  }

  export type AssetAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    personId?: SortOrder
    personName?: SortOrder
    personEmail?: SortOrder
    assignedAt?: SortOrder
    unassignedAt?: SortOrder
  }

  export type AssetAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    personId?: SortOrder
    personName?: SortOrder
    personEmail?: SortOrder
    assignedAt?: SortOrder
    unassignedAt?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LifecycleEventCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    metadata?: SortOrder
    occurredAt?: SortOrder
  }

  export type LifecycleEventMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    occurredAt?: SortOrder
  }

  export type LifecycleEventMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    occurredAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    at?: SortOrder
    metadata?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    at?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    at?: SortOrder
  }

  export type AssetCreateNestedManyWithoutAssetTypeInput = {
    create?: XOR<AssetCreateWithoutAssetTypeInput, AssetUncheckedCreateWithoutAssetTypeInput> | AssetCreateWithoutAssetTypeInput[] | AssetUncheckedCreateWithoutAssetTypeInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutAssetTypeInput | AssetCreateOrConnectWithoutAssetTypeInput[]
    createMany?: AssetCreateManyAssetTypeInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type AssetUncheckedCreateNestedManyWithoutAssetTypeInput = {
    create?: XOR<AssetCreateWithoutAssetTypeInput, AssetUncheckedCreateWithoutAssetTypeInput> | AssetCreateWithoutAssetTypeInput[] | AssetUncheckedCreateWithoutAssetTypeInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutAssetTypeInput | AssetCreateOrConnectWithoutAssetTypeInput[]
    createMany?: AssetCreateManyAssetTypeInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AssetUpdateManyWithoutAssetTypeNestedInput = {
    create?: XOR<AssetCreateWithoutAssetTypeInput, AssetUncheckedCreateWithoutAssetTypeInput> | AssetCreateWithoutAssetTypeInput[] | AssetUncheckedCreateWithoutAssetTypeInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutAssetTypeInput | AssetCreateOrConnectWithoutAssetTypeInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutAssetTypeInput | AssetUpsertWithWhereUniqueWithoutAssetTypeInput[]
    createMany?: AssetCreateManyAssetTypeInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutAssetTypeInput | AssetUpdateWithWhereUniqueWithoutAssetTypeInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutAssetTypeInput | AssetUpdateManyWithWhereWithoutAssetTypeInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AssetUncheckedUpdateManyWithoutAssetTypeNestedInput = {
    create?: XOR<AssetCreateWithoutAssetTypeInput, AssetUncheckedCreateWithoutAssetTypeInput> | AssetCreateWithoutAssetTypeInput[] | AssetUncheckedCreateWithoutAssetTypeInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutAssetTypeInput | AssetCreateOrConnectWithoutAssetTypeInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutAssetTypeInput | AssetUpsertWithWhereUniqueWithoutAssetTypeInput[]
    createMany?: AssetCreateManyAssetTypeInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutAssetTypeInput | AssetUpdateWithWhereUniqueWithoutAssetTypeInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutAssetTypeInput | AssetUpdateManyWithWhereWithoutAssetTypeInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AssetTypeCreateNestedOneWithoutAssetsInput = {
    create?: XOR<AssetTypeCreateWithoutAssetsInput, AssetTypeUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: AssetTypeCreateOrConnectWithoutAssetsInput
    connect?: AssetTypeWhereUniqueInput
  }

  export type AssetAssignmentCreateNestedManyWithoutAssetInput = {
    create?: XOR<AssetAssignmentCreateWithoutAssetInput, AssetAssignmentUncheckedCreateWithoutAssetInput> | AssetAssignmentCreateWithoutAssetInput[] | AssetAssignmentUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: AssetAssignmentCreateOrConnectWithoutAssetInput | AssetAssignmentCreateOrConnectWithoutAssetInput[]
    createMany?: AssetAssignmentCreateManyAssetInputEnvelope
    connect?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
  }

  export type LifecycleEventCreateNestedManyWithoutAssetInput = {
    create?: XOR<LifecycleEventCreateWithoutAssetInput, LifecycleEventUncheckedCreateWithoutAssetInput> | LifecycleEventCreateWithoutAssetInput[] | LifecycleEventUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: LifecycleEventCreateOrConnectWithoutAssetInput | LifecycleEventCreateOrConnectWithoutAssetInput[]
    createMany?: LifecycleEventCreateManyAssetInputEnvelope
    connect?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
  }

  export type AssetAssignmentUncheckedCreateNestedManyWithoutAssetInput = {
    create?: XOR<AssetAssignmentCreateWithoutAssetInput, AssetAssignmentUncheckedCreateWithoutAssetInput> | AssetAssignmentCreateWithoutAssetInput[] | AssetAssignmentUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: AssetAssignmentCreateOrConnectWithoutAssetInput | AssetAssignmentCreateOrConnectWithoutAssetInput[]
    createMany?: AssetAssignmentCreateManyAssetInputEnvelope
    connect?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
  }

  export type LifecycleEventUncheckedCreateNestedManyWithoutAssetInput = {
    create?: XOR<LifecycleEventCreateWithoutAssetInput, LifecycleEventUncheckedCreateWithoutAssetInput> | LifecycleEventCreateWithoutAssetInput[] | LifecycleEventUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: LifecycleEventCreateOrConnectWithoutAssetInput | LifecycleEventCreateOrConnectWithoutAssetInput[]
    createMany?: LifecycleEventCreateManyAssetInputEnvelope
    connect?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumAssetStatusFieldUpdateOperationsInput = {
    set?: $Enums.AssetStatus
  }

  export type AssetTypeUpdateOneWithoutAssetsNestedInput = {
    create?: XOR<AssetTypeCreateWithoutAssetsInput, AssetTypeUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: AssetTypeCreateOrConnectWithoutAssetsInput
    upsert?: AssetTypeUpsertWithoutAssetsInput
    disconnect?: AssetTypeWhereInput | boolean
    delete?: AssetTypeWhereInput | boolean
    connect?: AssetTypeWhereUniqueInput
    update?: XOR<XOR<AssetTypeUpdateToOneWithWhereWithoutAssetsInput, AssetTypeUpdateWithoutAssetsInput>, AssetTypeUncheckedUpdateWithoutAssetsInput>
  }

  export type AssetAssignmentUpdateManyWithoutAssetNestedInput = {
    create?: XOR<AssetAssignmentCreateWithoutAssetInput, AssetAssignmentUncheckedCreateWithoutAssetInput> | AssetAssignmentCreateWithoutAssetInput[] | AssetAssignmentUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: AssetAssignmentCreateOrConnectWithoutAssetInput | AssetAssignmentCreateOrConnectWithoutAssetInput[]
    upsert?: AssetAssignmentUpsertWithWhereUniqueWithoutAssetInput | AssetAssignmentUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: AssetAssignmentCreateManyAssetInputEnvelope
    set?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
    disconnect?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
    delete?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
    connect?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
    update?: AssetAssignmentUpdateWithWhereUniqueWithoutAssetInput | AssetAssignmentUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: AssetAssignmentUpdateManyWithWhereWithoutAssetInput | AssetAssignmentUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: AssetAssignmentScalarWhereInput | AssetAssignmentScalarWhereInput[]
  }

  export type LifecycleEventUpdateManyWithoutAssetNestedInput = {
    create?: XOR<LifecycleEventCreateWithoutAssetInput, LifecycleEventUncheckedCreateWithoutAssetInput> | LifecycleEventCreateWithoutAssetInput[] | LifecycleEventUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: LifecycleEventCreateOrConnectWithoutAssetInput | LifecycleEventCreateOrConnectWithoutAssetInput[]
    upsert?: LifecycleEventUpsertWithWhereUniqueWithoutAssetInput | LifecycleEventUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: LifecycleEventCreateManyAssetInputEnvelope
    set?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
    disconnect?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
    delete?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
    connect?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
    update?: LifecycleEventUpdateWithWhereUniqueWithoutAssetInput | LifecycleEventUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: LifecycleEventUpdateManyWithWhereWithoutAssetInput | LifecycleEventUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: LifecycleEventScalarWhereInput | LifecycleEventScalarWhereInput[]
  }

  export type AssetAssignmentUncheckedUpdateManyWithoutAssetNestedInput = {
    create?: XOR<AssetAssignmentCreateWithoutAssetInput, AssetAssignmentUncheckedCreateWithoutAssetInput> | AssetAssignmentCreateWithoutAssetInput[] | AssetAssignmentUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: AssetAssignmentCreateOrConnectWithoutAssetInput | AssetAssignmentCreateOrConnectWithoutAssetInput[]
    upsert?: AssetAssignmentUpsertWithWhereUniqueWithoutAssetInput | AssetAssignmentUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: AssetAssignmentCreateManyAssetInputEnvelope
    set?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
    disconnect?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
    delete?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
    connect?: AssetAssignmentWhereUniqueInput | AssetAssignmentWhereUniqueInput[]
    update?: AssetAssignmentUpdateWithWhereUniqueWithoutAssetInput | AssetAssignmentUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: AssetAssignmentUpdateManyWithWhereWithoutAssetInput | AssetAssignmentUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: AssetAssignmentScalarWhereInput | AssetAssignmentScalarWhereInput[]
  }

  export type LifecycleEventUncheckedUpdateManyWithoutAssetNestedInput = {
    create?: XOR<LifecycleEventCreateWithoutAssetInput, LifecycleEventUncheckedCreateWithoutAssetInput> | LifecycleEventCreateWithoutAssetInput[] | LifecycleEventUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: LifecycleEventCreateOrConnectWithoutAssetInput | LifecycleEventCreateOrConnectWithoutAssetInput[]
    upsert?: LifecycleEventUpsertWithWhereUniqueWithoutAssetInput | LifecycleEventUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: LifecycleEventCreateManyAssetInputEnvelope
    set?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
    disconnect?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
    delete?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
    connect?: LifecycleEventWhereUniqueInput | LifecycleEventWhereUniqueInput[]
    update?: LifecycleEventUpdateWithWhereUniqueWithoutAssetInput | LifecycleEventUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: LifecycleEventUpdateManyWithWhereWithoutAssetInput | LifecycleEventUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: LifecycleEventScalarWhereInput | LifecycleEventScalarWhereInput[]
  }

  export type AssetCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<AssetCreateWithoutAssignmentsInput, AssetUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: AssetCreateOrConnectWithoutAssignmentsInput
    connect?: AssetWhereUniqueInput
  }

  export type AssetUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<AssetCreateWithoutAssignmentsInput, AssetUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: AssetCreateOrConnectWithoutAssignmentsInput
    upsert?: AssetUpsertWithoutAssignmentsInput
    connect?: AssetWhereUniqueInput
    update?: XOR<XOR<AssetUpdateToOneWithWhereWithoutAssignmentsInput, AssetUpdateWithoutAssignmentsInput>, AssetUncheckedUpdateWithoutAssignmentsInput>
  }

  export type AssetCreateNestedOneWithoutLifecycleInput = {
    create?: XOR<AssetCreateWithoutLifecycleInput, AssetUncheckedCreateWithoutLifecycleInput>
    connectOrCreate?: AssetCreateOrConnectWithoutLifecycleInput
    connect?: AssetWhereUniqueInput
  }

  export type AssetUpdateOneRequiredWithoutLifecycleNestedInput = {
    create?: XOR<AssetCreateWithoutLifecycleInput, AssetUncheckedCreateWithoutLifecycleInput>
    connectOrCreate?: AssetCreateOrConnectWithoutLifecycleInput
    upsert?: AssetUpsertWithoutLifecycleInput
    connect?: AssetWhereUniqueInput
    update?: XOR<XOR<AssetUpdateToOneWithWhereWithoutLifecycleInput, AssetUpdateWithoutLifecycleInput>, AssetUncheckedUpdateWithoutLifecycleInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumAssetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetStatusFilter<$PrismaModel> | $Enums.AssetStatus
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetStatusFilter<$PrismaModel>
    _max?: NestedEnumAssetStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AssetCreateWithoutAssetTypeInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: AssetAssignmentCreateNestedManyWithoutAssetInput
    lifecycle?: LifecycleEventCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutAssetTypeInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: AssetAssignmentUncheckedCreateNestedManyWithoutAssetInput
    lifecycle?: LifecycleEventUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetCreateOrConnectWithoutAssetTypeInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutAssetTypeInput, AssetUncheckedCreateWithoutAssetTypeInput>
  }

  export type AssetCreateManyAssetTypeInputEnvelope = {
    data: AssetCreateManyAssetTypeInput | AssetCreateManyAssetTypeInput[]
    skipDuplicates?: boolean
  }

  export type AssetUpsertWithWhereUniqueWithoutAssetTypeInput = {
    where: AssetWhereUniqueInput
    update: XOR<AssetUpdateWithoutAssetTypeInput, AssetUncheckedUpdateWithoutAssetTypeInput>
    create: XOR<AssetCreateWithoutAssetTypeInput, AssetUncheckedCreateWithoutAssetTypeInput>
  }

  export type AssetUpdateWithWhereUniqueWithoutAssetTypeInput = {
    where: AssetWhereUniqueInput
    data: XOR<AssetUpdateWithoutAssetTypeInput, AssetUncheckedUpdateWithoutAssetTypeInput>
  }

  export type AssetUpdateManyWithWhereWithoutAssetTypeInput = {
    where: AssetScalarWhereInput
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyWithoutAssetTypeInput>
  }

  export type AssetScalarWhereInput = {
    AND?: AssetScalarWhereInput | AssetScalarWhereInput[]
    OR?: AssetScalarWhereInput[]
    NOT?: AssetScalarWhereInput | AssetScalarWhereInput[]
    id?: StringFilter<"Asset"> | string
    assetId?: StringFilter<"Asset"> | string
    type?: StringFilter<"Asset"> | string
    description?: StringFilter<"Asset"> | string
    fundingDepartment?: StringFilter<"Asset"> | string
    manufacturer?: StringNullableFilter<"Asset"> | string | null
    model?: StringNullableFilter<"Asset"> | string | null
    modelGeneration?: StringNullableFilter<"Asset"> | string | null
    serialNumber?: StringNullableFilter<"Asset"> | string | null
    vendor?: StringNullableFilter<"Asset"> | string | null
    memory?: StringNullableFilter<"Asset"> | string | null
    hddSize?: StringNullableFilter<"Asset"> | string | null
    hddType?: StringNullableFilter<"Asset"> | string | null
    cpuGeneration?: StringNullableFilter<"Asset"> | string | null
    cpuSpeed?: StringNullableFilter<"Asset"> | string | null
    gpuModel?: StringNullableFilter<"Asset"> | string | null
    videoCard?: StringNullableFilter<"Asset"> | string | null
    wiredMac?: StringNullableFilter<"Asset"> | string | null
    wirelessMac?: StringNullableFilter<"Asset"> | string | null
    output1?: StringNullableFilter<"Asset"> | string | null
    output2?: StringNullableFilter<"Asset"> | string | null
    receivedDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    cost?: FloatNullableFilter<"Asset"> | number | null
    po?: StringNullableFilter<"Asset"> | string | null
    disposalDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    disposalType?: StringNullableFilter<"Asset"> | string | null
    location?: StringNullableFilter<"Asset"> | string | null
    status?: EnumAssetStatusFilter<"Asset"> | $Enums.AssetStatus
    assignedToId?: StringNullableFilter<"Asset"> | string | null
    assignedToName?: StringNullableFilter<"Asset"> | string | null
    assignedToEmail?: StringNullableFilter<"Asset"> | string | null
    assignedDate?: DateTimeNullableFilter<"Asset"> | Date | string | null
    createdAt?: DateTimeFilter<"Asset"> | Date | string
    updatedAt?: DateTimeFilter<"Asset"> | Date | string
    assetTypeId?: StringNullableFilter<"Asset"> | string | null
  }

  export type AssetTypeCreateWithoutAssetsInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type AssetTypeUncheckedCreateWithoutAssetsInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type AssetTypeCreateOrConnectWithoutAssetsInput = {
    where: AssetTypeWhereUniqueInput
    create: XOR<AssetTypeCreateWithoutAssetsInput, AssetTypeUncheckedCreateWithoutAssetsInput>
  }

  export type AssetAssignmentCreateWithoutAssetInput = {
    id?: string
    personId: string
    personName?: string | null
    personEmail?: string | null
    assignedAt?: Date | string
    unassignedAt?: Date | string | null
  }

  export type AssetAssignmentUncheckedCreateWithoutAssetInput = {
    id?: string
    personId: string
    personName?: string | null
    personEmail?: string | null
    assignedAt?: Date | string
    unassignedAt?: Date | string | null
  }

  export type AssetAssignmentCreateOrConnectWithoutAssetInput = {
    where: AssetAssignmentWhereUniqueInput
    create: XOR<AssetAssignmentCreateWithoutAssetInput, AssetAssignmentUncheckedCreateWithoutAssetInput>
  }

  export type AssetAssignmentCreateManyAssetInputEnvelope = {
    data: AssetAssignmentCreateManyAssetInput | AssetAssignmentCreateManyAssetInput[]
    skipDuplicates?: boolean
  }

  export type LifecycleEventCreateWithoutAssetInput = {
    id?: string
    action: string
    actorId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
  }

  export type LifecycleEventUncheckedCreateWithoutAssetInput = {
    id?: string
    action: string
    actorId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
  }

  export type LifecycleEventCreateOrConnectWithoutAssetInput = {
    where: LifecycleEventWhereUniqueInput
    create: XOR<LifecycleEventCreateWithoutAssetInput, LifecycleEventUncheckedCreateWithoutAssetInput>
  }

  export type LifecycleEventCreateManyAssetInputEnvelope = {
    data: LifecycleEventCreateManyAssetInput | LifecycleEventCreateManyAssetInput[]
    skipDuplicates?: boolean
  }

  export type AssetTypeUpsertWithoutAssetsInput = {
    update: XOR<AssetTypeUpdateWithoutAssetsInput, AssetTypeUncheckedUpdateWithoutAssetsInput>
    create: XOR<AssetTypeCreateWithoutAssetsInput, AssetTypeUncheckedCreateWithoutAssetsInput>
    where?: AssetTypeWhereInput
  }

  export type AssetTypeUpdateToOneWithWhereWithoutAssetsInput = {
    where?: AssetTypeWhereInput
    data: XOR<AssetTypeUpdateWithoutAssetsInput, AssetTypeUncheckedUpdateWithoutAssetsInput>
  }

  export type AssetTypeUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetTypeUncheckedUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetAssignmentUpsertWithWhereUniqueWithoutAssetInput = {
    where: AssetAssignmentWhereUniqueInput
    update: XOR<AssetAssignmentUpdateWithoutAssetInput, AssetAssignmentUncheckedUpdateWithoutAssetInput>
    create: XOR<AssetAssignmentCreateWithoutAssetInput, AssetAssignmentUncheckedCreateWithoutAssetInput>
  }

  export type AssetAssignmentUpdateWithWhereUniqueWithoutAssetInput = {
    where: AssetAssignmentWhereUniqueInput
    data: XOR<AssetAssignmentUpdateWithoutAssetInput, AssetAssignmentUncheckedUpdateWithoutAssetInput>
  }

  export type AssetAssignmentUpdateManyWithWhereWithoutAssetInput = {
    where: AssetAssignmentScalarWhereInput
    data: XOR<AssetAssignmentUpdateManyMutationInput, AssetAssignmentUncheckedUpdateManyWithoutAssetInput>
  }

  export type AssetAssignmentScalarWhereInput = {
    AND?: AssetAssignmentScalarWhereInput | AssetAssignmentScalarWhereInput[]
    OR?: AssetAssignmentScalarWhereInput[]
    NOT?: AssetAssignmentScalarWhereInput | AssetAssignmentScalarWhereInput[]
    id?: StringFilter<"AssetAssignment"> | string
    assetId?: StringFilter<"AssetAssignment"> | string
    personId?: StringFilter<"AssetAssignment"> | string
    personName?: StringNullableFilter<"AssetAssignment"> | string | null
    personEmail?: StringNullableFilter<"AssetAssignment"> | string | null
    assignedAt?: DateTimeFilter<"AssetAssignment"> | Date | string
    unassignedAt?: DateTimeNullableFilter<"AssetAssignment"> | Date | string | null
  }

  export type LifecycleEventUpsertWithWhereUniqueWithoutAssetInput = {
    where: LifecycleEventWhereUniqueInput
    update: XOR<LifecycleEventUpdateWithoutAssetInput, LifecycleEventUncheckedUpdateWithoutAssetInput>
    create: XOR<LifecycleEventCreateWithoutAssetInput, LifecycleEventUncheckedCreateWithoutAssetInput>
  }

  export type LifecycleEventUpdateWithWhereUniqueWithoutAssetInput = {
    where: LifecycleEventWhereUniqueInput
    data: XOR<LifecycleEventUpdateWithoutAssetInput, LifecycleEventUncheckedUpdateWithoutAssetInput>
  }

  export type LifecycleEventUpdateManyWithWhereWithoutAssetInput = {
    where: LifecycleEventScalarWhereInput
    data: XOR<LifecycleEventUpdateManyMutationInput, LifecycleEventUncheckedUpdateManyWithoutAssetInput>
  }

  export type LifecycleEventScalarWhereInput = {
    AND?: LifecycleEventScalarWhereInput | LifecycleEventScalarWhereInput[]
    OR?: LifecycleEventScalarWhereInput[]
    NOT?: LifecycleEventScalarWhereInput | LifecycleEventScalarWhereInput[]
    id?: StringFilter<"LifecycleEvent"> | string
    assetId?: StringFilter<"LifecycleEvent"> | string
    action?: StringFilter<"LifecycleEvent"> | string
    actorId?: StringNullableFilter<"LifecycleEvent"> | string | null
    metadata?: JsonNullableFilter<"LifecycleEvent">
    occurredAt?: DateTimeFilter<"LifecycleEvent"> | Date | string
  }

  export type AssetCreateWithoutAssignmentsInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assetType?: AssetTypeCreateNestedOneWithoutAssetsInput
    lifecycle?: LifecycleEventCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assetTypeId?: string | null
    lifecycle?: LifecycleEventUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetCreateOrConnectWithoutAssignmentsInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutAssignmentsInput, AssetUncheckedCreateWithoutAssignmentsInput>
  }

  export type AssetUpsertWithoutAssignmentsInput = {
    update: XOR<AssetUpdateWithoutAssignmentsInput, AssetUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<AssetCreateWithoutAssignmentsInput, AssetUncheckedCreateWithoutAssignmentsInput>
    where?: AssetWhereInput
  }

  export type AssetUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: AssetWhereInput
    data: XOR<AssetUpdateWithoutAssignmentsInput, AssetUncheckedUpdateWithoutAssignmentsInput>
  }

  export type AssetUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetType?: AssetTypeUpdateOneWithoutAssetsNestedInput
    lifecycle?: LifecycleEventUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    lifecycle?: LifecycleEventUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetCreateWithoutLifecycleInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assetType?: AssetTypeCreateNestedOneWithoutAssetsInput
    assignments?: AssetAssignmentCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutLifecycleInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assetTypeId?: string | null
    assignments?: AssetAssignmentUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetCreateOrConnectWithoutLifecycleInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutLifecycleInput, AssetUncheckedCreateWithoutLifecycleInput>
  }

  export type AssetUpsertWithoutLifecycleInput = {
    update: XOR<AssetUpdateWithoutLifecycleInput, AssetUncheckedUpdateWithoutLifecycleInput>
    create: XOR<AssetCreateWithoutLifecycleInput, AssetUncheckedCreateWithoutLifecycleInput>
    where?: AssetWhereInput
  }

  export type AssetUpdateToOneWithWhereWithoutLifecycleInput = {
    where?: AssetWhereInput
    data: XOR<AssetUpdateWithoutLifecycleInput, AssetUncheckedUpdateWithoutLifecycleInput>
  }

  export type AssetUpdateWithoutLifecycleInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetType?: AssetTypeUpdateOneWithoutAssetsNestedInput
    assignments?: AssetAssignmentUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutLifecycleInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assetTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    assignments?: AssetAssignmentUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetCreateManyAssetTypeInput = {
    id?: string
    assetId: string
    type: string
    description: string
    fundingDepartment: string
    manufacturer?: string | null
    model?: string | null
    modelGeneration?: string | null
    serialNumber?: string | null
    vendor?: string | null
    memory?: string | null
    hddSize?: string | null
    hddType?: string | null
    cpuGeneration?: string | null
    cpuSpeed?: string | null
    gpuModel?: string | null
    videoCard?: string | null
    wiredMac?: string | null
    wirelessMac?: string | null
    output1?: string | null
    output2?: string | null
    receivedDate?: Date | string | null
    cost?: number | null
    po?: string | null
    disposalDate?: Date | string | null
    disposalType?: string | null
    location?: string | null
    status?: $Enums.AssetStatus
    assignedToId?: string | null
    assignedToName?: string | null
    assignedToEmail?: string | null
    assignedDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AssetUpdateWithoutAssetTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: AssetAssignmentUpdateManyWithoutAssetNestedInput
    lifecycle?: LifecycleEventUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutAssetTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: AssetAssignmentUncheckedUpdateManyWithoutAssetNestedInput
    lifecycle?: LifecycleEventUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateManyWithoutAssetTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fundingDepartment?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    modelGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    memory?: NullableStringFieldUpdateOperationsInput | string | null
    hddSize?: NullableStringFieldUpdateOperationsInput | string | null
    hddType?: NullableStringFieldUpdateOperationsInput | string | null
    cpuGeneration?: NullableStringFieldUpdateOperationsInput | string | null
    cpuSpeed?: NullableStringFieldUpdateOperationsInput | string | null
    gpuModel?: NullableStringFieldUpdateOperationsInput | string | null
    videoCard?: NullableStringFieldUpdateOperationsInput | string | null
    wiredMac?: NullableStringFieldUpdateOperationsInput | string | null
    wirelessMac?: NullableStringFieldUpdateOperationsInput | string | null
    output1?: NullableStringFieldUpdateOperationsInput | string | null
    output2?: NullableStringFieldUpdateOperationsInput | string | null
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    po?: NullableStringFieldUpdateOperationsInput | string | null
    disposalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disposalType?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToName?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetAssignmentCreateManyAssetInput = {
    id?: string
    personId: string
    personName?: string | null
    personEmail?: string | null
    assignedAt?: Date | string
    unassignedAt?: Date | string | null
  }

  export type LifecycleEventCreateManyAssetInput = {
    id?: string
    action: string
    actorId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
  }

  export type AssetAssignmentUpdateWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    personEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unassignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AssetAssignmentUncheckedUpdateWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    personEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unassignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AssetAssignmentUncheckedUpdateManyWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    personEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unassignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LifecycleEventUpdateWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifecycleEventUncheckedUpdateWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifecycleEventUncheckedUpdateManyWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AssetTypeCountOutputTypeDefaultArgs instead
     */
    export type AssetTypeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AssetTypeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AssetCountOutputTypeDefaultArgs instead
     */
    export type AssetCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AssetCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AssetTypeDefaultArgs instead
     */
    export type AssetTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AssetTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AssetDefaultArgs instead
     */
    export type AssetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AssetDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AssetAssignmentDefaultArgs instead
     */
    export type AssetAssignmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AssetAssignmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LifecycleEventDefaultArgs instead
     */
    export type LifecycleEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LifecycleEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditLogDefaultArgs instead
     */
    export type AuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
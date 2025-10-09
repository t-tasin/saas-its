
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
 * Model Reservation
 * 
 */
export type Reservation = $Result.DefaultSelection<Prisma.$ReservationPayload>
/**
 * Model ReservationItem
 * 
 */
export type ReservationItem = $Result.DefaultSelection<Prisma.$ReservationItemPayload>
/**
 * Model EquipmentAvailability
 * 
 */
export type EquipmentAvailability = $Result.DefaultSelection<Prisma.$EquipmentAvailabilityPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ReservationStatus: {
  pending: 'pending',
  approved: 'approved',
  denied: 'denied',
  active: 'active',
  returned: 'returned',
  cancelled: 'cancelled'
};

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]

}

export type ReservationStatus = $Enums.ReservationStatus

export const ReservationStatus: typeof $Enums.ReservationStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Reservations
 * const reservations = await prisma.reservation.findMany()
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
   * // Fetch zero or more Reservations
   * const reservations = await prisma.reservation.findMany()
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
   * `prisma.reservation`: Exposes CRUD operations for the **Reservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservations
    * const reservations = await prisma.reservation.findMany()
    * ```
    */
  get reservation(): Prisma.ReservationDelegate<ExtArgs>;

  /**
   * `prisma.reservationItem`: Exposes CRUD operations for the **ReservationItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReservationItems
    * const reservationItems = await prisma.reservationItem.findMany()
    * ```
    */
  get reservationItem(): Prisma.ReservationItemDelegate<ExtArgs>;

  /**
   * `prisma.equipmentAvailability`: Exposes CRUD operations for the **EquipmentAvailability** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EquipmentAvailabilities
    * const equipmentAvailabilities = await prisma.equipmentAvailability.findMany()
    * ```
    */
  get equipmentAvailability(): Prisma.EquipmentAvailabilityDelegate<ExtArgs>;

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
    Reservation: 'Reservation',
    ReservationItem: 'ReservationItem',
    EquipmentAvailability: 'EquipmentAvailability',
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
      modelProps: "reservation" | "reservationItem" | "equipmentAvailability" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Reservation: {
        payload: Prisma.$ReservationPayload<ExtArgs>
        fields: Prisma.ReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findFirst: {
            args: Prisma.ReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findMany: {
            args: Prisma.ReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          create: {
            args: Prisma.ReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          createMany: {
            args: Prisma.ReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          delete: {
            args: Prisma.ReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          update: {
            args: Prisma.ReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          deleteMany: {
            args: Prisma.ReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          aggregate: {
            args: Prisma.ReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservation>
          }
          groupBy: {
            args: Prisma.ReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservationCountArgs<ExtArgs>
            result: $Utils.Optional<ReservationCountAggregateOutputType> | number
          }
        }
      }
      ReservationItem: {
        payload: Prisma.$ReservationItemPayload<ExtArgs>
        fields: Prisma.ReservationItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservationItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservationItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          findFirst: {
            args: Prisma.ReservationItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservationItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          findMany: {
            args: Prisma.ReservationItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>[]
          }
          create: {
            args: Prisma.ReservationItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          createMany: {
            args: Prisma.ReservationItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservationItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>[]
          }
          delete: {
            args: Prisma.ReservationItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          update: {
            args: Prisma.ReservationItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          deleteMany: {
            args: Prisma.ReservationItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservationItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReservationItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          aggregate: {
            args: Prisma.ReservationItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservationItem>
          }
          groupBy: {
            args: Prisma.ReservationItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservationItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservationItemCountArgs<ExtArgs>
            result: $Utils.Optional<ReservationItemCountAggregateOutputType> | number
          }
        }
      }
      EquipmentAvailability: {
        payload: Prisma.$EquipmentAvailabilityPayload<ExtArgs>
        fields: Prisma.EquipmentAvailabilityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EquipmentAvailabilityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EquipmentAvailabilityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload>
          }
          findFirst: {
            args: Prisma.EquipmentAvailabilityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EquipmentAvailabilityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload>
          }
          findMany: {
            args: Prisma.EquipmentAvailabilityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload>[]
          }
          create: {
            args: Prisma.EquipmentAvailabilityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload>
          }
          createMany: {
            args: Prisma.EquipmentAvailabilityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EquipmentAvailabilityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload>[]
          }
          delete: {
            args: Prisma.EquipmentAvailabilityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload>
          }
          update: {
            args: Prisma.EquipmentAvailabilityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload>
          }
          deleteMany: {
            args: Prisma.EquipmentAvailabilityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EquipmentAvailabilityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EquipmentAvailabilityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipmentAvailabilityPayload>
          }
          aggregate: {
            args: Prisma.EquipmentAvailabilityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEquipmentAvailability>
          }
          groupBy: {
            args: Prisma.EquipmentAvailabilityGroupByArgs<ExtArgs>
            result: $Utils.Optional<EquipmentAvailabilityGroupByOutputType>[]
          }
          count: {
            args: Prisma.EquipmentAvailabilityCountArgs<ExtArgs>
            result: $Utils.Optional<EquipmentAvailabilityCountAggregateOutputType> | number
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
   * Count Type ReservationCountOutputType
   */

  export type ReservationCountOutputType = {
    items: number
  }

  export type ReservationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | ReservationCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * ReservationCountOutputType without action
   */
  export type ReservationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationCountOutputType
     */
    select?: ReservationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReservationCountOutputType without action
   */
  export type ReservationCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Reservation
   */

  export type AggregateReservation = {
    _count: ReservationCountAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  export type ReservationMinAggregateOutputType = {
    id: string | null
    requesterId: string | null
    requesterEmail: string | null
    requesterName: string | null
    status: $Enums.ReservationStatus | null
    requestDate: Date | null
    approvedDate: Date | null
    returnDate: Date | null
    actualReturnDate: Date | null
    approvedBy: string | null
    deniedBy: string | null
    denialReason: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReservationMaxAggregateOutputType = {
    id: string | null
    requesterId: string | null
    requesterEmail: string | null
    requesterName: string | null
    status: $Enums.ReservationStatus | null
    requestDate: Date | null
    approvedDate: Date | null
    returnDate: Date | null
    actualReturnDate: Date | null
    approvedBy: string | null
    deniedBy: string | null
    denialReason: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReservationCountAggregateOutputType = {
    id: number
    requesterId: number
    requesterEmail: number
    requesterName: number
    status: number
    requestDate: number
    approvedDate: number
    returnDate: number
    actualReturnDate: number
    approvedBy: number
    deniedBy: number
    denialReason: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReservationMinAggregateInputType = {
    id?: true
    requesterId?: true
    requesterEmail?: true
    requesterName?: true
    status?: true
    requestDate?: true
    approvedDate?: true
    returnDate?: true
    actualReturnDate?: true
    approvedBy?: true
    deniedBy?: true
    denialReason?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReservationMaxAggregateInputType = {
    id?: true
    requesterId?: true
    requesterEmail?: true
    requesterName?: true
    status?: true
    requestDate?: true
    approvedDate?: true
    returnDate?: true
    actualReturnDate?: true
    approvedBy?: true
    deniedBy?: true
    denialReason?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReservationCountAggregateInputType = {
    id?: true
    requesterId?: true
    requesterEmail?: true
    requesterName?: true
    status?: true
    requestDate?: true
    approvedDate?: true
    returnDate?: true
    actualReturnDate?: true
    approvedBy?: true
    deniedBy?: true
    denialReason?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservation to aggregate.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reservations
    **/
    _count?: true | ReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservationMaxAggregateInputType
  }

  export type GetReservationAggregateType<T extends ReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservation[P]>
      : GetScalarType<T[P], AggregateReservation[P]>
  }




  export type ReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithAggregationInput | ReservationOrderByWithAggregationInput[]
    by: ReservationScalarFieldEnum[] | ReservationScalarFieldEnum
    having?: ReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservationCountAggregateInputType | true
    _min?: ReservationMinAggregateInputType
    _max?: ReservationMaxAggregateInputType
  }

  export type ReservationGroupByOutputType = {
    id: string
    requesterId: string
    requesterEmail: string | null
    requesterName: string | null
    status: $Enums.ReservationStatus
    requestDate: Date
    approvedDate: Date | null
    returnDate: Date | null
    actualReturnDate: Date | null
    approvedBy: string | null
    deniedBy: string | null
    denialReason: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: ReservationCountAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  type GetReservationGroupByPayload<T extends ReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservationGroupByOutputType[P]>
            : GetScalarType<T[P], ReservationGroupByOutputType[P]>
        }
      >
    >


  export type ReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    requesterEmail?: boolean
    requesterName?: boolean
    status?: boolean
    requestDate?: boolean
    approvedDate?: boolean
    returnDate?: boolean
    actualReturnDate?: boolean
    approvedBy?: boolean
    deniedBy?: boolean
    denialReason?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | Reservation$itemsArgs<ExtArgs>
    _count?: boolean | ReservationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    requesterEmail?: boolean
    requesterName?: boolean
    status?: boolean
    requestDate?: boolean
    approvedDate?: boolean
    returnDate?: boolean
    actualReturnDate?: boolean
    approvedBy?: boolean
    deniedBy?: boolean
    denialReason?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectScalar = {
    id?: boolean
    requesterId?: boolean
    requesterEmail?: boolean
    requesterName?: boolean
    status?: boolean
    requestDate?: boolean
    approvedDate?: boolean
    returnDate?: boolean
    actualReturnDate?: boolean
    approvedBy?: boolean
    deniedBy?: boolean
    denialReason?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | Reservation$itemsArgs<ExtArgs>
    _count?: boolean | ReservationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reservation"
    objects: {
      items: Prisma.$ReservationItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requesterId: string
      requesterEmail: string | null
      requesterName: string | null
      status: $Enums.ReservationStatus
      requestDate: Date
      approvedDate: Date | null
      returnDate: Date | null
      actualReturnDate: Date | null
      approvedBy: string | null
      deniedBy: string | null
      denialReason: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["reservation"]>
    composites: {}
  }

  type ReservationGetPayload<S extends boolean | null | undefined | ReservationDefaultArgs> = $Result.GetResult<Prisma.$ReservationPayload, S>

  type ReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReservationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReservationCountAggregateInputType | true
    }

  export interface ReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reservation'], meta: { name: 'Reservation' } }
    /**
     * Find zero or one Reservation that matches the filter.
     * @param {ReservationFindUniqueArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservationFindUniqueArgs>(args: SelectSubset<T, ReservationFindUniqueArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Reservation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReservationFindUniqueOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Reservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservationFindFirstArgs>(args?: SelectSubset<T, ReservationFindFirstArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Reservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservations
     * const reservations = await prisma.reservation.findMany()
     * 
     * // Get first 10 Reservations
     * const reservations = await prisma.reservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservationWithIdOnly = await prisma.reservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservationFindManyArgs>(args?: SelectSubset<T, ReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Reservation.
     * @param {ReservationCreateArgs} args - Arguments to create a Reservation.
     * @example
     * // Create one Reservation
     * const Reservation = await prisma.reservation.create({
     *   data: {
     *     // ... data to create a Reservation
     *   }
     * })
     * 
     */
    create<T extends ReservationCreateArgs>(args: SelectSubset<T, ReservationCreateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reservations.
     * @param {ReservationCreateManyArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservationCreateManyArgs>(args?: SelectSubset<T, ReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reservations and returns the data saved in the database.
     * @param {ReservationCreateManyAndReturnArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reservations and only return the `id`
     * const reservationWithIdOnly = await prisma.reservation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Reservation.
     * @param {ReservationDeleteArgs} args - Arguments to delete one Reservation.
     * @example
     * // Delete one Reservation
     * const Reservation = await prisma.reservation.delete({
     *   where: {
     *     // ... filter to delete one Reservation
     *   }
     * })
     * 
     */
    delete<T extends ReservationDeleteArgs>(args: SelectSubset<T, ReservationDeleteArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Reservation.
     * @param {ReservationUpdateArgs} args - Arguments to update one Reservation.
     * @example
     * // Update one Reservation
     * const reservation = await prisma.reservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservationUpdateArgs>(args: SelectSubset<T, ReservationUpdateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reservations.
     * @param {ReservationDeleteManyArgs} args - Arguments to filter Reservations to delete.
     * @example
     * // Delete a few Reservations
     * const { count } = await prisma.reservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservationDeleteManyArgs>(args?: SelectSubset<T, ReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservationUpdateManyArgs>(args: SelectSubset<T, ReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reservation.
     * @param {ReservationUpsertArgs} args - Arguments to update or create a Reservation.
     * @example
     * // Update or create a Reservation
     * const reservation = await prisma.reservation.upsert({
     *   create: {
     *     // ... data to create a Reservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reservation we want to update
     *   }
     * })
     */
    upsert<T extends ReservationUpsertArgs>(args: SelectSubset<T, ReservationUpsertArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationCountArgs} args - Arguments to filter Reservations to count.
     * @example
     * // Count the number of Reservations
     * const count = await prisma.reservation.count({
     *   where: {
     *     // ... the filter for the Reservations we want to count
     *   }
     * })
    **/
    count<T extends ReservationCountArgs>(
      args?: Subset<T, ReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReservationAggregateArgs>(args: Subset<T, ReservationAggregateArgs>): Prisma.PrismaPromise<GetReservationAggregateType<T>>

    /**
     * Group by Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationGroupByArgs} args - Group by arguments.
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
      T extends ReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservationGroupByArgs['orderBy'] }
        : { orderBy?: ReservationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reservation model
   */
  readonly fields: ReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends Reservation$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Reservation$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Reservation model
   */ 
  interface ReservationFieldRefs {
    readonly id: FieldRef<"Reservation", 'String'>
    readonly requesterId: FieldRef<"Reservation", 'String'>
    readonly requesterEmail: FieldRef<"Reservation", 'String'>
    readonly requesterName: FieldRef<"Reservation", 'String'>
    readonly status: FieldRef<"Reservation", 'ReservationStatus'>
    readonly requestDate: FieldRef<"Reservation", 'DateTime'>
    readonly approvedDate: FieldRef<"Reservation", 'DateTime'>
    readonly returnDate: FieldRef<"Reservation", 'DateTime'>
    readonly actualReturnDate: FieldRef<"Reservation", 'DateTime'>
    readonly approvedBy: FieldRef<"Reservation", 'String'>
    readonly deniedBy: FieldRef<"Reservation", 'String'>
    readonly denialReason: FieldRef<"Reservation", 'String'>
    readonly notes: FieldRef<"Reservation", 'String'>
    readonly createdAt: FieldRef<"Reservation", 'DateTime'>
    readonly updatedAt: FieldRef<"Reservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reservation findUnique
   */
  export type ReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findUniqueOrThrow
   */
  export type ReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findFirst
   */
  export type ReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findFirstOrThrow
   */
  export type ReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findMany
   */
  export type ReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservations to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation create
   */
  export type ReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The data needed to create a Reservation.
     */
    data: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
  }

  /**
   * Reservation createMany
   */
  export type ReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reservation createManyAndReturn
   */
  export type ReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reservation update
   */
  export type ReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The data needed to update a Reservation.
     */
    data: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
    /**
     * Choose, which Reservation to update.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation updateMany
   */
  export type ReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reservations.
     */
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyInput>
    /**
     * Filter which Reservations to update
     */
    where?: ReservationWhereInput
  }

  /**
   * Reservation upsert
   */
  export type ReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The filter to search for the Reservation to update in case it exists.
     */
    where: ReservationWhereUniqueInput
    /**
     * In case the Reservation found by the `where` argument doesn't exist, create a new Reservation with this data.
     */
    create: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
    /**
     * In case the Reservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
  }

  /**
   * Reservation delete
   */
  export type ReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter which Reservation to delete.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation deleteMany
   */
  export type ReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservations to delete
     */
    where?: ReservationWhereInput
  }

  /**
   * Reservation.items
   */
  export type Reservation$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    where?: ReservationItemWhereInput
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    cursor?: ReservationItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * Reservation without action
   */
  export type ReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
  }


  /**
   * Model ReservationItem
   */

  export type AggregateReservationItem = {
    _count: ReservationItemCountAggregateOutputType | null
    _avg: ReservationItemAvgAggregateOutputType | null
    _sum: ReservationItemSumAggregateOutputType | null
    _min: ReservationItemMinAggregateOutputType | null
    _max: ReservationItemMaxAggregateOutputType | null
  }

  export type ReservationItemAvgAggregateOutputType = {
    quantity: number | null
  }

  export type ReservationItemSumAggregateOutputType = {
    quantity: number | null
  }

  export type ReservationItemMinAggregateOutputType = {
    id: string | null
    reservationId: string | null
    assetTypeId: string | null
    assetTypeName: string | null
    assetId: string | null
    quantity: number | null
    status: $Enums.ReservationStatus | null
    notes: string | null
  }

  export type ReservationItemMaxAggregateOutputType = {
    id: string | null
    reservationId: string | null
    assetTypeId: string | null
    assetTypeName: string | null
    assetId: string | null
    quantity: number | null
    status: $Enums.ReservationStatus | null
    notes: string | null
  }

  export type ReservationItemCountAggregateOutputType = {
    id: number
    reservationId: number
    assetTypeId: number
    assetTypeName: number
    assetId: number
    quantity: number
    status: number
    notes: number
    _all: number
  }


  export type ReservationItemAvgAggregateInputType = {
    quantity?: true
  }

  export type ReservationItemSumAggregateInputType = {
    quantity?: true
  }

  export type ReservationItemMinAggregateInputType = {
    id?: true
    reservationId?: true
    assetTypeId?: true
    assetTypeName?: true
    assetId?: true
    quantity?: true
    status?: true
    notes?: true
  }

  export type ReservationItemMaxAggregateInputType = {
    id?: true
    reservationId?: true
    assetTypeId?: true
    assetTypeName?: true
    assetId?: true
    quantity?: true
    status?: true
    notes?: true
  }

  export type ReservationItemCountAggregateInputType = {
    id?: true
    reservationId?: true
    assetTypeId?: true
    assetTypeName?: true
    assetId?: true
    quantity?: true
    status?: true
    notes?: true
    _all?: true
  }

  export type ReservationItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReservationItem to aggregate.
     */
    where?: ReservationItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservationItems to fetch.
     */
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservationItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservationItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservationItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReservationItems
    **/
    _count?: true | ReservationItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservationItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservationItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservationItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservationItemMaxAggregateInputType
  }

  export type GetReservationItemAggregateType<T extends ReservationItemAggregateArgs> = {
        [P in keyof T & keyof AggregateReservationItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservationItem[P]>
      : GetScalarType<T[P], AggregateReservationItem[P]>
  }




  export type ReservationItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationItemWhereInput
    orderBy?: ReservationItemOrderByWithAggregationInput | ReservationItemOrderByWithAggregationInput[]
    by: ReservationItemScalarFieldEnum[] | ReservationItemScalarFieldEnum
    having?: ReservationItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservationItemCountAggregateInputType | true
    _avg?: ReservationItemAvgAggregateInputType
    _sum?: ReservationItemSumAggregateInputType
    _min?: ReservationItemMinAggregateInputType
    _max?: ReservationItemMaxAggregateInputType
  }

  export type ReservationItemGroupByOutputType = {
    id: string
    reservationId: string
    assetTypeId: string
    assetTypeName: string
    assetId: string | null
    quantity: number
    status: $Enums.ReservationStatus
    notes: string | null
    _count: ReservationItemCountAggregateOutputType | null
    _avg: ReservationItemAvgAggregateOutputType | null
    _sum: ReservationItemSumAggregateOutputType | null
    _min: ReservationItemMinAggregateOutputType | null
    _max: ReservationItemMaxAggregateOutputType | null
  }

  type GetReservationItemGroupByPayload<T extends ReservationItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservationItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservationItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservationItemGroupByOutputType[P]>
            : GetScalarType<T[P], ReservationItemGroupByOutputType[P]>
        }
      >
    >


  export type ReservationItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservationId?: boolean
    assetTypeId?: boolean
    assetTypeName?: boolean
    assetId?: boolean
    quantity?: boolean
    status?: boolean
    notes?: boolean
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservationItem"]>

  export type ReservationItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservationId?: boolean
    assetTypeId?: boolean
    assetTypeName?: boolean
    assetId?: boolean
    quantity?: boolean
    status?: boolean
    notes?: boolean
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservationItem"]>

  export type ReservationItemSelectScalar = {
    id?: boolean
    reservationId?: boolean
    assetTypeId?: boolean
    assetTypeName?: boolean
    assetId?: boolean
    quantity?: boolean
    status?: boolean
    notes?: boolean
  }

  export type ReservationItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
  }
  export type ReservationItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation?: boolean | ReservationDefaultArgs<ExtArgs>
  }

  export type $ReservationItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReservationItem"
    objects: {
      reservation: Prisma.$ReservationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reservationId: string
      assetTypeId: string
      assetTypeName: string
      assetId: string | null
      quantity: number
      status: $Enums.ReservationStatus
      notes: string | null
    }, ExtArgs["result"]["reservationItem"]>
    composites: {}
  }

  type ReservationItemGetPayload<S extends boolean | null | undefined | ReservationItemDefaultArgs> = $Result.GetResult<Prisma.$ReservationItemPayload, S>

  type ReservationItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReservationItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReservationItemCountAggregateInputType | true
    }

  export interface ReservationItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReservationItem'], meta: { name: 'ReservationItem' } }
    /**
     * Find zero or one ReservationItem that matches the filter.
     * @param {ReservationItemFindUniqueArgs} args - Arguments to find a ReservationItem
     * @example
     * // Get one ReservationItem
     * const reservationItem = await prisma.reservationItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservationItemFindUniqueArgs>(args: SelectSubset<T, ReservationItemFindUniqueArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReservationItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReservationItemFindUniqueOrThrowArgs} args - Arguments to find a ReservationItem
     * @example
     * // Get one ReservationItem
     * const reservationItem = await prisma.reservationItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservationItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservationItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReservationItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemFindFirstArgs} args - Arguments to find a ReservationItem
     * @example
     * // Get one ReservationItem
     * const reservationItem = await prisma.reservationItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservationItemFindFirstArgs>(args?: SelectSubset<T, ReservationItemFindFirstArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReservationItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemFindFirstOrThrowArgs} args - Arguments to find a ReservationItem
     * @example
     * // Get one ReservationItem
     * const reservationItem = await prisma.reservationItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservationItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservationItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReservationItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReservationItems
     * const reservationItems = await prisma.reservationItem.findMany()
     * 
     * // Get first 10 ReservationItems
     * const reservationItems = await prisma.reservationItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservationItemWithIdOnly = await prisma.reservationItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservationItemFindManyArgs>(args?: SelectSubset<T, ReservationItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReservationItem.
     * @param {ReservationItemCreateArgs} args - Arguments to create a ReservationItem.
     * @example
     * // Create one ReservationItem
     * const ReservationItem = await prisma.reservationItem.create({
     *   data: {
     *     // ... data to create a ReservationItem
     *   }
     * })
     * 
     */
    create<T extends ReservationItemCreateArgs>(args: SelectSubset<T, ReservationItemCreateArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReservationItems.
     * @param {ReservationItemCreateManyArgs} args - Arguments to create many ReservationItems.
     * @example
     * // Create many ReservationItems
     * const reservationItem = await prisma.reservationItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservationItemCreateManyArgs>(args?: SelectSubset<T, ReservationItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReservationItems and returns the data saved in the database.
     * @param {ReservationItemCreateManyAndReturnArgs} args - Arguments to create many ReservationItems.
     * @example
     * // Create many ReservationItems
     * const reservationItem = await prisma.reservationItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReservationItems and only return the `id`
     * const reservationItemWithIdOnly = await prisma.reservationItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservationItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservationItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReservationItem.
     * @param {ReservationItemDeleteArgs} args - Arguments to delete one ReservationItem.
     * @example
     * // Delete one ReservationItem
     * const ReservationItem = await prisma.reservationItem.delete({
     *   where: {
     *     // ... filter to delete one ReservationItem
     *   }
     * })
     * 
     */
    delete<T extends ReservationItemDeleteArgs>(args: SelectSubset<T, ReservationItemDeleteArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReservationItem.
     * @param {ReservationItemUpdateArgs} args - Arguments to update one ReservationItem.
     * @example
     * // Update one ReservationItem
     * const reservationItem = await prisma.reservationItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservationItemUpdateArgs>(args: SelectSubset<T, ReservationItemUpdateArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReservationItems.
     * @param {ReservationItemDeleteManyArgs} args - Arguments to filter ReservationItems to delete.
     * @example
     * // Delete a few ReservationItems
     * const { count } = await prisma.reservationItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservationItemDeleteManyArgs>(args?: SelectSubset<T, ReservationItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReservationItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReservationItems
     * const reservationItem = await prisma.reservationItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservationItemUpdateManyArgs>(args: SelectSubset<T, ReservationItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReservationItem.
     * @param {ReservationItemUpsertArgs} args - Arguments to update or create a ReservationItem.
     * @example
     * // Update or create a ReservationItem
     * const reservationItem = await prisma.reservationItem.upsert({
     *   create: {
     *     // ... data to create a ReservationItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReservationItem we want to update
     *   }
     * })
     */
    upsert<T extends ReservationItemUpsertArgs>(args: SelectSubset<T, ReservationItemUpsertArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReservationItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemCountArgs} args - Arguments to filter ReservationItems to count.
     * @example
     * // Count the number of ReservationItems
     * const count = await prisma.reservationItem.count({
     *   where: {
     *     // ... the filter for the ReservationItems we want to count
     *   }
     * })
    **/
    count<T extends ReservationItemCountArgs>(
      args?: Subset<T, ReservationItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservationItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReservationItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReservationItemAggregateArgs>(args: Subset<T, ReservationItemAggregateArgs>): Prisma.PrismaPromise<GetReservationItemAggregateType<T>>

    /**
     * Group by ReservationItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemGroupByArgs} args - Group by arguments.
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
      T extends ReservationItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservationItemGroupByArgs['orderBy'] }
        : { orderBy?: ReservationItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReservationItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReservationItem model
   */
  readonly fields: ReservationItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReservationItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservationItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservation<T extends ReservationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReservationDefaultArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ReservationItem model
   */ 
  interface ReservationItemFieldRefs {
    readonly id: FieldRef<"ReservationItem", 'String'>
    readonly reservationId: FieldRef<"ReservationItem", 'String'>
    readonly assetTypeId: FieldRef<"ReservationItem", 'String'>
    readonly assetTypeName: FieldRef<"ReservationItem", 'String'>
    readonly assetId: FieldRef<"ReservationItem", 'String'>
    readonly quantity: FieldRef<"ReservationItem", 'Int'>
    readonly status: FieldRef<"ReservationItem", 'ReservationStatus'>
    readonly notes: FieldRef<"ReservationItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ReservationItem findUnique
   */
  export type ReservationItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItem to fetch.
     */
    where: ReservationItemWhereUniqueInput
  }

  /**
   * ReservationItem findUniqueOrThrow
   */
  export type ReservationItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItem to fetch.
     */
    where: ReservationItemWhereUniqueInput
  }

  /**
   * ReservationItem findFirst
   */
  export type ReservationItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItem to fetch.
     */
    where?: ReservationItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservationItems to fetch.
     */
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReservationItems.
     */
    cursor?: ReservationItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservationItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservationItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReservationItems.
     */
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * ReservationItem findFirstOrThrow
   */
  export type ReservationItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItem to fetch.
     */
    where?: ReservationItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservationItems to fetch.
     */
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReservationItems.
     */
    cursor?: ReservationItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservationItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservationItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReservationItems.
     */
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * ReservationItem findMany
   */
  export type ReservationItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItems to fetch.
     */
    where?: ReservationItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservationItems to fetch.
     */
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReservationItems.
     */
    cursor?: ReservationItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservationItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservationItems.
     */
    skip?: number
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * ReservationItem create
   */
  export type ReservationItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ReservationItem.
     */
    data: XOR<ReservationItemCreateInput, ReservationItemUncheckedCreateInput>
  }

  /**
   * ReservationItem createMany
   */
  export type ReservationItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReservationItems.
     */
    data: ReservationItemCreateManyInput | ReservationItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReservationItem createManyAndReturn
   */
  export type ReservationItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReservationItems.
     */
    data: ReservationItemCreateManyInput | ReservationItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReservationItem update
   */
  export type ReservationItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ReservationItem.
     */
    data: XOR<ReservationItemUpdateInput, ReservationItemUncheckedUpdateInput>
    /**
     * Choose, which ReservationItem to update.
     */
    where: ReservationItemWhereUniqueInput
  }

  /**
   * ReservationItem updateMany
   */
  export type ReservationItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReservationItems.
     */
    data: XOR<ReservationItemUpdateManyMutationInput, ReservationItemUncheckedUpdateManyInput>
    /**
     * Filter which ReservationItems to update
     */
    where?: ReservationItemWhereInput
  }

  /**
   * ReservationItem upsert
   */
  export type ReservationItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ReservationItem to update in case it exists.
     */
    where: ReservationItemWhereUniqueInput
    /**
     * In case the ReservationItem found by the `where` argument doesn't exist, create a new ReservationItem with this data.
     */
    create: XOR<ReservationItemCreateInput, ReservationItemUncheckedCreateInput>
    /**
     * In case the ReservationItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservationItemUpdateInput, ReservationItemUncheckedUpdateInput>
  }

  /**
   * ReservationItem delete
   */
  export type ReservationItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter which ReservationItem to delete.
     */
    where: ReservationItemWhereUniqueInput
  }

  /**
   * ReservationItem deleteMany
   */
  export type ReservationItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReservationItems to delete
     */
    where?: ReservationItemWhereInput
  }

  /**
   * ReservationItem without action
   */
  export type ReservationItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
  }


  /**
   * Model EquipmentAvailability
   */

  export type AggregateEquipmentAvailability = {
    _count: EquipmentAvailabilityCountAggregateOutputType | null
    _avg: EquipmentAvailabilityAvgAggregateOutputType | null
    _sum: EquipmentAvailabilitySumAggregateOutputType | null
    _min: EquipmentAvailabilityMinAggregateOutputType | null
    _max: EquipmentAvailabilityMaxAggregateOutputType | null
  }

  export type EquipmentAvailabilityAvgAggregateOutputType = {
    totalCount: number | null
    assignedCount: number | null
    reservedCount: number | null
    availableCount: number | null
  }

  export type EquipmentAvailabilitySumAggregateOutputType = {
    totalCount: number | null
    assignedCount: number | null
    reservedCount: number | null
    availableCount: number | null
  }

  export type EquipmentAvailabilityMinAggregateOutputType = {
    id: string | null
    assetTypeId: string | null
    assetTypeName: string | null
    totalCount: number | null
    assignedCount: number | null
    reservedCount: number | null
    availableCount: number | null
    updatedAt: Date | null
  }

  export type EquipmentAvailabilityMaxAggregateOutputType = {
    id: string | null
    assetTypeId: string | null
    assetTypeName: string | null
    totalCount: number | null
    assignedCount: number | null
    reservedCount: number | null
    availableCount: number | null
    updatedAt: Date | null
  }

  export type EquipmentAvailabilityCountAggregateOutputType = {
    id: number
    assetTypeId: number
    assetTypeName: number
    totalCount: number
    assignedCount: number
    reservedCount: number
    availableCount: number
    updatedAt: number
    _all: number
  }


  export type EquipmentAvailabilityAvgAggregateInputType = {
    totalCount?: true
    assignedCount?: true
    reservedCount?: true
    availableCount?: true
  }

  export type EquipmentAvailabilitySumAggregateInputType = {
    totalCount?: true
    assignedCount?: true
    reservedCount?: true
    availableCount?: true
  }

  export type EquipmentAvailabilityMinAggregateInputType = {
    id?: true
    assetTypeId?: true
    assetTypeName?: true
    totalCount?: true
    assignedCount?: true
    reservedCount?: true
    availableCount?: true
    updatedAt?: true
  }

  export type EquipmentAvailabilityMaxAggregateInputType = {
    id?: true
    assetTypeId?: true
    assetTypeName?: true
    totalCount?: true
    assignedCount?: true
    reservedCount?: true
    availableCount?: true
    updatedAt?: true
  }

  export type EquipmentAvailabilityCountAggregateInputType = {
    id?: true
    assetTypeId?: true
    assetTypeName?: true
    totalCount?: true
    assignedCount?: true
    reservedCount?: true
    availableCount?: true
    updatedAt?: true
    _all?: true
  }

  export type EquipmentAvailabilityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EquipmentAvailability to aggregate.
     */
    where?: EquipmentAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EquipmentAvailabilities to fetch.
     */
    orderBy?: EquipmentAvailabilityOrderByWithRelationInput | EquipmentAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EquipmentAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EquipmentAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EquipmentAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EquipmentAvailabilities
    **/
    _count?: true | EquipmentAvailabilityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EquipmentAvailabilityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EquipmentAvailabilitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EquipmentAvailabilityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EquipmentAvailabilityMaxAggregateInputType
  }

  export type GetEquipmentAvailabilityAggregateType<T extends EquipmentAvailabilityAggregateArgs> = {
        [P in keyof T & keyof AggregateEquipmentAvailability]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEquipmentAvailability[P]>
      : GetScalarType<T[P], AggregateEquipmentAvailability[P]>
  }




  export type EquipmentAvailabilityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EquipmentAvailabilityWhereInput
    orderBy?: EquipmentAvailabilityOrderByWithAggregationInput | EquipmentAvailabilityOrderByWithAggregationInput[]
    by: EquipmentAvailabilityScalarFieldEnum[] | EquipmentAvailabilityScalarFieldEnum
    having?: EquipmentAvailabilityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EquipmentAvailabilityCountAggregateInputType | true
    _avg?: EquipmentAvailabilityAvgAggregateInputType
    _sum?: EquipmentAvailabilitySumAggregateInputType
    _min?: EquipmentAvailabilityMinAggregateInputType
    _max?: EquipmentAvailabilityMaxAggregateInputType
  }

  export type EquipmentAvailabilityGroupByOutputType = {
    id: string
    assetTypeId: string
    assetTypeName: string
    totalCount: number
    assignedCount: number
    reservedCount: number
    availableCount: number
    updatedAt: Date
    _count: EquipmentAvailabilityCountAggregateOutputType | null
    _avg: EquipmentAvailabilityAvgAggregateOutputType | null
    _sum: EquipmentAvailabilitySumAggregateOutputType | null
    _min: EquipmentAvailabilityMinAggregateOutputType | null
    _max: EquipmentAvailabilityMaxAggregateOutputType | null
  }

  type GetEquipmentAvailabilityGroupByPayload<T extends EquipmentAvailabilityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EquipmentAvailabilityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EquipmentAvailabilityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EquipmentAvailabilityGroupByOutputType[P]>
            : GetScalarType<T[P], EquipmentAvailabilityGroupByOutputType[P]>
        }
      >
    >


  export type EquipmentAvailabilitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetTypeId?: boolean
    assetTypeName?: boolean
    totalCount?: boolean
    assignedCount?: boolean
    reservedCount?: boolean
    availableCount?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["equipmentAvailability"]>

  export type EquipmentAvailabilitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetTypeId?: boolean
    assetTypeName?: boolean
    totalCount?: boolean
    assignedCount?: boolean
    reservedCount?: boolean
    availableCount?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["equipmentAvailability"]>

  export type EquipmentAvailabilitySelectScalar = {
    id?: boolean
    assetTypeId?: boolean
    assetTypeName?: boolean
    totalCount?: boolean
    assignedCount?: boolean
    reservedCount?: boolean
    availableCount?: boolean
    updatedAt?: boolean
  }


  export type $EquipmentAvailabilityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EquipmentAvailability"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetTypeId: string
      assetTypeName: string
      totalCount: number
      assignedCount: number
      reservedCount: number
      availableCount: number
      updatedAt: Date
    }, ExtArgs["result"]["equipmentAvailability"]>
    composites: {}
  }

  type EquipmentAvailabilityGetPayload<S extends boolean | null | undefined | EquipmentAvailabilityDefaultArgs> = $Result.GetResult<Prisma.$EquipmentAvailabilityPayload, S>

  type EquipmentAvailabilityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EquipmentAvailabilityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EquipmentAvailabilityCountAggregateInputType | true
    }

  export interface EquipmentAvailabilityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EquipmentAvailability'], meta: { name: 'EquipmentAvailability' } }
    /**
     * Find zero or one EquipmentAvailability that matches the filter.
     * @param {EquipmentAvailabilityFindUniqueArgs} args - Arguments to find a EquipmentAvailability
     * @example
     * // Get one EquipmentAvailability
     * const equipmentAvailability = await prisma.equipmentAvailability.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EquipmentAvailabilityFindUniqueArgs>(args: SelectSubset<T, EquipmentAvailabilityFindUniqueArgs<ExtArgs>>): Prisma__EquipmentAvailabilityClient<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EquipmentAvailability that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EquipmentAvailabilityFindUniqueOrThrowArgs} args - Arguments to find a EquipmentAvailability
     * @example
     * // Get one EquipmentAvailability
     * const equipmentAvailability = await prisma.equipmentAvailability.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EquipmentAvailabilityFindUniqueOrThrowArgs>(args: SelectSubset<T, EquipmentAvailabilityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EquipmentAvailabilityClient<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EquipmentAvailability that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipmentAvailabilityFindFirstArgs} args - Arguments to find a EquipmentAvailability
     * @example
     * // Get one EquipmentAvailability
     * const equipmentAvailability = await prisma.equipmentAvailability.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EquipmentAvailabilityFindFirstArgs>(args?: SelectSubset<T, EquipmentAvailabilityFindFirstArgs<ExtArgs>>): Prisma__EquipmentAvailabilityClient<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EquipmentAvailability that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipmentAvailabilityFindFirstOrThrowArgs} args - Arguments to find a EquipmentAvailability
     * @example
     * // Get one EquipmentAvailability
     * const equipmentAvailability = await prisma.equipmentAvailability.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EquipmentAvailabilityFindFirstOrThrowArgs>(args?: SelectSubset<T, EquipmentAvailabilityFindFirstOrThrowArgs<ExtArgs>>): Prisma__EquipmentAvailabilityClient<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EquipmentAvailabilities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipmentAvailabilityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EquipmentAvailabilities
     * const equipmentAvailabilities = await prisma.equipmentAvailability.findMany()
     * 
     * // Get first 10 EquipmentAvailabilities
     * const equipmentAvailabilities = await prisma.equipmentAvailability.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const equipmentAvailabilityWithIdOnly = await prisma.equipmentAvailability.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EquipmentAvailabilityFindManyArgs>(args?: SelectSubset<T, EquipmentAvailabilityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EquipmentAvailability.
     * @param {EquipmentAvailabilityCreateArgs} args - Arguments to create a EquipmentAvailability.
     * @example
     * // Create one EquipmentAvailability
     * const EquipmentAvailability = await prisma.equipmentAvailability.create({
     *   data: {
     *     // ... data to create a EquipmentAvailability
     *   }
     * })
     * 
     */
    create<T extends EquipmentAvailabilityCreateArgs>(args: SelectSubset<T, EquipmentAvailabilityCreateArgs<ExtArgs>>): Prisma__EquipmentAvailabilityClient<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EquipmentAvailabilities.
     * @param {EquipmentAvailabilityCreateManyArgs} args - Arguments to create many EquipmentAvailabilities.
     * @example
     * // Create many EquipmentAvailabilities
     * const equipmentAvailability = await prisma.equipmentAvailability.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EquipmentAvailabilityCreateManyArgs>(args?: SelectSubset<T, EquipmentAvailabilityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EquipmentAvailabilities and returns the data saved in the database.
     * @param {EquipmentAvailabilityCreateManyAndReturnArgs} args - Arguments to create many EquipmentAvailabilities.
     * @example
     * // Create many EquipmentAvailabilities
     * const equipmentAvailability = await prisma.equipmentAvailability.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EquipmentAvailabilities and only return the `id`
     * const equipmentAvailabilityWithIdOnly = await prisma.equipmentAvailability.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EquipmentAvailabilityCreateManyAndReturnArgs>(args?: SelectSubset<T, EquipmentAvailabilityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EquipmentAvailability.
     * @param {EquipmentAvailabilityDeleteArgs} args - Arguments to delete one EquipmentAvailability.
     * @example
     * // Delete one EquipmentAvailability
     * const EquipmentAvailability = await prisma.equipmentAvailability.delete({
     *   where: {
     *     // ... filter to delete one EquipmentAvailability
     *   }
     * })
     * 
     */
    delete<T extends EquipmentAvailabilityDeleteArgs>(args: SelectSubset<T, EquipmentAvailabilityDeleteArgs<ExtArgs>>): Prisma__EquipmentAvailabilityClient<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EquipmentAvailability.
     * @param {EquipmentAvailabilityUpdateArgs} args - Arguments to update one EquipmentAvailability.
     * @example
     * // Update one EquipmentAvailability
     * const equipmentAvailability = await prisma.equipmentAvailability.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EquipmentAvailabilityUpdateArgs>(args: SelectSubset<T, EquipmentAvailabilityUpdateArgs<ExtArgs>>): Prisma__EquipmentAvailabilityClient<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EquipmentAvailabilities.
     * @param {EquipmentAvailabilityDeleteManyArgs} args - Arguments to filter EquipmentAvailabilities to delete.
     * @example
     * // Delete a few EquipmentAvailabilities
     * const { count } = await prisma.equipmentAvailability.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EquipmentAvailabilityDeleteManyArgs>(args?: SelectSubset<T, EquipmentAvailabilityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EquipmentAvailabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipmentAvailabilityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EquipmentAvailabilities
     * const equipmentAvailability = await prisma.equipmentAvailability.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EquipmentAvailabilityUpdateManyArgs>(args: SelectSubset<T, EquipmentAvailabilityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EquipmentAvailability.
     * @param {EquipmentAvailabilityUpsertArgs} args - Arguments to update or create a EquipmentAvailability.
     * @example
     * // Update or create a EquipmentAvailability
     * const equipmentAvailability = await prisma.equipmentAvailability.upsert({
     *   create: {
     *     // ... data to create a EquipmentAvailability
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EquipmentAvailability we want to update
     *   }
     * })
     */
    upsert<T extends EquipmentAvailabilityUpsertArgs>(args: SelectSubset<T, EquipmentAvailabilityUpsertArgs<ExtArgs>>): Prisma__EquipmentAvailabilityClient<$Result.GetResult<Prisma.$EquipmentAvailabilityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EquipmentAvailabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipmentAvailabilityCountArgs} args - Arguments to filter EquipmentAvailabilities to count.
     * @example
     * // Count the number of EquipmentAvailabilities
     * const count = await prisma.equipmentAvailability.count({
     *   where: {
     *     // ... the filter for the EquipmentAvailabilities we want to count
     *   }
     * })
    **/
    count<T extends EquipmentAvailabilityCountArgs>(
      args?: Subset<T, EquipmentAvailabilityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EquipmentAvailabilityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EquipmentAvailability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipmentAvailabilityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EquipmentAvailabilityAggregateArgs>(args: Subset<T, EquipmentAvailabilityAggregateArgs>): Prisma.PrismaPromise<GetEquipmentAvailabilityAggregateType<T>>

    /**
     * Group by EquipmentAvailability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipmentAvailabilityGroupByArgs} args - Group by arguments.
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
      T extends EquipmentAvailabilityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EquipmentAvailabilityGroupByArgs['orderBy'] }
        : { orderBy?: EquipmentAvailabilityGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EquipmentAvailabilityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEquipmentAvailabilityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EquipmentAvailability model
   */
  readonly fields: EquipmentAvailabilityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EquipmentAvailability.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EquipmentAvailabilityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the EquipmentAvailability model
   */ 
  interface EquipmentAvailabilityFieldRefs {
    readonly id: FieldRef<"EquipmentAvailability", 'String'>
    readonly assetTypeId: FieldRef<"EquipmentAvailability", 'String'>
    readonly assetTypeName: FieldRef<"EquipmentAvailability", 'String'>
    readonly totalCount: FieldRef<"EquipmentAvailability", 'Int'>
    readonly assignedCount: FieldRef<"EquipmentAvailability", 'Int'>
    readonly reservedCount: FieldRef<"EquipmentAvailability", 'Int'>
    readonly availableCount: FieldRef<"EquipmentAvailability", 'Int'>
    readonly updatedAt: FieldRef<"EquipmentAvailability", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EquipmentAvailability findUnique
   */
  export type EquipmentAvailabilityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which EquipmentAvailability to fetch.
     */
    where: EquipmentAvailabilityWhereUniqueInput
  }

  /**
   * EquipmentAvailability findUniqueOrThrow
   */
  export type EquipmentAvailabilityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which EquipmentAvailability to fetch.
     */
    where: EquipmentAvailabilityWhereUniqueInput
  }

  /**
   * EquipmentAvailability findFirst
   */
  export type EquipmentAvailabilityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which EquipmentAvailability to fetch.
     */
    where?: EquipmentAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EquipmentAvailabilities to fetch.
     */
    orderBy?: EquipmentAvailabilityOrderByWithRelationInput | EquipmentAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EquipmentAvailabilities.
     */
    cursor?: EquipmentAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EquipmentAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EquipmentAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EquipmentAvailabilities.
     */
    distinct?: EquipmentAvailabilityScalarFieldEnum | EquipmentAvailabilityScalarFieldEnum[]
  }

  /**
   * EquipmentAvailability findFirstOrThrow
   */
  export type EquipmentAvailabilityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which EquipmentAvailability to fetch.
     */
    where?: EquipmentAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EquipmentAvailabilities to fetch.
     */
    orderBy?: EquipmentAvailabilityOrderByWithRelationInput | EquipmentAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EquipmentAvailabilities.
     */
    cursor?: EquipmentAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EquipmentAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EquipmentAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EquipmentAvailabilities.
     */
    distinct?: EquipmentAvailabilityScalarFieldEnum | EquipmentAvailabilityScalarFieldEnum[]
  }

  /**
   * EquipmentAvailability findMany
   */
  export type EquipmentAvailabilityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which EquipmentAvailabilities to fetch.
     */
    where?: EquipmentAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EquipmentAvailabilities to fetch.
     */
    orderBy?: EquipmentAvailabilityOrderByWithRelationInput | EquipmentAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EquipmentAvailabilities.
     */
    cursor?: EquipmentAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EquipmentAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EquipmentAvailabilities.
     */
    skip?: number
    distinct?: EquipmentAvailabilityScalarFieldEnum | EquipmentAvailabilityScalarFieldEnum[]
  }

  /**
   * EquipmentAvailability create
   */
  export type EquipmentAvailabilityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * The data needed to create a EquipmentAvailability.
     */
    data: XOR<EquipmentAvailabilityCreateInput, EquipmentAvailabilityUncheckedCreateInput>
  }

  /**
   * EquipmentAvailability createMany
   */
  export type EquipmentAvailabilityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EquipmentAvailabilities.
     */
    data: EquipmentAvailabilityCreateManyInput | EquipmentAvailabilityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EquipmentAvailability createManyAndReturn
   */
  export type EquipmentAvailabilityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EquipmentAvailabilities.
     */
    data: EquipmentAvailabilityCreateManyInput | EquipmentAvailabilityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EquipmentAvailability update
   */
  export type EquipmentAvailabilityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * The data needed to update a EquipmentAvailability.
     */
    data: XOR<EquipmentAvailabilityUpdateInput, EquipmentAvailabilityUncheckedUpdateInput>
    /**
     * Choose, which EquipmentAvailability to update.
     */
    where: EquipmentAvailabilityWhereUniqueInput
  }

  /**
   * EquipmentAvailability updateMany
   */
  export type EquipmentAvailabilityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EquipmentAvailabilities.
     */
    data: XOR<EquipmentAvailabilityUpdateManyMutationInput, EquipmentAvailabilityUncheckedUpdateManyInput>
    /**
     * Filter which EquipmentAvailabilities to update
     */
    where?: EquipmentAvailabilityWhereInput
  }

  /**
   * EquipmentAvailability upsert
   */
  export type EquipmentAvailabilityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * The filter to search for the EquipmentAvailability to update in case it exists.
     */
    where: EquipmentAvailabilityWhereUniqueInput
    /**
     * In case the EquipmentAvailability found by the `where` argument doesn't exist, create a new EquipmentAvailability with this data.
     */
    create: XOR<EquipmentAvailabilityCreateInput, EquipmentAvailabilityUncheckedCreateInput>
    /**
     * In case the EquipmentAvailability was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EquipmentAvailabilityUpdateInput, EquipmentAvailabilityUncheckedUpdateInput>
  }

  /**
   * EquipmentAvailability delete
   */
  export type EquipmentAvailabilityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
    /**
     * Filter which EquipmentAvailability to delete.
     */
    where: EquipmentAvailabilityWhereUniqueInput
  }

  /**
   * EquipmentAvailability deleteMany
   */
  export type EquipmentAvailabilityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EquipmentAvailabilities to delete
     */
    where?: EquipmentAvailabilityWhereInput
  }

  /**
   * EquipmentAvailability without action
   */
  export type EquipmentAvailabilityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EquipmentAvailability
     */
    select?: EquipmentAvailabilitySelect<ExtArgs> | null
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


  export const ReservationScalarFieldEnum: {
    id: 'id',
    requesterId: 'requesterId',
    requesterEmail: 'requesterEmail',
    requesterName: 'requesterName',
    status: 'status',
    requestDate: 'requestDate',
    approvedDate: 'approvedDate',
    returnDate: 'returnDate',
    actualReturnDate: 'actualReturnDate',
    approvedBy: 'approvedBy',
    deniedBy: 'deniedBy',
    denialReason: 'denialReason',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReservationScalarFieldEnum = (typeof ReservationScalarFieldEnum)[keyof typeof ReservationScalarFieldEnum]


  export const ReservationItemScalarFieldEnum: {
    id: 'id',
    reservationId: 'reservationId',
    assetTypeId: 'assetTypeId',
    assetTypeName: 'assetTypeName',
    assetId: 'assetId',
    quantity: 'quantity',
    status: 'status',
    notes: 'notes'
  };

  export type ReservationItemScalarFieldEnum = (typeof ReservationItemScalarFieldEnum)[keyof typeof ReservationItemScalarFieldEnum]


  export const EquipmentAvailabilityScalarFieldEnum: {
    id: 'id',
    assetTypeId: 'assetTypeId',
    assetTypeName: 'assetTypeName',
    totalCount: 'totalCount',
    assignedCount: 'assignedCount',
    reservedCount: 'reservedCount',
    availableCount: 'availableCount',
    updatedAt: 'updatedAt'
  };

  export type EquipmentAvailabilityScalarFieldEnum = (typeof EquipmentAvailabilityScalarFieldEnum)[keyof typeof EquipmentAvailabilityScalarFieldEnum]


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
   * Reference to a field of type 'ReservationStatus'
   */
  export type EnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus'>
    


  /**
   * Reference to a field of type 'ReservationStatus[]'
   */
  export type ListEnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ReservationWhereInput = {
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    id?: StringFilter<"Reservation"> | string
    requesterId?: StringFilter<"Reservation"> | string
    requesterEmail?: StringNullableFilter<"Reservation"> | string | null
    requesterName?: StringNullableFilter<"Reservation"> | string | null
    status?: EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus
    requestDate?: DateTimeFilter<"Reservation"> | Date | string
    approvedDate?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    returnDate?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    actualReturnDate?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    approvedBy?: StringNullableFilter<"Reservation"> | string | null
    deniedBy?: StringNullableFilter<"Reservation"> | string | null
    denialReason?: StringNullableFilter<"Reservation"> | string | null
    notes?: StringNullableFilter<"Reservation"> | string | null
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    items?: ReservationItemListRelationFilter
  }

  export type ReservationOrderByWithRelationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    requesterEmail?: SortOrderInput | SortOrder
    requesterName?: SortOrderInput | SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvedDate?: SortOrderInput | SortOrder
    returnDate?: SortOrderInput | SortOrder
    actualReturnDate?: SortOrderInput | SortOrder
    approvedBy?: SortOrderInput | SortOrder
    deniedBy?: SortOrderInput | SortOrder
    denialReason?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: ReservationItemOrderByRelationAggregateInput
  }

  export type ReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    requesterId?: StringFilter<"Reservation"> | string
    requesterEmail?: StringNullableFilter<"Reservation"> | string | null
    requesterName?: StringNullableFilter<"Reservation"> | string | null
    status?: EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus
    requestDate?: DateTimeFilter<"Reservation"> | Date | string
    approvedDate?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    returnDate?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    actualReturnDate?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    approvedBy?: StringNullableFilter<"Reservation"> | string | null
    deniedBy?: StringNullableFilter<"Reservation"> | string | null
    denialReason?: StringNullableFilter<"Reservation"> | string | null
    notes?: StringNullableFilter<"Reservation"> | string | null
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    items?: ReservationItemListRelationFilter
  }, "id">

  export type ReservationOrderByWithAggregationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    requesterEmail?: SortOrderInput | SortOrder
    requesterName?: SortOrderInput | SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvedDate?: SortOrderInput | SortOrder
    returnDate?: SortOrderInput | SortOrder
    actualReturnDate?: SortOrderInput | SortOrder
    approvedBy?: SortOrderInput | SortOrder
    deniedBy?: SortOrderInput | SortOrder
    denialReason?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReservationCountOrderByAggregateInput
    _max?: ReservationMaxOrderByAggregateInput
    _min?: ReservationMinOrderByAggregateInput
  }

  export type ReservationScalarWhereWithAggregatesInput = {
    AND?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    OR?: ReservationScalarWhereWithAggregatesInput[]
    NOT?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reservation"> | string
    requesterId?: StringWithAggregatesFilter<"Reservation"> | string
    requesterEmail?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    requesterName?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    status?: EnumReservationStatusWithAggregatesFilter<"Reservation"> | $Enums.ReservationStatus
    requestDate?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    approvedDate?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    returnDate?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    actualReturnDate?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    approvedBy?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    deniedBy?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    denialReason?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
  }

  export type ReservationItemWhereInput = {
    AND?: ReservationItemWhereInput | ReservationItemWhereInput[]
    OR?: ReservationItemWhereInput[]
    NOT?: ReservationItemWhereInput | ReservationItemWhereInput[]
    id?: StringFilter<"ReservationItem"> | string
    reservationId?: StringFilter<"ReservationItem"> | string
    assetTypeId?: StringFilter<"ReservationItem"> | string
    assetTypeName?: StringFilter<"ReservationItem"> | string
    assetId?: StringNullableFilter<"ReservationItem"> | string | null
    quantity?: IntFilter<"ReservationItem"> | number
    status?: EnumReservationStatusFilter<"ReservationItem"> | $Enums.ReservationStatus
    notes?: StringNullableFilter<"ReservationItem"> | string | null
    reservation?: XOR<ReservationRelationFilter, ReservationWhereInput>
  }

  export type ReservationItemOrderByWithRelationInput = {
    id?: SortOrder
    reservationId?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    assetId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    reservation?: ReservationOrderByWithRelationInput
  }

  export type ReservationItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReservationItemWhereInput | ReservationItemWhereInput[]
    OR?: ReservationItemWhereInput[]
    NOT?: ReservationItemWhereInput | ReservationItemWhereInput[]
    reservationId?: StringFilter<"ReservationItem"> | string
    assetTypeId?: StringFilter<"ReservationItem"> | string
    assetTypeName?: StringFilter<"ReservationItem"> | string
    assetId?: StringNullableFilter<"ReservationItem"> | string | null
    quantity?: IntFilter<"ReservationItem"> | number
    status?: EnumReservationStatusFilter<"ReservationItem"> | $Enums.ReservationStatus
    notes?: StringNullableFilter<"ReservationItem"> | string | null
    reservation?: XOR<ReservationRelationFilter, ReservationWhereInput>
  }, "id">

  export type ReservationItemOrderByWithAggregationInput = {
    id?: SortOrder
    reservationId?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    assetId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    _count?: ReservationItemCountOrderByAggregateInput
    _avg?: ReservationItemAvgOrderByAggregateInput
    _max?: ReservationItemMaxOrderByAggregateInput
    _min?: ReservationItemMinOrderByAggregateInput
    _sum?: ReservationItemSumOrderByAggregateInput
  }

  export type ReservationItemScalarWhereWithAggregatesInput = {
    AND?: ReservationItemScalarWhereWithAggregatesInput | ReservationItemScalarWhereWithAggregatesInput[]
    OR?: ReservationItemScalarWhereWithAggregatesInput[]
    NOT?: ReservationItemScalarWhereWithAggregatesInput | ReservationItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReservationItem"> | string
    reservationId?: StringWithAggregatesFilter<"ReservationItem"> | string
    assetTypeId?: StringWithAggregatesFilter<"ReservationItem"> | string
    assetTypeName?: StringWithAggregatesFilter<"ReservationItem"> | string
    assetId?: StringNullableWithAggregatesFilter<"ReservationItem"> | string | null
    quantity?: IntWithAggregatesFilter<"ReservationItem"> | number
    status?: EnumReservationStatusWithAggregatesFilter<"ReservationItem"> | $Enums.ReservationStatus
    notes?: StringNullableWithAggregatesFilter<"ReservationItem"> | string | null
  }

  export type EquipmentAvailabilityWhereInput = {
    AND?: EquipmentAvailabilityWhereInput | EquipmentAvailabilityWhereInput[]
    OR?: EquipmentAvailabilityWhereInput[]
    NOT?: EquipmentAvailabilityWhereInput | EquipmentAvailabilityWhereInput[]
    id?: StringFilter<"EquipmentAvailability"> | string
    assetTypeId?: StringFilter<"EquipmentAvailability"> | string
    assetTypeName?: StringFilter<"EquipmentAvailability"> | string
    totalCount?: IntFilter<"EquipmentAvailability"> | number
    assignedCount?: IntFilter<"EquipmentAvailability"> | number
    reservedCount?: IntFilter<"EquipmentAvailability"> | number
    availableCount?: IntFilter<"EquipmentAvailability"> | number
    updatedAt?: DateTimeFilter<"EquipmentAvailability"> | Date | string
  }

  export type EquipmentAvailabilityOrderByWithRelationInput = {
    id?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    totalCount?: SortOrder
    assignedCount?: SortOrder
    reservedCount?: SortOrder
    availableCount?: SortOrder
    updatedAt?: SortOrder
  }

  export type EquipmentAvailabilityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    assetTypeId?: string
    AND?: EquipmentAvailabilityWhereInput | EquipmentAvailabilityWhereInput[]
    OR?: EquipmentAvailabilityWhereInput[]
    NOT?: EquipmentAvailabilityWhereInput | EquipmentAvailabilityWhereInput[]
    assetTypeName?: StringFilter<"EquipmentAvailability"> | string
    totalCount?: IntFilter<"EquipmentAvailability"> | number
    assignedCount?: IntFilter<"EquipmentAvailability"> | number
    reservedCount?: IntFilter<"EquipmentAvailability"> | number
    availableCount?: IntFilter<"EquipmentAvailability"> | number
    updatedAt?: DateTimeFilter<"EquipmentAvailability"> | Date | string
  }, "id" | "assetTypeId">

  export type EquipmentAvailabilityOrderByWithAggregationInput = {
    id?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    totalCount?: SortOrder
    assignedCount?: SortOrder
    reservedCount?: SortOrder
    availableCount?: SortOrder
    updatedAt?: SortOrder
    _count?: EquipmentAvailabilityCountOrderByAggregateInput
    _avg?: EquipmentAvailabilityAvgOrderByAggregateInput
    _max?: EquipmentAvailabilityMaxOrderByAggregateInput
    _min?: EquipmentAvailabilityMinOrderByAggregateInput
    _sum?: EquipmentAvailabilitySumOrderByAggregateInput
  }

  export type EquipmentAvailabilityScalarWhereWithAggregatesInput = {
    AND?: EquipmentAvailabilityScalarWhereWithAggregatesInput | EquipmentAvailabilityScalarWhereWithAggregatesInput[]
    OR?: EquipmentAvailabilityScalarWhereWithAggregatesInput[]
    NOT?: EquipmentAvailabilityScalarWhereWithAggregatesInput | EquipmentAvailabilityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EquipmentAvailability"> | string
    assetTypeId?: StringWithAggregatesFilter<"EquipmentAvailability"> | string
    assetTypeName?: StringWithAggregatesFilter<"EquipmentAvailability"> | string
    totalCount?: IntWithAggregatesFilter<"EquipmentAvailability"> | number
    assignedCount?: IntWithAggregatesFilter<"EquipmentAvailability"> | number
    reservedCount?: IntWithAggregatesFilter<"EquipmentAvailability"> | number
    availableCount?: IntWithAggregatesFilter<"EquipmentAvailability"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"EquipmentAvailability"> | Date | string
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

  export type ReservationCreateInput = {
    id?: string
    requesterId: string
    requesterEmail?: string | null
    requesterName?: string | null
    status?: $Enums.ReservationStatus
    requestDate: Date | string
    approvedDate?: Date | string | null
    returnDate?: Date | string | null
    actualReturnDate?: Date | string | null
    approvedBy?: string | null
    deniedBy?: string | null
    denialReason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ReservationItemCreateNestedManyWithoutReservationInput
  }

  export type ReservationUncheckedCreateInput = {
    id?: string
    requesterId: string
    requesterEmail?: string | null
    requesterName?: string | null
    status?: $Enums.ReservationStatus
    requestDate: Date | string
    approvedDate?: Date | string | null
    returnDate?: Date | string | null
    actualReturnDate?: Date | string | null
    approvedBy?: string | null
    deniedBy?: string | null
    denialReason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ReservationItemUncheckedCreateNestedManyWithoutReservationInput
  }

  export type ReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterEmail?: NullableStringFieldUpdateOperationsInput | string | null
    requesterName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deniedBy?: NullableStringFieldUpdateOperationsInput | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ReservationItemUpdateManyWithoutReservationNestedInput
  }

  export type ReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterEmail?: NullableStringFieldUpdateOperationsInput | string | null
    requesterName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deniedBy?: NullableStringFieldUpdateOperationsInput | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ReservationItemUncheckedUpdateManyWithoutReservationNestedInput
  }

  export type ReservationCreateManyInput = {
    id?: string
    requesterId: string
    requesterEmail?: string | null
    requesterName?: string | null
    status?: $Enums.ReservationStatus
    requestDate: Date | string
    approvedDate?: Date | string | null
    returnDate?: Date | string | null
    actualReturnDate?: Date | string | null
    approvedBy?: string | null
    deniedBy?: string | null
    denialReason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterEmail?: NullableStringFieldUpdateOperationsInput | string | null
    requesterName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deniedBy?: NullableStringFieldUpdateOperationsInput | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterEmail?: NullableStringFieldUpdateOperationsInput | string | null
    requesterName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deniedBy?: NullableStringFieldUpdateOperationsInput | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemCreateInput = {
    id?: string
    assetTypeId: string
    assetTypeName: string
    assetId?: string | null
    quantity?: number
    status?: $Enums.ReservationStatus
    notes?: string | null
    reservation: ReservationCreateNestedOneWithoutItemsInput
  }

  export type ReservationItemUncheckedCreateInput = {
    id?: string
    reservationId: string
    assetTypeId: string
    assetTypeName: string
    assetId?: string | null
    quantity?: number
    status?: $Enums.ReservationStatus
    notes?: string | null
  }

  export type ReservationItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    reservation?: ReservationUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ReservationItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservationId?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReservationItemCreateManyInput = {
    id?: string
    reservationId: string
    assetTypeId: string
    assetTypeName: string
    assetId?: string | null
    quantity?: number
    status?: $Enums.ReservationStatus
    notes?: string | null
  }

  export type ReservationItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReservationItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservationId?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EquipmentAvailabilityCreateInput = {
    id?: string
    assetTypeId: string
    assetTypeName: string
    totalCount?: number
    assignedCount?: number
    reservedCount?: number
    availableCount?: number
    updatedAt?: Date | string
  }

  export type EquipmentAvailabilityUncheckedCreateInput = {
    id?: string
    assetTypeId: string
    assetTypeName: string
    totalCount?: number
    assignedCount?: number
    reservedCount?: number
    availableCount?: number
    updatedAt?: Date | string
  }

  export type EquipmentAvailabilityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    totalCount?: IntFieldUpdateOperationsInput | number
    assignedCount?: IntFieldUpdateOperationsInput | number
    reservedCount?: IntFieldUpdateOperationsInput | number
    availableCount?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EquipmentAvailabilityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    totalCount?: IntFieldUpdateOperationsInput | number
    assignedCount?: IntFieldUpdateOperationsInput | number
    reservedCount?: IntFieldUpdateOperationsInput | number
    availableCount?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EquipmentAvailabilityCreateManyInput = {
    id?: string
    assetTypeId: string
    assetTypeName: string
    totalCount?: number
    assignedCount?: number
    reservedCount?: number
    availableCount?: number
    updatedAt?: Date | string
  }

  export type EquipmentAvailabilityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    totalCount?: IntFieldUpdateOperationsInput | number
    assignedCount?: IntFieldUpdateOperationsInput | number
    reservedCount?: IntFieldUpdateOperationsInput | number
    availableCount?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EquipmentAvailabilityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    totalCount?: IntFieldUpdateOperationsInput | number
    assignedCount?: IntFieldUpdateOperationsInput | number
    reservedCount?: IntFieldUpdateOperationsInput | number
    availableCount?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
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

  export type ReservationItemListRelationFilter = {
    every?: ReservationItemWhereInput
    some?: ReservationItemWhereInput
    none?: ReservationItemWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ReservationItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReservationCountOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    requesterEmail?: SortOrder
    requesterName?: SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvedDate?: SortOrder
    returnDate?: SortOrder
    actualReturnDate?: SortOrder
    approvedBy?: SortOrder
    deniedBy?: SortOrder
    denialReason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    requesterEmail?: SortOrder
    requesterName?: SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvedDate?: SortOrder
    returnDate?: SortOrder
    actualReturnDate?: SortOrder
    approvedBy?: SortOrder
    deniedBy?: SortOrder
    denialReason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReservationMinOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    requesterEmail?: SortOrder
    requesterName?: SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvedDate?: SortOrder
    returnDate?: SortOrder
    actualReturnDate?: SortOrder
    approvedBy?: SortOrder
    deniedBy?: SortOrder
    denialReason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type EnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
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

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ReservationRelationFilter = {
    is?: ReservationWhereInput
    isNot?: ReservationWhereInput
  }

  export type ReservationItemCountOrderByAggregateInput = {
    id?: SortOrder
    reservationId?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    assetId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    notes?: SortOrder
  }

  export type ReservationItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type ReservationItemMaxOrderByAggregateInput = {
    id?: SortOrder
    reservationId?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    assetId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    notes?: SortOrder
  }

  export type ReservationItemMinOrderByAggregateInput = {
    id?: SortOrder
    reservationId?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    assetId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    notes?: SortOrder
  }

  export type ReservationItemSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EquipmentAvailabilityCountOrderByAggregateInput = {
    id?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    totalCount?: SortOrder
    assignedCount?: SortOrder
    reservedCount?: SortOrder
    availableCount?: SortOrder
    updatedAt?: SortOrder
  }

  export type EquipmentAvailabilityAvgOrderByAggregateInput = {
    totalCount?: SortOrder
    assignedCount?: SortOrder
    reservedCount?: SortOrder
    availableCount?: SortOrder
  }

  export type EquipmentAvailabilityMaxOrderByAggregateInput = {
    id?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    totalCount?: SortOrder
    assignedCount?: SortOrder
    reservedCount?: SortOrder
    availableCount?: SortOrder
    updatedAt?: SortOrder
  }

  export type EquipmentAvailabilityMinOrderByAggregateInput = {
    id?: SortOrder
    assetTypeId?: SortOrder
    assetTypeName?: SortOrder
    totalCount?: SortOrder
    assignedCount?: SortOrder
    reservedCount?: SortOrder
    availableCount?: SortOrder
    updatedAt?: SortOrder
  }

  export type EquipmentAvailabilitySumOrderByAggregateInput = {
    totalCount?: SortOrder
    assignedCount?: SortOrder
    reservedCount?: SortOrder
    availableCount?: SortOrder
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

  export type ReservationItemCreateNestedManyWithoutReservationInput = {
    create?: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput> | ReservationItemCreateWithoutReservationInput[] | ReservationItemUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutReservationInput | ReservationItemCreateOrConnectWithoutReservationInput[]
    createMany?: ReservationItemCreateManyReservationInputEnvelope
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
  }

  export type ReservationItemUncheckedCreateNestedManyWithoutReservationInput = {
    create?: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput> | ReservationItemCreateWithoutReservationInput[] | ReservationItemUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutReservationInput | ReservationItemCreateOrConnectWithoutReservationInput[]
    createMany?: ReservationItemCreateManyReservationInputEnvelope
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumReservationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReservationStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ReservationItemUpdateManyWithoutReservationNestedInput = {
    create?: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput> | ReservationItemCreateWithoutReservationInput[] | ReservationItemUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutReservationInput | ReservationItemCreateOrConnectWithoutReservationInput[]
    upsert?: ReservationItemUpsertWithWhereUniqueWithoutReservationInput | ReservationItemUpsertWithWhereUniqueWithoutReservationInput[]
    createMany?: ReservationItemCreateManyReservationInputEnvelope
    set?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    disconnect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    delete?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    update?: ReservationItemUpdateWithWhereUniqueWithoutReservationInput | ReservationItemUpdateWithWhereUniqueWithoutReservationInput[]
    updateMany?: ReservationItemUpdateManyWithWhereWithoutReservationInput | ReservationItemUpdateManyWithWhereWithoutReservationInput[]
    deleteMany?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
  }

  export type ReservationItemUncheckedUpdateManyWithoutReservationNestedInput = {
    create?: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput> | ReservationItemCreateWithoutReservationInput[] | ReservationItemUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutReservationInput | ReservationItemCreateOrConnectWithoutReservationInput[]
    upsert?: ReservationItemUpsertWithWhereUniqueWithoutReservationInput | ReservationItemUpsertWithWhereUniqueWithoutReservationInput[]
    createMany?: ReservationItemCreateManyReservationInputEnvelope
    set?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    disconnect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    delete?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    update?: ReservationItemUpdateWithWhereUniqueWithoutReservationInput | ReservationItemUpdateWithWhereUniqueWithoutReservationInput[]
    updateMany?: ReservationItemUpdateManyWithWhereWithoutReservationInput | ReservationItemUpdateManyWithWhereWithoutReservationInput[]
    deleteMany?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
  }

  export type ReservationCreateNestedOneWithoutItemsInput = {
    create?: XOR<ReservationCreateWithoutItemsInput, ReservationUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ReservationCreateOrConnectWithoutItemsInput
    connect?: ReservationWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ReservationUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<ReservationCreateWithoutItemsInput, ReservationUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ReservationCreateOrConnectWithoutItemsInput
    upsert?: ReservationUpsertWithoutItemsInput
    connect?: ReservationWhereUniqueInput
    update?: XOR<XOR<ReservationUpdateToOneWithWhereWithoutItemsInput, ReservationUpdateWithoutItemsInput>, ReservationUncheckedUpdateWithoutItemsInput>
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

  export type NestedEnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
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

  export type NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
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

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
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

  export type ReservationItemCreateWithoutReservationInput = {
    id?: string
    assetTypeId: string
    assetTypeName: string
    assetId?: string | null
    quantity?: number
    status?: $Enums.ReservationStatus
    notes?: string | null
  }

  export type ReservationItemUncheckedCreateWithoutReservationInput = {
    id?: string
    assetTypeId: string
    assetTypeName: string
    assetId?: string | null
    quantity?: number
    status?: $Enums.ReservationStatus
    notes?: string | null
  }

  export type ReservationItemCreateOrConnectWithoutReservationInput = {
    where: ReservationItemWhereUniqueInput
    create: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput>
  }

  export type ReservationItemCreateManyReservationInputEnvelope = {
    data: ReservationItemCreateManyReservationInput | ReservationItemCreateManyReservationInput[]
    skipDuplicates?: boolean
  }

  export type ReservationItemUpsertWithWhereUniqueWithoutReservationInput = {
    where: ReservationItemWhereUniqueInput
    update: XOR<ReservationItemUpdateWithoutReservationInput, ReservationItemUncheckedUpdateWithoutReservationInput>
    create: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput>
  }

  export type ReservationItemUpdateWithWhereUniqueWithoutReservationInput = {
    where: ReservationItemWhereUniqueInput
    data: XOR<ReservationItemUpdateWithoutReservationInput, ReservationItemUncheckedUpdateWithoutReservationInput>
  }

  export type ReservationItemUpdateManyWithWhereWithoutReservationInput = {
    where: ReservationItemScalarWhereInput
    data: XOR<ReservationItemUpdateManyMutationInput, ReservationItemUncheckedUpdateManyWithoutReservationInput>
  }

  export type ReservationItemScalarWhereInput = {
    AND?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
    OR?: ReservationItemScalarWhereInput[]
    NOT?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
    id?: StringFilter<"ReservationItem"> | string
    reservationId?: StringFilter<"ReservationItem"> | string
    assetTypeId?: StringFilter<"ReservationItem"> | string
    assetTypeName?: StringFilter<"ReservationItem"> | string
    assetId?: StringNullableFilter<"ReservationItem"> | string | null
    quantity?: IntFilter<"ReservationItem"> | number
    status?: EnumReservationStatusFilter<"ReservationItem"> | $Enums.ReservationStatus
    notes?: StringNullableFilter<"ReservationItem"> | string | null
  }

  export type ReservationCreateWithoutItemsInput = {
    id?: string
    requesterId: string
    requesterEmail?: string | null
    requesterName?: string | null
    status?: $Enums.ReservationStatus
    requestDate: Date | string
    approvedDate?: Date | string | null
    returnDate?: Date | string | null
    actualReturnDate?: Date | string | null
    approvedBy?: string | null
    deniedBy?: string | null
    denialReason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservationUncheckedCreateWithoutItemsInput = {
    id?: string
    requesterId: string
    requesterEmail?: string | null
    requesterName?: string | null
    status?: $Enums.ReservationStatus
    requestDate: Date | string
    approvedDate?: Date | string | null
    returnDate?: Date | string | null
    actualReturnDate?: Date | string | null
    approvedBy?: string | null
    deniedBy?: string | null
    denialReason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservationCreateOrConnectWithoutItemsInput = {
    where: ReservationWhereUniqueInput
    create: XOR<ReservationCreateWithoutItemsInput, ReservationUncheckedCreateWithoutItemsInput>
  }

  export type ReservationUpsertWithoutItemsInput = {
    update: XOR<ReservationUpdateWithoutItemsInput, ReservationUncheckedUpdateWithoutItemsInput>
    create: XOR<ReservationCreateWithoutItemsInput, ReservationUncheckedCreateWithoutItemsInput>
    where?: ReservationWhereInput
  }

  export type ReservationUpdateToOneWithWhereWithoutItemsInput = {
    where?: ReservationWhereInput
    data: XOR<ReservationUpdateWithoutItemsInput, ReservationUncheckedUpdateWithoutItemsInput>
  }

  export type ReservationUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterEmail?: NullableStringFieldUpdateOperationsInput | string | null
    requesterName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deniedBy?: NullableStringFieldUpdateOperationsInput | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterEmail?: NullableStringFieldUpdateOperationsInput | string | null
    requesterName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualReturnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deniedBy?: NullableStringFieldUpdateOperationsInput | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemCreateManyReservationInput = {
    id?: string
    assetTypeId: string
    assetTypeName: string
    assetId?: string | null
    quantity?: number
    status?: $Enums.ReservationStatus
    notes?: string | null
  }

  export type ReservationItemUpdateWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReservationItemUncheckedUpdateWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReservationItemUncheckedUpdateManyWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetTypeId?: StringFieldUpdateOperationsInput | string
    assetTypeName?: StringFieldUpdateOperationsInput | string
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ReservationCountOutputTypeDefaultArgs instead
     */
    export type ReservationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReservationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReservationDefaultArgs instead
     */
    export type ReservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReservationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReservationItemDefaultArgs instead
     */
    export type ReservationItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReservationItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EquipmentAvailabilityDefaultArgs instead
     */
    export type EquipmentAvailabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EquipmentAvailabilityDefaultArgs<ExtArgs>
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
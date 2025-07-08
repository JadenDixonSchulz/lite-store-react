type Mapped<TIn, TOut extends { [K in keyof TIn]: unknown }> = {
  [K in keyof TIn]: TOut[K];
} & {
  // Enforce that TB doesn't have any extra keys
  [K in Exclude<keyof TOut, keyof TIn>]: never;
};
export function mapObj<From, To extends { [K in keyof From]: unknown }>(
  input: From,
  mapper: (input: From) => Mapped<From, To>
): Mapped<From, To> {
  return mapper(input);
}


export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Nullable<T> = { [P in keyof T]: T[P] | null }

export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
    { [P in U]: never } & { [x: string]: never })[T]

export type Dictionary<T> = { [key: string]: T }
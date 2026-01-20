export type RootState = number;

export type Selector<S> = (state: RootState) => S;
export type Renderer<S> = (next: S, prev: S | undefined) => void;

export type Subscriber<S> = {
  select: Selector<S>;
  render: Renderer<S>;
  prev?: S;
};

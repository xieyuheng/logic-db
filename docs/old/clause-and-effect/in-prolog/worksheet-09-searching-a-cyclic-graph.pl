a(g, h).
a(d, a).
a(g, d).
a(e, d).
a(h, f).
a(e, f).
a(a, e).
a(a, b).
a(b, f).
a(b, c).
a(f, c).

%% a e d -- in a loop

%% the following relation
%%   will make query searching in loop
%% path(X, X).
%% path(X, Y) :- a(X, Z), path(Z, Y).

path(X, X, _).
path(X, Y, T) :-
  a(X, Z), legal(Z, T), path(Z, Y, [Z | T]).

legal(_, []).
legal(Z, [H | T]) :- Z \== H, legal(Z, T).

%% path(f, f, []).
%% path(a, c, []).
%% path(g, e, []).
%% path(g, X, []).
%% path(X, h, []).

%% path(g, c, []).
%% path(g, c, [f]).
%% path(a, X, [f, d]).
%% path(a, X, []).

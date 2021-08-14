list_append([], S, S).
list_append([H | T], S, [H | R]) :- list_append(T, S, R).

list_flatten([], []).
list_flatten([H | T], L3) :-
  list_flatten(H, L1),
  list_flatten(T, L2),
  list_append(L1, L2, L3).
list_flatten(X, [X]).

%% list_flatten([a, [b, c], [d, e, [f, [g], h]]], L).
%% list_flatten(X, [a, b, c, d, e, f, g, h]). %% loop

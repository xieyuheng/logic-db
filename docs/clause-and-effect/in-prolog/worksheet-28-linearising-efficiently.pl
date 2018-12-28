list_flatten(X, Y) :- diff_list_flatten(X, Y - []).

diff_list_flatten([], L - L).
diff_list_flatten([H | T], L1 - L3) :-
  diff_list_flatten(H, L1 - L2),
  diff_list_flatten(T, L2 - L3).
diff_list_flatten(X, [X | Z] - Z).

%% list_flatten([a, [b, c], [d, e, [f, [g], h]]], L).
%% list_flatten(X, [a, b, c, d, e, f, g, h]).

list_append([], S, S).
list_append([H | T], S, [H | R]) :- list_append(T, S, R).

%% note that,
%%   this way of defining append is tail-recursive, by contrast,
%%   the equivalent function definition of append is not tail-recursive
%%   because the last call is cons, not append.

%% list_append([1, 2, 3], [1, 2, 3], R).
%% list_append(A, S, [1, 2, 3]).
%% list_append(A, A, [1, 2, 3, 1, 2, 3]).

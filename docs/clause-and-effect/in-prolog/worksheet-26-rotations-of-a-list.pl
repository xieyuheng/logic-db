list_append([], S, S).
list_append([H | T], S, [H | R]) :- list_append(T, S, R).

rotall([], _, []).
rotall([H | T], A, [L | Z]) :-
  list_append([H | T], A, L),
  list_append(A, [H], A1),
  rotall(T, A1, Z).

%% rotall([2, 1, 0], [], L).
%% rotall(X, Y, [[2, 1, 0], [1, 0, 2], [0, 2, 1]]).
%% rotall([2, 1, 0], [a, b, c], L).

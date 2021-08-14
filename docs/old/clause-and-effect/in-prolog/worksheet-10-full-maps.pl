sqlist([], []).
sqlist([X | T], [Y | L]) :-
  Y is X * X, sqlist(T, L).

sqterm([], []).
sqterm([X | T], [s(X, Y) | L]) :-
  Y is X * X, sqterm(T, L).

%% The general scheme for a full map is as follows:
%% fullmap([], []).
%% fullmap([X | T], [Y | L]) :-
%%   transform(X, V), fullmap(T, L).

%% sqlist([1, 2, 3], L).
%% sqterm([1, 2, 3], L).

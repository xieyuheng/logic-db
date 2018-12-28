member(X, [X | _]).
member(X, [H | T]) :- member(X, T).

setify([], []).
setify([X | T], L) :- member(X, T), setify(T, L).
setify([X | T], [X | L]) :- setify(T, L).

%% setify([a,a,b,c,b], X).
%% setify([a,a,b,c,b], [a,c,b]).
%% setify([a,a,b,c,b], [a,b,c]).

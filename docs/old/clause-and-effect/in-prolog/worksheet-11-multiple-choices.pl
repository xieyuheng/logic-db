squint([], []).
squint([X | T], [Y | L]) :- integer(X), Y is X * X, squint(T, L).
squint([X | T], [X | L]) :- squint(T, L).

%% squint([1, 3, w, 5, goat], X).

%% it is important to know what will happen when a program backtracks.
%% the behaviour of the relation counter
%%   to our expectations of how the program should work.
%% we need `cut` to fix this

list_length([], 0) .
list_length([_ | T], N) :-
  list_length(T, Nt), N is Nt + 1.

%% note that
%%   `Nt` is instantiated after `list_length(T, Nt)`
%%   simple implementation of this
%%   requires a deep first search of `list_length(T, Nt)`

%% list_length([], 0) .
%% list_length([_ | T], N) :-
%%   N is Nt + 1, list_length(T, Nt).

%% list_length([], 0) .
%% list_length([_ | T], N) :-
%%   list_length(T, Nt), Nt is N - 1.

%% list_length(L, N) :- accumulate(L, 0, N).

%% accumulate([], A, A).
%% accumulate([_ | T], A, N) :-
%%   A1 is A + 1,
%%   accumulate(T, A1, N).

%% list_length([apple, pear], N).
%% list_length(L, 3). %% infinite loop at second result
%% list_length([alpha], 2).

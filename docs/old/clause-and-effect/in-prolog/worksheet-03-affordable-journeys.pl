border(sussex, kent).
border(sussex, surrey).
border(surrey, kent).
border(hampshire, sussex).
border(hampshire, surrey).
border(hampshire, berkshire).
border(berkshire, surrey).
border(wiltshire, hampshire).
border(wiltshire, berkshire).

%% to get symmetry

adjacent(X, Y) :- border(X, Y).
adjacent(X, Y) :- border(Y, X).

affordable(X, Y) :- adjacent(X, Z), adjacent(Z, Y).

%% affordable(wiltshire, sussex).
%% affordable(wiltshire, kent).
%% affordable(hampshire, hampshire).
%% affordable(X, kent).
%% affordable(sussex, X).
%% affordable(X, V).

drinks(john, martini).
drinks(mary, gin).
drinks(susan, vodka).
drinks(john, gin).
drinks(fred, gin).

%% pair(X, Y, Z) :-
%%   drinks(X, Z), drinks(Y, Z).

pair(X, Y, Z) :-
  drinks(X, Z), drinks(Y, Z), X \== Y.

%% pair(X, john, martini).
%% pair(mary, susan, gin).
%% pair(john, mary, gin).
%% pair(john, john, gin).
%% pair(X, Y, gin).
%% pair(bertram, lucinda, vodka).
%% pair(X, Y, Z).

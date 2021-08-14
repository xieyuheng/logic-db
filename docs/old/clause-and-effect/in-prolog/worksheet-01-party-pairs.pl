male(bertram).
male(percival).

female(lucinda).
female(camilla).

pair(X, Y):-
  male(X), female(Y).

%% pair(percival, X).
%% pair(apollo, daphne).
%% pair(camilla, X).
%% pair(X, lucinda).
%% pair(X, X).
%% pair(bertram, lucinda).
%% pair(X, fido).
%% pair(X, V).

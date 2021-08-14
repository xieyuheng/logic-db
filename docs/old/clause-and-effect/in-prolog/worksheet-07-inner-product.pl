inner([], [], 0).
inner([A | As], [B | Bs], N) :-
  inner(As, Bs, Ns), N is Ns + (A * B).

%% inner(A, B, N) :- dotaux(A, B, 0, N).
%% dotaux([], [], P, P).
%% dotaux([A | As], [B | Bs], N, Z) :-
%%   N1 is N + (A * B), dotaux(As, Bs, N1, Z).

%% inner([1, 2, 1], [1, 2, 1], P).
%% inner([1, 2, 1], [1, 2, 1, 4], P).

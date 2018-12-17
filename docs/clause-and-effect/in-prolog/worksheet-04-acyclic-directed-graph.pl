a(g, h).
a(g, d).
a(e, d).
a(h, f).
a(e, f).
a(a, e).
a(a, b).
a(b, f).
a(b, c).
a(f, c).

path(X, X).
path(X, Y) :- a(X, Z), path(Z, V).

%% path(f, f).
%% path(a, c).
%% path(g, e).
%% path(g, X).
%% path(X, h).

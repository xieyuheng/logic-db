member(X, [X | _]).
member(X, [H | T]) :- member(X, T).

%% member(john, [paul, john]).
%% member(X, [paul, john]).
%% member(joe, [marx, darwin, freud])
%% member(foo, X).

mystery(X, A, B) :- member(X, A), member(X, B).

%% mystery(a, [b,c,a] , [p,a,l]).
%% mystery(X, [b,l,u,e], [y,e,l,l,o,w]).
%% mystery(X, [r,a,p,i,d], [a,c,t,i,o,n]).
%% mystery(X, [w,a,l,n,u,t], [c,h,e,r,r,y]).

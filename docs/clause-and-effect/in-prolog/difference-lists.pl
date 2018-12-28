app(A - B, B - C, A - C).

%% app([a, b, c | Z1] - Z1, [d, e | Z2] - Z2, X - Y).

%% why bother use app when you can do the stitching 'in place'
%% where it is needed in programs, simply by
%% rearranging the variables in the clause!
%% this is the basis of most advanced programming in prolog.
%%   no amount of new syntax
%%   no amount of new definition
%%   just one symbol

num_max([], A, A).
num_max([H | T], A, M) :- H > A, num_max(T, H, M).
num_max([H | T], A, M) :- H =< A, num_max(T, A, M).

%% num_max([3, 1, 4, 1, 5, 8, 2, 6], 0, N).
%% num_max([3, 1, 4, 1, 5, 8, 2, 6], 9, N).
%% num_max([2, 4, 7, 7, 7, 2, 1, 6], 5, N).
